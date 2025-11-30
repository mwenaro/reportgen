// ============================================================================\n// CORE TYPES\n// ============================================================================\n\nexport interface User {\n  id: string\n  email: string\n  name: string\n  role: UserRole\n  schoolId?: string\n  isActive: boolean\n  createdAt: Date\n  updatedAt: Date\n}\n\nexport enum UserRole {\n  SUPER_ADMIN = 'super_admin',\n  SCHOOL_ADMIN = 'school_admin', \n  TEACHER = 'teacher',\n  STUDENT = 'student',\n  PARENT = 'parent',\n  ACCOUNTANT = 'accountant'\n}\n\nexport interface School {\n  id: string\n  name: string\n  subdomain: string\n  logo?: string\n  address: Address\n  contact: ContactInfo\n  settings: SchoolSettings\n  subscription: SubscriptionPlan\n  createdAt: Date\n  updatedAt: Date\n}\n\nexport interface Address {\n  street?: string\n  city?: string\n  county?: string\n  postalCode?: string\n  country?: string\n}\n\nexport interface ContactInfo {\n  phone?: string\n  email?: string\n  website?: string\n}\n\nexport interface SchoolSettings {\n  academicYear: {\n    start: Date\n    end: Date\n  }\n  termSystem: 'trimester' | 'semester'\n  gradingSystem: {\n    scale: string\n    passingGrade: number\n    gradePoints: Record<string, number>\n  }\n}\n\nexport interface SubscriptionPlan {\n  plan: 'free' | 'basic' | 'premium'\n  status: 'active' | 'suspended' | 'cancelled'\n  expiresAt: Date\n}\n\n// ============================================================================\n// API TYPES\n// ============================================================================\n\nexport interface ApiResponse<T = any> {\n  data: T\n  message?: string\n  success: boolean\n  errors?: string[]\n}\n\nexport interface PaginatedResponse<T = any> {\n  data: T[]\n  pagination: {\n    page: number\n    limit: number\n    total: number\n    totalPages: number\n  }\n}\n\nexport interface ApiError {\n  message: string\n  status: number\n  code?: string\n}\n\n// ============================================================================\n// UI COMPONENT TYPES\n// ============================================================================\n\nexport interface FormField {\n  id: string\n  label: string\n  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file'\n  placeholder?: string\n  value?: string | number | boolean\n  defaultValue?: string | number | boolean\n  required?: boolean\n  disabled?: boolean\n  options?: { label: string; value: string | number }[]\n  validation?: {\n    min?: number\n    max?: number\n    minLength?: number\n    maxLength?: number\n    pattern?: RegExp\n    custom?: (value: any) => string | null\n  }\n  className?: string\n  helperText?: string\n  rows?: number\n  accept?: string\n}\n\n// ============================================================================\n// NAVIGATION TYPES\n// ============================================================================\n\nexport interface NavigationItem {\n  id: string\n  label: string\n  href: string\n  icon?: React.ComponentType<{ className?: string }>\n  badge?: number\n  submenu?: NavigationItem[]\n  permissions: string[]\n}\n\nexport interface NavigationConfig {\n  items: NavigationItem[]\n  footer: NavigationItem[]\n}\n\n// ============================================================================\n// STUDENT MANAGEMENT TYPES\n// ============================================================================\n\nexport interface Student {\n  id: string\n  schoolId: string\n  admissionNumber: string\n  name: string\n  email?: string\n  phone?: string\n  dateOfBirth: Date\n  gender: 'male' | 'female'\n  classId: string\n  className?: string // Populated field\n  kcpeMarks?: number\n  status: 'active' | 'inactive' | 'graduated' | 'transferred'\n  enrollmentDate: Date\n  address?: {\n    street?: string\n    city?: string\n    county?: string\n    postalCode?: string\n  }\n  guardian?: {\n    name: string\n    relationship: 'father' | 'mother' | 'guardian' | 'grandparent' | 'uncle' | 'aunt' | 'other'\n    phone: string\n    email?: string\n    occupation?: string\n  }\n  profileImage?: string\n  medicalInfo?: string\n  notes?: string\n  createdAt: Date\n  updatedAt: Date\n}\n\nexport interface CreateStudentData {\n  admissionNumber: string\n  name: string\n  email?: string\n  phone?: string\n  dateOfBirth: Date\n  gender: 'male' | 'female'\n  classId: string\n  kcpeMarks?: number\n  status: 'active' | 'inactive' | 'graduated' | 'transferred'\n  enrollmentDate: Date\n  address?: {\n    street?: string\n    city?: string\n    county?: string\n    postalCode?: string\n  }\n  guardian: {\n    name: string\n    relationship: 'father' | 'mother' | 'guardian' | 'grandparent' | 'uncle' | 'aunt' | 'other'\n    phone: string\n    email?: string\n    occupation?: string\n  }\n  profileImage?: string\n  medicalInfo?: string\n  notes?: string\n}\n\nexport interface StudentFilters {\n  search?: string\n  classId?: string\n  status?: Student['status']\n  gender?: Student['gender']\n  kcpeMarksMin?: number\n  kcpeMarksMax?: number\n  ageMin?: number\n  ageMax?: number\n  enrollmentDateFrom?: string\n  enrollmentDateTo?: string\n  hasEmail?: boolean\n  hasPhone?: boolean\n  guardianRelationship?: string\n}

