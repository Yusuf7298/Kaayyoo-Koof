import {
  boolean,
  decimal,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  bigint,
  uniqueIndex,
  index,
  foreignKey,
  varchar,
  json,
  date,
} from 'drizzle-orm/pg-core'

// =====================================================
// BETTER AUTH TABLES (Keep existing)
// =====================================================

export const user = pgTable('user', {
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').notNull().primaryKey(),
  userId: text('userId').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const account = pgTable('account', {
  id: text('id').notNull().primaryKey(),
  userId: text('userId').notNull(),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refreshToken: text('refreshToken'),
  accessToken: text('accessToken'),
  expiresAt: bigint('expiresAt', { mode: 'number' }),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').notNull().primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// =====================================================
// RBAC SYSTEM TABLES
// =====================================================

export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  rank: integer('rank').notNull(), // For hierarchy: 1=Guest, 8=Super Admin
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  nameIdx: index('roles_name_idx').on(table.name),
}))

export const permissions = pgTable('permissions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(), // e.g. "members.create", "events.delete"
  description: text('description'),
  category: text('category').notNull(), // e.g. "members", "events", "finance"
  created_at: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  nameIdx: index('permissions_name_idx').on(table.name),
  categoryIdx: index('permissions_category_idx').on(table.category),
}))

export const rolePermissions = pgTable('role_permissions', {
  id: serial('id').primaryKey(),
  role_id: integer('role_id').notNull(),
  permission_id: integer('permission_id').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  roleIdIdx: index('role_permissions_role_id_idx').on(table.role_id),
  permissionIdIdx: index('role_permissions_permission_id_idx').on(table.permission_id),
}))

export const userRoles = pgTable('user_roles', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull(),
  role_id: integer('role_id').notNull(),
  assigned_by: text('assigned_by'),
  created_at: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('user_roles_user_id_idx').on(table.user_id),
  roleIdIdx: index('user_roles_role_id_idx').on(table.role_id),
}))

// =====================================================
// AUDIT LOGGING TABLES
// =====================================================

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  user_id: text('user_id'),
  action: text('action').notNull(), // "CREATE", "UPDATE", "DELETE", "VIEW"
  resource_type: text('resource_type').notNull(), // "member", "event", "contribution"
  resource_id: text('resource_id').notNull(),
  changes: json('changes'), // { before: {}, after: {} }
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),
  status: text('status').notNull().default('success'), // "success", "failure"
  error_message: text('error_message'),
  created_at: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('audit_logs_user_id_idx').on(table.user_id),
  resourceTypeIdx: index('audit_logs_resource_type_idx').on(table.resource_type),
  createdAtIdx: index('audit_logs_created_at_idx').on(table.created_at),
}))

export const deviceSessions = pgTable('device_sessions', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull(),
  device_name: text('device_name'),
  device_type: text('device_type'), // "web", "mobile", "tablet"
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),
  last_active: timestamp('last_active').notNull().defaultNow(),
  created_at: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('device_sessions_user_id_idx').on(table.user_id),
}))

// =====================================================
// ENHANCED MEMBER TABLES
// =====================================================

export const members = pgTable('members', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  profile_picture: text('profile_picture'),
  cover_photo: text('cover_photo'),
  bio: text('bio'),
  occupation: text('occupation'),
  education: text('education'),
  location: text('location'),
  website: text('website'),
  skills: json('skills'), // ["Leadership", "Mentoring", ...]
  interests: json('interests'), // ["Community", "Events", ...]
  social_media: json('social_media'), // { facebook: "", twitter: "", ... }
  telegram_id: text('telegram_id').unique(),
  member_status: text('member_status').notNull().default('pending'), // pending, active, inactive, suspended
  member_tier: text('member_tier').notNull().default('individual'), // individual, student, corporate, benefactor
  joined_date: timestamp('joined_date').notNull().defaultNow(),
  renewal_date: timestamp('renewal_date'),
  profile_visibility: text('profile_visibility').notNull().default('public'), // public, private, members_only
  verification_status: text('verification_status').notNull().default('unverified'), // unverified, verified, approved
  volunteer_hours: decimal('volunteer_hours', { precision: 8, scale: 2 }).default('0'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('members_userId_idx').on(table.userId),
  emailIdx: index('members_email_idx').on(table.email),
  memberStatusIdx: index('members_member_status_idx').on(table.member_status),
}))

