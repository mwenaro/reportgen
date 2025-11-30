import mongoose, { Schema, Document, Model } from 'mongoose'
import { Class, ClassSchedule, ClassResource } from '@/types/entities'

// ============================================================================
// SUBDOCUMENTS & EMBEDDED SCHEMAS
// ============================================================================

const ClassScheduleSchema = new Schema<ClassSchedule>({
  day: { 
    type: String, 
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true 
  },
  periods: [{
    periodNumber: { type: Number, required: true, min: 1, max: 10 },
    subject: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Subject',
      required: true 
    },
    subjectName: { type: String, required: true, trim: true },
    teacher: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Teacher',
      required: true 
    },
    teacherName: { type: String, required: true, trim: true },
    startTime: { type: String, required: true, match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ },
    endTime: { type: String, required: true, match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ },
    duration: { type: Number, required: true, min: 30, max: 120 }, // in minutes
    room: { type: String, trim: true },
    isBreak: { type: Boolean, default: false },
    notes: { type: String, trim: true }
  }]
}, { _id: false })

const ClassResourceSchema = new Schema<ClassResource>({
  name: { type: String, required: true, trim: true },
  type: { 
    type: String, 
    enum: ['textbook', 'reference', 'equipment', 'digital', 'software', 'stationery', 'other'],
    required: true 
  },
  description: { type: String, trim: true },
  quantity: { type: Number, required: true, min: 0 },
  unitCost: { type: Number, min: 0 },
  totalCost: { type: Number, min: 0 },
  supplier: { type: String, trim: true },
  purchaseDate: { type: Date },
  condition: { 
    type: String, 
    enum: ['new', 'good', 'fair', 'poor', 'damaged'],
    default: 'good' 
  },
  location: { type: String, trim: true },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Teacher' 
  },
  isActive: { type: Boolean, default: true }
}, { _id: true })

// ============================================================================
// MAIN CLASS SCHEMA
// ============================================================================

export interface IClass extends Omit<Class, 'id'>, Document {
  _id: mongoose.Types.ObjectId
}

