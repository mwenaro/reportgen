import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { 
  ExcelData, 
  ClassData, 
  StudentAnalysis, 
  SubjectAnalysis, 
  KENYAN_GRADING_SYSTEMS 
} from './excel-report-parser'

export interface ReportGenerationOptions {
  includeStudentReports: boolean
  includeClassAnalysis: boolean
  includeSubjectAnalysis: boolean
  gradingSystem: '8-4-4' | 'CBC'
  watermark?: string
}

export interface GeneratedReport {
  filename: string
  blob?: Blob
  url: string
  type: 'student' | 'class' | 'subject' | 'summary' | 'student-bundle' | 'class-scoresheet' | 'class-analysis' | 'subject-analysis'
  className?: string
  studentName?: string
}

export class ExcelReportGenerator {
  private excelData: ExcelData
  private options: ReportGenerationOptions

  constructor(excelData: ExcelData, options: ReportGenerationOptions) {
    this.excelData = excelData
    this.options = options
  }

  // Generate individual student report
  generateStudentReport(student: StudentAnalysis, classData: ClassData): GeneratedReport {
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.width
    const pageHeight = pdf.internal.pageSize.height

    // School Header
    this.addSchoolHeader(pdf, pageWidth)

    // Report Title
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    const title = 'STUDENT TERMINAL REPORT'
    pdf.text(title, pageWidth / 2, 50, { align: 'center' })

    // Student Details
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    const studentDetails = [
      [`Student Name: ${student.name}`, `Class: ${classData.grade}`],
      [`Gender: ${student.gender}`, `Term: ${classData.term}`],
      [`Admission No: ${student.admissionNo || 'N/A'}`, `Exam: ${classData.examName}`],
    ]

    let yPos = 65
    studentDetails.forEach(([left, right]) => {
      pdf.text(left, 20, yPos)
      pdf.text(right, pageWidth / 2 + 10, yPos)
      yPos += 6
    })

    // Subjects Table
    yPos += 10
    const tableData = student.subjects.map((subject, index) => [
      index + 1,
      subject.subject,
      subject.score,
      subject.grade,
      subject.points,
      'Good' // Comments - could be dynamic based on performance
    ])

    autoTable(pdf, {
      startY: yPos,
      head: [['No.', 'Subject', 'Score', 'Grade', 'Points', 'Remarks']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 9, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 50 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 40 }
      }
    })

    // Summary Statistics
    yPos = (pdf as any).lastAutoTable?.finalY + 10 || yPos + 50
    pdf.setFont('helvetica', 'bold')
    pdf.text('PERFORMANCE SUMMARY', 20, yPos)
    
    yPos += 10
    pdf.setFont('helvetica', 'normal')
    const summaryData = [
      ['Total Marks:', student.totalMarks.toString()],
      ['Average Score:', `${student.averageScore.toFixed(1)}%`],
      ['Mean Grade:', student.meanGrade],
      ['Class Position:', `${student.overallPosition} out of ${classData.totalStudents}`],
    ]

    summaryData.forEach(([label, value]) => {
      pdf.text(label, 20, yPos)
      pdf.text(value, 80, yPos)
      yPos += 6
    })

    // Performance Comments
    yPos += 10
    pdf.setFont('helvetica', 'bold')
    pdf.text('TEACHER\'S COMMENTS:', 20, yPos)
    yPos += 8
    pdf.setFont('helvetica', 'normal')
    
    const comment = this.generateStudentComment(student)
    const commentLines = pdf.splitTextToSize(comment, pageWidth - 40)
    pdf.text(commentLines, 20, yPos)

    // Principal's Remarks
    yPos += 10
    pdf.setFont('helvetica', 'bold')
    pdf.text('PRINCIPAL\'S REMARKS:', 20, yPos)
    yPos += 8
    pdf.setFont('helvetica', 'normal')
    
    const principalComment = this.generatePrincipalComment(student)
    const principalLines = pdf.splitTextToSize(principalComment, pageWidth - 40)
    pdf.text(principalLines, 20, yPos)
    
    // Principal signature
    yPos += principalLines.length * 5 + 15
    pdf.text('Principal: _________________________ Date: ___________', 20, yPos)
    
    // Next Term Opens On
    yPos += 15
    pdf.setFont('helvetica', 'bold')
    pdf.text('NEXT TERM OPENS ON: ________________________', 20, yPos)

    // Footer
    this.addReportFooter(pdf, pageWidth, pageHeight)

    const filename = `${student.name.replace(/\s+/g, '_')}_Terminal_Report.pdf`
    const blob = pdf.output('blob')
    const url = URL.createObjectURL(blob)

