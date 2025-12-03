import * as XLSX from 'xlsx'

// Types for Excel data structure
export interface SchoolDetails {
  name: string
  educationSystem: '8-4-4' | 'CBC'
  box?: string
  tel?: string
  email?: string
  motto?: string
  logo?: string
  principal?: string
  deputy?: string
}

export interface StudentRecord {
  no: number
  name: string
  gender: 'M' | 'F'
  admissionNo?: string
  [subject: string]: number | string // Subject marks
}

export interface SubjectScore {
  subject: string
  score: number
  grade: string
  points: number
  position?: number
  outOf?: number
}

export interface StudentAnalysis extends StudentRecord {
  totalMarks: number
  averageScore: number
  totalPoints: number
  meanGrade: string
  overallPosition: number
  subjects: SubjectScore[]
  remarks?: string
}

export interface ClassData {
  sheetName: string
  grade: string
  examName: string
  term: string
  students: StudentRecord[]
  subjects: string[]
  totalStudents: number
  averageScore: number
  highestScore: number
  lowestScore: number
  passRate: number
  topPerformer?: StudentRecord
  studentAnalysis?: StudentAnalysis[]
}

export interface SubjectAnalysis {
  subject: string
  totalStudents: number
  averageScore: number
  highestScore: number
  lowestScore: number
  passRate: number
  gradeDistribution: { [grade: string]: number }
  topPerformers: Array<{
    name: string
    score: number
    class: string
  }>
}

export interface ExcelData {
  schoolDetails: SchoolDetails
  classes: ClassData[]
  subjectAnalysis?: SubjectAnalysis[]
  isValid: boolean
  errors: string[]
  summary: {
    totalClasses: number
    totalStudents: number
    overallAverage: number
    overallPassRate: number
  }
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// Kenyan Grading Systems
export const KENYAN_GRADING_SYSTEMS = {
  '8-4-4': {
    name: '8-4-4 System (Secondary)',
    grades: [
      { grade: 'A', min: 80, max: 100, points: 12, description: 'Excellent' },
      { grade: 'A-', min: 75, max: 79, points: 11, description: 'Very Good' },
      { grade: 'B+', min: 70, max: 74, points: 10, description: 'Good' },
      { grade: 'B', min: 65, max: 69, points: 9, description: 'Good' },
      { grade: 'B-', min: 60, max: 64, points: 8, description: 'Above Average' },
      { grade: 'C+', min: 55, max: 59, points: 7, description: 'Average' },
      { grade: 'C', min: 50, max: 54, points: 6, description: 'Average' },
      { grade: 'C-', min: 45, max: 49, points: 5, description: 'Below Average' },
      { grade: 'D+', min: 40, max: 44, points: 4, description: 'Weak' },
      { grade: 'D', min: 35, max: 39, points: 3, description: 'Weak' },
      { grade: 'D-', min: 30, max: 34, points: 2, description: 'Very Weak' },
      { grade: 'E', min: 0, max: 29, points: 1, description: 'Failure' }
    ],
    passGrade: 'D',
    passPoints: 3,
    meanGrades: [
      { grade: 'A', min: 11, max: 12, description: 'Excellent' },
      { grade: 'A-', min: 10, max: 10.9, description: 'Very Good' },
      { grade: 'B+', min: 9, max: 9.9, description: 'Good' },
      { grade: 'B', min: 8, max: 8.9, description: 'Good' },
      { grade: 'B-', min: 7, max: 7.9, description: 'Above Average' },
      { grade: 'C+', min: 6, max: 6.9, description: 'Average' },
      { grade: 'C', min: 5, max: 5.9, description: 'Average' },
      { grade: 'C-', min: 4, max: 4.9, description: 'Below Average' },
      { grade: 'D+', min: 3, max: 3.9, description: 'Weak' },
      { grade: 'D', min: 2, max: 2.9, description: 'Weak' },
      { grade: 'D-', min: 1, max: 1.9, description: 'Very Weak' },
      { grade: 'E', min: 0, max: 0.9, description: 'Failure' }
    ]
  },
  'CBC': {
    name: 'CBC System (Competency-Based)',
    grades: [
      { grade: 'EE', min: 80, max: 100, points: 4, description: 'Exceeding Expectations' },
      { grade: 'ME', min: 60, max: 79, points: 3, description: 'Meeting Expectations' },
      { grade: 'AE', min: 40, max: 59, points: 2, description: 'Approaching Expectations' },
      { grade: 'BE', min: 0, max: 39, points: 1, description: 'Below Expectations' }
    ],
    passGrade: 'AE',
    passPoints: 2,
    meanGrades: [
      { grade: 'EE', min: 3.5, max: 4, description: 'Exceeding Expectations' },
      { grade: 'ME', min: 2.5, max: 3.4, description: 'Meeting Expectations' },
      { grade: 'AE', min: 1.5, max: 2.4, description: 'Approaching Expectations' },
      { grade: 'BE', min: 0, max: 1.4, description: 'Below Expectations' }
    ]
  }
}

// Subject mappings for common abbreviations
export const SUBJECT_MAPPINGS: { [key: string]: string } = {
  'mat': 'Mathematics',
  'eng': 'English',
  'kis': 'Kiswahili',
  'bio': 'Biology',
  'che': 'Chemistry',
  'phy': 'Physics',
  'his': 'History',
  'geo': 'Geography',
  'cre': 'CRE',
  'ire': 'IRE',
  'bst': 'Business Studies',
  'agr': 'Agriculture',
  'hsc': 'Home Science',
  'com': 'Computer Studies',
  'lit': 'Literature',
  'fre': 'French',
  'ger': 'German',
  'art': 'Art & Design',
  'mus': 'Music',
  'pe': 'Physical Education',
  'sci': 'Science',
  'sst': 'Social Studies',
  'env': 'Environmental Activities',
  'hyg': 'Hygiene & Nutrition',
  'rel': 'Religious Education',
  'lse': 'Life Skills Education',
  'pte': 'Pre-Technical Education'
}

export class ExcelReportParser {
  private gradingSystem: '8-4-4' | 'CBC'

