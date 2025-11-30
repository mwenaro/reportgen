// Core entity type definitions for the school management system

// ============================================================================
// SCHOOL & INSTITUTIONAL TYPES
// ============================================================================

export interface School {
  id: string
  name: string
  subdomain: string
  logo?: string
  motto?: string
  address: Address
  contact: ContactInfo
  settings: SchoolSettings
  subscription: SubscriptionPlan
  branding: SchoolBranding
  features: SchoolFeatures
  timezone: string
  locale: string
  currency: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  street: string
  city: string
  state: string
  country: string
  postalCode: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

export interface ContactInfo {
  email: string
  phone: string
  website?: string
  fax?: string
  socialMedia?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  }
}

export interface SchoolSettings {
  academicYear: {
    start: Date
    end: Date
    current: string
  }
  termSystem: 'trimester' | 'semester' | 'quarters'
  gradingSystem: {
    scale: string
    passingGrade: number
    gradePoints: Record<string, number>
    categories: GradeCategory[]
  }
  attendance: {
    trackingEnabled: boolean
    lateThreshold: number // minutes
    absentThreshold: number // minutes
  }
  notifications: {
    emailEnabled: boolean
    smsEnabled: boolean
    pushEnabled: boolean
  }
}

export interface SchoolBranding {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  logoUrl?: string
  faviconUrl?: string
  theme: 'light' | 'dark' | 'auto'
  customCss?: string
}

export interface SchoolFeatures {
  multiLanguage: boolean
  onlinePayments: boolean
  parentPortal: boolean
  mobileApp: boolean
  analytics: boolean
  reporting: boolean
  messaging: boolean
  calendar: boolean
  library: boolean
  transport: boolean
  hostel: boolean
  inventory: boolean
}

export interface GradeCategory {
  id: string
  name: string
  weight: number
  color: string
}

export interface SubscriptionPlan {
  plan: 'free' | 'basic' | 'premium' | 'enterprise'
  status: 'active' | 'suspended' | 'cancelled' | 'trial'
  expiresAt: Date
  features: string[]
  limits: {
    students: number
    teachers: number
    storage: number // GB
    apiCalls: number
  }
  billing: {
    amount: number
    currency: string
    interval: 'monthly' | 'annually'
    nextBillingDate?: Date
  }
}

// ============================================================================
// STUDENT TYPES
// ============================================================================