const ClassSchema = new Schema<IClass>({
  // School isolation
  schoolId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'School',
    required: [true, 'School ID is required'],
    index: true 
  },
  
  // Basic Information
  name: { 
    type: String, 
    required: [true, 'Class name is required'],
    trim: true,
    maxlength: [50, 'Class name cannot exceed 50 characters'],
    index: 'text'
  },
  
  code: { 
    type: String, 
    required: [true, 'Class code is required'],
    trim: true,
    uppercase: true,
    maxlength: [10, 'Class code cannot exceed 10 characters']
  },
  
  level: { 
    type: String, 
    required: [true, 'Class level is required'],
    enum: {
      values: ['kindergarten', 'primary', 'secondary', 'tertiary'],
      message: 'Invalid class level'
    },
    index: true
  },
  
  grade: { 
    type: Number, 
    required: [true, 'Grade is required'],
    min: [1, 'Grade must be at least 1'],
    max: [12, 'Grade cannot exceed 12'],
    index: true
  },
  
  stream: { 
    type: String, 
    trim: true,
    uppercase: true,
    maxlength: [5, 'Stream cannot exceed 5 characters']
  },
  
  section: { 
    type: String, 
    trim: true,
    maxlength: [20, 'Section cannot exceed 20 characters']
  },
  
  // Academic Information
  academicYear: { 
    type: String, 
    required: [true, 'Academic year is required'],
    trim: true,
    index: true
  },
  
  curriculum: { 
    type: String, 
    required: [true, 'Curriculum is required'],
    enum: ['8-4-4', 'CBC', 'Cambridge', 'IB', 'American', 'other'],
    default: 'CBC'
  },
  
  // Class Teacher and Staff
  classTeacher: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Teacher',
    required: [true, 'Class teacher is required']
  },
  
  assistantTeachers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Teacher'
  }],
  
  subjectTeachers: [{
    subject: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Subject',
      required: true 
    },
    teacher: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Teacher',
      required: true 
    },
    assignedDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
  }],
  
  // Enrollment and Capacity
  maxCapacity: { 
    type: Number, 
    required: [true, 'Maximum capacity is required'],
    min: [1, 'Maximum capacity must be at least 1'],
    max: [100, 'Maximum capacity cannot exceed 100']
  },
  
  currentEnrollment: { 
    type: Number, 
    default: 0,
    min: 0
  },
  
  enrollmentStatus: { 
    type: String, 
    enum: ['open', 'full', 'closed'],
    default: 'open'
  },
  
  // Physical Information
  classroom: {
    number: { type: String, trim: true },
    block: { type: String, trim: true },
    floor: { type: Number, min: 0 },
    capacity: { type: Number, min: 1 },
    facilities: [{ 
      type: String, 
      enum: ['projector', 'whiteboard', 'blackboard', 'computers', 'internet', 'ac', 'fans', 'lab_equipment'],
      lowercase: true 
    }],
    condition: { 
      type: String, 
      enum: ['excellent', 'good', 'fair', 'poor', 'maintenance_required'],
      default: 'good' 
    }
  },
  
  // Subjects and Curriculum
  subjects: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subject'
  }],
  
  coreSubjects: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subject'
  }],
  
  electiveSubjects: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subject'
  }],
  
  // Schedule and Timetable
  schedule: [ClassScheduleSchema],
  
  // Class Performance and Statistics
  performance: {
    averageGrade: { type: Number, min: 0, max: 100 },
    passRate: { type: Number, min: 0, max: 100 },
    attendanceRate: { type: Number, min: 0, max: 100 },
    behaviorScore: { type: Number, min: 0, max: 100 },
    lastUpdated: { type: Date, default: Date.now }
  },
  
  // Resources and Equipment
  resources: [ClassResourceSchema],
  
  // Class Rules and Guidelines
  rules: [{ 
    type: String, 
    trim: true 
  }],
  
  guidelines: [{ 
    type: String, 
    trim: true 
  }],
  
  // Class Events and Activities
  events: [{
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    date: { type: Date, required: true },
    type: { 
      type: String, 
      enum: ['academic', 'social', 'sports', 'cultural', 'field_trip', 'other'],
      default: 'academic' 
    },
    organizer: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Teacher' 
    },
    participants: { type: Number, min: 0 },
    budget: { type: Number, min: 0 },
    status: { 
      type: String, 
      enum: ['planned', 'approved', 'ongoing', 'completed', 'cancelled'],
      default: 'planned' 
    }
  }],
  
  // Parent-Teacher Communication
  parentMeetings: [{
    date: { type: Date, required: true },
    agenda: { type: String, required: true, trim: true },
    organizer: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Teacher',
      required: true 
    },
    attendees: { type: Number, min: 0 },
    notes: { type: String, trim: true },
    followUpActions: [{ type: String, trim: true }]
  }],
  
  // Status and Management
  status: { 
    type: String, 
    enum: {
      values: ['active', 'inactive', 'archived', 'graduated'],
      message: 'Invalid class status'
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
  collection: 'classes',
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
ClassSchema.index({ schoolId: 1, code: 1 }, { unique: true })
ClassSchema.index({ schoolId: 1, name: 1, academicYear: 1 }, { unique: true })
ClassSchema.index({ schoolId: 1, level: 1, grade: 1, status: 1 })
ClassSchema.index({ schoolId: 1, academicYear: 1, status: 1 })

// Teacher assignment indexes
ClassSchema.index({ schoolId: 1, classTeacher: 1 })
ClassSchema.index({ schoolId: 1, 'subjectTeachers.teacher': 1 })

// Performance and analytics indexes
ClassSchema.index({ schoolId: 1, 'performance.averageGrade': -1 })
ClassSchema.index({ schoolId: 1, currentEnrollment: -1 })

// Search indexes
ClassSchema.index({ 
  schoolId: 1, 
  name: 'text', 
  code: 'text' 
})

// ============================================================================
// VIRTUAL FIELDS
// ============================================================================

ClassSchema.virtual('id').get(function(this: IClass) {
  return this._id.toHexString()
})

ClassSchema.virtual('fullName').get(function(this: IClass) {
  let fullName = this.name
  if (this.stream) fullName += ` ${this.stream}`
  if (this.section) fullName += ` (${this.section})`
  return fullName
})

ClassSchema.virtual('availableSlots').get(function(this: IClass) {
  return Math.max(0, this.maxCapacity - this.currentEnrollment)
})

ClassSchema.virtual('occupancyRate').get(function(this: IClass) {
  return this.maxCapacity > 0 ? (this.currentEnrollment / this.maxCapacity) * 100 : 0
})

ClassSchema.virtual('isActive').get(function(this: IClass) {
  return this.status === 'active' && !this.isDeleted
})

// ============================================================================
// INSTANCE METHODS
// ============================================================================

ClassSchema.methods.addStudent = function(this: IClass): Promise<IClass> {
  if (this.currentEnrollment >= this.maxCapacity) {
    throw new Error('Class has reached maximum capacity')
  }
  
  this.currentEnrollment += 1
  
  // Update enrollment status
  if (this.currentEnrollment >= this.maxCapacity) {
    this.enrollmentStatus = 'full'
  }
  
  return this.save()
}

ClassSchema.methods.removeStudent = function(this: IClass): Promise<IClass> {
  if (this.currentEnrollment > 0) {
    this.currentEnrollment -= 1
    
    // Update enrollment status
    if (this.enrollmentStatus === 'full') {
      this.enrollmentStatus = 'open'
    }
  }
  
  return this.save()
}

ClassSchema.methods.assignSubjectTeacher = function(
  this: IClass, 
  subjectId: mongoose.Types.ObjectId,
  teacherId: mongoose.Types.ObjectId
): Promise<IClass> {
  // Remove existing assignment for this subject
  this.subjectTeachers = this.subjectTeachers.filter(
    assignment => assignment.subject.toString() !== subjectId.toString()
  )
  
  // Add new assignment
  this.subjectTeachers.push({
    subject: subjectId,
    teacher: teacherId,
    assignedDate: new Date(),
    isActive: true
  } as any)
  
  return this.save()
}

ClassSchema.methods.updatePerformance = function(
  this: IClass, 
  performanceData: Partial<typeof this.performance>
): Promise<IClass> {
  this.performance = {
    ...this.performance,
    ...performanceData,
    lastUpdated: new Date()
  }
  
  return this.save()
}

// ============================================================================
// STATIC METHODS
// ============================================================================

ClassSchema.statics.findBySchool = function(schoolId: mongoose.Types.ObjectId) {
  return this.find({ 
    schoolId,
    isDeleted: false 
  }).sort({ grade: 1, name: 1 })
}

ClassSchema.statics.findByLevel = function(
  schoolId: mongoose.Types.ObjectId, 
  level: string
) {
  return this.find({ 
    schoolId,
    level,
    status: 'active',
    isDeleted: false 
  }).sort({ grade: 1, name: 1 })
}

ClassSchema.statics.findByTeacher = function(
  schoolId: mongoose.Types.ObjectId, 
  teacherId: mongoose.Types.ObjectId
) {
  return this.find({ 
    schoolId,
    $or: [
      { classTeacher: teacherId },
      { assistantTeachers: teacherId },
      { 'subjectTeachers.teacher': teacherId }
    ],
    status: 'active',
    isDeleted: false 
  })
}

ClassSchema.statics.getSchoolStats = function(schoolId: mongoose.Types.ObjectId) {
  return this.aggregate([
    { $match: { schoolId, isDeleted: false } },
    {
      $group: {
        _id: null,
        totalClasses: { $sum: 1 },
        activeClasses: { 
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } 
        },
        totalCapacity: { $sum: '$maxCapacity' },
        totalEnrollment: { $sum: '$currentEnrollment' },
        averageClassSize: { $avg: '$currentEnrollment' },
        occupancyRate: { 
          $avg: { 
            $cond: [
              { $gt: ['$maxCapacity', 0] },
              { $multiply: [{ $divide: ['$currentEnrollment', '$maxCapacity'] }, 100] },
              0
            ]
          }
        }
      }
    }
  ])
}

// ============================================================================
// MIDDLEWARE HOOKS
// ============================================================================

// Pre-save middleware
ClassSchema.pre('save', function(next) {
  // Ensure code is uppercase
  if (this.code) {
    this.code = this.code.toUpperCase()
  }
  
  // Update enrollment status based on current enrollment
  if (this.currentEnrollment >= this.maxCapacity) {
    this.enrollmentStatus = 'full'
  } else if (this.currentEnrollment === 0) {
    this.enrollmentStatus = 'open'
  } else {
    this.enrollmentStatus = 'open'
  }
  
  next()
})

// Post-save middleware
ClassSchema.post('save', function(doc) {
  if (doc.wasNew) {
    // Update school statistics
    mongoose.model('School').updateOne(
      { _id: doc.schoolId },
      { 
        $inc: { 'stats.totalClasses': 1 },
        $set: { 'stats.lastActivityAt': new Date() }
      }
    ).exec()
  }
})

// ============================================================================
// MODEL EXPORT
// ============================================================================

export interface IClassModel extends Model<IClass> {
  findBySchool(schoolId: mongoose.Types.ObjectId): Promise<IClass[]>
  findByLevel(schoolId: mongoose.Types.ObjectId, level: string): Promise<IClass[]>
  findByTeacher(schoolId: mongoose.Types.ObjectId, teacherId: mongoose.Types.ObjectId): Promise<IClass[]>
  getSchoolStats(schoolId: mongoose.Types.ObjectId): Promise<any[]>
}

// Prevent re-compilation in development
const ClassModel = (mongoose.models.Class as IClassModel) || 
                  mongoose.model<IClass, IClassModel>('Class', ClassSchema)

export default ClassModel