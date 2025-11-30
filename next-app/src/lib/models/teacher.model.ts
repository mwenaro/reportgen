import mongoose, { Schema, Document, Model } from 'mongoose'
import { Teacher, TeacherQualification, TeacherExperience, TeacherPerformance, SubjectAssignment, ClassAssignment } from '@/types/entities'
import { Address, ContactInfo } from '@/types/entities'

// ============================================================================
// SUBDOCUMENTS & EMBEDDED SCHEMAS
// ============================================================================

const AddressSchema = new Schema<Address>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  postalCode: { type: String, required: true },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  }
}, { _id: false })

const ContactInfoSchema = new Schema<ContactInfo>({
  phone: { type: String, required: true },
  email: { type: String, required: true },
  website: { type: String },
  fax: { type: String }
}, { _id: false })

const TeacherQualificationSchema = new Schema<TeacherQualification>({
  degree: { 
    type: String, 
    required: true,
    trim: true,
    enum: ['certificate', 'diploma', 'bachelor', 'master', 'phd', 'other']
  },
  field: { 
    type: String, 
    required: true,
    trim: true 
  },
  institution: { 
    type: String, 
    required: true,
    trim: true 
  },
  yearCompleted: { 
    type: Number, 
    required: true,
    min: [1950, 'Year must be after 1950'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  },
  grade: { 
    type: String, 
    trim: true,
    enum: ['first_class', 'second_upper', 'second_lower', 'third_class', 'pass', 'distinction', 'credit', 'other']
  },
  certificateNumber: { 
    type: String, 
    trim: true 
  },
  verified: { 
    type: Boolean, 
    default: false 
  },
  verifiedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  verifiedAt: { type: Date },
  documentUrl: { type: String },
  isActive: { type: Boolean, default: true }
}, { _id: true })

const TeacherExperienceSchema = new Schema<TeacherExperience>({
  institution: { 
    type: String, 
    required: true,
    trim: true 
  },
  position: { 
    type: String, 
    required: true,
    trim: true 
  },
  subjects: [{ 
    type: String, 
    trim: true 
  }],
  classes: [{ 
    type: String, 
    trim: true 
  }],
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { type: Date },
  isCurrent: { 
    type: Boolean, 
    default: false 
  },
  responsibilities: [{ 
    type: String, 
    trim: true 
  }],
  achievements: [{ 
    type: String, 
    trim: true 
  }],
  reasonForLeaving: { 
    type: String, 
    trim: true 
  },
  supervisorName: { 
    type: String, 
    trim: true 
  },
  supervisorContact: { 
    type: String, 
    trim: true 
  },
  verified: { 
    type: Boolean, 
    default: false 
  }
}, { _id: true })

const SubjectAssignmentSchema = new Schema<SubjectAssignment>({
  subjectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subject',
    required: true 
  },
  subjectName: { 
    type: String, 
    required: true,
    trim: true 
  },
  subjectCode: { 
    type: String, 
    trim: true 
  },
  classes: [{
    classId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Class',
      required: true 
    },
    className: { 
      type: String, 
      required: true,
      trim: true 
    },
    hoursPerWeek: { 
      type: Number, 
      required: true,
      min: [1, 'Hours per week must be at least 1'],
      max: [40, 'Hours per week cannot exceed 40']
    },
    studentCount: { 
      type: Number, 
      default: 0,
      min: 0 
    }
  }],
  totalHours: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  totalStudents: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  assignedDate: { 
    type: Date, 
    default: Date.now 
  },
  assignedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  academicYear: { 
    type: String, 
    required: true,
    trim: true 
  },
  term: { 
    type: String, 
    required: true,
    trim: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { _id: true })

const ClassAssignmentSchema = new Schema<ClassAssignment>({
  classId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Class',
    required: true 
  },
  className: { 
    type: String, 
    required: true,
    trim: true 
  },
  role: { 
    type: String, 
    enum: ['class_teacher', 'assistant_teacher', 'subject_teacher'],
    required: true 
  },
  responsibilities: [{ 
    type: String, 
    trim: true 
  }],
  studentCount: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  assignedDate: { 
    type: Date, 
    default: Date.now 
  },
  assignedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  academicYear: { 
    type: String, 
    required: true,
    trim: true 
  },
  term: { 
    type: String, 
    required: true,
    trim: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { _id: true })

const TeacherPerformanceSchema = new Schema<TeacherPerformance>({
  academicYear: { 
    type: String, 
    required: true,
    trim: true 
  },
  term: { 
    type: String, 
    required: true,
    trim: true 
  },
  overallRating: { 
    type: Number, 
    required: true,
    min: [1, 'Rating must be between 1 and 5'],
    max: [5, 'Rating must be between 1 and 5']
  },
  categories: {
    teaching: { 
      type: Number, 
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5'],
      default: 3 
    },
    planning: { 
      type: Number, 
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5'],
      default: 3 
    },
    assessment: { 
      type: Number, 
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5'],
      default: 3 
    },
    management: { 
      type: Number, 
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5'],
      default: 3 
    },
    communication: { 
      type: Number, 
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5'],
      default: 3 
    },
    professional: { 
      type: Number, 
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5'],
      default: 3 
    }
  },
  studentResults: {
    averageGrade: { type: Number, min: 0, max: 100 },
    passRate: { type: Number, min: 0, max: 100 },
    improvementRate: { type: Number }
  },
  attendance: {
    totalDays: { type: Number, default: 0, min: 0 },
    presentDays: { type: Number, default: 0, min: 0 },
    absentDays: { type: Number, default: 0, min: 0 },
    lateArrivals: { type: Number, default: 0, min: 0 },
    attendanceRate: { type: Number, min: 0, max: 100 }
  },
  goals: [{
    description: { type: String, required: true, trim: true },
    targetDate: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ['not_started', 'in_progress', 'completed', 'cancelled'],
      default: 'not_started' 
    },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    notes: { type: String, trim: true }
  }],
  strengths: [{ 
    type: String, 
    trim: true 
  }],
  areasForImprovement: [{ 
    type: String, 
    trim: true 
  }],
  recommendations: [{ 
    type: String, 
    trim: true 
  }],
  evaluatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  evaluatedByName: { 
    type: String, 
    required: true,
    trim: true 
  },
  evaluationDate: { 
    type: Date, 
    default: Date.now 
  },
  nextEvaluationDate: { 
    type: Date, 
    required: true 
  },
  comments: { 
    type: String, 
    trim: true 
  },
  teacherComments: { 
    type: String, 
    trim: true 
  },
  actionPlan: [{ 
    type: String, 
    trim: true 
  }]
}, { _id: true })

// ============================================================================
// MAIN TEACHER SCHEMA
// ============================================================================

export interface ITeacher extends Omit<Teacher, 'id'>, Document {
  _id: mongoose.Types.ObjectId
}

const TeacherSchema = new Schema<ITeacher>({
  // School isolation
  schoolId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'School',
    required: [true, 'School ID is required'],
    index: true 
  },
  
  // Employee Information
  employeeNumber: { 
    type: String, 
    required: [true, 'Employee number is required'],
    trim: true,
    uppercase: true,
    maxlength: [20, 'Employee number cannot exceed 20 characters'],
    index: true
  },
  
  tscNumber: { // Teachers Service Commission Number
    type: String, 
    trim: true,
    uppercase: true,
    sparse: true,
    unique: true
  },
  
  // Personal Information
  firstName: { 
    type: String, 
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters'],
    index: 'text'
  },
  
  lastName: { 
    type: String, 
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters'],
    index: 'text'
  },
  
  middleName: { 
    type: String, 
    trim: true,
    maxlength: [50, 'Middle name cannot exceed 50 characters']
  },
  
  dateOfBirth: { 
    type: Date, 
    required: [true, 'Date of birth is required'],
    index: true
  },
  
  gender: { 
    type: String, 
    enum: {
      values: ['male', 'female', 'other'],
      message: 'Gender must be male, female, or other'
    },
    required: [true, 'Gender is required'],
    lowercase: true,
    index: true
  },
  
  nationality: { 
    type: String, 
    required: [true, 'Nationality is required'],
    trim: true,
    default: 'Kenyan'
  },
  
  religion: { 
    type: String, 
    trim: true,
    enum: ['christian', 'muslim', 'hindu', 'buddhist', 'other', 'none'],
    lowercase: true
  },
  
  maritalStatus: { 
    type: String, 
    enum: ['single', 'married', 'divorced', 'widowed', 'other'],
    lowercase: true
  },
  
  // Contact Information
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number']
  },
  
  alternativePhone: { 
    type: String, 
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number']
  },
  
  address: { 
    type: AddressSchema, 
    required: [true, 'Teacher address is required'] 
  },
  
  // Emergency Contact
  emergencyContact: {
    name: { type: String, required: true, trim: true },
    relationship: { type: String, required: true, trim: true },
    phone: { 
      type: String, 
      required: true,
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number']
    },
    alternativePhone: { type: String, trim: true },
    address: AddressSchema
  },
  
  // Professional Information
  qualifications: { 
    type: [TeacherQualificationSchema], 
    required: [true, 'At least one qualification is required'],
    validate: {
      validator: function(qualifications: TeacherQualification[]) {
        return qualifications.length >= 1
      },
      message: 'Teacher must have at least one qualification'
    }
  },
  
  experience: [TeacherExperienceSchema],
  
  specializations: [{ 
    type: String, 
    trim: true,
    lowercase: true 
  }],
  
  // Employment Details
  employmentType: { 
    type: String, 
    enum: {
      values: ['permanent', 'contract', 'temporary', 'volunteer', 'intern'],
      message: 'Invalid employment type'
    },
    required: [true, 'Employment type is required'],
    default: 'contract'
  },
  
  dateOfJoining: { 
    type: Date, 
    required: [true, 'Date of joining is required'],
    default: Date.now,
    index: true 
  },
  
  contractEndDate: { 
    type: Date 
  },
  
  salary: {
    basic: { type: Number, min: 0 },
    allowances: [{
      name: { type: String, required: true, trim: true },
      amount: { type: Number, required: true, min: 0 },
      taxable: { type: Boolean, default: true }
    }],
    deductions: [{
      name: { type: String, required: true, trim: true },
      amount: { type: Number, required: true, min: 0 },
      mandatory: { type: Boolean, default: false }
    }],
    currency: { type: String, default: 'KES' },
    paymentFrequency: { 
      type: String, 
      enum: ['weekly', 'bi_weekly', 'monthly', 'quarterly'],
      default: 'monthly' 
    }
  },
  
  // Current Assignments
  subjectAssignments: [SubjectAssignmentSchema],
  classAssignments: [ClassAssignmentSchema],
  
  // Performance and Professional Development
  performanceRecords: [TeacherPerformanceSchema],
  
  professionalDevelopment: [{
    title: { type: String, required: true, trim: true },
    provider: { type: String, required: true, trim: true },
    type: { 
      type: String, 
      enum: ['workshop', 'seminar', 'course', 'conference', 'certification', 'other'],
      required: true 
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    hoursCompleted: { type: Number, min: 0 },
    certificateNumber: { type: String, trim: true },
    certificateUrl: { type: String },
    cost: { type: Number, min: 0 },
    fundedBy: { 
      type: String, 
      enum: ['school', 'self', 'government', 'other'],
      default: 'school' 
    },
    status: { 
      type: String, 
      enum: ['enrolled', 'in_progress', 'completed', 'cancelled'],
      default: 'enrolled' 
    },
    notes: { type: String, trim: true }
  }],
  
  // Administrative Roles
  administrativeRoles: [{
    title: { type: String, required: true, trim: true },
    department: { type: String, trim: true },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date },
    responsibilities: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true }
  }],
  
  // Status and Employment
  status: { 
    type: String, 
    enum: {
      values: ['active', 'inactive', 'suspended', 'terminated', 'resigned', 'retired', 'on_leave'],
      message: 'Invalid teacher status'
    },
    required: true,
    default: 'active',
    index: true
  },
  
  statusChangedAt: { 
    type: Date, 
    default: Date.now 
  },
  
  statusChangedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  
  statusReason: { 
    type: String, 
    trim: true 
  },
  
  // Leave Management
  leaveBalance: {
    annual: { type: Number, default: 21, min: 0 }, // 21 days default
    sick: { type: Number, default: 14, min: 0 }, // 14 days default
    maternity: { type: Number, default: 90, min: 0 }, // 90 days default
    compassionate: { type: Number, default: 5, min: 0 }, // 5 days default
    study: { type: Number, default: 0, min: 0 }
  },
  
  leaveRecords: [{
    type: { 
      type: String, 
      enum: ['annual', 'sick', 'maternity', 'paternity', 'compassionate', 'study', 'other'],
      required: true 
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    daysRequested: { type: Number, required: true, min: 1 },
    reason: { type: String, required: true, trim: true },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'pending' 
    },
    appliedDate: { type: Date, default: Date.now },
    reviewedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    reviewedAt: { type: Date },
    reviewComments: { type: String, trim: true },
    substituteTeacher: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Teacher' 
    },
    documents: [{ 
      type: String 
    }]
  }],
  
  // Media and Documents
  profileImage: { 
    type: String, 
    trim: true 
  },
  
  documents: [{
    name: { type: String, required: true, trim: true },
    type: { 
      type: String, 
      enum: ['cv', 'certificate', 'id_copy', 'contract', 'performance_review', 'other'],
      required: true 
    },
    url: { type: String, required: true, trim: true },
    uploadedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    uploadedAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false },
    verifiedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    verifiedAt: { type: Date },
    expiryDate: { type: Date }
  }],
  
  // System and Audit Fields
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  updatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  
  // Soft delete
  deletedAt: { type: Date },
  deletedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  isDeleted: { type: Boolean, default: false, index: true },
  
  // Privacy and Preferences
  preferences: {
    language: { type: String, default: 'en' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    privacy: {
      showProfile: { type: Boolean, default: true },
      showContact: { type: Boolean, default: true },
      allowMessaging: { type: Boolean, default: true }
    }
  },
  
  // Performance Summary (computed fields)
  performanceSummary: {
    currentRating: { type: Number, min: 1, max: 5 },
    averageRating: { type: Number, min: 1, max: 5 },
    attendanceRate: { type: Number, min: 0, max: 100 },
    studentSatisfaction: { type: Number, min: 0, max: 100 },
    lastEvaluated: { type: Date },
    nextEvaluation: { type: Date }
  },
  
  // Tags and Notes
  tags: [{ 
    type: String, 
    trim: true,
    lowercase: true 
  }],
  
  notes: { 
    type: String, 
    trim: true,
    maxlength: [2000, 'Notes cannot exceed 2000 characters'] 
  }

}, {
  timestamps: true,
  collection: 'teachers',
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id.toString()
      delete ret._id
      delete ret.__v
      // Remove sensitive salary information from JSON output
      if (ret.salary) {
        delete ret.salary
      }
      return ret
    }
  },
  toObject: { virtuals: true }
})