export const membershipTiers = pgTable('membership_tiers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  annual_fee: decimal('annual_fee', { precision: 10, scale: 2 }).notNull(),
  benefits: json('benefits'), // ["Voting rights", "Event access", ...]
  created_at: timestamp('created_at').notNull().defaultNow(),
})

export const membershipApplications = pgTable('membership_applications', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull(),
  tier_id: integer('tier_id').notNull(),
  status: text('status').notNull().default('pending'), // pending, approved, rejected
  application_date: timestamp('application_date').notNull().defaultNow(),
  approval_date: timestamp('approval_date'),
  approved_by: text('approved_by'),
  rejection_reason: text('rejection_reason'),
  created_at: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('membership_applications_user_id_idx').on(table.user_id),
  statusIdx: index('membership_applications_status_idx').on(table.status),
}))

export const memberBadges = pgTable('member_badges', {
  id: serial('id').primaryKey(),
  member_id: integer('member_id').notNull(),
  badge_name: text('badge_name').notNull(),
  badge_icon: text('badge_icon'),
  badge_description: text('badge_description'),
  earned_date: timestamp('earned_date').notNull().defaultNow(),
})

export const memberCertificates = pgTable('member_certificates', {
  id: serial('id').primaryKey(),
  member_id: integer('member_id').notNull(),
  certificate_name: text('certificate_name').notNull(),
  certificate_url: text('certificate_url'),
  issued_date: timestamp('issued_date').notNull().defaultNow(),
  issued_by: text('issued_by'),
  certificate_number: text('certificate_number').unique(),
})

// =====================================================
// ENHANCED EVENT TABLES
// =====================================================

export const eventCategories = pgTable('event_categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  icon: text('icon'),
  created_at: timestamp('created_at').notNull().defaultNow(),
})

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  category_id: integer('category_id'),
  event_date: timestamp('event_date').notNull(),
  end_date: timestamp('end_date'),
  location: text('location'),
  location_url: text('location_url'), // Google Maps link
  organizer_id: text('organizer_id').notNull(),
  max_attendees: integer('max_attendees'),
  current_attendees: integer('current_attendees').default(0),
  waiting_list_count: integer('waiting_list_count').default(0),
  status: text('status').notNull().default('upcoming'), // upcoming, ongoing, completed, cancelled
  event_image: text('event_image'),
  registration_deadline: timestamp('registration_deadline'),
  enable_feedback: boolean('enable_feedback').default(true),
  tags: json('tags'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  organizerIdIdx: index('events_organizer_id_idx').on(table.organizer_id),
  eventDateIdx: index('events_event_date_idx').on(table.event_date),
  statusIdx: index('events_status_idx').on(table.status),
}))

export const eventSpeakers = pgTable('event_speakers', {
  id: serial('id').primaryKey(),
  event_id: integer('event_id').notNull(),
  speaker_name: text('speaker_name').notNull(),
  speaker_bio: text('speaker_bio'),
  speaker_image: text('speaker_image'),
  speaker_title: text('speaker_title'),
  start_time: timestamp('start_time'),
  end_time: timestamp('end_time'),
})

export const eventSponsors = pgTable('event_sponsors', {
  id: serial('id').primaryKey(),
  event_id: integer('event_id').notNull(),
  sponsor_name: text('sponsor_name').notNull(),
  sponsor_logo: text('sponsor_logo'),
  sponsor_level: text('sponsor_level'), // gold, silver, bronze
  sponsor_website: text('sponsor_website'),
})

export const eventAttendees = pgTable('event_attendees', {
  id: serial('id').primaryKey(),
  event_id: integer('event_id').notNull(),
  member_id: integer('member_id').notNull(),
  status: text('status').notNull().default('registered'), // registered, checked_in, no_show, waiting_list
  registered_at: timestamp('registered_at').notNull().defaultNow(),
  checked_in_at: timestamp('checked_in_at'),
}, (table) => ({
  eventIdIdx: index('event_attendees_event_id_idx').on(table.event_id),
  memberIdIdx: index('event_attendees_member_id_idx').on(table.member_id),
}))

export const qrCodes = pgTable('qr_codes', {
  id: serial('id').primaryKey(),
  event_id: integer('event_id').notNull(),
  qr_code_data: text('qr_code_data').notNull(),
  qr_code_image: text('qr_code_image'),
  created_at: timestamp('created_at').notNull().defaultNow(),
})

