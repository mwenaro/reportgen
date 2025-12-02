import { useState } from 'react';
import { StudentReportGenerator, StudentData, Subject, MathUtils } from '../report-generator/StudentReportGenerator';

export interface UseStudentReportGeneratorProps {
  onSuccess?: (filename: string) => void;
  onError?: (error: Error) => void;
}

export const useStudentReportGenerator = (props?: UseStudentReportGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<string[]>([]);

  const generateStudentReport = async (studentData: StudentData, filename?: string) => {
    setIsGenerating(true);
    
    try {
      // Process and validate student data
      const processedData = await processStudentData(studentData);
      
      // Generate PDF
      await StudentReportGenerator.generateAndDownload(processedData, filename);
      
      const generatedFilename = filename || `${studentData.name.replace(/\s+/g, '_')}_Terminal_Report_${studentData.term}_${studentData.year}.pdf`;
      setGeneratedReports(prev => [...prev, generatedFilename]);
      
      props?.onSuccess?.(generatedFilename);
      
      return { success: true, filename: generatedFilename };
    } catch (error) {
      console.error('Error generating student report:', error);
      props?.onError?.(error as Error);
      return { success: false, error: error as Error };
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBulkReports = async (studentsData: StudentData[]) => {
    setIsGenerating(true);
    const results = [];
    
    try {
      for (const studentData of studentsData) {
        const result = await generateStudentReport(studentData);
        results.push(result);
        
        // Add small delay to prevent browser freezing
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      return results;
    } catch (error) {
      console.error('Error generating bulk reports:', error);
      props?.onError?.(error as Error);
      return results;
    } finally {
      setIsGenerating(false);
    }
  };

  const previewReport = async (studentData: StudentData): Promise<string | null> => {
    try {
      const processedData = await processStudentData(studentData);
      const blob = await StudentReportGenerator.generateBlob(processedData);
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error generating preview:', error);
      props?.onError?.(error as Error);
      return null;
    }
  };

  const clearGeneratedReports = () => {
    setGeneratedReports([]);
  };

  return {
    generateStudentReport,
    generateBulkReports,
    previewReport,
    isGenerating,
    generatedReports,
    clearGeneratedReports
  };
};

// Helper function to process and validate student data
async function processStudentData(studentData: StudentData): Promise<StudentData> {
  // Calculate grades and points for each subject
  const processedSubjects: Subject[] = studentData.subjects.map(subject => {
    const gradeInfo = MathUtils.calculateGrade(subject.marks);
    return {
      ...subject,
      grade: gradeInfo.grade,
      points: gradeInfo.points,
      remark: subject.code === 'kis' ? gradeInfo.kiswahili : gradeInfo.remark
    };
  });

  // Calculate overall performance
  const totalMarks = processedSubjects.reduce((sum, subject) => 
    sum + MathUtils.calculateGrade(subject.marks).mark, 0
  );
  
  const meanPoints = MathUtils.calculateMeanPoints(processedSubjects);
  const meanGrade = MathUtils.calculateGrade(meanPoints).grade;
  
  // Calculate KCPE grade and points
  const kcpeGradeInfo = studentData.kcpe > 0 
    ? MathUtils.calculateGrade(studentData.kcpe / 5) 
    : { grade: '-', points: 0 };

  return {
    ...studentData,
    subjects: processedSubjects,
    totalMarks,
    meanPoints,
    meanGrade,
    kcpeGrade: kcpeGradeInfo.grade,
    kcpePoints: kcpeGradeInfo.points
  };
}

// Sample data generator for testing
export const generateSampleStudentData = (overrides?: Partial<StudentData>): StudentData => {
  const defaultSubjects: Subject[] = [
    { code: 'mat', name: 'Mathematics', marks: [78, 82], grade: 'B+', points: 10, position: '3/45', remark: 'Very Good!', teacher: 'M.L' },
    { code: 'eng', name: 'English', marks: [85, 88], grade: 'A-', points: 11, position: '2/45', remark: 'Very Good!', teacher: 'M.S' },
    { code: 'kis', name: 'Kiswahili', marks: [75, 78], grade: 'B+', points: 10, position: '5/45', remark: 'Vizuri Sana!', teacher: 'C.M' },
    { code: 'bio', name: 'Biology', marks: [80, 85], grade: 'A-', points: 11, position: '1/45', remark: 'Excellent!', teacher: 'C.L' },
    { code: 'che', name: 'Chemistry', marks: [72, 75], grade: 'B+', points: 10, position: '4/45', remark: 'Very Good!', teacher: 'S.K' },
    { code: 'phy', name: 'Physics', marks: [68, 72], grade: 'B', points: 9, position: '6/45', remark: 'Good!', teacher: 'M.L' },
    { code: 'his', name: 'History', marks: [82, 85], grade: 'A-', points: 11, position: '2/45', remark: 'Very Good!', teacher: 'R.M' },
    { code: 'geo', name: 'Geography', marks: [76, 80], grade: 'A-', points: 11, position: '3/45', remark: 'Very Good!', teacher: 'A.O' },
    { code: 'cre', name: 'CRE', marks: [88, 92], grade: 'A', points: 12, position: '1/45', remark: 'Excellent!', teacher: 'C.M' },
    { code: 'bst', name: 'Business Studies', marks: [79, 83], grade: 'A-', points: 11, position: '2/45', remark: 'Very Good!', teacher: 'A.O' }
  ];

  const defaultData: StudentData = {
    name: 'Jane Doe',
    admissionNumber: '2024/001',
    form: '3',
    class: '3A',
    term: '1',
    year: '2024-2025',
    gender: 'F',
    kcpe: 382,
    subjects: defaultSubjects,
    totalMarks: 787,
    meanGrade: 'A-',
    meanPoints: 10.6,
    position: 5,
    outOf: 45,
    kcpeGrade: 'A',
    kcpePoints: 12,
    schoolInfo: {
      name: 'Tsagwa Secondary School',
      level: 'Secondary',
      box: '236-80105, Kaloleni',
      telephone: '0714-050682',
      motto: 'Success By Effort',
      logoPath: '/images/school-logo.png'
    }
  };

  return { ...defaultData, ...overrides };
};

// Generate varied sample data for demonstrations
export const generateVariedSampleData = (): StudentData[] => {
  const baseSubjects = ['Mathematics', 'English', 'Kiswahili', 'Biology', 'Chemistry', 'Physics', 'History', 'Geography', 'CRE', 'Business Studies'];
  const teachers = { 
    mat: 'M.L', eng: 'M.S', kis: 'C.M', bio: 'C.L', che: 'S.K', 
    phy: 'M.L', his: 'R.M', geo: 'A.O', cre: 'C.M', bst: 'A.O' 
  };

  const students = [
    {
      name: 'Alice Mwende',
      admissionNumber: '2024/001',
      gender: 'F' as const,
      kcpe: 385,
      performance: 'excellent',
      position: 1
    },
    {
      name: 'John Kimani', 
      admissionNumber: '2024/002',
      gender: 'M' as const,
      kcpe: 365,
      performance: 'good',
      position: 8
    },
    {
      name: 'Grace Nyambura',
      admissionNumber: '2024/003', 
      gender: 'F' as const,
      kcpe: 340,
      performance: 'average',
      position: 15
    }
  ];

  return students.map((student, index) => {
    // Generate marks based on performance level
    const generateMarks = (performance: string) => {
      switch (performance) {
        case 'excellent': return [85, 90]; // A- to A range
        case 'good': return [70, 75]; // B+ to B range
        case 'average': return [55, 60]; // C+ to C range
        default: return [45, 50]; // C- to D+ range
      }
    };

    const baseMarks = generateMarks(student.performance);
    const subjects = baseSubjects.map((subjectName, i) => {
      const code = Object.keys(teachers)[i] as keyof typeof teachers;
      const variation = Math.random() * 10 - 5; // ±5 points variation
      const marks = baseMarks.map(mark => Math.max(0, Math.min(100, Math.round(mark + variation))));
      const gradeInfo = MathUtils.calculateGrade(marks);
      
      return {
        code,
        name: subjectName,
        marks,
        grade: gradeInfo.grade,
        points: gradeInfo.points,
        position: `${Math.floor(Math.random() * 10) + 1}/45`,
        remark: code === 'kis' ? gradeInfo.kiswahili : gradeInfo.remark,
        teacher: teachers[code]
      };
    });

    const totalMarks = subjects.reduce((sum, subject) => sum + MathUtils.calculateGrade(subject.marks).mark, 0);
    const meanPoints = MathUtils.calculateMeanPoints(subjects);
    const meanGrade = MathUtils.calculateGrade(meanPoints).grade;
    const kcpeGradeInfo = MathUtils.calculateGrade(student.kcpe / 5);

    return {
      name: student.name,
      admissionNumber: student.admissionNumber,
      form: '3',
      class: '3A',
      term: '1',
      year: '2024-2025',
      gender: student.gender,
      kcpe: student.kcpe,
      subjects,
      totalMarks,
      meanGrade,
      meanPoints,
      position: student.position,
      outOf: 45,
      kcpeGrade: kcpeGradeInfo.grade,
      kcpePoints: kcpeGradeInfo.points,
      schoolInfo: {
        name: 'Tsagwa Secondary School',
        level: 'Secondary',
        box: '236-80105, Kaloleni',
        telephone: '0714-050682',
        motto: 'Success By Effort',
        logoPath: '/images/school-logo.png'
      }
    };
  });
};