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
  blob: Blob
  url: string
  type: 'student' | 'class' | 'subject' | 'summary'
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
    yPos += commentLines.length * 5 + 10
    pdf.setFont('helvetica', 'bold')
    pdf.text('PRINCIPAL\'S REMARKS:', 20, yPos)
    yPos += 8
    pdf.setFont('helvetica', 'normal')
    
    const principalComment = this.generatePrincipalComment(student)
    const principalLines = pdf.splitTextToSize(principalComment, pageWidth - 40)
    pdf.text(principalLines, 20, yPos)

    // Footer
    this.addReportFooter(pdf, pageWidth, pageHeight)

    const filename = `${student.name.replace(/\s+/g, '_')}_Terminal_Report.pdf`
    const blob = pdf.output('blob')
    const url = URL.createObjectURL(blob)

    return { filename, blob, url, type: 'student' }
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

    return { filename, blob, url, type: 'class' }
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

      // Top Performers by Subject (if there's space)
      this.excelData.subjectAnalysis.forEach((subject, index) => {
        if (subject.topPerformers.length > 0 && index < 3) { // Limit to first 3 subjects for space
          yPos = (pdf as any).lastAutoTable?.finalY + 15 || yPos + 40
          
          if (yPos > 250) { // Check if we need a new page
            pdf.addPage()
            yPos = 30
          }

          pdf.setFont('helvetica', 'bold')
          pdf.text(`TOP PERFORMERS - ${subject.subject.toUpperCase()}`, 20, yPos)

          yPos += 10
          const performerData = subject.topPerformers.slice(0, 5).map((performer, idx) => [
            idx + 1,
            performer.name,
            performer.score.toString() + '%',
            performer.class
          ])

          autoTable(pdf, {
            startY: yPos,
            head: [['Rank', 'Name', 'Score', 'Class']],
            body: performerData,
            theme: 'grid',
            headStyles: { fillColor: [52, 152, 219], textColor: 255 },
            styles: { fontSize: 8, cellPadding: 1.5 }
          })
        }
      })
    }

    const filename = `Subject_Analysis_Report.pdf`
    const blob = pdf.output('blob')
    const url = URL.createObjectURL(blob)

    return { filename, blob, url, type: 'subject' }
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