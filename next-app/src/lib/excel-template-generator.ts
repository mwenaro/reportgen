import * as XLSX from 'xlsx'

export interface ExcelTemplateData {
  schoolName: string
  gradingSystem: '8-4-4' | 'CBC'
  classes: Array<{
    name: string
    examName: string
    term: string
    students: Array<{
      name: string
      gender: 'M' | 'F'
      subjects: { [subject: string]: number }
    }>
  }>
}

export function createExcelTemplate(data: ExcelTemplateData): Blob {
  // Create a new workbook
  const wb = XLSX.utils.book_new()

  // Create school details sheet
  const schoolDetailsData = [
    ['Field', 'Value'],
    ['Name', data.schoolName],
    ['Education System', data.gradingSystem],
    ['Box', 'P.O. Box 123, Nairobi'],
    ['Tel', '+254 123 456 789'],
    ['Email', 'info@school.ac.ke'],
    ['Motto', 'Excellence Through Education']
  ]

  const schoolSheet = XLSX.utils.aoa_to_sheet(schoolDetailsData)
  XLSX.utils.book_append_sheet(wb, schoolSheet, 'School Details')

  // Create class sheets
  data.classes.forEach((classData, index) => {
    // Create headers
    const subjects = Object.keys(classData.students[0]?.subjects || {})
    const headers = ['No', 'Name', 'Gender', ...subjects]
    
    // Create data rows
    const rows = classData.students.map((student, idx) => [
      idx + 1,
      student.name,
      student.gender,
      ...subjects.map(subject => student.subjects[subject] || 0)
    ])

    const sheetData = [headers, ...rows]
    const classSheet = XLSX.utils.aoa_to_sheet(sheetData)
    
    // Set sheet name in format: "Grade - Exam - Term" (max 31 chars)
    let sheetName = `${classData.name} - ${classData.examName} - ${classData.term}`
    if (sheetName.length > 31) {
      sheetName = sheetName.substring(0, 28) + '...'
    }
    XLSX.utils.book_append_sheet(wb, classSheet, sheetName)
  })

  // Convert to binary
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })
  
  // Create blob
  const buf = new ArrayBuffer(wbout.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i < wbout.length; i++) {
    view[i] = wbout.charCodeAt(i) & 0xFF
  }
  
  return new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}

export function downloadSampleTemplate() {
  const sampleData: ExcelTemplateData = {
    schoolName: 'Sunrise Academy',
    gradingSystem: '8-4-4',
    classes: [
      {
        name: 'Form 1A',
        examName: 'End of Term Exam',
        term: 'Term 1',
        students: [
          {
            name: 'John Kamau',
            gender: 'M',
            subjects: {
              Mathematics: 78,
              English: 82,
              Kiswahili: 75,
              Biology: 88,
              Chemistry: 73,
              Physics: 80,
              History: 76,
              Geography: 79
            }
          },
          {
            name: 'Mary Wanjiku',
            gender: 'F',
            subjects: {
              Mathematics: 85,
              English: 90,
              Kiswahili: 87,
              Biology: 92,
              Chemistry: 88,
              Physics: 86,
              History: 89,
              Geography: 84
            }
          },
          {
            name: 'Peter Ochieng',
            gender: 'M',
            subjects: {
              Mathematics: 65,
              English: 68,
              Kiswahili: 70,
              Biology: 72,
              Chemistry: 66,
              Physics: 69,
              History: 71,
              Geography: 67
            }
          },
          {
            name: 'Grace Akinyi',
            gender: 'F',
            subjects: {
              Mathematics: 92,
              English: 89,
              Kiswahili: 91,
              Biology: 95,
              Chemistry: 90,
              Physics: 88,
              History: 87,
              Geography: 93
            }
          },
          {
            name: 'David Mutua',
            gender: 'M',
            subjects: {
              Mathematics: 74,
              English: 77,
              Kiswahili: 72,
              Biology: 79,
              Chemistry: 75,
              Physics: 73,
              History: 78,
              Geography: 76
            }
          }
        ]
      },
      {
        name: 'Form 1B',
        examName: 'End of Term Exam',
        term: 'Term 1',
        students: [
          {
            name: 'Sarah Chebet',
            gender: 'F',
            subjects: {
              Mathematics: 81,
              English: 84,
              Kiswahili: 79,
              Biology: 86,
              Chemistry: 82,
              Physics: 78,
              History: 80,
              Geography: 83
            }
          },
          {
            name: 'James Kipchoge',
            gender: 'M',
            subjects: {
              Mathematics: 69,
              English: 72,
              Kiswahili: 74,
              Biology: 71,
              Chemistry: 68,
              Physics: 70,
              History: 73,
              Geography: 75
            }
          },
          {
            name: 'Faith Nyambura',
            gender: 'F',
            subjects: {
              Mathematics: 88,
              English: 91,
              Kiswahili: 85,
              Biology: 89,
              Chemistry: 87,
              Physics: 84,
              History: 86,
              Geography: 90
            }
          }
        ]
      }
    ]
  }

  const blob = createExcelTemplate(sampleData)
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `Excel_Template_${sampleData.gradingSystem}_System.xlsx`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

export function downloadCBCTemplate() {
  const cbcData: ExcelTemplateData = {
    schoolName: 'Bright Future Primary School',
    gradingSystem: 'CBC',
    classes: [
      {
        name: 'Grade 6A',
        examName: 'Summative Assessment',
        term: 'Term 2',
        students: [
          {
            name: 'Amina Hassan',
            gender: 'F',
            subjects: {
              Mathematics: 85,
              English: 82,
              Kiswahili: 88,
              'Integrated Science': 90,
              'Social Studies': 87,
              'Life Skills': 89
            }
          },
          {
            name: 'Brian Mwangi',
            gender: 'M',
            subjects: {
              Mathematics: 72,
              English: 75,
              Kiswahili: 74,
              'Integrated Science': 78,
              'Social Studies': 76,
              'Life Skills': 80
            }
          },
          {
            name: 'Cynthia Wairimu',
            gender: 'F',
            subjects: {
              Mathematics: 91,
              English: 88,
              Kiswahili: 85,
              'Integrated Science': 92,
              'Social Studies': 89,
              'Life Skills': 87
            }
          },
          {
            name: 'Dennis Kiprotich',
            gender: 'M',
            subjects: {
              Mathematics: 68,
              English: 70,
              Kiswahili: 72,
              'Integrated Science': 71,
              'Social Studies': 69,
              'Life Skills': 73
            }
          }
        ]
      }
    ]
  }

  const blob = createExcelTemplate(cbcData)
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `Excel_Template_${cbcData.gradingSystem}_System.xlsx`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}