// Academic types for examinations, grading, and educational processes

// ============================================================================
// EXAMINATION TYPES
// ============================================================================

export interface Exam {
  id: string
  schoolId: string
  name: string
  type: ExamType
  subjectId: string
  classIds: string[]
  academicYear: string
  term: string
  date: Date
  startTime: string
  endTime: string
  duration: number // in minutes
  totalMarks: number
  passingMarks: number
  instructions?: string
  venue?: string
  invigilators: string[]
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  config: ExamConfig
  statistics?: ExamStatistics
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface ExamType {
  id: string
  name: string
  code: string
  description?: string
  weight: number // percentage contribution to final grade
  category: 'continuous_assessment' | 'mid_term' | 'end_term' | 'final' | 'mock'
  frequency: 'weekly' | 'monthly' | 'termly' | 'yearly'
  isOfficial: boolean
}

export interface ExamConfig {
  allowLateSubmission: boolean
  lateSubmissionPenalty: number
  showResultsImmediately: boolean
  allowReview: boolean
  randomizeQuestions: boolean
  preventCheating: boolean
  requireCamera: boolean
  timeWarnings: number[] // minutes before end
}

export interface ExamStatistics {
  totalStudents: number
  submitted: number
  pending: number
  average: number
  highest: number
  lowest: number
  passRate: number
  distribution: GradeDistribution[]
}

export interface GradeDistribution {
  grade: string
  count: number
  percentage: number
}

// ============================================================================
// GRADING & MARKS TYPES
// ============================================================================

export interface Mark {
  id: string
  studentId: string
  examId: string
  subjectId: string
  classId: string
  marksObtained: number
  totalMarks: number
  percentage: number
  grade: string
  gradePoints: number
  position?: number
  remarks?: string
  submittedAt?: Date
  gradedBy: string
  gradedAt: Date
  isAbsent: boolean
  isCheating: boolean
  status: 'draft' | 'submitted' | 'graded' | 'published'
  breakdown?: MarkBreakdown[]
  createdAt: Date
  updatedAt: Date
}

export interface MarkBreakdown {
  section: string
  marksObtained: number
  totalMarks: number
  percentage: number
}

export interface Grade {
  letter: string
  description: string
  minPercentage: number
  maxPercentage: number
  points: number
  color?: string
  passingGrade: boolean
}

export interface GradingScale {
  id: string
  schoolId: string
  name: string
  description?: string
  grades: Grade[]
  isDefault: boolean
  applicableLevels: string[]
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// REPORT TYPES
// ============================================================================

export interface Report {
  id: string
  studentId: string
  classId: string
  academicYear: string
  term: string
  type: ReportType
  template: string
  data: ReportData
  status: 'generating' | 'ready' | 'sent' | 'archived'
  generatedAt: Date
  generatedBy: string
  sentAt?: Date
  accessCount: number
  lastAccessedAt?: Date
  downloadUrl?: string
  comments: ReportComment[]
}

export interface ReportType {
  id: string
  name: string
  description?: string
  template: string
  frequency: 'weekly' | 'monthly' | 'termly' | 'annually'
  recipients: ('student' | 'parent' | 'teacher' | 'admin')[]
  sections: ReportSection[]
  isActive: boolean
}

export interface ReportData {
  studentInfo: {
    name: string
    admissionNumber: string
    class: string
    stream?: string
  }
  academicInfo: {
    year: string
    term: string
    totalMarks: number
    totalPossible: number
    percentage: number
    position: number
    grade: string
    classSize: number
  }
  subjectResults: SubjectResult[]
  summary: ReportSummary
  attendance: AttendanceSummary
  behavior: BehaviorSummary
  extracurricular: ExtracurricularRecord[]
  teacherComments: TeacherComment[]
  principalComment?: string
}

export interface ReportSection {
  id: string
  name: string
  type: 'academics' | 'behavior' | 'attendance' | 'extracurricular' | 'comments'
  order: number
  visible: boolean
  config: Record<string, any>
}

export interface SubjectResult {
  subjectId: string
  subjectName: string
  examResults: ExamResult[]
  totalMarks: number
  totalPossible: number
  percentage: number
  grade: string
  position: number
  teacherComment?: string
  improvement?: string
}

export interface ExamResult {
  examId: string
  examName: string
  examType: string
  marks: number
  totalMarks: number
  percentage: number
  grade: string
}

export interface ReportSummary {
  overallPerformance: 'excellent' | 'very_good' | 'good' | 'satisfactory' | 'needs_improvement'
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  nextTermFee?: number
  promotionStatus: 'promoted' | 'repeat' | 'probation' | 'pending'
}

export interface ReportComment {
  id: string
  authorId: string
  authorName: string
  authorRole: string
  comment: string
  createdAt: Date
  isVisible: boolean
}

// ============================================================================
// ATTENDANCE TYPES
// ============================================================================

export interface AttendanceRecord {
  id: string
  studentId: string
  classId: string
  date: Date
  status: AttendanceStatus
  timeIn?: string
  timeOut?: string
  reason?: string
  verifiedBy?: string
  verifiedAt?: Date
  parentNotified: boolean
  excused: boolean
  makeup?: MakeupSession
  createdBy: string
  createdAt: Date
}

export interface AttendanceStatus {
  value: 'present' | 'absent' | 'late' | 'excused' | 'sick' | 'suspended'
  label: string
  requiresReason: boolean
  affectsGrade: boolean
  notifyParent: boolean
}

export interface AttendanceSummary {
  totalDays: number
  presentDays: number
  absentDays: number
  lateDays: number
  excusedDays: number
  attendanceRate: number
  punctualityRate: number
  trend: 'improving' | 'declining' | 'stable'
}

export interface MakeupSession {
  id: string
  date: Date
  subject: string
  teacher: string
  completed: boolean
  notes?: string
}

// ============================================================================
// CURRICULUM & COURSE TYPES
// ============================================================================

export interface Course {
  id: string
  schoolId: string
  name: string
  code: string
  description: string
  level: string
  duration: CourseDuration
  subjects: CourseSubject[]
  requirements: CourseRequirement[]
  outcomes: LearningOutcome[]
  assessmentPlan: AssessmentPlan[]
  resources: CourseResource[]
  status: 'draft' | 'active' | 'archived'
  accreditation?: Accreditation
  createdAt: Date
  updatedAt: Date
}

export interface CourseDuration {
  years: number
  terms: number
  hoursPerWeek: number
  totalHours: number
}

export interface CourseSubject {
  subjectId: string
  isCore: boolean
  isElective: boolean
  weight: number
  prerequisites?: string[]
}

export interface CourseRequirement {
  type: 'academic' | 'age' | 'qualification' | 'other'
  description: string
  mandatory: boolean
  value?: string | number
}

export interface LearningOutcome {
  id: string
  description: string
  level: 'knowledge' | 'comprehension' | 'application' | 'analysis' | 'synthesis' | 'evaluation'
  assessable: boolean
}

export interface AssessmentPlan {
  type: string
  weight: number
  frequency: string
  description: string
  rubric?: AssessmentRubric[]
}

export interface AssessmentRubric {
  criteria: string
  excellent: string
  good: string
  satisfactory: string
  needsImprovement: string
  points: Record<string, number>
}

export interface CourseResource {
  type: 'textbook' | 'digital' | 'equipment' | 'software' | 'other'
  name: string
  description?: string
  required: boolean
  cost?: number
  supplier?: string
  url?: string
}

export interface Accreditation {
  body: string
  level: string
  validFrom: Date
  validTo: Date
  certificateNumber?: string
}

// ============================================================================
// ACADEMIC PERIODS & CALENDAR
// ============================================================================

export interface AcademicYear {
  id: string
  schoolId: string
  name: string
  startDate: Date
  endDate: Date
  terms: Term[]
  holidays: Holiday[]
  isActive: boolean
  isCurrent: boolean
  registrationDeadline?: Date
  feeStructure?: FeeStructure[]
  calendar: AcademicEvent[]
}

export interface Term {
  id: string
  name: string
  number: number
  startDate: Date
  endDate: Date
  examPeriod: {
    startDate: Date
    endDate: Date
  }
  reportingDate?: Date
  closingDate?: Date
  nextTermStarts?: Date
  fees: TermFee[]
}

export interface Holiday {
  id: string
  name: string
  type: 'public' | 'school' | 'religious' | 'midterm'
  startDate: Date
  endDate: Date
  description?: string
  recurring: boolean
  affectsSchedule: boolean
}

export interface FeeStructure {
  class: string
  category: 'tuition' | 'boarding' | 'transport' | 'lunch' | 'activities' | 'other'
  amount: number
  currency: string
  mandatory: boolean
  paymentPlan: PaymentPlan[]
}

export interface PaymentPlan {
  installment: number
  dueDate: Date
  amount: number
  description?: string
}

export interface TermFee {
  id: string
  category: 'tuition' | 'boarding' | 'transport' | 'lunch' | 'activities' | 'examination' | 'library' | 'laboratory' | 'other'
  name: string
  description?: string
  amount: number
  currency: string
  mandatory: boolean
  dueDate?: Date
  lateFeePenalty?: number
  discountEligible: boolean
  paymentMethods: ('cash' | 'bank_transfer' | 'mobile_money' | 'card' | 'cheque')[]
}

export interface AcademicEvent {
  id: string
  title: string
  description?: string
  type: 'exam' | 'sports' | 'cultural' | 'academic' | 'administrative'
  startDate: Date
  endDate?: Date
  allDay: boolean
  location?: string
  participants: ('all' | 'students' | 'teachers' | 'parents')[]
  classIds?: string[]
  subjectIds?: string[]
  mandatory: boolean
  reminderDays?: number[]
}

// ============================================================================
// BEHAVIORAL & EXTRACURRICULAR
// ============================================================================

export interface BehaviorSummary {
  overallRating: 'excellent' | 'very_good' | 'good' | 'satisfactory' | 'needs_improvement'
  categories: {
    discipline: number
    cooperation: number
    leadership: number
    initiative: number
    responsibility: number
  }
  incidents: number
  commendations: number
  trend: 'improving' | 'declining' | 'stable'
}

export interface ExtracurricularRecord {
  activityId: string
  activityName: string
  category: 'sports' | 'arts' | 'academic' | 'community' | 'leadership'
  role?: string
  achievements: string[]
  participation: 'excellent' | 'good' | 'satisfactory' | 'poor'
  hours?: number
  awards?: Award[]
}

export interface Award {
  name: string
  level: 'class' | 'school' | 'district' | 'regional' | 'national' | 'international'
  position?: string
  date: Date
  description?: string
}

// ============================================================================
// TEACHER ACADEMIC TYPES
// ============================================================================

export interface TeacherComment {
  subjectId: string
  subjectName: string
  teacherId: string
  teacherName: string
  comment: string
  recommendations?: string[]
  createdAt: Date
}

export interface TeachingLoad {
  teacherId: string
  academicYear: string
  term: string
  subjects: TeachingSubject[]
  classes: TeachingClass[]
  totalHours: number
  maxHours: number
  overloadHours: number
}

export interface TeachingSubject {
  subjectId: string
  subjectName: string
  classes: string[]
  hoursPerWeek: number
  totalStudents: number
}

export interface TeachingClass {
  classId: string
  className: string
  subjects: string[]
  totalStudents: number
  isClassTeacher: boolean
}

// ============================================================================
// PERFORMANCE ANALYTICS
// ============================================================================

export interface PerformanceAnalytics {
  studentId: string
  classId: string
  academicYear: string
  term: string
  overallPerformance: PerformanceMetrics
  subjectPerformance: SubjectPerformanceMetrics[]
  trends: PerformanceTrend[]
  predictions: PerformancePrediction[]
  recommendations: string[]
  interventions: InterventionRecord[]
  lastUpdated: Date
}

export interface PerformanceMetrics {
  currentGPA: number
  previousGPA?: number
  classRank: number
  classSize: number
  percentile: number
  improvementRate: number
  consistencyScore: number
}

export interface SubjectPerformanceMetrics {
  subjectId: string
  subjectName: string
  currentGrade: number
  previousGrade?: number
  trend: 'improving' | 'declining' | 'stable'
  classRank: number
  difficulty: 'easy' | 'moderate' | 'difficult'
  teacherRating: number
  timeSpent?: number // hours per week
}

export interface PerformanceTrend {
  period: string
  metric: 'gpa' | 'attendance' | 'behavior' | 'subject_average'
  value: number
  change: number
  changePercent: number
}

export interface PerformancePrediction {
  metric: 'final_grade' | 'graduation_gpa' | 'college_readiness'
  predictedValue: number
  confidence: number
  factors: string[]
  recommendations: string[]
}

export interface InterventionRecord {
  id: string
  type: 'academic_support' | 'counseling' | 'mentoring' | 'extra_classes'
  description: string
  startDate: Date
  endDate?: Date
  responsiblePerson: string
  progress: 'not_started' | 'in_progress' | 'completed' | 'discontinued'
  outcomes?: string[]
  effectiveness: number // 1-5 scale
}