    return { 
      filename, 
      blob, 
      url, 
      type: 'student',
      studentName: student.name,
      className: classData.grade
    }
  }

  // Generate class analysis report
  generateClassAnalysisReport(classData: ClassData): GeneratedReport {
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.width

    // School Header
    this.addSchoolHeader(pdf, pageWidth)

    // Report Title
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    const title = `${classData.grade} - CLASS PERFORMANCE ANALYSIS`
    pdf.text(title, pageWidth / 2, 50, { align: 'center' })

    // Class Details
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    let yPos = 65
    const classDetails = [
      `Examination: ${classData.examName}`,
      `Term: ${classData.term}`,
      `Total Students: ${classData.totalStudents}`,
      `Class Average: ${classData.averageScore.toFixed(1)}%`,
      `Pass Rate: ${classData.passRate.toFixed(1)}%`
    ]

    classDetails.forEach(detail => {
      pdf.text(detail, 20, yPos)
      yPos += 6
    })

    // Subject Performance Summary
    yPos += 10
    pdf.setFont('helvetica', 'bold')
    pdf.text('SUBJECT PERFORMANCE OVERVIEW', 20, yPos)

    yPos += 10
    const subjectData = classData.subjects.map(subject => {
      const scores = classData.students
        .map(student => student[subject.toLowerCase()] as number)
        .filter(score => score > 0)
      
      const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
      const highest = Math.max(...scores)
      const lowest = Math.min(...scores)
      
      return [
        subject,
        average.toFixed(1),
        highest.toString(),
        lowest.toString(),
        scores.length.toString()
      ]
    })

    autoTable(pdf, {
      startY: yPos,
      head: [['Subject', 'Average', 'Highest', 'Lowest', 'Students']],
      body: subjectData,
      theme: 'grid',
      headStyles: { fillColor: [52, 152, 219], textColor: 255 },
      styles: { fontSize: 9, cellPadding: 2 }
    })

    // Top Performers
    if (classData.studentAnalysis && classData.studentAnalysis.length > 0) {
      yPos = (pdf as any).lastAutoTable?.finalY + 20 || yPos + 50
      pdf.setFont('helvetica', 'bold')
      pdf.text('TOP 10 PERFORMERS', 20, yPos)

      yPos += 10
      const topPerformers = classData.studentAnalysis
        .slice(0, 10)
        .map((student, index) => [
          index + 1,
          student.name,
          student.averageScore.toFixed(1) + '%',
          student.meanGrade,
          student.totalPoints.toString()
        ])

      autoTable(pdf, {
        startY: yPos,
        head: [['Position', 'Name', 'Average', 'Mean Grade', 'Points']],
        body: topPerformers,
        theme: 'grid',
        headStyles: { fillColor: [46, 204, 113], textColor: 255 },
        styles: { fontSize: 9, cellPadding: 2 }
      })
    }

    // Grade Distribution
    if (classData.studentAnalysis) {
      const gradeDistribution = this.calculateGradeDistribution(classData.studentAnalysis)
      
      yPos = (pdf as any).lastAutoTable?.finalY + 20 || yPos + 50
      pdf.setFont('helvetica', 'bold')
      pdf.text('GRADE DISTRIBUTION', 20, yPos)

      yPos += 10
      const gradeData = Object.entries(gradeDistribution).map(([grade, count]) => [
        grade,
        count.toString(),
        ((count / classData.totalStudents) * 100).toFixed(1) + '%'
      ])

      autoTable(pdf, {
        startY: yPos,
        head: [['Grade', 'Students', 'Percentage']],
        body: gradeData,
        theme: 'grid',
        headStyles: { fillColor: [155, 89, 182], textColor: 255 },
        styles: { fontSize: 9, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 30 },
          2: { cellWidth: 40 }
        }
      })
    }

    const filename = `${classData.grade}_Class_Analysis_${classData.term}.pdf`
    const blob = pdf.output('blob')
    const url = URL.createObjectURL(blob)

    return { 
      filename, 
      blob, 
      url, 
      type: 'class-analysis',
      className: classData.grade
    }
  }

  // Generate subject analysis report
  generateSubjectAnalysisReport(): GeneratedReport {
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.width

    // School Header
    this.addSchoolHeader(pdf, pageWidth)

    // Report Title
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    const title = 'SUBJECT PERFORMANCE ANALYSIS'
    pdf.text(title, pageWidth / 2, 50, { align: 'center' })

    // Overall Statistics
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    let yPos = 65
    const overallStats = [
      `Total Classes: ${this.excelData.classes.length}`,
      `Total Students: ${this.excelData.summary.totalStudents}`,
      `Overall Average: ${this.excelData.summary.overallAverage.toFixed(1)}%`,
      `Overall Pass Rate: ${this.excelData.summary.overallPassRate.toFixed(1)}%`
    ]

    overallStats.forEach(stat => {
      pdf.text(stat, 20, yPos)
      yPos += 6
    })

    // Subject Performance Table
    if (this.excelData.subjectAnalysis) {
      yPos += 10
      pdf.setFont('helvetica', 'bold')
      pdf.text('SUBJECT PERFORMANCE SUMMARY', 20, yPos)

      yPos += 10
      const subjectData = this.excelData.subjectAnalysis.map(subject => [
        subject.subject,
        subject.totalStudents.toString(),
        subject.averageScore.toFixed(1) + '%',
        subject.highestScore.toString(),
        subject.lowestScore.toString(),
        subject.passRate.toFixed(1) + '%'
      ])

      autoTable(pdf, {
        startY: yPos,
        head: [['Subject', 'Students', 'Average', 'Highest', 'Lowest', 'Pass Rate']],
        body: subjectData,
        theme: 'grid',
        headStyles: { fillColor: [231, 76, 60], textColor: 255 },
        styles: { fontSize: 8, cellPadding: 1.5 }
      })

      // Top and Bottom Performers by Subject
      this.excelData.subjectAnalysis.forEach((subject, index) => {
        if (subject.topPerformers.length > 0 && index < 4) { // Limit to first 4 subjects for space
          if (yPos > 200) { // Check if we need a new page
            pdf.addPage()
            yPos = 30
          }
          
          pdf.setFont('helvetica', 'bold')
          pdf.text(`${subject.subject.toUpperCase()} - TOP & BOTTOM PERFORMERS`, 20, yPos)
          yPos += 8

          // Top 3 performers
          const topPerformers = subject.topPerformers.slice(0, 3).map((performer, idx) => [
            `Top ${idx + 1}`,
            performer.name,
            performer.score.toString() + '%',
            performer.class
          ])
          
          // Bottom 3 performers (get from end of sorted list)
          const bottomPerformers = subject.topPerformers.slice(-3).reverse().map((performer, idx) => [
            `Bot ${idx + 1}`,
            performer.name,
            performer.score.toString() + '%',
            performer.class
          ])
          
          const allPerformers = [...topPerformers, ...bottomPerformers]

          autoTable(pdf, {
            startY: yPos,
            head: [['Position', 'Name', 'Score', 'Class']],
            body: allPerformers,
            theme: 'grid',
            headStyles: { fillColor: [52, 152, 219], textColor: 255 },
            styles: { fontSize: 8, cellPadding: 1.5 }
          })
          
          yPos = (pdf as any).lastAutoTable?.finalY + 15 || yPos + 40
        }
      })
    }

    const filename = `Subject_Analysis_Report.pdf`
    const blob = pdf.output('blob')
    const url = URL.createObjectURL(blob)

    return { 
      filename, 
      blob, 
      url, 
      type: 'subject-analysis'
    }
  }

  // Generate comprehensive summary report
  generateSummaryReport(): GeneratedReport {
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.width

    // School Header
    this.addSchoolHeader(pdf, pageWidth)

    // Report Title
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    const title = 'COMPREHENSIVE SCHOOL PERFORMANCE REPORT'
    pdf.text(title, pageWidth / 2, 50, { align: 'center' })

    // Executive Summary
    pdf.setFontSize(12)
    let yPos = 70
    pdf.text('EXECUTIVE SUMMARY', 20, yPos)

    yPos += 10
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    const summaryText = [
      `This report provides a comprehensive analysis of academic performance across ${this.excelData.classes.length} classes`,
      `involving ${this.excelData.summary.totalStudents} students. The overall school average is ${this.excelData.summary.overallAverage.toFixed(1)}%`,
      `with a pass rate of ${this.excelData.summary.overallPassRate.toFixed(1)}%.`
    ]

    summaryText.forEach(text => {
      const lines = pdf.splitTextToSize(text, pageWidth - 40)
      pdf.text(lines, 20, yPos)
      yPos += lines.length * 5 + 2
    })

    // Class Performance Overview
    yPos += 10
    pdf.setFont('helvetica', 'bold')
    pdf.text('CLASS PERFORMANCE OVERVIEW', 20, yPos)

    yPos += 10
    const classData = this.excelData.classes.map((cls, index) => [
      index + 1,
      cls.grade,
      cls.totalStudents.toString(),
      cls.averageScore.toFixed(1) + '%',
      cls.passRate.toFixed(1) + '%'
    ])

    autoTable(pdf, {
      startY: yPos,
      head: [['No.', 'Class', 'Students', 'Average', 'Pass Rate']],
      body: classData,
      theme: 'grid',
      headStyles: { fillColor: [52, 152, 219], textColor: 255 },
      styles: { fontSize: 9, cellPadding: 2 }
    })

    // Key Recommendations
    yPos = (pdf as any).lastAutoTable?.finalY + 20 || yPos + 50
    pdf.setFont('helvetica', 'bold')
    pdf.text('KEY RECOMMENDATIONS', 20, yPos)

    yPos += 10
    pdf.setFont('helvetica', 'normal')
    const recommendations = this.generateRecommendations()
    recommendations.forEach((recommendation, index) => {
      const bulletPoint = `${index + 1}. ${recommendation}`
      const lines = pdf.splitTextToSize(bulletPoint, pageWidth - 40)
      pdf.text(lines, 20, yPos)
      yPos += lines.length * 5 + 2
    })

    const filename = `School_Performance_Summary_Report.pdf`
    const blob = pdf.output('blob')
    const url = URL.createObjectURL(blob)

    return { filename, blob, url, type: 'summary' }
  }

  // Add school header to PDF
  private addHeader(pdf: jsPDF, title: string, subtitle?: string) {
    const pageWidth = pdf.internal.pageSize.width
    
    // Title
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(16)
    const titleWidth = pdf.getTextWidth(title)
    pdf.text(title, (pageWidth - titleWidth) / 2, 25)
    
    // Subtitle
    if (subtitle) {
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(12)
      const subtitleWidth = pdf.getTextWidth(subtitle)
      pdf.text(subtitle, (pageWidth - subtitleWidth) / 2, 35)
    }
    
    // Line under header
    pdf.line(20, 45, pageWidth - 20, 45)
  }

  private addSchoolHeader(pdf: jsPDF, pageWidth: number) {
    const school = this.excelData.schoolDetails
    
    // School name
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    pdf.text(school.name.toUpperCase(), pageWidth / 2, 20, { align: 'center' })

    // School details
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    let yPos = 28
    
    if (school.box) {
      pdf.text(`P.O. Box ${school.box}`, pageWidth / 2, yPos, { align: 'center' })
      yPos += 5
    }
    
    if (school.tel) {
      pdf.text(`Tel: ${school.tel}`, pageWidth / 2, yPos, { align: 'center' })
      yPos += 5
    }
    
    if (school.email) {
      pdf.text(`Email: ${school.email}`, pageWidth / 2, yPos, { align: 'center' })
      yPos += 5
    }
    
    if (school.motto) {
      pdf.setFont('helvetica', 'italic')
      pdf.text(`"${school.motto}"`, pageWidth / 2, yPos + 3, { align: 'center' })
    }

    // Horizontal line
    pdf.setLineWidth(0.5)
    pdf.line(20, 45, pageWidth - 20, 45)
  }

  // Add footer to report
  private addReportFooter(pdf: jsPDF, pageWidth: number, pageHeight: number) {
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    
    // Date generated
    const dateGenerated = new Date().toLocaleDateString()
    pdf.text(`Generated on: ${dateGenerated}`, 20, pageHeight - 15)
    
    // Grading system used
    const gradingSystem = KENYAN_GRADING_SYSTEMS[this.options.gradingSystem]
    pdf.text(`Grading System: ${gradingSystem.name}`, pageWidth - 20, pageHeight - 15, { align: 'right' })
    
    // Page number
    pdf.text(`Page 1`, pageWidth / 2, pageHeight - 10, { align: 'center' })
  }

  // Generate student comment based on performance
  private generateStudentComment(student: StudentAnalysis): string {
    const performance = student.averageScore
    
    if (performance >= 80) {
      return `Excellent performance! ${student.name} has demonstrated exceptional understanding across all subjects. Continue with the same dedication and focus on maintaining this high standard.`
    } else if (performance >= 70) {
      return `Very good performance. ${student.name} shows strong academic ability and consistent effort. With continued focus, even better results are achievable.`
    } else if (performance >= 60) {
      return `Good performance overall. ${student.name} is making steady progress but should focus more on weaker subjects to achieve better grades.`
    } else if (performance >= 50) {
      return `Average performance. ${student.name} needs to put in more effort and seek extra help in challenging subjects to improve academic standing.`
    } else {
      return `Below average performance. ${student.name} requires immediate intervention and additional support to improve academic performance across all subjects.`
    }
  }

  // Generate principal's comment
  private generatePrincipalComment(student: StudentAnalysis): string {
    const performance = student.averageScore
    
    if (performance >= 75) {
      return "Keep up the excellent work. You are a role model for other students."
    } else if (performance >= 60) {
      return "Good progress. Continue working hard to achieve even better results."
    } else if (performance >= 50) {
      return "Satisfactory performance. There is room for improvement with more dedication."
    } else {
      return "Needs improvement. Please work closely with teachers and parents for better results."
    }
  }

  // Calculate grade distribution
  private calculateGradeDistribution(students: StudentAnalysis[]): { [grade: string]: number } {
    const distribution: { [grade: string]: number } = {}
    
    students.forEach(student => {
      const grade = student.meanGrade
      distribution[grade] = (distribution[grade] || 0) + 1
    })
    
    return distribution
  }

  // Generate recommendations based on performance data
  private generateRecommendations(): string[] {
    const recommendations: string[] = []
    const summary = this.excelData.summary
    
    if (summary.overallPassRate < 70) {
      recommendations.push("Implement additional support programs for struggling students to improve overall pass rates")
    }
    
    if (summary.overallAverage < 60) {
      recommendations.push("Review teaching methodologies and consider additional training for teachers in underperforming subjects")
    }
    
    // Subject-specific recommendations
    if (this.excelData.subjectAnalysis) {
      const weakSubjects = this.excelData.subjectAnalysis
        .filter(subject => subject.passRate < 60)
        .sort((a, b) => a.passRate - b.passRate)
      
      if (weakSubjects.length > 0) {
        recommendations.push(`Focus on improving performance in ${weakSubjects[0].subject} which has the lowest pass rate of ${weakSubjects[0].passRate.toFixed(1)}%`)
      }
    }
    
    recommendations.push("Continue monitoring student progress and provide targeted interventions where necessary")
    recommendations.push("Recognize and celebrate top performers to motivate other students")
    
    return recommendations
  }

  // Generate all reports
  async generateAllReports(onProgress?: (progress: { completed: number; total: number; current: string }) => void): Promise<GeneratedReport[]> {
    const reports: GeneratedReport[] = []
    let completed = 0
    let total = 0
    
    // Calculate total reports to generate
    if (this.options.includeStudentReports) {
      total += this.excelData.classes.reduce((sum, cls) => sum + cls.totalStudents, 0)
    }
    if (this.options.includeClassAnalysis) {
      total += this.excelData.classes.length
    }
    if (this.options.includeSubjectAnalysis) {
      total += 1
    }
    total += 1 // Summary report

    // Generate student reports
    if (this.options.includeStudentReports) {
      for (const classData of this.excelData.classes) {
        if (classData.studentAnalysis) {
          for (const student of classData.studentAnalysis) {
            onProgress?.({ completed, total, current: `Generating report for ${student.name}` })
            const report = this.generateStudentReport(student, classData)
            reports.push(report)
            completed++
            
            // Small delay to allow UI updates
            await new Promise(resolve => setTimeout(resolve, 50))
          }
        }
      }
    }

    // Generate class analysis reports
    if (this.options.includeClassAnalysis) {
      for (const classData of this.excelData.classes) {
        onProgress?.({ completed, total, current: `Generating ${classData.grade} class analysis` })
        const report = this.generateClassAnalysisReport(classData)
        reports.push(report)
        completed++
        
        await new Promise(resolve => setTimeout(resolve, 50))
      }
    }

    // Generate subject analysis report
    if (this.options.includeSubjectAnalysis) {
      onProgress?.({ completed, total, current: 'Generating subject analysis report' })
      const report = this.generateSubjectAnalysisReport()
      reports.push(report)
      completed++
      
      await new Promise(resolve => setTimeout(resolve, 50))
    }

    // Generate summary report
    onProgress?.({ completed, total, current: 'Generating summary report' })
    const summaryReport = this.generateSummaryReport()
    reports.push(summaryReport)
    completed++

    onProgress?.({ completed, total, current: 'All reports generated successfully' })
    
    return reports
  }

  generateClassExamScoreSheet(classData: ClassData): GeneratedReport {
    const pdf = new jsPDF('l', 'mm', 'a4') // Landscape orientation for wider tables
    
    // Add header
    this.addHeader(pdf, `${classData.grade} - Exam Score Sheet`, 
      `${this.excelData.schoolDetails?.examName || 'Exam'} ${this.excelData.schoolDetails?.term || 'Term'} ${this.excelData.schoolDetails?.year || ''}`)
    
    let yPos = 60
    
    // School details if available
    if (this.excelData.schoolDetails) {
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)
      if (this.excelData.schoolDetails.schoolName) {
        pdf.text(`School: ${this.excelData.schoolDetails.schoolName}`, 20, yPos)
        yPos += 6
      }
      if (this.excelData.schoolDetails.educationSystem) {
        pdf.text(`Education System: ${this.excelData.schoolDetails.educationSystem}`, 20, yPos)
        yPos += 10
      }
    }
    
    // Prepare table data
    const students = classData.studentAnalysis || []
    
    // Calculate rankings
    const rankedStudents = [...students].sort((a, b) => {
      const totalA = a.totalMarks || 0
      const totalB = b.totalMarks || 0
      return totalB - totalA
    })
    
    // Create table headers - get all unique subjects
    const allSubjects = Array.from(new Set(
      students.flatMap(s => s.subjects?.map(score => score.subject) || [])
    )).sort()
    
    const headers = ['No.', 'Student Name', 'Gender', ...allSubjects, 'Total', 'Avg', 'Grade', 'Rank']
    
    // Create table body
    const tableData = rankedStudents.map((student, index) => {
      const row = [
        (index + 1).toString(),
        student.name,
        student.gender || 'N/A'
      ]
      
      // Add subject scores
      allSubjects.forEach(subject => {
        const score = student.subjects?.find(s => s.subject === subject)?.score || 0
        row.push(score.toString())
      })
      
      // Add totals and grade
      row.push(
        (student.totalMarks || 0).toString(),
        (student.averageScore || 0).toFixed(1),
        student.meanGrade || 'N/A',
        (index + 1).toString()
      )
      
      return row
    })
    
    // Generate table
    autoTable(pdf, {
      startY: yPos,
      head: [headers],
      body: tableData,
      theme: 'grid',
      headStyles: { 
        fillColor: [52, 152, 219], 
        textColor: 255,
        fontSize: 8
      },
      styles: { 
        fontSize: 7, 
        cellPadding: 1,
        overflow: 'linebreak' as const
      },
      columnStyles: {
        0: { cellWidth: 8 },  // No
        1: { cellWidth: 25 }, // Name
        2: { cellWidth: 10 }, // Gender
      }
    })
    
    yPos = (pdf as any).lastAutoTable?.finalY + 20 || yPos + 100
    
    // Add class statistics
    if (yPos > 180) { // Check for landscape page height
      pdf.addPage()
      yPos = 30
    }
    
    pdf.setFont('helvetica', 'bold')
    pdf.text('CLASS STATISTICS', 20, yPos)
    yPos += 10
    
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    
    const totalStudents = students.length
    const classAverage = students.reduce((sum, s) => sum + (s.averageScore || 0), 0) / totalStudents
    const passRate = (students.filter(s => (s.averageScore || 0) >= 50).length / totalStudents) * 100
    
    const stats = [
      `Total Students: ${totalStudents}`,
      `Class Average: ${classAverage.toFixed(1)}%`,
      `Highest Score: ${Math.max(...students.map(s => s.totalMarks || 0))}`,
      `Lowest Score: ${Math.min(...students.map(s => s.totalMarks || 0))}`,
      `Pass Rate: ${passRate.toFixed(1)}%`
    ]
    
    stats.forEach(stat => {
      pdf.text(stat, 20, yPos)
      yPos += 6
    })
    
    const buffer = pdf.output('arraybuffer')
    const blob = new Blob([buffer], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    
    return {
      filename: `${classData.grade}_exam_scoresheet.pdf`,
      url,
      type: 'class-scoresheet',
      className: classData.grade
    }
  }

  generateBundledStudentReports(): GeneratedReport {
    const pdf = new jsPDF()
    let isFirstReport = true
    let studentCount = 0
    
    this.excelData.classes.forEach(classData => {
      if (classData.studentAnalysis) {
        classData.studentAnalysis.forEach(student => {
          if (!isFirstReport) {
            pdf.addPage()
          }
          isFirstReport = false
          studentCount++
          
          // Generate student report content on current page
          this.addStudentReportContent(pdf, student, classData)
        })
      }
    })
    
    const buffer = pdf.output('arraybuffer')
    const blob = new Blob([buffer], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    
    return {
      filename: `all_student_reports_bundled.pdf`,
      url,
      type: 'student-bundle',
      className: `${studentCount} Students`
    }
  }
  
  private addStudentReportContent(pdf: jsPDF, student: StudentAnalysis, classData: ClassData) {
    const pageWidth = pdf.internal.pageSize.width
    const pageHeight = pdf.internal.pageSize.height

    // Add full school header (same as individual reports)
    this.addSchoolHeader(pdf, pageWidth)

    // Report Title
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    const title = 'TERMINAL EXAMINATION REPORT'
    const titleWidth = pdf.getTextWidth(title)
    pdf.text(title, (pageWidth - titleWidth) / 2, 60)

    // Student Info Section (Compact layout)
    let yPos = 75
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    
    // Student details in two columns
    const studentInfo = [
      ['Name:', student.name],
      ['Class:', classData.grade],
      ['Admission No:', student.admissionNo || 'N/A'],
      ['Gender:', student.gender || 'N/A']
    ]

    // Display in two columns to save space
    for (let i = 0; i < studentInfo.length; i += 2) {
      // Left column
      pdf.setFont('helvetica', 'bold')
      pdf.text(studentInfo[i][0], 20, yPos)
      pdf.setFont('helvetica', 'normal')
      pdf.text(studentInfo[i][1].toString(), 60, yPos)
      
      // Right column if exists
      if (i + 1 < studentInfo.length) {
        pdf.setFont('helvetica', 'bold')
        pdf.text(studentInfo[i + 1][0], 120, yPos)
        pdf.setFont('helvetica', 'normal')
        pdf.text(studentInfo[i + 1][1].toString(), 160, yPos)
      }
      yPos += 6
    }

    yPos += 5
    
    // Subjects Table (Compact)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(10)
    pdf.text('SUBJECT PERFORMANCE', 20, yPos)
    yPos += 8

    // Generate subjects table with compact layout
    const subjectsData = student.subjects?.map((score, index) => [
      index + 1,
      score.subject,
      score.score,
      score.grade,
      score.points || 'N/A',
      score.remarks || this.getRemarks(score.score)
    ]) || []

    autoTable(pdf, {
      startY: yPos,
      head: [['No.', 'Subject', 'Marks', 'Grade', 'Points', 'Remarks']],
      body: subjectsData,
      theme: 'striped',
      headStyles: { fillColor: [52, 73, 94], textColor: 255, fontSize: 8 },
      styles: { fontSize: 8, cellPadding: 2 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 40 },
        2: { cellWidth: 18 },
        3: { cellWidth: 15 },
        4: { cellWidth: 15 },
        5: { cellWidth: 35 }
      }
    })

    yPos = (pdf as any).lastAutoTable?.finalY + 8 || yPos + 60

    // Summary Section (Compact)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(9)
    pdf.text('SUMMARY', 20, yPos)
    yPos += 6

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    const summaryData = [
      ['Total Marks:', student.totalMarks?.toString() || '0'],
      ['Average Score:', `${(student.averageScore || 0).toFixed(1)}%`],
      ['Mean Grade:', student.meanGrade || 'N/A'],
      ['Class Position:', `${student.overallPosition || 'N/A'} out of ${classData.totalStudents || 'N/A'}`],
    ]

    // Display summary in two columns
    for (let i = 0; i < summaryData.length; i += 2) {
      // Left column
      pdf.text(summaryData[i][0], 20, yPos)
      pdf.text(summaryData[i][1], 70, yPos)
      
      // Right column if exists
      if (i + 1 < summaryData.length) {
        pdf.text(summaryData[i + 1][0], 120, yPos)
        pdf.text(summaryData[i + 1][1], 170, yPos)
      }
      yPos += 5
    }

    // Performance Chart
    yPos += 5
    this.addPerformanceChart(pdf, student, yPos, pageWidth)
    yPos += 50 // Space for chart

    // Performance Comments (Compact)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(9)
    pdf.text('TEACHER\'S COMMENTS:', 20, yPos)
    yPos += 6
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    
    const comment = this.generateStudentComment(student)
    const commentLines = pdf.splitTextToSize(comment, pageWidth - 40)
    // Limit comment to 2 lines to save space
    const limitedCommentLines = commentLines.slice(0, 2)
    pdf.text(limitedCommentLines, 20, yPos)
    
    // Teacher signature
    yPos += limitedCommentLines.length * 4 + 8
    pdf.setFontSize(7)
    pdf.text('Class Teacher: _________________________ Date: ___________', 20, yPos)

    // Principal's Remarks (Compact)
    yPos += 8
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(9)
    pdf.text('PRINCIPAL\'S REMARKS:', 20, yPos)
    yPos += 6
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    
    const principalRemarks = this.generatePrincipalComment(student)
    const remarksLines = pdf.splitTextToSize(principalRemarks, pageWidth - 40)
    // Limit principal remarks to 2 lines
    const limitedPrincipalLines = remarksLines.slice(0, 2)
    pdf.text(limitedPrincipalLines, 20, yPos)
    
    // Principal signature
    yPos += limitedPrincipalLines.length * 4 + 8
    pdf.setFontSize(7)
    pdf.text('Principal: _________________________ Date: ___________', 20, yPos)
    
    // Next Term Opens On
    yPos += 8
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(8)
    pdf.text('NEXT TERM OPENS ON: ________________________', 20, yPos)

    // Footer
    this.addReportFooter(pdf, pageWidth, pageHeight)
  }
  
  private getRemarks(score: number): string {
    if (score >= 80) return 'Excellent'
    if (score >= 70) return 'Very Good'
    if (score >= 60) return 'Good'
    if (score >= 50) return 'Average'
    if (score >= 40) return 'Below Average'
    return 'Poor'
  }
  
  private addPerformanceChart(pdf: jsPDF, student: StudentAnalysis, startY: number, pageWidth: number) {
    const chartWidth = pageWidth - 60
    const chartHeight = 40
    const chartX = 30
    const chartY = startY + 5
    
    // Chart title
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(9)
    pdf.text('PERFORMANCE CHART', chartX, startY)
    
    // Draw chart background
    pdf.setDrawColor(200, 200, 200)
    pdf.rect(chartX, chartY, chartWidth, chartHeight)
    
    // Draw grid lines
    pdf.setDrawColor(230, 230, 230)
    for (let i = 1; i <= 4; i++) {
      const y = chartY + (chartHeight * i / 5)
      pdf.line(chartX, y, chartX + chartWidth, y)
    }
    
    if (!student.subjects || student.subjects.length === 0) return
    
    const subjects = student.subjects
    const maxSubjects = Math.min(subjects.length, 8) // Limit to 8 subjects for readability
    const barWidth = chartWidth / (maxSubjects * 2)
    const maxScore = 100
    
    // Draw bars and line
    const linePoints: { x: number; y: number }[] = []
    
    subjects.slice(0, maxSubjects).forEach((subject, index) => {
      const x = chartX + (index * 2 + 1) * barWidth
      const barHeight = (subject.score / maxScore) * chartHeight
      const y = chartY + chartHeight - barHeight
      
      // Draw bar (column)
      pdf.setFillColor(52, 152, 219) // Blue bars
      pdf.rect(x, y, barWidth, barHeight, 'F')
      
      // Store point for line graph
      linePoints.push({ x: x + barWidth / 2, y })
      
      // Subject label
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8)
      const label = subject.subject.length > 6 ? subject.subject.substring(0, 6) : subject.subject
      const labelWidth = pdf.getTextWidth(label)
      pdf.text(label, x + barWidth / 2 - labelWidth / 2, chartY + chartHeight + 10)
      
      // Score label
      pdf.text(subject.score.toString(), x + barWidth / 2 - 5, y - 2)
    })
    
    // Draw line graph connecting the points
    if (linePoints.length > 1) {
      pdf.setDrawColor(231, 76, 60) // Red line
      pdf.setLineWidth(2)
      for (let i = 0; i < linePoints.length - 1; i++) {
        pdf.line(linePoints[i].x, linePoints[i].y, linePoints[i + 1].x, linePoints[i + 1].y)
      }
      
      // Draw points
      pdf.setFillColor(231, 76, 60)
      linePoints.forEach(point => {
        pdf.circle(point.x, point.y, 1.5, 'F')
      })
    }
    
    // Y-axis labels
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    for (let i = 0; i <= 5; i++) {
      const score = (i * 20).toString()
      const y = chartY + chartHeight - (i * chartHeight / 5)
      pdf.text(score, chartX - 10, y + 2)
    }
    
    // Legend (Compact)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(7)
    const legendY = chartY + chartHeight + 15
    
    // Bar legend
    pdf.setFillColor(52, 152, 219)
    pdf.rect(chartX, legendY, 6, 4, 'F')
    pdf.text('Scores', chartX + 8, legendY + 3)
    
    // Line legend
    pdf.setDrawColor(231, 76, 60)
    pdf.setLineWidth(1)
    pdf.line(chartX + 40, legendY + 2, chartX + 46, legendY + 2)
    pdf.setFillColor(231, 76, 60)
    pdf.circle(chartX + 43, legendY + 2, 1, 'F')
    pdf.text('Trend', chartX + 48, legendY + 3)
  }
}

// Utility function to create report generator
export const createReportGenerator = (excelData: ExcelData, options: ReportGenerationOptions) =>
  new ExcelReportGenerator(excelData, options)

// Utility function to download report
export const downloadReport = (report: GeneratedReport) => {
  const link = document.createElement('a')
  link.href = report.url
  link.download = report.filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Utility function to download all reports as ZIP (simplified - would need additional library for actual ZIP creation)
export const downloadAllReports = (reports: GeneratedReport[]) => {
  reports.forEach(report => {
    setTimeout(() => downloadReport(report), Math.random() * 1000)
  })
}