  constructor(gradingSystem: '8-4-4' | 'CBC' = '8-4-4') {
    this.gradingSystem = gradingSystem
  }

  // Calculate grade based on score
  calculateGrade(score: number): { grade: string; points: number; description: string } {
    const system = KENYAN_GRADING_SYSTEMS[this.gradingSystem]
    for (const gradeInfo of system.grades) {
      if (score >= gradeInfo.min && score <= gradeInfo.max) {
        return {
          grade: gradeInfo.grade,
          points: gradeInfo.points,
          description: gradeInfo.description
        }
      }
    }
    return { grade: 'E', points: 1, description: 'Failure' }
  }

  // Calculate mean grade based on points
  calculateMeanGrade(meanPoints: number): { grade: string; description: string } {
    const system = KENYAN_GRADING_SYSTEMS[this.gradingSystem]
    for (const gradeInfo of system.meanGrades || []) {
      if (meanPoints >= gradeInfo.min && meanPoints <= gradeInfo.max) {
        return {
          grade: gradeInfo.grade,
          description: gradeInfo.description
        }
      }
    }
    return { grade: 'E', description: 'Failure' }
  }

  // Parse school details from first sheet
  private parseSchoolDetails(worksheet: XLSX.WorkSheet): SchoolDetails {
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]
    
    const schoolDetails: SchoolDetails = {
      name: '',
      educationSystem: this.gradingSystem,
      box: '',
      tel: '',
      email: '',
      motto: ''
    }

    data.forEach((row: any[]) => {
      if (row[0] && row[1]) {
        const key = row[0].toString().toLowerCase()
        const value = row[1].toString()
        
        if (key.includes('name') || key.includes('school')) {
          schoolDetails.name = value
        } else if (key.includes('system') || key.includes('education')) {
          schoolDetails.educationSystem = value.includes('CBC') || value.includes('cbc') ? 'CBC' : '8-4-4'
          this.gradingSystem = schoolDetails.educationSystem
        } else if (key.includes('box') || key.includes('address')) {
          schoolDetails.box = value
        } else if (key.includes('tel') || key.includes('phone')) {
          schoolDetails.tel = value
        } else if (key.includes('email') || key.includes('mail')) {
          schoolDetails.email = value
        } else if (key.includes('motto')) {
          schoolDetails.motto = value
        } else if (key.includes('principal')) {
          schoolDetails.principal = value
        } else if (key.includes('deputy')) {
          schoolDetails.deputy = value
        }
      }
    })

