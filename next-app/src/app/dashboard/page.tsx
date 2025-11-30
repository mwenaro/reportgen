'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Building2,
  TrendingUp,
  Calendar,
  AlertCircle,
  Activity
} from 'lucide-react'
import Link from 'next/link'

// Mock data for dashboard stats
const dashboardStats = {
  totalTeachers: 45,
  totalStudents: 1250,
  totalClasses: 28,
  totalSubjects: 15,
  activeEnrollments: 1180,
  pendingApplications: 23,
  upcomingEvents: 8,
  systemAlerts: 3
}

const recentActivities = [
  {
    id: 1,
    type: 'teacher',
    message: 'New teacher Sarah Johnson joined Mathematics Department',
    timestamp: '2 hours ago',
    icon: Users
  },
  {
    id: 2,
    type: 'class',
    message: 'Class 10A schedule updated for next week',
    timestamp: '4 hours ago',
    icon: Calendar
  },
  {
    id: 3,
    type: 'subject',
    message: 'Advanced Physics curriculum approved',
    timestamp: '1 day ago',
    icon: BookOpen
  },
  {
    id: 4,
    type: 'enrollment',
    message: '15 new student enrollments processed',
    timestamp: '2 days ago',
    icon: GraduationCap
  }
]

const quickActions = [
  {
    title: 'Add New Teacher',
    description: 'Register a new teacher in the system',
    href: '/dashboard/teachers/new',
    icon: Users,
    color: 'bg-blue-500'
  },
  {
    title: 'Create Class',
    description: 'Set up a new class for the term',
    href: '/dashboard/classes/new',
    icon: Building2,
    color: 'bg-green-500'
  },
  {
    title: 'Add Subject',
    description: 'Add a new subject to curriculum',
    href: '/dashboard/subjects/new',
    icon: BookOpen,
    color: 'bg-purple-500'
  },
  {
    title: 'Enroll Student',
    description: 'Register new student enrollment',
    href: '/dashboard/students/new',
    icon: GraduationCap,
    color: 'bg-orange-500'
  }
]

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString())
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening at your school today.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Activity className="h-4 w-4" />
          <span>Last updated: {currentTime}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalTeachers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalClasses}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">+2</span> new this term
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalSubjects}</div>
            <p className="text-xs text-muted-foreground">
              Across all departments
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Quick Actions */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="grid gap-4 md:grid-cols-2">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="block group"
                >
                  <Card className="transition-colors hover:bg-accent">
                    <CardContent className="flex items-center space-x-4 p-4">
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold group-hover:text-accent-foreground">
                          {action.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Enrollment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {dashboardStats.activeEnrollments}
            </div>
            <p className="text-sm text-muted-foreground">Active enrollments</p>
            <div className="mt-2">
              <div className="text-sm">
                <span className="text-yellow-600">{dashboardStats.pendingApplications}</span> pending applications
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {dashboardStats.upcomingEvents}
            </div>
            <p className="text-sm text-muted-foreground">Next 7 days</p>
            <Button variant="outline" size="sm" className="mt-2">
              View Calendar
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              System Alerts
              <AlertCircle className="h-4 w-4 ml-2 text-red-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {dashboardStats.systemAlerts}
            </div>
            <p className="text-sm text-muted-foreground">Require attention</p>
            <Button variant="outline" size="sm" className="mt-2">
              View Details
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}