export interface Class {
  id: string
  name: string
  level: string
  section: string
  description?: string
  capacity: number
  currentEnrollment: number
  classTeacherId?: string
  classTeacherName?: string
  subjects?: string[]
  academicYear: string
  schedule?: {
    startTime: string
    endTime: string
    daysOfWeek: string[]
  }
  room?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateClassData {
  name: string
  level: string
  section: string
  description?: string
  capacity: number
  currentEnrollment: number
  classTeacherId?: string
  subjects?: string[]
  academicYear: string
  schedule?: {
    startTime: string
    endTime: string
    daysOfWeek: string[]
  }
  room?: string
  isActive: boolean
}

export interface ClassFilters {
  level?: string
  academicYear?: string
  classTeacherId?: string
  isActive?: boolean
  minEnrollment?: number
  maxEnrollment?: number
  search?: string
}\n\nexport interface Grade {\n  id: string\n  studentId: string\n  subjectId: string\n  subjectName: string\n  examId: string\n  examName: string\n  mark: number\n  grade: string\n  points: number\n  term: string\n  academicYear: string\n  classId?: string\n  createdAt: Date\n  updatedAt: Date\n}\n\nexport interface CreateGradeData {\n  studentId: string\n  subjectId: string\n  subjectName: string\n  examId: string\n  examName: string\n  mark: number\n  grade: string\n  points: number\n  term: string\n  academicYear: string\n  classId?: string\n}\n\n// ============================================================================\n// TEACHER MANAGEMENT TYPES\n// ============================================================================\n\nexport interface Teacher {\n  id: string\n  employeeId: string\n  name: string\n  email?: string\n  phone?: string\n  gender: 'male' | 'female'\n  dateOfBirth: Date\n  address?: string\n  qualification?: string\n  experience?: string\n  specialization?: string\n  hireDate: Date\n  contractType: 'permanent' | 'contract' | 'temporary' | 'substitute'\n  status: 'active' | 'inactive' | 'on-leave'\n  salary?: number\n  subjects?: string[] // Array of subject IDs\n  classes?: string[] // Array of class IDs\n  tscNumber?: string // Teachers Service Commission Number\n  idNumber?: string\n  emergencyContact?: {\n    name?: string\n    phone?: string\n    relationship?: string\n  }\n  notes?: string\n  profileImage?: string\n  createdAt: Date\n  updatedAt: Date\n}\n\nexport interface CreateTeacherData {\n  employeeId: string\n  name: string\n  email?: string\n  phone?: string\n  gender: 'male' | 'female'\n  dateOfBirth: Date\n  address?: string\n  qualification?: string\n  experience?: string\n  specialization?: string\n  hireDate: Date\n  contractType: 'permanent' | 'contract' | 'temporary' | 'substitute'\n  status: 'active' | 'inactive' | 'on-leave'\n  salary?: number\n  subjects?: string[]\n  classes?: string[]\n  tscNumber?: string\n  idNumber?: string\n  emergencyContact?: {\n    name?: string\n    phone?: string\n    relationship?: string\n  }\n  notes?: string\n  profileImage?: string\n}\n\nexport interface UpdateTeacherData extends Partial<CreateTeacherData> {}\n\nexport interface TeacherFilters {\n  status?: 'active' | 'inactive' | 'on-leave'\n  gender?: 'male' | 'female'\n  contractType?: 'permanent' | 'contract' | 'temporary' | 'substitute'\n  subjects?: string[]\n  hireDateFrom?: string\n  hireDateTo?: string\n  qualification?: string\n  experienceRange?: '0-2' | '3-5' | '6-10' | '10+'\n  minSalary?: number\n  maxSalary?: number\n}\n\n// ============================================================================\n// SUBJECT MANAGEMENT TYPES\n// ============================================================================\n\nexport interface Subject {
  id: string
  name: string
  code: string
  description?: string
  department?: string
  level?: string
  credits: number
  teacherCount?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateSubjectData {
  name: string
  code: string
  description?: string
  department?: string
  level?: string
  credits: number
  isActive: boolean
}

export interface UpdateSubjectData extends Partial<CreateSubjectData> {}

export interface SubjectFilters {
  department?: string
  level?: string
  isActive?: boolean
  minCredits?: number
  maxCredits?: number
  hasTeachers?: boolean
  search?: string
}