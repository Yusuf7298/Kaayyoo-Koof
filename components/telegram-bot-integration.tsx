'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function TelegramBotIntegration() {
  const [botToken, setBotToken] = useState('')
  const [webhookUrl, setWebhookUrl] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveConfiguration = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/telegram/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bot_token: botToken,
          webhook_url: webhookUrl,
        }),
      })

      if (response.ok) {
        setIsConnected(true)
        alert('Bot configuration saved successfully!')
      }
    } catch (error) {
      console.error('[v0] Error saving config:', error)
      alert('Failed to save configuration')
    } finally {
      setIsSaving(false)
    }
  }

  const testConnection = async () => {
    try {
      const response = await fetch('/api/telegram/test', {
        method: 'POST',
      })

      if (response.ok) {
        alert('Connection test successful!')
      } else {
        alert('Connection test failed')
      }
    } catch (error) {
      console.error('[v0] Test error:', error)
      alert('Failed to test connection')
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Telegram Bot Configuration</CardTitle>
          <CardDescription>Set up your community Telegram bot integration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Bot Token</label>
            <Input
              type="password"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="Enter your Telegram bot token"
              disabled={isSaving}
            />
            <p className="text-xs text-gray-500 mt-1">
              Get this from @BotFather on Telegram
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Webhook URL</label>
            <Input
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://yourdomain.com/api/telegram/webhook"
              disabled={isSaving}
            />
            <p className="text-xs text-gray-500 mt-1">
              The URL where Telegram will send updates
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSaveConfiguration} disabled={isSaving || !botToken}>
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </Button>
            <Button variant="outline" onClick={testConnection} disabled={!isConnected}>
              Test Connection
            </Button>
          </div>

          {isConnected && (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
              Bot is connected and operational
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bot Commands</CardTitle>
          <CardDescription>Available commands for your community members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border rounded">
              <p className="font-mono text-sm">/start</p>
              <p className="text-xs text-gray-600">Start the bot and get registration link</p>
            </div>
            <div className="p-3 border rounded">
              <p className="font-mono text-sm">/register</p>
              <p className="text-xs text-gray-600">Register as a new community member</p>
            </div>
            <div className="p-3 border rounded">
              <p className="font-mono text-sm">/status</p>
              <p className="text-xs text-gray-600">Check membership and profile status</p>
            </div>
            <div className="p-3 border rounded">
              <p className="font-mono text-sm">/events</p>
              <p className="text-xs text-gray-600">View upcoming community events</p>
            </div>
            <div className="p-3 border rounded">
              <p className="font-mono text-sm">/help</p>
              <p className="text-xs text-gray-600">Get help and command information</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bot Activity</CardTitle>
          <CardDescription>Recent bot interactions and commands</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 border rounded">
              <span>/start</span>
              <span className="text-gray-500">2 min ago</span>
            </div>
            <div className="flex justify-between items-center p-2 border rounded">
              <span>/register</span>
              <span className="text-gray-500">5 min ago</span>
            </div>
            <div className="flex justify-between items-center p-2 border rounded">
              <span>/events</span>
              <span className="text-gray-500">12 min ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
