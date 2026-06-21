'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface CampWithStats {
  id: number
  title: string
  description: string
  status: string
  start_date: string
  max_participants: number
  enrollment_count?: number
}

export function CampManagementDashboard() {
  const [camps, setCamps] = useState<CampWithStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function fetchCamps() {
      try {
        const response = await fetch('/api/camps')
        if (!response.ok) throw new Error('Failed to fetch camps')
        const data = await response.json()
        setCamps(data)
      } catch (error) {
        console.error('[v0] Error fetching camps:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCamps()
  }, [])

  const filteredCamps = camps.filter(
    (camp) =>
      camp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camp.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalEnrollments = camps.reduce((sum, camp) => sum + (camp.enrollment_count || 0), 0)
  const activeCamps = camps.filter((camp) => camp.status === 'active').length
  const completedCamps = camps.filter((camp) => camp.status === 'completed').length

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Camps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{camps.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Camps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCamps}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCamps}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Camp List</CardTitle>
          <CardDescription>Manage all camps and their participants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search camps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading camps...</div>
          ) : filteredCamps.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No camps found</div>
          ) : (
            <div className="space-y-2">
              {filteredCamps.map((camp) => (
                <div
                  key={camp.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 flex justify-between items-center"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{camp.title}</h3>
                    <p className="text-sm text-gray-600">{camp.description}</p>
                    <div className="mt-2 flex gap-4 text-sm">
                      <span className="text-gray-500">
                        Enrollments: {camp.enrollment_count || 0}/{camp.max_participants}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          camp.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : camp.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {camp.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