export const eventFeedback = pgTable('event_feedback', {
  id: serial('id').primaryKey(),
  event_id: integer('event_id').notNull(),
  member_id: integer('member_id').notNull(),
  rating: integer('rating'), // 1-5
  comment: text('comment'),
  submitted_at: timestamp('submitted_at').notNull().defaultNow(),
})

export const attendanceRecords = pgTable('attendance_records', {
  id: serial('id').primaryKey(),
  event_id: integer('event_id').notNull(),
  member_id: integer('member_id').notNull(),
  check_in_time: timestamp('check_in_time').notNull().defaultNow(),
  check_out_time: timestamp('check_out_time'),
  duration_minutes: integer('duration_minutes'),
  verified_by: text('verified_by'),
})

// =====================================================
// FINANCIAL TABLES
// =====================================================

export const contributions = pgTable('contributions', {
  id: serial('id').primaryKey(),
  member_id: integer('member_id').notNull(),
  user_id: text('user_id').notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  contribution_type: text('contribution_type').notNull(), // membership_fee, donation, fundraising, event_fee
  description: text('description'),
  status: text('status').notNull().default('completed'), // pending, completed, failed, refunded
  payment_method: text('payment_method'), // cash, card, bank_transfer, telegram
  transaction_id: text('transaction_id').unique(),
  contribution_date: timestamp('contribution_date').notNull().defaultNow(),
  receipt_url: text('receipt_url'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  memberIdIdx: index('contributions_member_id_idx').on(table.member_id),
  userIdIdx: index('contributions_user_id_idx').on(table.user_id),
  statusIdx: index('contributions_status_idx').on(table.status),
}))

export const fundraisingCampaigns = pgTable('fundraising_campaigns', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  goal_amount: decimal('goal_amount', { precision: 12, scale: 2 }).notNull(),
  current_amount: decimal('current_amount', { precision: 12, scale: 2 }).default('0'),
  campaign_image: text('campaign_image'),
  start_date: timestamp('start_date').notNull().defaultNow(),
  end_date: timestamp('end_date').notNull(),
  status: text('status').notNull().default('active'), // active, completed, paused, cancelled
  created_by: text('created_by').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
})

// =====================================================
// NOTIFICATION TABLES
// =====================================================

export const notificationPreferences = pgTable('notification_preferences', {
  id: serial('id').primaryKey(),
  member_id: integer('member_id').notNull(),
  email_notifications: boolean('email_notifications').default(true),
  telegram_notifications: boolean('telegram_notifications').default(true),
  in_app_notifications: boolean('in_app_notifications').default(true),
  push_notifications: boolean('push_notifications').default(true),
  event_reminders: boolean('event_reminders').default(true),
  membership_reminders: boolean('membership_reminders').default(true),
  contribution_reminders: boolean('contribution_reminders').default(true),
  announcements: boolean('announcements').default(true),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
})

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  member_id: integer('member_id').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull(), // event_reminder, membership_alert, announcement, contribution, etc
  related_resource_type: text('related_resource_type'),
  related_resource_id: text('related_resource_id'),
  read_at: timestamp('read_at'),
  created_at: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  memberIdIdx: index('notifications_member_id_idx').on(table.member_id),
  readAtIdx: index('notifications_read_at_idx').on(table.read_at),
}))

// =====================================================
// CONTENT MANAGEMENT TABLES
// =====================================================

export const contentCategories = pgTable('content_categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  icon: text('icon'),
  created_at: timestamp('created_at').notNull().defaultNow(),
})

export const content = pgTable('content', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  category_id: integer('category_id'),
  author_id: text('author_id').notNull(),
  featured_image: text('featured_image'),
  status: text('status').notNull().default('draft'), // draft, published, archived
  is_featured: boolean('is_featured').default(false),
  view_count: integer('view_count').default(0),
  seo_title: text('seo_title'),
  seo_description: text('seo_description'),
  published_at: timestamp('published_at'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  slugIdx: index('content_slug_idx').on(table.slug),
  statusIdx: index('content_status_idx').on(table.status),
}))

// =====================================================
// MEDIA TABLES
// =====================================================

export const mediaAlbums = pgTable('media_albums', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  created_by: text('created_by').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
})

export const media = pgTable('media', {
  id: serial('id').primaryKey(),
  album_id: integer('album_id'),
  file_name: text('file_name').notNull(),
  file_url: text('file_url').notNull(),
  file_type: text('file_type'), // image, video, document
  file_size: integer('file_size'),
  uploaded_by: text('uploaded_by').notNull(),
  uploaded_at: timestamp('uploaded_at').notNull().defaultNow(),
}, (table) => ({
  albumIdIdx: index('media_album_id_idx').on(table.album_id),
}))