// ============================================================================
// COMPOUND INDEXES FOR PERFORMANCE
// ============================================================================

// Primary indexes for tenant isolation and common queries
TeacherSchema.index({ schoolId: 1, employeeNumber: 1 }, { unique: true })
TeacherSchema.index({ schoolId: 1, tscNumber: 1 }, { unique: true, sparse: true })
TeacherSchema.index({ schoolId: 1, status: 1, isDeleted: 1 })
TeacherSchema.index({ schoolId: 1, employmentType: 1, status: 1 })

// Search and filtering indexes
TeacherSchema.index({ 
  schoolId: 1, 
  firstName: 'text', 
  lastName: 'text', 
  employeeNumber: 'text' 
})

// Contact and communication indexes
TeacherSchema.index({ email: 1 }, { unique: true })
TeacherSchema.index({ phone: 1 })

// Assignment and workload indexes
TeacherSchema.index({ schoolId: 1, 'subjectAssignments.subjectId': 1 })
TeacherSchema.index({ schoolId: 1, 'classAssignments.classId': 1 })

// Performance and evaluation indexes
TeacherSchema.index({ schoolId: 1, 'performanceSummary.currentRating': -1 })
TeacherSchema.index({ schoolId: 1, dateOfJoining: -1 })

// Leave and attendance indexes
TeacherSchema.index({ schoolId: 1, 'leaveRecords.startDate': -1 })

