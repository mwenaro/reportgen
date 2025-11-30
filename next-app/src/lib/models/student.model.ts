import mongoose, { Schema, Document, Model } from 'mongoose'
import { Student, Guardian, Address, MedicalInfo, AcademicRecord, BehaviorRecord, FeeRecord } from '@/types/entities'

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

const GuardianSchema = new Schema<Guardian>({
  type: { 
    type: String, 
    enum: ['parent', 'guardian', 'relative', 'other'],
    required: true,
    default: 'parent'
  },
  relationship: { 
    type: String, 
    enum: ['father', 'mother', 'grandfather', 'grandmother', 'uncle', 'aunt', 'sibling', 'guardian', 'other'],
    required: true
  },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: { 
    type: String, 
    required: true,
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number']
  },
  alternativePhone: { type: String, trim: true },
  occupation: { type: String, trim: true },
  workplace: { type: String, trim: true },
  address: AddressSchema,
  emergencyContact: { type: Boolean, default: false },
  financialResponsibility: { type: Boolean, default: false },
  academicNotifications: { type: Boolean, default: true },
  disciplineNotifications: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true }
}, { _id: false })

const MedicalInfoSchema = new Schema<MedicalInfo>({
  bloodType: { 
    type: String, 
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    uppercase: true
  },
  allergies: [{ 
    type: String, 
    trim: true 
  }],
  medications: [{
    name: { type: String, required: true, trim: true },
    dosage: { type: String, trim: true },
    frequency: { type: String, trim: true },
    prescribedBy: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    instructions: { type: String, trim: true }
  }],
  conditions: [{
    name: { type: String, required: true, trim: true },
    severity: { type: String, enum: ['mild', 'moderate', 'severe'], default: 'mild' },
    diagnosedDate: { type: Date },
    notes: { type: String, trim: true }
  }],
  emergencyProcedures: [{ type: String, trim: true }],
  doctorName: { type: String, trim: true },
  doctorPhone: { type: String, trim: true },
  hospitalPreference: { type: String, trim: true },
  insuranceProvider: { type: String, trim: true },
  insuranceNumber: { type: String, trim: true },
  lastCheckup: { type: Date },
  vaccinations: [{
    name: { type: String, required: true, trim: true },
    dateGiven: { type: Date, required: true },
    boosterDue: { type: Date },
    administeredBy: { type: String, trim: true }
  }],
  specialNeeds: { type: String, trim: true },
  notes: { type: String, trim: true }
}, { _id: false })

const AcademicRecordSchema = new Schema<AcademicRecord>({
  academicYear: { type: String, required: true },
  term: { type: String, required: true },
  classId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Class',
    required: true 
  },
  className: { type: String, required: true },
  stream: { type: String, trim: true },
  subjects: [{
    subjectId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Subject',
      required: true 
    },
    subjectName: { type: String, required: true },
    teacherId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Teacher' 
    },
    teacherName: { type: String },
    marks: [{
      examId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Exam',
        required: true 
      },
      examName: { type: String, required: true },
      examType: { type: String, required: true },
      marksObtained: { type: Number, required: true, min: 0 },
      totalMarks: { type: Number, required: true, min: 1 },
      percentage: { type: Number, min: 0, max: 100 },
      grade: { type: String, required: true },
      position: { type: Number, min: 1 },
      remarks: { type: String, trim: true },
      enteredBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
      },
      enteredAt: { type: Date, default: Date.now }
    }],
    overallGrade: { type: String },
    overallPercentage: { type: Number, min: 0, max: 100 },
    position: { type: Number, min: 1 },
    teacherComment: { type: String, trim: true }
  }],
  overallGrade: { type: String },
  overallPercentage: { type: Number, min: 0, max: 100 },
  overallPosition: { type: Number, min: 1 },
  classSize: { type: Number, min: 1 },
  attendance: {
    totalDays: { type: Number, default: 0, min: 0 },
    presentDays: { type: Number, default: 0, min: 0 },
    absentDays: { type: Number, default: 0, min: 0 },
    lateDays: { type: Number, default: 0, min: 0 },
    excusedDays: { type: Number, default: 0, min: 0 },
    attendancePercentage: { type: Number, min: 0, max: 100 }
  },
  behavior: {
    conduct: { type: String, enum: ['excellent', 'very_good', 'good', 'fair', 'poor'], default: 'good' },
    effort: { type: String, enum: ['excellent', 'very_good', 'good', 'fair', 'poor'], default: 'good' },
    punctuality: { type: String, enum: ['excellent', 'very_good', 'good', 'fair', 'poor'], default: 'good' },
    discipline: { type: String, enum: ['excellent', 'very_good', 'good', 'fair', 'poor'], default: 'good' }
  },
  teacherComments: [{ type: String, trim: true }],
  principalComment: { type: String, trim: true },
  promoted: { type: Boolean, default: false },
  nextClass: { type: String, trim: true },
  reportGeneratedAt: { type: Date }
}, { _id: false })

