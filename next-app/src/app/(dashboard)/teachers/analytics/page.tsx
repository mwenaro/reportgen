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
import { useTeachers } from '@/lib/store/teachers'
import { useSubjects } from '@/lib/store/subjects'
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
  Line,
  AreaChart,
  Area
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C']

export default function TeacherAnalyticsPage() {
  const { data: teachers = [], isLoading } = useTeachers()
  const { data: subjects = [] } = useSubjects()
  const { data: classes = [] } = useClasses()

  // Calculate analytics data
  const analytics = React.useMemo(() => {
    if (teachers.length === 0) return null

    // Gender distribution
    const genderDistribution = teachers.reduce((acc, teacher) => {
      acc[teacher.gender] = (acc[teacher.gender] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Status distribution
    const statusDistribution = teachers.reduce((acc, teacher) => {
      acc[teacher.status] = (acc[teacher.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Contract type distribution
    const contractDistribution = teachers.reduce((acc, teacher) => {
      acc[teacher.contractType] = (acc[teacher.contractType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Age distribution
    const ageDistribution = teachers.reduce((acc, teacher) => {
      const age = calculateAge(teacher.dateOfBirth)
      const ageGroup = age < 25 ? '20-24' : age < 30 ? '25-29' : age < 35 ? '30-34' : age < 40 ? '35-39' : age < 45 ? '40-44' : age < 50 ? '45-49' : age < 55 ? '50-54' : '55+'
      acc[ageGroup] = (acc[ageGroup] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Experience distribution
    const experienceDistribution = teachers.reduce((acc, teacher) => {
      const experience = teacher.experience || '0'
      const years = parseInt(experience.match(/\d+/)?.[0] || '0')
      const expGroup = years < 2 ? '0-1' : years < 5 ? '2-4' : years < 10 ? '5-9' : years < 15 ? '10-14' : '15+'
      acc[expGroup] = (acc[expGroup] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Subject teaching load
    const subjectLoad = subjects.map(subject => {
      const teacherCount = teachers.filter(teacher => 
        teacher.subjects?.includes(subject.id)
      ).length
      return {
        name: subject.name,
        teachers: teacherCount,
        code: subject.code
      }
    }).filter(item => item.teachers > 0)

    // Class load distribution
    const classLoadDistribution = teachers.reduce((acc, teacher) => {
      const classCount = teacher.classes?.length || 0
      const loadGroup = classCount === 0 ? 'No Classes' : classCount <= 2 ? '1-2 Classes' : classCount <= 4 ? '3-4 Classes' : classCount <= 6 ? '5-6 Classes' : '7+ Classes'
      acc[loadGroup] = (acc[loadGroup] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Qualification distribution
    const qualificationDistribution = teachers.reduce((acc, teacher) => {
      const qualification = teacher.qualification || 'Not Specified'
      // Categorize qualifications
      let category = 'Other'
      if (qualification.toLowerCase().includes('bachelor')) category = 'Bachelor\'s Degree'
      else if (qualification.toLowerCase().includes('master')) category = 'Master\'s Degree'
      else if (qualification.toLowerCase().includes('phd') || qualification.toLowerCase().includes('doctorate')) category = 'PhD/Doctorate'
      else if (qualification.toLowerCase().includes('diploma')) category = 'Diploma'
      else if (qualification.toLowerCase().includes('certificate')) category = 'Certificate'
      
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Hiring trends (by year)
    const hiringTrends = teachers.reduce((acc, teacher) => {
      const year = teacher.hireDate.getFullYear().toString()
      acc[year] = (acc[year] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Salary distribution (for teachers with salary data)
    const teachersWithSalary = teachers.filter(t => t.salary)
    const salaryDistribution = teachersWithSalary.reduce((acc, teacher) => {
      const salary = teacher.salary!
      const range = salary < 30000 ? '20k-30k' : salary < 40000 ? '30k-40k' : salary < 50000 ? '40k-50k' : salary < 60000 ? '50k-60k' : '60k+'
      acc[range] = (acc[range] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total: teachers.length,
      genderDistribution: Object.entries(genderDistribution).map(([key, value]) => ({ name: key, value })),
      statusDistribution: Object.entries(statusDistribution).map(([key, value]) => ({ name: key, value })),
      contractDistribution: Object.entries(contractDistribution).map(([key, value]) => ({ name: key, value })),
      ageDistribution: Object.entries(ageDistribution).map(([key, value]) => ({ name: key, value })),
      experienceDistribution: Object.entries(experienceDistribution).map(([key, value]) => ({ name: key, value })),
      subjectLoad: subjectLoad.sort((a, b) => b.teachers - a.teachers),
      classLoadDistribution: Object.entries(classLoadDistribution).map(([key, value]) => ({ name: key, value })),
      qualificationDistribution: Object.entries(qualificationDistribution).map(([key, value]) => ({ name: key, value })),
      hiringTrends: Object.entries(hiringTrends).map(([key, value]) => ({ year: key, hires: value })).sort((a, b) => parseInt(a.year) - parseInt(b.year)),
      salaryDistribution: Object.entries(salaryDistribution).map(([key, value]) => ({ name: key, value })),
      averageAge: teachers.reduce((sum, t) => sum + calculateAge(t.dateOfBirth), 0) / teachers.length,
      averageSalary: teachersWithSalary.length > 0 ? teachersWithSalary.reduce((sum, t) => sum + t.salary!, 0) / teachersWithSalary.length : 0,
      averageClassLoad: teachers.reduce((sum, t) => sum + (t.classes?.length || 0), 0) / teachers.length,
      totalSubjectsCovered: new Set(teachers.flatMap(t => t.subjects || [])).size,
      teachersWithSalaryData: teachersWithSalary.length
    }
  }, [teachers, subjects])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-muted-foreground">No teacher data available for analytics</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Teacher Analytics</h1>
        <p className="text-muted-foreground">
          Insights and trends from teaching staff data
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Teachers</p>
                <p className="text-3xl font-bold">{analytics.total}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-xs">👥</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Age</p>
                <p className="text-3xl font-bold">{Math.round(analytics.averageAge * 10) / 10}</p>
                <p className="text-xs text-muted-foreground">years</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-xs">📅</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Classes</p>
                <p className="text-3xl font-bold">{Math.round(analytics.averageClassLoad * 10) / 10}</p>
                <p className="text-xs text-muted-foreground">per teacher</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 text-xs">🏫</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subjects Covered</p>
                <p className="text-3xl font-bold">{analytics.totalSubjectsCovered}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <span className="text-orange-600 dark:text-orange-400 text-xs">📚</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.genderDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.genderDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Employment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.statusDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Contract Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Contract Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.contractDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#82ca9d"
                    dataKey="value"
                  >
                    {analytics.contractDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Age Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.ageDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Experience Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Experience Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.experienceDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ff7c7c" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Class Load Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Teaching Load Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.classLoadDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8dd1e1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subject Teaching Load */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Teaching Load</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.subjectLoad.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="code" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name, props) => [value, 'Teachers']}
                    labelFormatter={(label) => analytics.subjectLoad.find(s => s.code === label)?.name || label}
                  />
                  <Bar dataKey="teachers" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Qualification Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Qualification Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.qualificationDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#d084d0" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hiring Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Hiring Trends Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.hiringTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="hires" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Salary Analysis */}
      {analytics.teachersWithSalaryData > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Salary Distribution</CardTitle>
              <p className="text-sm text-muted-foreground">
                Based on {analytics.teachersWithSalaryData} teachers with salary data
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.salaryDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Salary Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-3xl font-bold">KSh {Math.round(analytics.averageSalary).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Average Monthly Salary</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Teachers with salary data</span>
                  <Badge variant="secondary">{analytics.teachersWithSalaryData}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Data coverage</span>
                  <Badge variant="outline">
                    {Math.round((analytics.teachersWithSalaryData / analytics.total) * 100)}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Employment Status */}
            <div>
              <h4 className="font-semibold mb-3">Employment Status</h4>
              <div className="space-y-2">
                {analytics.statusDistribution.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="capitalize">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{item.value}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {((item.value / analytics.total) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contract Types */}
            <div>
              <h4 className="font-semibold mb-3">Contract Types</h4>
              <div className="space-y-2">
                {analytics.contractDistribution.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="capitalize">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{item.value}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {((item.value / analytics.total) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Subjects */}
            <div>
              <h4 className="font-semibold mb-3">Most Taught Subjects</h4>
              <div className="space-y-2">
                {analytics.subjectLoad.slice(0, 5).map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span>{item.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{item.teachers}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {((item.teachers / analytics.total) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}