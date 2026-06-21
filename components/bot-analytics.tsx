'use client'

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface CommandUsageData {
  command: string
  count: number
  success_rate: number
}

interface RegistrationTrendData {
  date: string
  registrations: number
  telegram_registrations: number
}

interface BotHealth {
  status: 'healthy' | 'warning' | 'error'
  response_time_ms: number
  error_rate: number
  total_commands: number
  success_count: number
}

export function BotHealthCard({ health }: { health: BotHealth }) {
  const statusColor = {
    healthy: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  }

  const statusEmoji = {
    healthy: '✅',
    warning: '⚠️',
    error: '❌',
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-400">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">Bot Health Status</h3>
        <span className={`px-3 py-1 rounded-full font-bold ${statusColor[health.status]}`}>
          {statusEmoji[health.status]} {health.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600 text-sm">Response Time</p>
          <p className="text-2xl font-bold text-gray-800">
            {health.response_time_ms}ms
          </p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Error Rate</p>
          <p className="text-2xl font-bold text-gray-800">
            {(health.error_rate * 100).toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Total Commands</p>
          <p className="text-2xl font-bold text-gray-800">{health.total_commands}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Success Count</p>
          <p className="text-2xl font-bold text-green-600">{health.success_count}</p>
        </div>
      </div>
    </div>
  )
}

export function CommandUsageChart({ data }: { data: CommandUsageData[] }) {
  const chartData = data.map((cmd) => ({
    command: cmd.command.replace('/', ''),
    count: cmd.count,
    success_rate: Math.round(cmd.success_rate * 100),
  }))

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Command Usage Statistics</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="command" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#FFC107" name="Total Uses" />
          <Bar dataKey="success_rate" fill="#10B981" name="Success Rate %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function RegistrationTrendChart({
  data,
}: {
  data: RegistrationTrendData[]
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Registration Trends
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="registrations"
            stroke="#3B82F6"
            strokeWidth={2}
            name="Web Registrations"
          />
          <Line
            type="monotone"
            dataKey="telegram_registrations"
            stroke="#FFC107"
            strokeWidth={2}
            name="Telegram Registrations"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

interface ErrorLogEntry {
  id: number
  timestamp: string
  command: string
  error_message: string
  telegram_user_id: string
}

export function ErrorLog({ errors }: { errors: ErrorLogEntry[] }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Errors</h3>

      {errors.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No errors recorded</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {errors.map((error) => (
            <div
              key={error.id}
              className="flex gap-3 p-3 bg-red-50 rounded border-l-4 border-red-400"
            >
              <div className="text-red-600 flex-shrink-0">🔴</div>
              <div className="flex-1">
                <p className="font-mono text-sm text-gray-800">
                  {error.command} - {new Date(error.timestamp).toLocaleString()}
                </p>
                <p className="text-xs text-red-600 mt-1">{error.error_message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
