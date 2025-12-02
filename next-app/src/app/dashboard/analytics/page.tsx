'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  GraduationCap,
  BookOpen,
  Award,
  Calendar,
  Target,
  PieChart,
  LineChart,
  Activity,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'

interface PerformanceMetric {
  subject: string
  averageGrade: string
  averagePoints: number
  passRate: number
  improvement: number
  totalStudents: number
  topPerformers: number
}

interface ClassAnalytics {
  className: string
  totalStudents: number
  averageGrade: string
  passRate: number
  subjectPerformance: PerformanceMetric[]
}

interface TrendData {
  period: string
  enrollment: number
  passRate: number
  averageGrade: number
  teacherRatio: number
}

export default function AnalyticsPage() {
  const [selectedTerm, setSelectedTerm] = useState('term1')
  const [selectedYear, setSelectedYear] = useState('2024-2025')
  const [selectedClass, setSelectedClass] = useState('all')

  // Mock data - in real app, this would come from your database
  const overallStats = {
    totalStudents: 1247,
    totalTeachers: 52,
    totalClasses: 28,
    averageGrade: 'B+',
    overallPassRate: 84.2,
    studentTeacherRatio: 24,
    enrollmentGrowth: 12.5,
    performanceImprovement: 8.3
  }

  const performanceBySubject: PerformanceMetric[] = [
    {
      subject: 'Mathematics',
      averageGrade: 'B',
      averagePoints: 9.2,
      passRate: 78.5,
      improvement: 5.2,
      totalStudents: 1247,
      topPerformers: 156
    },
    {
      subject: 'English',
      averageGrade: 'B+',
      averagePoints: 10.1,
      passRate: 85.3,
      improvement: 3.8,
      totalStudents: 1247,
      topPerformers: 203
    },
    {
      subject: 'Kiswahili',
      averageGrade: 'B+',
      averagePoints: 9.8,
      passRate: 82.7,
      improvement: 7.1,
      totalStudents: 1247,
      topPerformers: 189
    },
    {
      subject: 'Biology',
      averageGrade: 'A-',
      averagePoints: 10.5,
      passRate: 89.2,
      improvement: 12.3,
      totalStudents: 645,
      topPerformers: 134
    },
    {
      subject: 'Chemistry',
      averageGrade: 'B',
      averagePoints: 8.9,
      passRate: 76.8,
      improvement: -2.1,
      totalStudents: 645,
      topPerformers: 98
    },
    {
      subject: 'Physics',
      averageGrade: 'B-',
      averagePoints: 8.3,
      passRate: 71.4,
      improvement: 1.5,
      totalStudents: 645,
      topPerformers: 76
    }
  ]

  const classAnalytics: ClassAnalytics[] = [
    {
      className: 'Form 1A',
      totalStudents: 45,
      averageGrade: 'B+',
      passRate: 88.9,
      subjectPerformance: performanceBySubject.slice(0, 3)
    },
    {
      className: 'Form 2B',
      totalStudents: 42,
      averageGrade: 'B',
      passRate: 83.3,
      subjectPerformance: performanceBySubject.slice(0, 4)
    },
    {
      className: 'Form 3A',
      totalStudents: 38,
      averageGrade: 'A-',
      passRate: 94.7,
      subjectPerformance: performanceBySubject
    }
  ]

  const trends: TrendData[] = [
    { period: 'Term 1 2023', enrollment: 1156, passRate: 79.8, averageGrade: 8.9, teacherRatio: 26 },
    { period: 'Term 2 2023', enrollment: 1167, passRate: 81.2, averageGrade: 9.1, teacherRatio: 25 },
    { period: 'Term 3 2023', enrollment: 1178, passRate: 83.5, averageGrade: 9.3, teacherRatio: 25 },
    { period: 'Term 1 2024', enrollment: 1203, passRate: 82.1, averageGrade: 9.2, teacherRatio: 24 },
    { period: 'Term 2 2024', enrollment: 1225, passRate: 84.6, averageGrade: 9.5, teacherRatio: 24 },
    { period: 'Term 3 2024', enrollment: 1247, passRate: 84.2, averageGrade: 9.6, teacherRatio: 24 }
  ]

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
      case 'A-':
        return 'text-green-600 bg-green-50'
      case 'B+':
      case 'B':
        return 'text-blue-600 bg-blue-50'
      case 'B-':
      case 'C+':
        return 'text-yellow-600 bg-yellow-50'
      default:
        return 'text-red-600 bg-red-50'
    }
  }

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />
    } else if (improvement < 0) {
      return <TrendingDown className="h-4 w-4 text-red-500" />
    }
    return <Activity className="h-4 w-4 text-gray-400" />
  }

  return (
    <div className="flex-1 space-y-6 p-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Performance metrics, trends, and insights for academic excellence
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-2025">2024-2025</SelectItem>
              <SelectItem value="2023-2024">2023-2024</SelectItem>
              <SelectItem value="2022-2023">2022-2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Select value={selectedTerm} onValueChange={setSelectedTerm}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="term1">Term 1</SelectItem>
            <SelectItem value="term2">Term 2</SelectItem>
            <SelectItem value="term3">Term 3</SelectItem>
            <SelectItem value="annual">Annual</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            <SelectItem value="form1">Form 1</SelectItem>
            <SelectItem value="form2">Form 2</SelectItem>
            <SelectItem value="form3">Form 3</SelectItem>
            <SelectItem value="form4">Form 4</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +{overallStats.enrollmentGrowth}% from last year
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.averageGrade}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +{overallStats.performanceImprovement}% improvement
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.overallPassRate}%</div>
            <p className="text-xs text-muted-foreground">
              Above national average of 78%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teacher Ratio</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1:{overallStats.studentTeacherRatio}</div>
            <p className="text-xs text-muted-foreground">
              {overallStats.totalTeachers} teachers total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance by Subject */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Subject Performance Analysis</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Academic performance across all subjects for {selectedTerm.replace('term', 'Term ')} {selectedYear}
              </p>
            </div>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceBySubject.map((subject, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{subject.subject}</h3>
                    <p className="text-sm text-muted-foreground">
                      {subject.totalStudents} students • {subject.topPerformers} top performers
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Average Grade</div>
                    <Badge className={getGradeColor(subject.averageGrade)}>
                      {subject.averageGrade}
                    </Badge>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Points</div>
                    <div className="font-semibold">{subject.averagePoints}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Pass Rate</div>
                    <div className="font-semibold">{subject.passRate}%</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Improvement</div>
                    <div className="flex items-center space-x-1">
                      {getImprovementIcon(subject.improvement)}
                      <span className={`font-semibold ${
                        subject.improvement > 0 ? 'text-green-600' : 
                        subject.improvement < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {subject.improvement > 0 ? '+' : ''}{subject.improvement}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Class Performance and Trends */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Performing Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="mr-2 h-5 w-5 text-yellow-500" />
              Top Performing Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classAnalytics
                .sort((a, b) => b.passRate - a.passRate)
                .slice(0, 3)
                .map((classData, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{classData.className}</h3>
                    <p className="text-sm text-muted-foreground">
                      {classData.totalStudents} students
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={getGradeColor(classData.averageGrade)}>
                      {classData.averageGrade}
                    </Badge>
                    <p className="text-sm font-semibold text-green-600 mt-1">
                      {classData.passRate}% pass rate
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Academic Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="mr-2 h-5 w-5 text-blue-500" />
              Academic Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trends.slice(-3).map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{trend.period}</h3>
                    <p className="text-sm text-muted-foreground">
                      {trend.enrollment} students enrolled
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{trend.passRate}%</div>
                    <p className="text-sm text-muted-foreground">
                      Pass Rate
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights and Recommendations */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <CheckCircle className="mr-2 h-5 w-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 shrink-0"></span>
                Biology shows excellent performance with 89.2% pass rate
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 shrink-0"></span>
                Overall enrollment growth of 12.5% indicates strong reputation
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 shrink-0"></span>
                Form 3A leads with 94.7% pass rate
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-700">
              <AlertCircle className="mr-2 h-5 w-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-2 shrink-0"></span>
                Physics performance needs attention (71.4% pass rate)
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-2 shrink-0"></span>
                Chemistry shows declining trend (-2.1%)
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-2 shrink-0"></span>
                Mathematics could benefit from additional support
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700">
              <Target className="mr-2 h-5 w-5" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 shrink-0"></span>
                Implement peer tutoring for Physics and Chemistry
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 shrink-0"></span>
                Share Form 3A's successful strategies with other classes
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 shrink-0"></span>
                Focus on STEM teacher professional development
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}