// =====================================================
// ANALYTICS TABLES
// =====================================================

export const analyticsEvents = pgTable('analytics_events', {
  id: serial('id').primaryKey(),
  event_name: text('event_name').notNull(),
  user_id: text('user_id'),
  event_data: json('event_data'),
  user_agent: text('user_agent'),
  ip_address: text('ip_address'),
  created_at: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  eventNameIdx: index('analytics_events_event_name_idx').on(table.event_name),
  userIdIdx: index('analytics_events_user_id_idx').on(table.user_id),
}))

// =====================================================
// SEARCH HISTORY
// =====================================================

export const searchHistory = pgTable('search_history', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull(),
  query: text('query').notNull(),
  result_count: integer('result_count'),
  search_type: text('search_type'), // members, events, content, all
  created_at: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('search_history_user_id_idx').on(table.user_id),
}))

// =====================================================
// USER PREFERENCES
// =====================================================

export const userPreferences = pgTable('user_preferences', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull().unique(),
  language: text('language').default('en'), // en, om, am
  theme: text('theme').default('light'), // light, dark
  timezone: text('timezone').default('UTC'),
  receive_newsletter: boolean('receive_newsletter').default(true),
  receive_updates: boolean('receive_updates').default(true),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
})

// =====================================================
// LEGACY TABLES (Keep existing for compatibility)
// =====================================================

export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  author_id: text('author_id').notNull(),
  status: text('status').notNull().default('published'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
  published_at: timestamp('published_at'),
})

export const telegram_logs = pgTable('telegram_logs', {
  id: serial('id').primaryKey(),
  telegram_user_id: bigint('telegram_user_id', { mode: 'number' }).notNull(),
  telegram_username: text('telegram_username'),
  action: text('action').notNull(),
  status: text('status').notNull().default('success'),
  message: text('message'),
  member_id: integer('member_id'),
  created_at: timestamp('created_at').notNull().defaultNow(),
})

// =====================================================
// PHASE 2 TABLES: CAMPS SYSTEM
// =====================================================

export const camps = pgTable('camps', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull(), // "leadership", "skill", "mentoring", "community"
  start_date: timestamp('start_date').notNull(),
  end_date: timestamp('end_date').notNull(),
  location: text('location'),
  organizer_id: text('organizer_id').notNull(),
  max_participants: integer('max_participants'),
  camp_image: text('camp_image'),
  status: text('status').notNull().default('planning'), // planning, active, completed, cancelled
  tags: json('tags'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  organizerIdIdx: index('camps_organizer_id_idx').on(table.organizer_id),
  statusIdx: index('camps_status_idx').on(table.status),
}))

export const camp_sessions = pgTable('camp_sessions', {
  id: serial('id').primaryKey(),
  camp_id: integer('camp_id').notNull(),
  session_number: integer('session_number').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  session_date: timestamp('session_date').notNull(),
  start_time: text('start_time'),
  end_time: text('end_time'),
  facilitator_id: text('facilitator_id'),
  location: text('location'),
  created_at: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  campIdIdx: index('camp_sessions_camp_id_idx').on(table.camp_id),
}))

export const camp_enrollments = pgTable('camp_enrollments', {
  id: serial('id').primaryKey(),
  camp_id: integer('camp_id').notNull(),
  member_id: integer('member_id').notNull(),
  enrollment_status: text('enrollment_status').notNull().default('enrolled'), // enrolled, completed, dropped, waiting
  enrollment_date: timestamp('enrollment_date').notNull().defaultNow(),
  completion_date: timestamp('completion_date'),
  created_at: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  campIdIdx: index('camp_enrollments_camp_id_idx').on(table.camp_id),
  memberIdIdx: index('camp_enrollments_member_id_idx').on(table.member_id),
}))

export const camp_feedback = pgTable('camp_feedback', {
  id: serial('id').primaryKey(),
  camp_id: integer('camp_id').notNull(),
  member_id: integer('member_id').notNull(),
  rating: integer('rating'), // 1-5
  comment: text('comment'),
  would_recommend: boolean('would_recommend'),
  submitted_at: timestamp('submitted_at').notNull().defaultNow(),
})

// =====================================================
// PHASE 2 TABLES: ANNOUNCEMENTS (ENHANCED)
// =====================================================