    return schoolDetails
  }

  // Parse class data from worksheet
  private parseClassData(sheetName: string, worksheet: XLSX.WorkSheet): ClassData {
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' })
    
    // Extract grade, exam name, term from sheet name
    const sheetParts = sheetName.split(' - ')
    const grade = sheetParts[0] || sheetName
    const examName = sheetParts[1] || 'Assessment'
    const term = sheetParts[2] || 'Term 1'

    if (jsonData.length === 0) {
      return {
        sheetName,
        grade,
        examName,
        term,
        students: [],
        subjects: [],
        totalStudents: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        passRate: 0
      }
    }

    // Get headers to identify subjects
    const firstRow = jsonData[0] as any
    const headers = Object.keys(firstRow)
    
    // Filter out non-subject columns
    const excludeColumns = ['no', 'name', 'gender', 'admission', 'adm', 'student']
    const subjectColumns = headers.filter(header => 
      !excludeColumns.some(col => header.toLowerCase().includes(col))
    )

    // Process student data
    const students: StudentRecord[] = jsonData.map((row: any, index) => {
      const student: StudentRecord = {
        no: row.no || row.No || row.NO || index + 1,
        name: row.name || row.Name || row.NAME || `Student ${index + 1}`,
        gender: (row.gender || row.Gender || row.GENDER || 'M') as 'M' | 'F',
        admissionNo: row.admission || row.admissionNo || row.adm || undefined
      }

      // Add subject marks
      subjectColumns.forEach(subject => {
        const mark = parseFloat(row[subject]) || 0
        student[subject.toLowerCase()] = mark
      })

      return student
    })

    // Calculate class statistics
    const allScores = students.flatMap(student => 
      subjectColumns.map(subject => student[subject.toLowerCase()] as number).filter(score => score > 0)
    )
    
    const validScores = allScores.filter(score => score > 0)
    const averageScore = validScores.length > 0 ? validScores.reduce((a, b) => a + b, 0) / validScores.length : 0
    const highestScore = validScores.length > 0 ? Math.max(...validScores) : 0
    const lowestScore = validScores.length > 0 ? Math.min(...validScores) : 0
    
    // Calculate pass rate based on grading system
    const passThreshold = this.gradingSystem === 'CBC' ? 40 : 30
    const passedStudents = students.filter(student => {
      const studentScores = subjectColumns.map(subject => student[subject.toLowerCase()] as number || 0)
      const validStudentScores = studentScores.filter(score => score > 0)
      if (validStudentScores.length === 0) return false
      const studentAvg = validStudentScores.reduce((sum, score) => sum + score, 0) / validStudentScores.length
      return studentAvg >= passThreshold
    }).length

    const passRate = students.length > 0 ? (passedStudents / students.length) * 100 : 0

    // Find top performer
    const studentsWithAverage = students.map(student => {
      const studentScores = subjectColumns.map(subject => student[subject.toLowerCase()] as number || 0)
      const validStudentScores = studentScores.filter(score => score > 0)
      const average = validStudentScores.length > 0 ? 
        validStudentScores.reduce((sum, score) => sum + score, 0) / validStudentScores.length : 0
      return { ...student, average }
    })

    const topPerformer = studentsWithAverage.reduce((top, current) => 
      current.average > top.average ? current : top, studentsWithAverage[0]
    )

    return {
      sheetName,
      grade,
      examName,
      term,
      students,
      subjects: subjectColumns,
      totalStudents: students.length,
      averageScore: Math.round(averageScore * 10) / 10,
      highestScore,
      lowestScore,
      passRate: Math.round(passRate * 10) / 10,
      topPerformer
    }
  }