const BehaviorRecordSchema = new Schema<BehaviorRecord>({
  date: { type: Date, required: true, default: Date.now },
  type: { 
    type: String, 
    enum: ['commendation', 'warning', 'suspension', 'expulsion', 'other'],
    required: true
  },
  category: {
    type: String,
    enum: ['academic', 'discipline', 'conduct', 'attendance', 'other'],
    required: true
  },
  description: { type: String, required: true, trim: true },
  severity: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  action: { type: String, trim: true },
  followUp: { type: String, trim: true },
  reportedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  reportedByName: { type: String, required: true },
  parentNotified: { type: Boolean, default: false },
  parentNotifiedAt: { type: Date },
  resolved: { type: Boolean, default: false },
  resolvedAt: { type: Date },
  resolvedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  notes: { type: String, trim: true }
}, { _id: false })

const FeeRecordSchema = new Schema<FeeRecord>({
  academicYear: { type: String, required: true },
  term: { type: String, required: true },
  feeStructure: [{
    category: { 
      type: String, 
      enum: ['tuition', 'boarding', 'transport', 'lunch', 'activities', 'examination', 'other'],
      required: true 
    },
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    dueDate: { type: Date, required: true },
    paid: { type: Boolean, default: false },
    paidAmount: { type: Number, default: 0, min: 0 },
    paidDate: { type: Date },
    paymentMethod: { 
      type: String, 
      enum: ['cash', 'cheque', 'bank_transfer', 'mobile_money', 'card', 'other']
    },
    receiptNumber: { type: String, trim: true },
    balance: { type: Number, default: 0 }
  }],
  totalFees: { type: Number, required: true, min: 0 },
  totalPaid: { type: Number, default: 0, min: 0 },
  totalBalance: { type: Number, default: 0, min: 0 },
  paymentHistory: [{
    date: { type: Date, required: true },
    amount: { type: Number, required: true, min: 0 },
    method: { 
      type: String, 
      enum: ['cash', 'cheque', 'bank_transfer', 'mobile_money', 'card', 'other'],
      required: true 
    },
    reference: { type: String, trim: true },
    receiptNumber: { type: String, required: true, trim: true },
    collectedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    collectedByName: { type: String, required: true },
    notes: { type: String, trim: true }
  }],
  scholarships: [{
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['full', 'partial', 'merit', 'need', 'other'], required: true },
    amount: { type: Number, required: true, min: 0 },
    percentage: { type: Number, min: 0, max: 100 },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    sponsor: { type: String, trim: true },
    conditions: { type: String, trim: true },
    renewable: { type: Boolean, default: false }
  }],
  discounts: [{
    type: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    percentage: { type: Number, min: 0, max: 100 },
    reason: { type: String, required: true, trim: true },
    approvedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    approvedAt: { type: Date, default: Date.now }
  }],
  status: { 
    type: String, 
    enum: ['current', 'defaulter', 'cleared', 'exempted'],
    default: 'current'
  }
}, { _id: false })

// ============================================================================
// MAIN STUDENT SCHEMA
// ============================================================================

export interface IStudent extends Omit<Student, 'id'>, Document {
  _id: mongoose.Types.ObjectId
}

