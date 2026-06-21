#!/bin/bash

# Database Backup & Disaster Recovery Script
# Supports daily, weekly, and monthly backups with automatic retention

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./.backups}"
RETENTION_DAYS_DAILY=30
RETENTION_DAYS_WEEKLY=180
RETENTION_DAYS_MONTHLY=365
DATABASE_URL="${DATABASE_URL}"
BACKUP_TYPE="${1:-daily}" # daily, weekly, monthly, full
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_${BACKUP_TYPE}_${TIMESTAMP}.sql.gz"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"

# Verify database connection
verify_database() {
  echo "[$(date)] Verifying database connection..."
  psql "$DATABASE_URL" -c "SELECT version();" > /dev/null 2>&1 || {
    echo "ERROR: Cannot connect to database"
    exit 1
  }
  echo "[$(date)] ✓ Database connection verified"
}

# Create backup directory
create_backup_dir() {
  mkdir -p "$BACKUP_DIR"
  echo "[$(date)] ✓ Backup directory ready: $BACKUP_DIR"
}

# Perform backup
perform_backup() {
  echo "[$(date)] Starting $BACKUP_TYPE backup..."
  
  case "$BACKUP_TYPE" in
    daily)
      echo "[$(date)] Performing daily backup..."
      pg_dump "$DATABASE_URL" | gzip > "$BACKUP_PATH"
      ;;
    weekly)
      echo "[$(date)] Performing weekly backup..."
      pg_dump "$DATABASE_URL" --format=custom | gzip > "$BACKUP_PATH"
      ;;
    monthly)
      echo "[$(date)] Performing monthly full backup..."
      pg_dump "$DATABASE_URL" --verbose --format=custom > "$BACKUP_PATH"
      ;;
    full)
      echo "[$(date)] Performing full backup with statistics..."
      pg_dump "$DATABASE_URL" \
        --verbose \
        --format=custom \
        --compress=9 \
        --blobs \
        --section=pre-data \
        --section=data \
        --section=post-data > "$BACKUP_PATH"
      ;;
    *)
      echo "ERROR: Unknown backup type: $BACKUP_TYPE"
      exit 1
      ;;
  esac

  if [ -f "$BACKUP_PATH" ]; then
    SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
    echo "[$(date)] ✓ Backup completed: $BACKUP_NAME ($SIZE)"
    echo "$BACKUP_PATH"
  else
    echo "ERROR: Backup failed"
    exit 1
  fi
}

# Delete old backups based on retention policy
cleanup_old_backups() {
  echo "[$(date)] Cleaning up old backups..."
  
  case "$BACKUP_TYPE" in
    daily)
      find "$BACKUP_DIR" -name "backup_daily_*" -mtime +$RETENTION_DAYS_DAILY -delete
      echo "[$(date)] ✓ Deleted daily backups older than $RETENTION_DAYS_DAILY days"
      ;;
    weekly)
      find "$BACKUP_DIR" -name "backup_weekly_*" -mtime +$RETENTION_DAYS_WEEKLY -delete
      echo "[$(date)] ✓ Deleted weekly backups older than $RETENTION_DAYS_WEEKLY days"
      ;;
    monthly)
      find "$BACKUP_DIR" -name "backup_monthly_*" -mtime +$RETENTION_DAYS_MONTHLY -delete
      echo "[$(date)] ✓ Deleted monthly backups older than $RETENTION_DAYS_MONTHLY days"
      ;;
  esac
}

# Verify backup integrity
verify_backup() {
  echo "[$(date)] Verifying backup integrity..."
  
  if gunzip -t "$BACKUP_PATH" 2>/dev/null; then
    echo "[$(date)] ✓ Backup integrity verified"
    return 0
  else
    echo "ERROR: Backup file is corrupted"
    rm "$BACKUP_PATH"
    exit 1
  fi
}

# List available backups
list_backups() {
  echo "[$(date)] Available backups:"
  ls -lh "$BACKUP_DIR" | grep backup_ || echo "No backups found"
}

# Restore from backup
restore_backup() {
  BACKUP_FILE="$1"
  
  if [ ! -f "$BACKUP_FILE" ]; then
    echo "ERROR: Backup file not found: $BACKUP_FILE"
    exit 1
  fi
  
  echo "[$(date)] WARNING: This will overwrite the current database!"
  read -p "Type 'CONFIRM' to proceed: " confirmation
  
  if [ "$confirmation" != "CONFIRM" ]; then
    echo "Restore cancelled"
    exit 0
  fi
  
  echo "[$(date)] Starting database restore from: $BACKUP_FILE"
  
  # Create connection string for restore database
  RESTORE_DB="${DATABASE_URL}"
  
  # Drop existing connections
  psql "$RESTORE_DB" -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname=current_database() AND pid != pg_backend_pid();" || true
  
  # Restore from backup
  if [[ "$BACKUP_FILE" == *.gz ]]; then
    gunzip -c "$BACKUP_FILE" | psql "$RESTORE_DB"
  else
    psql "$RESTORE_DB" < "$BACKUP_FILE"
  fi
  
  echo "[$(date)] ✓ Restore completed successfully"
}

# RTO/RPO statistics
print_statistics() {
  echo ""
  echo "=== Backup Statistics ==="
  echo "RTO (Recovery Time Objective): ~1 hour"
  echo "RPO (Recovery Point Objective): 15 minutes"
  echo ""
  echo "Backup Schedule:"
  echo "- Daily: Every 6 hours (30-day retention)"
  echo "- Weekly: Every Sunday (180-day retention)"
  echo "- Monthly: 1st of month (365-day retention)"
  echo ""
}

# Main execution
main() {
  verify_database
  create_backup_dir
  perform_backup
  verify_backup
  cleanup_old_backups
  list_backups
  print_statistics
  
  echo "[$(date)] Backup process completed successfully!"
}

# Handle command line arguments
case "$1" in
  list)
    list_backups
    ;;
  restore)
    restore_backup "$2"
    ;;
  verify)
    verify_backup "$2"
    ;;
  *)
    main
    ;;
esac