export const announcement_categories = pgTable('announcement_categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  icon: text('icon'),
  created_at: timestamp('created_at').notNull().defaultNow(),
})

export const announcement_views = pgTable('announcement_views', {
  id: serial('id').primaryKey(),
  announcement_id: integer('announcement_id').notNull(),
  user_id: text('user_id').notNull(),
  viewed_at: timestamp('viewed_at').notNull().defaultNow(),
}, (table) => ({
  announcementIdIdx: index('announcement_views_announcement_id_idx').on(table.announcement_id),
  userIdIdx: index('announcement_views_user_id_idx').on(table.user_id),
}))

// =====================================================
// PHASE 2 TABLES: MEDIA MANAGEMENT
// =====================================================

export const media_categories = pgTable('media_categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  created_at: timestamp('created_at').notNull().defaultNow(),
})

// =====================================================
// PHASE 2 TABLES: CMS CONTENT MANAGEMENT
// =====================================================

export const cms_settings = pgTable('cms_settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: json('value'),
  description: text('description'),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  keyIdx: index('cms_settings_key_idx').on(table.key),
}))

export const page_blocks = pgTable('page_blocks', {
  id: serial('id').primaryKey(),
  page_type: text('page_type').notNull(), // "home", "about", "events", "gallery"
  block_type: text('block_type').notNull(), // "hero", "services", "testimonials", "cta"
  block_order: integer('block_order').notNull(),
  title: text('title'),
  description: text('description'),
  content: json('content'), // flexible content structure
  background_image: text('background_image'),
  background_color: text('background_color'),
  text_color: text('text_color'),
  is_visible: boolean('is_visible').default(true),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  pageTypeIdx: index('page_blocks_page_type_idx').on(table.page_type),
  blockTypeIdx: index('page_blocks_block_type_idx').on(table.block_type),
}))

// =====================================================
// PHASE 2 TABLES: COMMUNITY STATISTICS & ANALYTICS
// =====================================================

export const community_statistics = pgTable('community_statistics', {
  id: serial('id').primaryKey(),
  metric_name: text('metric_name').notNull(), // "active_members", "events_hosted", "volunteer_hours", "funds_raised"
  metric_value: text('metric_value').notNull(), // stored as string to support various types
  metric_type: text('metric_type'), // "number", "currency", "hours", "percentage"
  updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  metricNameIdx: index('community_statistics_metric_name_idx').on(table.metric_name),
}))

export const bot_commands_analytics = pgTable('bot_commands_analytics', {
  id: serial('id').primaryKey(),
  command_name: text('command_name').notNull(), // "/start", "/register", "/status", "/help"
  user_id: text('user_id'),
  telegram_user_id: bigint('telegram_user_id', { mode: 'number' }),
  success: boolean('success').default(true),
  error_message: text('error_message'),
  executed_at: timestamp('executed_at').notNull().defaultNow(),
}, (table) => ({
  commandNameIdx: index('bot_commands_analytics_command_name_idx').on(table.command_name),
  telegramUserIdIdx: index('bot_commands_analytics_telegram_user_id_idx').on(table.telegram_user_id),
}))

// =====================================================
// PHASE 2 TABLES: ENHANCED ANNOUNCEMENTS
// =====================================================

export const announcements_enhanced = pgTable('announcements_enhanced', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  author_id: text('author_id').notNull(),
  category_id: integer('category_id'),
  status: text('status').notNull().default('published'), // draft, published, archived
  is_pinned: boolean('is_pinned').default(false),
  is_featured: boolean('is_featured').default(false),
  announcement_image: text('announcement_image'),
  expiration_date: timestamp('expiration_date'),
  view_count: integer('view_count').default(0),
  target_audience: text('target_audience').default('public'), // public, members_only, admins_only
  published_at: timestamp('published_at'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  authorIdIdx: index('announcements_enhanced_author_id_idx').on(table.author_id),
  statusIdx: index('announcements_enhanced_status_idx').on(table.status),
  categoryIdIdx: index('announcements_enhanced_category_id_idx').on(table.category_id),
}))

// =====================================================
// PHASE 2 TABLES: TESTIMONIALS MANAGEMENT
// =====================================================

