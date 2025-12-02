// Report Generation Types
export interface StudentData {
  id: string;
  adm: string;
  name: string;
  form: number;
  stream?: string;
  gender: 'M' | 'F';
  kcpe?: number;
  term: number;
  year: number;
  rank?: number;
  marks: Record<string, number[]>;
  totalMarks?: number;
  meanScore?: number;
  meanGrade?: string;
  meanPoints?: number;
  examCount: number;
}

export interface SubjectData {
  code: string;
  name: string;
  marks: number[];
  grade: string;
  points: number;
  percentage: number;
  position?: number;
  outOf?: number;
  teacher?: string;
  remark?: string;
}

export interface GradeData {
  grade: string;
  points: number;
  percentage: number;
  comment: {
    english: string;
    kiswahili: string;
  };
}

export interface SchoolInfo {
  name: string;
  level: 'primary' | 'secondary';
  box: string;
  telephone: string;
  motto: string;
  logo?: string;
}

export interface ReportConfig {
  school: SchoolInfo;
  term: number;
  year: number;
  reportTitle: string;
  layout?: ReportLayout;
}

export interface ReportLayout {
  pageSize: 'A4' | 'Letter';
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  colors: {
    primary: string;
    secondary: string;
    text: string;
    border: string;
  };
  fonts: {
    title: string;
    heading: string;
    body: string;
    caption: string;
  };
}

export interface PerformanceMetrics {
  totalStudents: number;
  averageScore: number;
  topPerformers: StudentData[];
  subjectAnalysis: Record<string, {
    average: number;
    highest: number;
    lowest: number;
    passRate: number;
  }>;
}

export interface ReportSection {
  header: boolean;
  studentDetails: boolean;
  resultsTable: boolean;
  performanceGraph: boolean;
  comments: boolean;
  footer: boolean;
}

export interface CommentTemplate {
  gradeRange: string[];
  templates: {
    classTeacher: string[];
    principal: string[];
  };
  conditions?: {
    gender?: 'M' | 'F';
    formLevel?: number[];
    performanceLevel?: 'excellent' | 'good' | 'average' | 'poor';
  };
}

export interface GraphData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
  options?: {
    title?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
    showLegend?: boolean;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

export interface ReportGenerationOptions {
  format: 'pdf' | 'html' | 'json';
  sections?: Partial<ReportSection>;
  template?: string;
  watermark?: string;
  batchMode?: boolean;
  compress?: boolean;
}

export interface ReportMetadata {
  generatedAt: Date;
  generatedBy: string;
  version: string;
  studentCount: number;
  processingTime: number;
  fileSize?: number;
}

// Database related types
export interface StudentRecord {
  studentId: string;
  admissionNo: string;
  fullName: string;
  form: number;
  stream?: string;
  gender: 'M' | 'F';
  dateOfBirth?: Date;
  kcpeMarks?: number;
  guardianInfo?: {
    name: string;
    phone: string;
    email?: string;
  };
}

export interface ExamRecord {
  examId: string;
  term: number;
  year: number;
  examType: 'opener' | 'midterm' | 'endterm' | 'mock';
  startDate: Date;
  endDate: Date;
}

export interface MarkRecord {
  markId: string;
  studentId: string;
  subjectId: string;
  examId: string;
  score: number;
  maxScore: number;
  grade?: string;
  points?: number;
}

export interface SubjectRecord {
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  category: 'core' | 'optional' | 'applied';
  form?: number[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  metadata?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface ReportGenerationResponse {
  reportId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  progress?: number;
  metadata: ReportMetadata;
}