// ============================================================================
// VIRTUAL FIELDS
// ============================================================================

TeacherSchema.virtual('id').get(function(this: ITeacher) {
  return this._id.toHexString()
})

TeacherSchema.virtual('fullName').get(function(this: ITeacher) {
  const parts = [this.firstName]
  if (this.middleName) parts.push(this.middleName)
  parts.push(this.lastName)
  return parts.join(' ')
})

TeacherSchema.virtual('age').get(function(this: ITeacher) {
  const today = new Date()
  const birthDate = new Date(this.dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
})

TeacherSchema.virtual('yearsOfService').get(function(this: ITeacher) {
  const today = new Date()
  const joiningDate = new Date(this.dateOfJoining)
  return Math.floor((today.getTime() - joiningDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
})

TeacherSchema.virtual('totalTeachingHours').get(function(this: ITeacher) {
  return this.subjectAssignments.reduce((total, assignment) => 
    total + assignment.totalHours, 0
  )
})

TeacherSchema.virtual('totalStudents').get(function(this: ITeacher) {
  return this.subjectAssignments.reduce((total, assignment) => 
    total + assignment.totalStudents, 0
  )
})

TeacherSchema.virtual('isActive').get(function(this: ITeacher) {
  return this.status === 'active' && !this.isDeleted
})

TeacherSchema.virtual('highestQualification').get(function(this: ITeacher) {
  const qualificationOrder = { phd: 5, master: 4, bachelor: 3, diploma: 2, certificate: 1 }
  return this.qualifications.reduce((highest, current) => {
    const currentValue = qualificationOrder[current.degree as keyof typeof qualificationOrder] || 0
    const highestValue = qualificationOrder[highest.degree as keyof typeof qualificationOrder] || 0
    return currentValue > highestValue ? current : highest
  }, this.qualifications[0])
})

// ============================================================================
// INSTANCE METHODS
// ============================================================================

TeacherSchema.methods.calculateAge = function(this: ITeacher): number {
  const today = new Date()
  const birthDate = new Date(this.dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

TeacherSchema.methods.addSubjectAssignment = function(
  this: ITeacher, 
  assignmentData: Partial<SubjectAssignment>
): Promise<ITeacher> {
  // Check if already assigned to this subject
  const existingAssignment = this.subjectAssignments.find(
    assignment => assignment.subjectId.toString() === assignmentData.subjectId?.toString()
  )
  
  if (existingAssignment) {
    throw new Error('Teacher is already assigned to this subject')
  }
  
  this.subjectAssignments.push(assignmentData as SubjectAssignment)
  return this.save()
}

TeacherSchema.methods.removeSubjectAssignment = function(
  this: ITeacher, 
  subjectId: mongoose.Types.ObjectId
): Promise<ITeacher> {
  this.subjectAssignments = this.subjectAssignments.filter(
    assignment => assignment.subjectId.toString() !== subjectId.toString()
  )
  return this.save()
}

TeacherSchema.methods.updateStatus = function(
  this: ITeacher, 
  newStatus: string, 
  reason: string, 
  updatedBy: mongoose.Types.ObjectId
): Promise<ITeacher> {
  this.status = newStatus as any
  this.statusChangedAt = new Date()
  this.statusChangedBy = updatedBy
  this.statusReason = reason
  this.updatedBy = updatedBy
  return this.save()
}

TeacherSchema.methods.applyLeave = function(
  this: ITeacher, 
  leaveData: any
): Promise<ITeacher> {
  // Check if teacher has sufficient leave balance
  const leaveType = leaveData.type as keyof typeof this.leaveBalance
  const availableBalance = this.leaveBalance[leaveType]
  
  if (availableBalance < leaveData.daysRequested) {
    throw new Error(`Insufficient ${leaveType} leave balance`)
  }
  
  this.leaveRecords.push(leaveData)
  return this.save()
}

TeacherSchema.methods.updatePerformanceSummary = function(this: ITeacher): Promise<ITeacher> {
  const recentPerformance = this.performanceRecords
    .filter(record => new Date(record.evaluationDate) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000))
    .sort((a, b) => new Date(b.evaluationDate).getTime() - new Date(a.evaluationDate).getTime())
  
  if (recentPerformance.length > 0) {
    this.performanceSummary = {
      currentRating: recentPerformance[0].overallRating,
      averageRating: recentPerformance.reduce((sum, record) => sum + record.overallRating, 0) / recentPerformance.length,
      attendanceRate: recentPerformance[0].attendance?.attendanceRate || 0,
      studentSatisfaction: 85, // Default value, can be calculated from student feedback
      lastEvaluated: recentPerformance[0].evaluationDate,
      nextEvaluation: recentPerformance[0].nextEvaluationDate
    }
  }
  
  return this.save()
}

// ============================================================================
// STATIC METHODS
// ============================================================================

TeacherSchema.statics.findBySchool = function(schoolId: mongoose.Types.ObjectId) {
  return this.find({ 
    schoolId,
    isDeleted: false 
  }).sort({ firstName: 1, lastName: 1 })
}

TeacherSchema.statics.findByEmployeeNumber = function(
  schoolId: mongoose.Types.ObjectId, 
  employeeNumber: string
) {
  return this.findOne({ 
    schoolId,
    employeeNumber: employeeNumber.toUpperCase(),
    isDeleted: false 
  })
}

TeacherSchema.statics.findBySubject = function(
  schoolId: mongoose.Types.ObjectId, 
  subjectId: mongoose.Types.ObjectId
) {
  return this.find({ 
    schoolId,
    'subjectAssignments.subjectId': subjectId,
    'subjectAssignments.isActive': true,
    status: 'active',
    isDeleted: false 
  })
}

TeacherSchema.statics.findByClass = function(
  schoolId: mongoose.Types.ObjectId, 
  classId: mongoose.Types.ObjectId
) {
  return this.find({ 
    schoolId,
    'classAssignments.classId': classId,
    'classAssignments.isActive': true,
    status: 'active',
    isDeleted: false 
  })
}

TeacherSchema.statics.getSchoolStats = function(schoolId: mongoose.Types.ObjectId) {
  return this.aggregate([
    { $match: { schoolId, isDeleted: false } },
    {
      $group: {
        _id: null,
        totalTeachers: { $sum: 1 },
        activeTeachers: { 
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } 
        },
        maleTeachers: { 
          $sum: { $cond: [{ $eq: ['$gender', 'male'] }, 1, 0] } 
        },
        femaleTeachers: { 
          $sum: { $cond: [{ $eq: ['$gender', 'female'] }, 1, 0] } 
        },
        averageAge: { $avg: '$age' },
        averageYearsOfService: { $avg: '$yearsOfService' }
      }
    }
  ])
}

TeacherSchema.statics.findExpiring = function(
  schoolId: mongoose.Types.ObjectId,
  days: number = 30
) {
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + days)
  
  return this.find({
    schoolId,
    employmentType: 'contract',
    contractEndDate: { $lte: expiryDate },
    status: 'active',
    isDeleted: false
  }).sort({ contractEndDate: 1 })
}

// ============================================================================
// MIDDLEWARE HOOKS
// ============================================================================

// Pre-save middleware
TeacherSchema.pre('save', function(next) {
  // Ensure employee number is uppercase
  if (this.employeeNumber) {
    this.employeeNumber = this.employeeNumber.toUpperCase()
  }
  
  // Ensure TSC number is uppercase
  if (this.tscNumber) {
    this.tscNumber = this.tscNumber.toUpperCase()
  }
  
  // Calculate total hours and students for subject assignments
  this.subjectAssignments.forEach(assignment => {
    assignment.totalHours = assignment.classes.reduce((total, cls) => total + cls.hoursPerWeek, 0)
    assignment.totalStudents = assignment.classes.reduce((total, cls) => total + cls.studentCount, 0)
  })
  
  // Update performance summary if performance records changed
  if (this.isModified('performanceRecords')) {
    this.updatePerformanceSummary()
  }
  
  next()
})

// Post-save middleware for statistics updates
TeacherSchema.post('save', function(doc) {
  if (doc.wasNew) {
    // Increment school teacher count
    mongoose.model('School').updateOne(
      { _id: doc.schoolId },
      { 
        $inc: { 'stats.totalTeachers': 1 },
        $set: { 'stats.lastActivityAt': new Date() }
      }
    ).exec()
  }
})

// ============================================================================
// MODEL EXPORT
// ============================================================================

export interface ITeacherModel extends Model<ITeacher> {
  findBySchool(schoolId: mongoose.Types.ObjectId): Promise<ITeacher[]>
  findByEmployeeNumber(schoolId: mongoose.Types.ObjectId, employeeNumber: string): Promise<ITeacher | null>
  findBySubject(schoolId: mongoose.Types.ObjectId, subjectId: mongoose.Types.ObjectId): Promise<ITeacher[]>
  findByClass(schoolId: mongoose.Types.ObjectId, classId: mongoose.Types.ObjectId): Promise<ITeacher[]>
  getSchoolStats(schoolId: mongoose.Types.ObjectId): Promise<any[]>
  findExpiring(schoolId: mongoose.Types.ObjectId, days?: number): Promise<ITeacher[]>
}

// Prevent re-compilation in development
const TeacherModel = (mongoose.models.Teacher as ITeacherModel) || 
                    mongoose.model<ITeacher, ITeacherModel>('Teacher', TeacherSchema)

export default TeacherModel