'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ComprehensiveReportingDashboard() {
  const reportTypes = [
    { name: 'Member Report', description: 'Complete member statistics and demographics' },
    { name: 'Event Report', description: 'Event attendance and engagement metrics' },
    { name: 'Financial Report', description: 'Contributions and fundraising summary' },
    { name: 'Camp Report', description: 'Camp enrollment and completion rates' },
    { name: 'Activity Report', description: 'User activity and engagement timeline' },
    { name: 'Bot Analytics', description: 'Telegram bot command usage statistics' },
  ]

  const handleGenerateReport = (reportType: string) => {
    const endpoint = `/api/reports/${reportType.toLowerCase().replace(' ', '-')}`
    window.location.href = `${endpoint}?format=csv`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Report Center</CardTitle>
          <CardDescription>Generate and download comprehensive reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTypes.map((report) => (
              <Card key={report.name} className="p-4">
                <h3 className="font-semibold mb-1">{report.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateReport(report.name)}
                  >
                    CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateReport(report.name)}
                  >
                    PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Report History</CardTitle>
          <CardDescription>Recently generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 border rounded">
              <span className="text-sm">Member Report - 2024-06-15</span>
              <Button variant="ghost" size="sm">
                Download
              </Button>
            </div>
            <div className="flex justify-between items-center p-3 border rounded">
              <span className="text-sm">Event Report - 2024-06-10</span>
              <Button variant="ghost" size="sm">
                Download
              </Button>
            </div>
            <div className="flex justify-between items-center p-3 border rounded">
              <span className="text-sm">Financial Report - 2024-06-01</span>
              <Button variant="ghost" size="sm">
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