export interface Student {
  id: string
  schoolId: string
  admissionNumber: string
  name: {
    first: string
    middle?: string
    last: string
    preferred?: string
  }
  email?: string
  phone?: string
  dateOfBirth: Date
  gender: 'male' | 'female' | 'other'
  nationality: string
  religion?: string
  address: Address
  guardian: Guardian
  secondaryGuardian?: Guardian
  classId: string
  house?: string // for house system
  medicalInfo?: MedicalInfo
  academicInfo: StudentAcademicInfo
  behaviorRecord?: BehaviorRecord[]
  documents: StudentDocument[]
  fees: FeeRecord[]
  status: 'active' | 'inactive' | 'graduated' | 'transferred' | 'suspended'
  enrollmentDate: Date
  graduationDate?: Date
  profileImage?: string
  tags?: string[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Guardian {
  id?: string
  name: {
    first: string
    middle?: string
    last: string
    title?: string
  }
  relationship: 'parent' | 'guardian' | 'sibling' | 'relative' | 'other'
  email?: string
  phone: string
  alternatePhone?: string
  occupation?: string
  employer?: string
  workPhone?: string
  address?: Address
  emergencyContact: boolean
  isPrimary: boolean
  canPickup: boolean
  notes?: string
}

export interface MedicalInfo {
  bloodType?: string
  allergies?: string[]
  medications?: string[]
  conditions?: string[]
  doctor?: {
    name: string
    phone: string
    address?: string
  }
  insurance?: {
    provider: string
    policyNumber: string
  }
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  notes?: string
}

export interface StudentAcademicInfo {
  previousSchool?: string
  kcpeMarks?: number
  kcseMarks?: number
  transferGrades?: Record<string, number>
  specialNeeds?: string[]
  academicLevel: 'below_average' | 'average' | 'above_average' | 'excellent'
  subjects?: string[]
  stream?: string
  boardingStatus: 'day' | 'boarding' | 'weekly_boarding'
}

export interface BehaviorRecord {
  id: string
  date: Date
  type: 'positive' | 'negative' | 'neutral'
  category: 'academic' | 'behavioral' | 'attendance' | 'participation'
  description: string
  severity?: 'low' | 'medium' | 'high'
  actionTaken?: string
  reportedBy: string
  resolved: boolean
}

export interface StudentDocument {
  id: string
  name: string
  type: 'birth_certificate' | 'medical_report' | 'transfer_letter' | 'photo' | 'other'
  url: string
  uploadedDate: Date
  uploadedBy: string
  verified: boolean
}

export interface FeeRecord {
  id: string
  academicYear: string
  term: string
  totalAmount: number
  paidAmount: number
  balance: number
  dueDate: Date
  status: 'pending' | 'partial' | 'paid' | 'overdue'
  paymentHistory: Payment[]
}

export interface Payment {
  id: string
  amount: number
  method: 'cash' | 'bank_transfer' | 'mobile_money' | 'card' | 'cheque'
  reference: string
  date: Date
  receivedBy: string
  notes?: string
}

// ============================================================================
// TEACHER & STAFF TYPES
// ============================================================================

export interface Teacher {
  id: string
  schoolId: string
  employeeId: string
  name: {
    first: string
    middle?: string
    last: string
    title?: string
  }
  email: string
  phone: string
  alternatePhone?: string
  dateOfBirth: Date
  gender: 'male' | 'female' | 'other'
  nationality: string
  address: Address
  qualification: Qualification[]
  experience: Experience[]
  subjects: string[]
  classes: string[]
  role: TeacherRole
  department?: string
  employmentInfo: EmploymentInfo
  performance: PerformanceRecord[]
  documents: TeacherDocument[]
  status: 'active' | 'inactive' | 'on_leave' | 'suspended' | 'terminated'
  profileImage?: string
  biography?: string
  specializations?: string[]
  languages?: string[]
  socialMedia?: ContactInfo['socialMedia']
  emergencyContact: EmergencyContact
  createdAt: Date
  updatedAt: Date
}

export interface Qualification {
  id: string
  degree: string
  institution: string
  year: number
  grade?: string
  field: string
  verified: boolean
}

export interface Experience {
  id: string
  institution: string
  position: string
  startDate: Date
  endDate?: Date
  responsibilities?: string[]
  achievements?: string[]
}

export interface TeacherRole {
  type: 'head_teacher' | 'deputy_head' | 'senior_teacher' | 'teacher' | 'substitute'
  isClassTeacher: boolean
  isSubjectHead: boolean
  isDepartmentHead: boolean
  isHouseMaster: boolean
  permissions: string[]
}

export interface EmploymentInfo {
  joinDate: Date
  contractType: 'permanent' | 'temporary' | 'contract' | 'substitute'
  contractEndDate?: Date
  salary: {
    basic: number
    allowances: Record<string, number>
    deductions: Record<string, number>
    currency: string
  }
  workingHours: {
    start: string
    end: string
    daysPerWeek: number
  }
  leaveBalance: {
    annual: number
    sick: number
    maternity?: number
    study?: number
  }
}

export interface PerformanceRecord {
  id: string
  year: string
  term?: string
  rating: number
  areas: {
    teaching: number
    preparation: number
    discipline: number
    punctuality: number
    collaboration: number
  }
  goals: string[]
  achievements: string[]
  improvements: string[]
  reviewedBy: string
  reviewDate: Date
}

export interface TeacherDocument {
  id: string
  name: string
  type: 'cv' | 'certificate' | 'id_copy' | 'contract' | 'photo' | 'other'
  url: string
  uploadedDate: Date
  verified: boolean
}

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
  alternatePhone?: string
  address?: string
}

// ============================================================================
// ACADEMIC STRUCTURE TYPES
// ============================================================================

export interface Class {
  id: string
  schoolId: string
  name: string
  level: string // e.g., "Form 1", "Grade 8", "Year 9"
  stream?: string // e.g., "A", "B", "East", "North"
  capacity: number
  currentEnrollment: number
  classTeacherId?: string
  subjects: string[]
  classroom?: string
  schedule: ClassSchedule[]
  academicYear: string
  status: 'active' | 'inactive'
  metadata: {
    averageAge?: number
    maleCount?: number
    femaleCount?: number
    boardingCount?: number
    dayCount?: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface ClassSchedule {
  id: string
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  startTime: string
  endTime: string
  subjectId: string
  teacherId: string
  room?: string
  type: 'regular' | 'practical' | 'extra_curricular'
}

export interface Subject {
  id: string
  schoolId: string
  name: string
  code: string
  category: 'core' | 'elective' | 'extra_curricular'
  level?: string
  description?: string
  objectives: string[]
  syllabus?: SyllabusItem[]
  teachers: string[]
  classes: string[]
  department?: string
  credits: number
  hoursPerWeek: number
  practicalRequired: boolean
  materials?: string[]
  assessmentCriteria: AssessmentCriteria[]
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}

export interface SyllabusItem {
  id: string
  topic: string
  subtopics?: string[]
  objectives: string[]
  duration: number // in hours
  resources?: string[]
  assessments?: string[]
}

export interface AssessmentCriteria {
  name: string
  weight: number
  type: 'exam' | 'assignment' | 'project' | 'practical' | 'participation'
  description?: string
}

// ============================================================================
// SYSTEM & UTILITY TYPES
// ============================================================================

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  resourceId?: string
  oldValues?: Record<string, any>
  newValues?: Record<string, any>
  ipAddress: string
  userAgent: string
  timestamp: Date
  schoolId: string
}

export interface FileUpload {
  id: string
  fileName: string
  originalName: string
  mimeType: string
  size: number
  url: string
  uploadedBy: string
  uploadedAt: Date
  schoolId: string
  tags?: string[]
  metadata?: Record<string, any>
}

export interface SystemNotification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  recipients: NotificationRecipient[]
  channels: ('email' | 'sms' | 'push' | 'in_app')[]
  scheduledAt?: Date
  sentAt?: Date
  status: 'draft' | 'scheduled' | 'sent' | 'failed'
  schoolId?: string
  createdBy: string
  createdAt: Date
}

export interface NotificationRecipient {
  id: string
  type: 'user' | 'role' | 'class' | 'parent'
  readAt?: Date
  deliveredAt?: Date
  status: 'pending' | 'delivered' | 'read' | 'failed'
}