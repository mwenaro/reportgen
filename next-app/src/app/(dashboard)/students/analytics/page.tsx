'use client'

import React from 'react'
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LoadingSpinner,
  Badge
} from '@/components'
import { useStudents } from '@/lib/store/students'
import { useClasses } from '@/lib/store/classes'
import { formatDate, calculateAge } from '@/lib/utils'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function StudentAnalyticsPage() {
  const { data: students = [], isLoading } = useStudents()
  const { data: classes = [] } = useClasses()

  // Calculate analytics data
  const analytics = React.useMemo(() => {
    if (students.length === 0) return null

    // Gender distribution
    const genderDistribution = students.reduce((acc, student) => {
      acc[student.gender] = (acc[student.gender] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Status distribution
    const statusDistribution = students.reduce((acc, student) => {
      acc[student.status] = (acc[student.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Class distribution
    const classDistribution = students.reduce((acc, student) => {
      const className = student.className || 'Unassigned'
      acc[className] = (acc[className] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Age distribution
    const ageDistribution = students.reduce((acc, student) => {
      const age = calculateAge(student.dateOfBirth)
      const ageGroup = age < 10 ? '5-9' : age < 13 ? '10-12' : age < 16 ? '13-15' : age < 19 ? '16-18' : '19+'
      acc[ageGroup] = (acc[ageGroup] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // KCPE distribution
    const kcpeDistribution = students
      .filter(s => s.kcpeMarks)
      .reduce((acc, student) => {
        const marks = student.kcpeMarks!
        const range = marks < 250 ? '0-249' : marks < 300 ? '250-299' : marks < 350 ? '300-349' : marks < 400 ? '350-399' : '400-500'
        acc[range] = (acc[range] || 0) + 1
        return acc
      }, {} as Record<string, number>)

    // Enrollment trends (by month)\n    const enrollmentTrends = students.reduce((acc, student) => {\n      const month = student.enrollmentDate.toLocaleString('default', { month: 'short', year: 'numeric' })\n      acc[month] = (acc[month] || 0) + 1\n      return acc\n    }, {} as Record<string, number>)\n\n    return {\n      total: students.length,\n      genderDistribution: Object.entries(genderDistribution).map(([key, value]) => ({ name: key, value })),\n      statusDistribution: Object.entries(statusDistribution).map(([key, value]) => ({ name: key, value })),\n      classDistribution: Object.entries(classDistribution).map(([key, value]) => ({ name: key, value })),\n      ageDistribution: Object.entries(ageDistribution).map(([key, value]) => ({ name: key, value })),\n      kcpeDistribution: Object.entries(kcpeDistribution).map(([key, value]) => ({ name: key, value })),\n      enrollmentTrends: Object.entries(enrollmentTrends).map(([key, value]) => ({ month: key, students: value })),\n      averageAge: students.reduce((sum, s) => sum + calculateAge(s.dateOfBirth), 0) / students.length,\n      averageKcpe: students.filter(s => s.kcpeMarks).reduce((sum, s) => sum + s.kcpeMarks!, 0) / students.filter(s => s.kcpeMarks).length || 0\n    }\n  }, [students])\n\n  if (isLoading) {\n    return (\n      <div className=\"container mx-auto px-4 py-8\">\n        <div className=\"flex items-center justify-center py-12\">\n          <LoadingSpinner size=\"lg\" />\n        </div>\n      </div>\n    )\n  }\n\n  if (!analytics) {\n    return (\n      <div className=\"container mx-auto px-4 py-8\">\n        <Card>\n          <CardContent className=\"py-8\">\n            <div className=\"text-center\">\n              <p className=\"text-muted-foreground\">No student data available for analytics</p>\n            </div>\n          </CardContent>\n        </Card>\n      </div>\n    )\n  }\n\n  return (\n    <div className=\"container mx-auto px-4 py-8 space-y-6\">\n      {/* Header */}\n      <div>\n        <h1 className=\"text-3xl font-bold\">Student Analytics</h1>\n        <p className=\"text-muted-foreground\">\n          Insights and trends from student data\n        </p>\n      </div>\n\n      {/* Summary Cards */}\n      <div className=\"grid grid-cols-1 md:grid-cols-4 gap-4\">\n        <Card>\n          <CardContent className=\"p-6\">\n            <div className=\"flex items-center justify-between\">\n              <div>\n                <p className=\"text-sm font-medium text-muted-foreground\">Total Students</p>\n                <p className=\"text-3xl font-bold\">{analytics.total}</p>\n              </div>\n              <div className=\"h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center\">\n                <span className=\"text-blue-600 dark:text-blue-400 text-xs\">👥</span>\n              </div>\n            </div>\n          </CardContent>\n        </Card>\n\n        <Card>\n          <CardContent className=\"p-6\">\n            <div className=\"flex items-center justify-between\">\n              <div>\n                <p className=\"text-sm font-medium text-muted-foreground\">Average Age</p>\n                <p className=\"text-3xl font-bold\">{Math.round(analytics.averageAge * 10) / 10}</p>\n                <p className=\"text-xs text-muted-foreground\">years</p>\n              </div>\n              <div className=\"h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center\">\n                <span className=\"text-green-600 dark:text-green-400 text-xs\">📅</span>\n              </div>\n            </div>\n          </CardContent>\n        </Card>\n\n        <Card>\n          <CardContent className=\"p-6\">\n            <div className=\"flex items-center justify-between\">\n              <div>\n                <p className=\"text-sm font-medium text-muted-foreground\">Average KCPE</p>\n                <p className=\"text-3xl font-bold\">{Math.round(analytics.averageKcpe)}</p>\n                <p className=\"text-xs text-muted-foreground\">out of 500</p>\n              </div>\n              <div className=\"h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center\">\n                <span className=\"text-purple-600 dark:text-purple-400 text-xs\">📊</span>\n              </div>\n            </div>\n          </CardContent>\n        </Card>\n\n        <Card>\n          <CardContent className=\"p-6\">\n            <div className=\"flex items-center justify-between\">\n              <div>\n                <p className=\"text-sm font-medium text-muted-foreground\">Active Classes</p>\n                <p className=\"text-3xl font-bold\">{classes.filter(c => c.isActive).length}</p>\n              </div>\n              <div className=\"h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center\">\n                <span className=\"text-orange-600 dark:text-orange-400 text-xs\">🏫</span>\n              </div>\n            </div>\n          </CardContent>\n        </Card>\n      </div>\n\n      {/* Charts Grid */}\n      <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6\">\n        {/* Gender Distribution */}\n        <Card>\n          <CardHeader>\n            <CardTitle>Gender Distribution</CardTitle>\n          </CardHeader>\n          <CardContent>\n            <div className=\"h-64\">\n              <ResponsiveContainer width=\"100%\" height=\"100%\">\n                <PieChart>\n                  <Pie\n                    data={analytics.genderDistribution}\n                    cx=\"50%\"\n                    cy=\"50%\"\n                    labelLine={false}\n                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}\n                    outerRadius={80}\n                    fill=\"#8884d8\"\n                    dataKey=\"value\"\n                  >\n                    {analytics.genderDistribution.map((entry, index) => (\n                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />\n                    ))}\n                  </Pie>\n                  <Tooltip />\n                </PieChart>\n              </ResponsiveContainer>\n            </div>\n          </CardContent>\n        </Card>\n\n        {/* Status Distribution */}\n        <Card>\n          <CardHeader>\n            <CardTitle>Student Status</CardTitle>\n          </CardHeader>\n          <CardContent>\n            <div className=\"h-64\">\n              <ResponsiveContainer width=\"100%\" height=\"100%\">\n                <BarChart data={analytics.statusDistribution}>\n                  <CartesianGrid strokeDasharray=\"3 3\" />\n                  <XAxis dataKey=\"name\" />\n                  <YAxis />\n                  <Tooltip />\n                  <Bar dataKey=\"value\" fill=\"#8884d8\" />\n                </BarChart>\n              </ResponsiveContainer>\n            </div>\n          </CardContent>\n        </Card>\n\n        {/* Class Distribution */}\n        <Card>\n          <CardHeader>\n            <CardTitle>Students by Class</CardTitle>\n          </CardHeader>\n          <CardContent>\n            <div className=\"h-64\">\n              <ResponsiveContainer width=\"100%\" height=\"100%\">\n                <BarChart data={analytics.classDistribution.slice(0, 8)}>\n                  <CartesianGrid strokeDasharray=\"3 3\" />\n                  <XAxis dataKey=\"name\" />\n                  <YAxis />\n                  <Tooltip />\n                  <Bar dataKey=\"value\" fill=\"#82ca9d\" />\n                </BarChart>\n              </ResponsiveContainer>\n            </div>\n          </CardContent>\n        </Card>\n\n        {/* Age Distribution */}\n        <Card>\n          <CardHeader>\n            <CardTitle>Age Distribution</CardTitle>\n          </CardHeader>\n          <CardContent>\n            <div className=\"h-64\">\n              <ResponsiveContainer width=\"100%\" height=\"100%\">\n                <BarChart data={analytics.ageDistribution}>\n                  <CartesianGrid strokeDasharray=\"3 3\" />\n                  <XAxis dataKey=\"name\" />\n                  <YAxis />\n                  <Tooltip />\n                  <Bar dataKey=\"value\" fill=\"#ffc658\" />\n                </BarChart>\n              </ResponsiveContainer>\n            </div>\n          </CardContent>\n        </Card>\n\n        {/* KCPE Distribution */}\n        {analytics.kcpeDistribution.length > 0 && (\n          <Card>\n            <CardHeader>\n              <CardTitle>KCPE Marks Distribution</CardTitle>\n            </CardHeader>\n            <CardContent>\n              <div className=\"h-64\">\n                <ResponsiveContainer width=\"100%\" height=\"100%\">\n                  <BarChart data={analytics.kcpeDistribution}>\n                    <CartesianGrid strokeDasharray=\"3 3\" />\n                    <XAxis dataKey=\"name\" />\n                    <YAxis />\n                    <Tooltip />\n                    <Bar dataKey=\"value\" fill=\"#ff7c7c\" />\n                  </BarChart>\n                </ResponsiveContainer>\n              </div>\n            </CardContent>\n          </Card>\n        )}\n\n        {/* Enrollment Trends */}\n        <Card>\n          <CardHeader>\n            <CardTitle>Enrollment Trends</CardTitle>\n          </CardHeader>\n          <CardContent>\n            <div className=\"h-64\">\n              <ResponsiveContainer width=\"100%\" height=\"100%\">\n                <LineChart data={analytics.enrollmentTrends.slice(-12)}>\n                  <CartesianGrid strokeDasharray=\"3 3\" />\n                  <XAxis dataKey=\"month\" />\n                  <YAxis />\n                  <Tooltip />\n                  <Line type=\"monotone\" dataKey=\"students\" stroke=\"#8884d8\" strokeWidth={2} />\n                </LineChart>\n              </ResponsiveContainer>\n            </div>\n          </CardContent>\n        </Card>\n      </div>\n\n      {/* Detailed Stats Table */}\n      <Card>\n        <CardHeader>\n          <CardTitle>Detailed Statistics</CardTitle>\n        </CardHeader>\n        <CardContent>\n          <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">\n            {/* Gender Stats */}\n            <div>\n              <h4 className=\"font-semibold mb-3\">Gender Breakdown</h4>\n              <div className=\"space-y-2\">\n                {analytics.genderDistribution.map((item, index) => (\n                  <div key={item.name} className=\"flex items-center justify-between\">\n                    <span className=\"capitalize\">{item.name}</span>\n                    <div className=\"flex items-center gap-2\">\n                      <Badge variant=\"outline\">{item.value}</Badge>\n                      <span className=\"text-sm text-muted-foreground\">\n                        {((item.value / analytics.total) * 100).toFixed(1)}%\n                      </span>\n                    </div>\n                  </div>\n                ))}\n              </div>\n            </div>\n\n            {/* Status Stats */}\n            <div>\n              <h4 className=\"font-semibold mb-3\">Status Breakdown</h4>\n              <div className=\"space-y-2\">\n                {analytics.statusDistribution.map((item, index) => (\n                  <div key={item.name} className=\"flex items-center justify-between\">\n                    <span className=\"capitalize\">{item.name}</span>\n                    <div className=\"flex items-center gap-2\">\n                      <Badge variant=\"outline\">{item.value}</Badge>\n                      <span className=\"text-sm text-muted-foreground\">\n                        {((item.value / analytics.total) * 100).toFixed(1)}%\n                      </span>\n                    </div>\n                  </div>\n                ))}\n              </div>\n            </div>\n\n            {/* Top Classes */}\n            <div>\n              <h4 className=\"font-semibold mb-3\">Top Classes</h4>\n              <div className=\"space-y-2\">\n                {analytics.classDistribution.slice(0, 5).map((item, index) => (\n                  <div key={item.name} className=\"flex items-center justify-between\">\n                    <span>{item.name}</span>\n                    <div className=\"flex items-center gap-2\">\n                      <Badge variant=\"outline\">{item.value}</Badge>\n                      <span className=\"text-sm text-muted-foreground\">\n                        {((item.value / analytics.total) * 100).toFixed(1)}%\n                      </span>\n                    </div>\n                  </div>\n                ))}\n              </div>\n            </div>\n          </div>\n        </CardContent>\n      </Card>\n    </div>\n  )\n}"