const StudentSchema = new Schema<IStudent>({
  // School isolation
  schoolId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'School',
    required: [true, 'School ID is required'],
    index: true 
  },
  
  // Basic Information
  admissionNumber: { 
    type: String, 
    required: [true, 'Admission number is required'],
    trim: true,
    uppercase: true,
    maxlength: [20, 'Admission number cannot exceed 20 characters'],
    index: true
  },
  
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
  
  // Contact Information
  email: { 
    type: String, 
    lowercase: true,
    trim: true,
    sparse: true, // Allow null values but enforce uniqueness when present
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  
  phone: { 
    type: String, 
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number']
  },
  
  address: { 
    type: AddressSchema, 
    required: [true, 'Student address is required'] 
  },
  
  // Guardian Information
  guardians: { 
    type: [GuardianSchema], 
    required: [true, 'At least one guardian is required'],
    validate: {
      validator: function(guardians: Guardian[]) {
        return guardians.length >= 1 && guardians.length <= 4
      },
      message: 'Student must have between 1 and 4 guardians'
    }
  },
  
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
  
  // Academic Information
  currentClassId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Class',
    required: [true, 'Current class is required'],
    index: true 
  },
  
  currentClassName: { 
    type: String, 
    required: [true, 'Current class name is required'],
    trim: true 
  },
  
  stream: { 
    type: String, 
    trim: true 
  },
  
  admissionDate: { 
    type: Date, 
    required: [true, 'Admission date is required'],
    default: Date.now,
    index: true 
  },
  
  academicYear: { 
    type: String, 
    required: [true, 'Academic year is required'],
    trim: true,
    index: true 
  },
  
  previousSchool: { 
    type: String, 
    trim: true 
  },
  
  previousClass: { 
    type: String, 
    trim: true 
  },
  
  kcpeMarks: { 
    type: Number, 
    min: [0, 'KCPE marks cannot be negative'],
    max: [500, 'KCPE marks cannot exceed 500']
  },
  
  kcpeIndex: { 
    type: String, 
    trim: true,
    uppercase: true 
  },
  
  // Student Records
  medicalInfo: MedicalInfoSchema,
  academicRecords: [AcademicRecordSchema],
  behaviorRecords: [BehaviorRecordSchema],
  feeRecords: [FeeRecordSchema],
  
  // Status and Performance
  status: { 
    type: String, 
    enum: {
      values: ['active', 'inactive', 'transferred', 'graduated', 'expelled', 'suspended', 'dropout'],
      message: 'Invalid student status'
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
  
  // Performance Summary (computed fields for quick access)
  performanceSummary: {
    currentGPA: { type: Number, min: 0, max: 12 },
    currentPosition: { type: Number, min: 1 },
    attendanceRate: { type: Number, min: 0, max: 100 },
    behaviorScore: { type: Number, min: 0, max: 100 },
    lastUpdated: { type: Date, default: Date.now }
  },
  
  // Media and Documents
  profileImage: { 
    type: String, 
    trim: true 
  },
  
  documents: [{
    name: { type: String, required: true, trim: true },
    type: { 
      type: String, 
      enum: ['birth_certificate', 'passport', 'id_copy', 'medical_report', 'transfer_certificate', 'other'],
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
    verifiedAt: { type: Date }
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
      showProfile: { type: Boolean, default: false },
      showGrades: { type: Boolean, default: false },
      allowMessaging: { type: Boolean, default: true }
    }
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
    maxlength: [1000, 'Notes cannot exceed 1000 characters'] 
  }

}, {
  timestamps: true,
  collection: 'students',
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id.toString()
      delete ret._id
      delete ret.__v
      return ret
    }
  },
  toObject: { virtuals: true }
})

// ============================================================================
// COMPOUND INDEXES FOR PERFORMANCE
// ============================================================================

// Primary indexes for tenant isolation and common queries
StudentSchema.index({ schoolId: 1, admissionNumber: 1 }, { unique: true })
StudentSchema.index({ schoolId: 1, currentClassId: 1 })
StudentSchema.index({ schoolId: 1, status: 1, isDeleted: 1 })
StudentSchema.index({ schoolId: 1, academicYear: 1, currentClassId: 1 })