export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  member_id: integer('member_id').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  rating: integer('rating'), // 1-5
  member_role: text('member_role'), // "volunteer", "member", "corporate_partner", etc
  member_image: text('member_image'),
  is_featured: boolean('is_featured').default(false),
  is_approved: boolean('is_approved').default(false),
  created_at: timestamp('created_at').notNull().defaultNow(),
  approved_at: timestamp('approved_at'),
  approved_by: text('approved_by'),
}, (table) => ({
  memberIdIdx: index('testimonials_member_id_idx').on(table.member_id),
  isFeaturedIdx: index('testimonials_is_featured_idx').on(table.is_featured),
}))

// =====================================================
// PHASE 2 TABLES: GALLERY & ALBUMS
// =====================================================

export const gallery_albums = pgTable('gallery_albums', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category'), // "events", "camps", "community", "achievements"
  cover_image: text('cover_image'),
  created_by: text('created_by').notNull(),
  is_public: boolean('is_public').default(true),
  created_at: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  categoryIdx: index('gallery_albums_category_idx').on(table.category),
}))

export const gallery_images = pgTable('gallery_images', {
  id: serial('id').primaryKey(),
  album_id: integer('album_id').notNull(),
  image_url: text('image_url').notNull(),
  caption: text('caption'),
  uploaded_by: text('uploaded_by').notNull(),
  image_order: integer('image_order'),
  uploaded_at: timestamp('uploaded_at').notNull().defaultNow(),
}, (table) => ({
  albumIdIdx: index('gallery_images_album_id_idx').on(table.album_id),
}))

// =====================================================
// PHASE 2 TABLES: SERVICES & FEATURES
// =====================================================

export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  icon: text('icon'), // emoji or icon name
  image_url: text('image_url'),
  service_order: integer('service_order'),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  isActiveIdx: index('services_is_active_idx').on(table.is_active),
}))

// =====================================================
// PHASE 2 TABLES: ACHIEVEMENTS & MILESTONES
// =====================================================

export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  metric_value: text('metric_value').notNull(), // "1,250 Members", "48 Events", etc
  metric_label: text('metric_label'), // "Active Members", "Events Hosted", etc
  achievement_icon: text('achievement_icon'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
})

// =====================================================
// PHASE 2 TABLES: EVENTS SYSTEM (ENHANCED)
// =====================================================

export const events_enhanced = pgTable('events_enhanced', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  event_date: timestamp('event_date').notNull(),
  start_time: text('start_time'),
  end_time: text('end_time'),
  location: text('location').notNull(),
  capacity: integer('capacity').notNull(),
  registered_count: integer('registered_count').default(0),
  event_image: text('event_image'),
  category: text('category'), // "workshop", "conference", "networking", "training"
  status: text('status').notNull().default('upcoming'), // upcoming, live, completed, cancelled
  organizer_id: text('organizer_id').notNull(),
  is_featured: boolean('is_featured').default(false),
  tags: json('tags'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  organizerIdIdx: index('events_enhanced_organizer_id_idx').on(table.organizer_id),
  statusIdx: index('events_enhanced_status_idx').on(table.status),
  dateIdx: index('events_enhanced_date_idx').on(table.event_date),
}))

export const event_speakers = pgTable('event_speakers', {
  id: serial('id').primaryKey(),
  event_id: integer('event_id').notNull(),
  speaker_name: text('speaker_name').notNull(),
  speaker_bio: text('speaker_bio'),
  speaker_image: text('speaker_image'),
  speaker_title: text('speaker_title'),
  created_at: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  eventIdIdx: index('event_speakers_event_id_idx').on(table.event_id),
}))

export const event_attendees = pgTable('event_attendees', {
  id: serial('id').primaryKey(),
  event_id: integer('event_id').notNull(),
  member_id: integer('member_id'),
  user_id: text('user_id'),
  registration_date: timestamp('registration_date').notNull().defaultNow(),
  check_in_date: timestamp('check_in_date'),
  attendance_status: text('attendance_status').default('registered'), // registered, checked_in, no_show, cancelled
  created_at: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  eventIdIdx: index('enh_event_attendees_event_id_idx').on(table.event_id),
  userIdIdx: index('enh_event_attendees_user_id_idx').on(table.user_id),
}))

export const event_feedback = pgTable('event_feedback', {
  id: serial('id').primaryKey(),
  event_id: integer('event_id').notNull(),
  user_id: text('user_id').notNull(),
  rating: integer('rating'), // 1-5
  comment: text('comment'),
  would_recommend: boolean('would_recommend'),
  submitted_at: timestamp('submitted_at').notNull().defaultNow(),
}, (table) => ({
  eventIdIdx: index('event_feedback_event_id_idx').on(table.event_id),
}))