  // Generate detailed student analysis
  generateStudentAnalysis(classData: ClassData): StudentAnalysis[] {
    return classData.students.map(student => {
      const subjects: SubjectScore[] = classData.subjects.map(subject => {
        const score = student[subject.toLowerCase()] as number || 0
        const gradeInfo = this.calculateGrade(score)
        
        return {
          subject: SUBJECT_MAPPINGS[subject.toLowerCase()] || subject,
          score,
          grade: gradeInfo.grade,
          points: gradeInfo.points
        }
      })

      const validScores = subjects.filter(s => s.score > 0)
      const totalMarks = validScores.reduce((sum, s) => sum + s.score, 0)
      const averageScore = validScores.length > 0 ? totalMarks / validScores.length : 0
      const totalPoints = validScores.reduce((sum, s) => sum + s.points, 0)
      const meanPoints = validScores.length > 0 ? totalPoints / validScores.length : 0
      const meanGrade = this.calculateMeanGrade(meanPoints)

      return {
        ...student,
        totalMarks,
        averageScore: Math.round(averageScore * 10) / 10,
        totalPoints,
        meanGrade: meanGrade.grade,
        overallPosition: 0, // Will be calculated after sorting
        subjects
      }
    }).sort((a, b) => b.averageScore - a.averageScore)
    .map((student, index) => ({ ...student, overallPosition: index + 1 }))
  }

  // Generate subject analysis across all classes
  generateSubjectAnalysis(classes: ClassData[]): SubjectAnalysis[] {
    const subjectMap: { [subject: string]: SubjectAnalysis } = {}

    classes.forEach(classData => {
      classData.subjects.forEach(subject => {
        const subjectKey = SUBJECT_MAPPINGS[subject.toLowerCase()] || subject
        
        if (!subjectMap[subjectKey]) {
          subjectMap[subjectKey] = {
            subject: subjectKey,
            totalStudents: 0,
            averageScore: 0,
            highestScore: 0,
            lowestScore: 100,
            passRate: 0,
            gradeDistribution: {},
            topPerformers: []
          }
        }

        const subjectScores = classData.students
          .map(student => student[subject.toLowerCase()] as number)
          .filter(score => score > 0)

        if (subjectScores.length > 0) {
          const analysis = subjectMap[subjectKey]
          const prevTotal = analysis.totalStudents
          const newTotal = prevTotal + subjectScores.length
          
          // Update statistics
          analysis.totalStudents = newTotal
          analysis.averageScore = ((analysis.averageScore * prevTotal) + 
            subjectScores.reduce((sum, score) => sum + score, 0)) / newTotal
          analysis.highestScore = Math.max(analysis.highestScore, Math.max(...subjectScores))
          analysis.lowestScore = Math.min(analysis.lowestScore, Math.min(...subjectScores))

          // Update grade distribution
          subjectScores.forEach(score => {
            const grade = this.calculateGrade(score).grade
            analysis.gradeDistribution[grade] = (analysis.gradeDistribution[grade] || 0) + 1
          })

          // Add top performers
          classData.students.forEach(student => {
            const score = student[subject.toLowerCase()] as number
            if (score >= 80) { // Top performer threshold
              analysis.topPerformers.push({
                name: student.name,
                score,
                class: classData.grade
              })
            }
          })
        }
      })
    })

    // Calculate pass rates and round averages
    Object.values(subjectMap).forEach(analysis => {
      analysis.averageScore = Math.round(analysis.averageScore * 10) / 10
      const passThreshold = this.gradingSystem === 'CBC' ? 40 : 30
      const passedCount = Object.entries(analysis.gradeDistribution)
        .filter(([grade]) => {
          const gradeInfo = KENYAN_GRADING_SYSTEMS[this.gradingSystem].grades.find(g => g.grade === grade)
          return gradeInfo && gradeInfo.min >= passThreshold
        })
        .reduce((sum, [, count]) => sum + count, 0)
      
      analysis.passRate = analysis.totalStudents > 0 ? 
        Math.round((passedCount / analysis.totalStudents) * 1000) / 10 : 0
      
      // Sort and limit top performers
      analysis.topPerformers = analysis.topPerformers
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
    })

    return Object.values(subjectMap)
  }

  // Parse Excel workbook
  async parseExcelFile(file: File): Promise<ExcelData> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = e.target?.result
          const workbook = XLSX.read(data, { type: 'binary' })
          
          const result: ExcelData = {
            schoolDetails: {
              name: '',
              educationSystem: this.gradingSystem,
            },
            classes: [],
            isValid: true,
            errors: [],
            summary: {
              totalClasses: 0,
              totalStudents: 0,
              overallAverage: 0,
              overallPassRate: 0
            }
          }