// Search and filtering indexes
StudentSchema.index({ 
  schoolId: 1, 
  firstName: 'text', 
  lastName: 'text', 
  admissionNumber: 'text' 
})

// Performance and analytics indexes
StudentSchema.index({ schoolId: 1, 'performanceSummary.currentGPA': -1 })
StudentSchema.index({ schoolId: 1, gender: 1, status: 1 })
StudentSchema.index({ schoolId: 1, dateOfBirth: 1 })
StudentSchema.index({ schoolId: 1, admissionDate: -1 })

// Guardian contact indexes
StudentSchema.index({ 'guardians.email': 1 }, { sparse: true })
StudentSchema.index({ 'guardians.phone': 1 }, { sparse: true })

// Geospatial index
StudentSchema.index({ 'address.coordinates': '2dsphere' })

// ============================================================================
// VIRTUAL FIELDS
// ============================================================================

StudentSchema.virtual('id').get(function(this: IStudent) {
  return this._id.toHexString()
})

StudentSchema.virtual('fullName').get(function(this: IStudent) {
  const parts = [this.firstName]
  if (this.middleName) parts.push(this.middleName)
  parts.push(this.lastName)
  return parts.join(' ')
})

StudentSchema.virtual('age').get(function(this: IStudent) {
  const today = new Date()
  const birthDate = new Date(this.dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
})

StudentSchema.virtual('primaryGuardian').get(function(this: IStudent) {
  return this.guardians.find(g => g.financialResponsibility) || this.guardians[0]
})

StudentSchema.virtual('currentAcademicRecord').get(function(this: IStudent) {
  return this.academicRecords.find(record => 
    record.academicYear === this.academicYear
  )
})

StudentSchema.virtual('currentFeeRecord').get(function(this: IStudent) {
  return this.feeRecords.find(record => 
    record.academicYear === this.academicYear
  )
})

StudentSchema.virtual('isActive').get(function(this: IStudent) {
  return this.status === 'active' && !this.isDeleted
})

// ============================================================================
// INSTANCE METHODS
// ============================================================================

StudentSchema.methods.calculateAge = function(this: IStudent): number {
  const today = new Date()
  const birthDate = new Date(this.dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

StudentSchema.methods.addGuardian = function(this: IStudent, guardianData: Guardian): Promise<IStudent> {
  if (this.guardians.length >= 4) {
    throw new Error('Maximum of 4 guardians allowed per student')
  }
  
  this.guardians.push(guardianData)
  return this.save()
}

StudentSchema.methods.updateStatus = function(
  this: IStudent, 
  newStatus: string, 
  reason: string, 
  updatedBy: mongoose.Types.ObjectId
): Promise<IStudent> {
  this.status = newStatus as any
  this.statusChangedAt = new Date()
  this.statusChangedBy = updatedBy
  this.statusReason = reason
  this.updatedBy = updatedBy
  return this.save()
}

StudentSchema.methods.promoteToClass = function(
  this: IStudent, 
  newClassId: mongoose.Types.ObjectId,
  newClassName: string,
  newAcademicYear: string,
  promotedBy: mongoose.Types.ObjectId
): Promise<IStudent> {
  this.currentClassId = newClassId
  this.currentClassName = newClassName
  this.academicYear = newAcademicYear
  this.updatedBy = promotedBy
  return this.save()
}

StudentSchema.methods.addBehaviorRecord = function(
  this: IStudent, 
  behaviorData: Partial<BehaviorRecord>
): Promise<IStudent> {
  this.behaviorRecords.push(behaviorData as BehaviorRecord)
  return this.save()
}

StudentSchema.methods.updatePerformanceSummary = function(this: IStudent): Promise<IStudent> {
  const currentRecord = this.currentAcademicRecord
  if (currentRecord) {
    this.performanceSummary = {
      currentGPA: currentRecord.overallPercentage || 0,
      currentPosition: currentRecord.overallPosition || 0,
      attendanceRate: currentRecord.attendance?.attendancePercentage || 0,
      behaviorScore: 85, // Default score, can be calculated based on behavior records
      lastUpdated: new Date()
    }
  }
  return this.save()
}

// ============================================================================
// STATIC METHODS
// ============================================================================

StudentSchema.statics.findBySchool = function(schoolId: mongoose.Types.ObjectId) {
  return this.find({ 
    schoolId,
    isDeleted: false 
  }).sort({ firstName: 1, lastName: 1 })
}

StudentSchema.statics.findByClass = function(
  schoolId: mongoose.Types.ObjectId, 
  classId: mongoose.Types.ObjectId
) {
  return this.find({ 
    schoolId,
    currentClassId: classId,
    status: 'active',
    isDeleted: false 
  }).sort({ firstName: 1, lastName: 1 })
}

StudentSchema.statics.findByAdmissionNumber = function(
  schoolId: mongoose.Types.ObjectId, 
  admissionNumber: string
) {
  return this.findOne({ 
    schoolId,
    admissionNumber: admissionNumber.toUpperCase(),
    isDeleted: false 
  })
}

StudentSchema.statics.getSchoolStats = function(schoolId: mongoose.Types.ObjectId) {
  return this.aggregate([
    { $match: { schoolId, isDeleted: false } },
    {
      $group: {
        _id: null,
        totalStudents: { $sum: 1 },
        activeStudents: { 
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } 
        },
        maleStudents: { 
          $sum: { $cond: [{ $eq: ['$gender', 'male'] }, 1, 0] } 
        },
        femaleStudents: { 
          $sum: { $cond: [{ $eq: ['$gender', 'female'] }, 1, 0] } 
        },
        averageAge: { $avg: '$age' }
      }
    }
  ])
}

StudentSchema.statics.searchStudents = function(
  schoolId: mongoose.Types.ObjectId,
  searchTerm: string,
  filters: any = {}
) {
  const query = {
    schoolId,
    isDeleted: false,
    $or: [
      { firstName: { $regex: searchTerm, $options: 'i' } },
      { lastName: { $regex: searchTerm, $options: 'i' } },
      { admissionNumber: { $regex: searchTerm, $options: 'i' } }
    ],
    ...filters
  }
  
  return this.find(query)
    .sort({ firstName: 1, lastName: 1 })
    .populate('currentClassId', 'name level')
    .limit(50)
}

// ============================================================================
// MIDDLEWARE HOOKS
// ============================================================================

// Pre-save middleware
StudentSchema.pre('save', function(next) {
  // Ensure admission number is uppercase
  if (this.admissionNumber) {
    this.admissionNumber = this.admissionNumber.toUpperCase()
  }
  
  // Calculate and cache age (for search purposes)
  if (this.dateOfBirth) {
    (this as any).age = this.calculateAge()
  }
  
  // Update performance summary if academic records changed
  if (this.isModified('academicRecords')) {
    this.updatePerformanceSummary()
  }
  
  next()
})

// Post-save middleware for statistics updates
StudentSchema.post('save', function(doc) {
  // Update school statistics
  if (doc.wasNew) {
    // Increment school student count
    mongoose.model('School').updateOne(
      { _id: doc.schoolId },
      { 
        $inc: { 'stats.totalStudents': 1 },
        $set: { 'stats.lastActivityAt': new Date() }
      }
    ).exec()
  }
})

// ============================================================================
// MODEL EXPORT
// ============================================================================

export interface IStudentModel extends Model<IStudent> {
  findBySchool(schoolId: mongoose.Types.ObjectId): Promise<IStudent[]>
  findByClass(schoolId: mongoose.Types.ObjectId, classId: mongoose.Types.ObjectId): Promise<IStudent[]>
  findByAdmissionNumber(schoolId: mongoose.Types.ObjectId, admissionNumber: string): Promise<IStudent | null>
  getSchoolStats(schoolId: mongoose.Types.ObjectId): Promise<any[]>
  searchStudents(schoolId: mongoose.Types.ObjectId, searchTerm: string, filters?: any): Promise<IStudent[]>
}

// Prevent re-compilation in development
const StudentModel = (mongoose.models.Student as IStudentModel) || 
                    mongoose.model<IStudent, IStudentModel>('Student', StudentSchema)

export default StudentModel