          // Parse first sheet (School Details)
          const firstSheetName = workbook.SheetNames[0]
          const firstSheet = workbook.Sheets[firstSheetName]
          
          if (firstSheetName.toLowerCase().includes('school') || workbook.SheetNames.length > 1) {
            result.schoolDetails = this.parseSchoolDetails(firstSheet)
            this.gradingSystem = result.schoolDetails.educationSystem
          }

          // Parse class sheets
          const classSheets = workbook.SheetNames.slice(
            firstSheetName.toLowerCase().includes('school') ? 1 : 0
          )
          
          classSheets.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName]
            const classData = this.parseClassData(sheetName, worksheet)
            
            if (classData.students.length > 0) {
              // Generate detailed student analysis
              classData.studentAnalysis = this.generateStudentAnalysis(classData)
              result.classes.push(classData)
            }
          })

          // Generate subject analysis
          if (result.classes.length > 0) {
            result.subjectAnalysis = this.generateSubjectAnalysis(result.classes)
          }

          // Calculate summary statistics
          result.summary.totalClasses = result.classes.length
          result.summary.totalStudents = result.classes.reduce((sum, cls) => sum + cls.totalStudents, 0)
          
          if (result.classes.length > 0) {
            const weightedAverage = result.classes.reduce((sum, cls) => 
              sum + (cls.averageScore * cls.totalStudents), 0) / result.summary.totalStudents
            result.summary.overallAverage = Math.round(weightedAverage * 10) / 10
            
            const weightedPassRate = result.classes.reduce((sum, cls) => 
              sum + (cls.passRate * cls.totalStudents), 0) / result.summary.totalStudents
            result.summary.overallPassRate = Math.round(weightedPassRate * 10) / 10
          }

          resolve(result)
        } catch (error) {
          console.error('Error parsing Excel file:', error)
          resolve({
            schoolDetails: {
              name: '',
              educationSystem: this.gradingSystem,
            },
            classes: [],
            isValid: false,
            errors: ['Failed to parse Excel file. Please check the file format.'],
            summary: {
              totalClasses: 0,
              totalStudents: 0,
              overallAverage: 0,
              overallPassRate: 0
            }
          })
        }
      }
      reader.readAsBinaryString(file)
    })
  }

  // Validate Excel data
  validateExcelData(data: ExcelData): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Validate school details
    if (!data.schoolDetails.name) {
      errors.push('School name is required in the first sheet')
    }

    // Validate classes
    if (data.classes.length === 0) {
      errors.push('No valid class data found in the Excel file')
    }

    data.classes.forEach((classData, index) => {
      if (classData.students.length === 0) {
        warnings.push(`Sheet "${classData.sheetName}" has no student data`)
      }
      
      if (classData.subjects.length === 0) {
        warnings.push(`Sheet "${classData.sheetName}" has no subject columns`)
      }

      // Check for missing student names
      const missingNames = classData.students.filter(student => 
        !student.name || student.name.includes('Student'))
      if (missingNames.length > 0) {
        warnings.push(`Sheet "${classData.sheetName}" has ${missingNames.length} students with missing names`)
      }

      // Check for invalid scores
      classData.students.forEach(student => {
        classData.subjects.forEach(subject => {
          const score = student[subject.toLowerCase()] as number
          if (score < 0 || score > 100) {
            warnings.push(`Invalid score (${score}) for ${student.name} in ${subject}`)
          }
        })
      })
    })

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }
}

// Export utility functions
export const createExcelParser = (gradingSystem: '8-4-4' | 'CBC' = '8-4-4') => 
  new ExcelReportParser(gradingSystem)

export const getSubjectName = (abbreviation: string): string => 
  SUBJECT_MAPPINGS[abbreviation.toLowerCase()] || abbreviation

export const calculatePassRate = (scores: number[], gradingSystem: '8-4-4' | 'CBC'): number => {
  const passThreshold = gradingSystem === 'CBC' ? 40 : 30
  const passedCount = scores.filter(score => score >= passThreshold).length
  return scores.length > 0 ? Math.round((passedCount / scores.length) * 1000) / 10 : 0
}