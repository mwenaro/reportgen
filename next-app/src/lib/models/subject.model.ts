import mongoose, { Schema, Document, Model } from 'mongoose'
import { Subject, LearningObjective, AssessmentCriteria } from '@/types/entities'

// ============================================================================
// SUBDOCUMENTS & EMBEDDED SCHEMAS
// ============================================================================

const LearningObjectiveSchema = new Schema<LearningObjective>({
  id: { type: String, required: true },
  description: { type: String, required: true, trim: true },
  level: { 
    type: String, 
    enum: ['knowledge', 'comprehension', 'application', 'analysis', 'synthesis', 'evaluation'],
    required: true 
  },
  bloomLevel: { type: Number, min: 1, max: 6, required: true },
  assessable: { type: Boolean, default: true },
  prerequisites: [{ type: String, trim: true }],
  outcomes: [{ type: String, trim: true }],
  activities: [{ type: String, trim: true }],
  resources: [{ type: String, trim: true }],
  assessmentMethods: [{ 
    type: String, 
    enum: ['written', 'practical', 'oral', 'project', 'portfolio', 'observation'],
    lowercase: true 
  }],
  timeAllocation: { type: Number, min: 0 }, // hours
  difficulty: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate' 
  },
  isActive: { type: Boolean, default: true }
}, { _id: false })

const AssessmentCriteriaSchema = new Schema<AssessmentCriteria>({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  weight: { type: Number, required: true, min: 0, max: 100 },
  type: { 
    type: String, 
    enum: ['continuous', 'summative', 'formative', 'diagnostic'],
    required: true 
  },
  rubric: [{
    level: { type: String, required: true, trim: true },
    score: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    indicators: [{ type: String, trim: true }]
  }],
  passThreshold: { type: Number, required: true, min: 0, max: 100 },
  excellenceThreshold: { type: Number, min: 0, max: 100 },
  isActive: { type: Boolean, default: true }
}, { _id: false })

// ============================================================================
// MAIN SUBJECT SCHEMA
// ============================================================================

export interface ISubject extends Omit<Subject, 'id'>, Document {
  _id: mongoose.Types.ObjectId
}

const SubjectSchema = new Schema<ISubject>({
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
    required: [true, 'Subject name is required'],
    trim: true,
    maxlength: [100, 'Subject name cannot exceed 100 characters'],
    index: 'text'
  },
  
  code: { 
    type: String, 
    required: [true, 'Subject code is required'],
    trim: true,
    uppercase: true,
    maxlength: [10, 'Subject code cannot exceed 10 characters'],
    index: true
  },
  
  shortName: { 
    type: String, 
    required: [true, 'Short name is required'],
    trim: true,
    maxlength: [20, 'Short name cannot exceed 20 characters']
  },
  
  description: { 
    type: String, 
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'] 
  },
  
  // Academic Classification
  category: { 
    type: String, 
    enum: {
      values: ['core', 'elective', 'optional', 'co_curricular', 'extra_curricular'],
      message: 'Invalid subject category'
    },
    required: [true, 'Subject category is required'],
    index: true
  },
  
  department: { 
    type: String, 
    required: [true, 'Department is required'],
    trim: true,
    enum: [
      'languages', 'mathematics', 'sciences', 'humanities', 'arts', 'technical', 
      'physical_education', 'religious_studies', 'computer_studies', 'other'
    ],
    index: true
  },
  
  level: { 
    type: String, 
    required: [true, 'Subject level is required'],
    enum: {
      values: ['kindergarten', 'primary', 'secondary', 'tertiary'],
      message: 'Invalid subject level'
    },
    index: true
  },
  
  grades: [{ 
    type: Number, 
    min: [1, 'Grade must be at least 1'],
    max: [12, 'Grade cannot exceed 12']
  }],
  
  // Curriculum and Standards
  curriculum: { 
    type: String, 
    required: [true, 'Curriculum is required'],
    enum: ['8-4-4', 'CBC', 'Cambridge', 'IB', 'American', 'other'],
    default: 'CBC'
  },
  
  syllabus: {
    title: { type: String, trim: true },
    version: { type: String, trim: true },
    effectiveDate: { type: Date },
    expiryDate: { type: Date },
    documentUrl: { type: String, trim: true },
    lastReviewed: { type: Date },
    reviewedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }
  },
  
  // Learning Objectives and Outcomes
  learningObjectives: [LearningObjectiveSchema],
  
  learningOutcomes: [{ 
    type: String, 
    required: true,
    trim: true 
  }],
  
  // Assessment and Evaluation
  assessmentCriteria: [AssessmentCriteriaSchema],
  
  gradingScale: {
    type: { 
      type: String, 
      enum: ['percentage', 'letter', 'points', 'rubric'],
      default: 'percentage' 
    },
    passingGrade: { type: Number, required: true, min: 0, max: 100 },
    excellentGrade: { type: Number, min: 0, max: 100 },
    scale: [{
      grade: { type: String, required: true, trim: true },
      minScore: { type: Number, required: true, min: 0, max: 100 },
      maxScore: { type: Number, required: true, min: 0, max: 100 },
      description: { type: String, trim: true },
      points: { type: Number, min: 0 }
    }]
  },
  
  // Time Allocation
  hoursPerWeek: { 
    type: Number, 
    required: [true, 'Hours per week is required'],
    min: [1, 'Hours per week must be at least 1'],
    max: [20, 'Hours per week cannot exceed 20']
  },
  
  totalHours: { 
    type: Number, 
    min: [1, 'Total hours must be at least 1']
  },
  
  periods: {
    perWeek: { type: Number, required: true, min: 1, max: 15 },
    duration: { type: Number, required: true, min: 30, max: 120 }, // in minutes
    breakBetween: { type: Number, min: 0, max: 30 } // minutes
  },
  
  // Prerequisites and Dependencies
  prerequisites: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subject'
  }],
  
  corequisites: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subject'
  }],
  
  // Resources and Materials
  resources: {
    textbooks: [{
      title: { type: String, required: true, trim: true },
      author: { type: String, trim: true },
      publisher: { type: String, trim: true },
      isbn: { type: String, trim: true },
      edition: { type: String, trim: true },
      year: { type: Number },
      price: { type: Number, min: 0 },
      required: { type: Boolean, default: true },
      digitalVersion: { type: Boolean, default: false },
      url: { type: String, trim: true }
    }],
    
    references: [{
      title: { type: String, required: true, trim: true },
      type: { 
        type: String, 
        enum: ['book', 'article', 'website', 'video', 'software', 'other'],
        default: 'book' 
      },
      author: { type: String, trim: true },
      url: { type: String, trim: true },
      description: { type: String, trim: true }
    }],
    
    equipment: [{
      name: { type: String, required: true, trim: true },
      quantity: { type: Number, required: true, min: 1 },
      description: { type: String, trim: true },
      required: { type: Boolean, default: true },
      alternatives: [{ type: String, trim: true }]
    }],
    
    software: [{
      name: { type: String, required: true, trim: true },
      version: { type: String, trim: true },
      license: { 
        type: String, 
        enum: ['free', 'paid', 'educational', 'trial'],
        default: 'free' 
      },
      url: { type: String, trim: true },
      description: { type: String, trim: true }
    }]
  },
  
  // Subject Coordination
  coordinator: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Teacher'
  },
  
  teachers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Teacher'
  }],
  
  // Classes offering this subject
  classes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Class'
  }],
  
  // Subject Performance and Analytics
  statistics: {
    totalStudents: { type: Number, default: 0, min: 0 },
    averageGrade: { type: Number, min: 0, max: 100 },
    passRate: { type: Number, min: 0, max: 100 },
    failureRate: { type: Number, min: 0, max: 100 },
    excellenceRate: { type: Number, min: 0, max: 100 },
    attendanceRate: { type: Number, min: 0, max: 100 },
    lastUpdated: { type: Date, default: Date.now }
  },
  
  // Examination and Assessment Schedule
  examSchedule: [{
    examType: { 
      type: String, 
      enum: ['cat', 'midterm', 'endterm', 'mock', 'national'],
      required: true 
    },
    term: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true, min: 30 }, // in minutes
    totalMarks: { type: Number, required: true, min: 1 },
    passingMarks: { type: Number, required: true, min: 0 },
    venue: { type: String, trim: true },
    invigilators: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Teacher'
    }],
    status: { 
      type: String, 
      enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
      default: 'scheduled' 
    }
  }],
  
  // Subject Settings
  settings: {
    allowOnlineSubmissions: { type: Boolean, default: false },
    requireAttendance: { type: Boolean, default: true },
    allowMakeupExams: { type: Boolean, default: true },
    gradingMethod: { 
      type: String, 
      enum: ['absolute', 'relative', 'criterion'],
      default: 'absolute' 
    },
    notifyParents: { type: Boolean, default: true },
    publishResults: { type: Boolean, default: true },
    allowPeerAssessment: { type: Boolean, default: false }
  },
  
  // Status and Management
  status: { 
    type: String, 
    enum: {
      values: ['active', 'inactive', 'archived', 'under_review'],
      message: 'Invalid subject status'
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
  
  // Academic Year
  academicYear: { 
    type: String, 
    required: [true, 'Academic year is required'],
    trim: true,
    index: true 
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
  collection: 'subjects',
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
SubjectSchema.index({ schoolId: 1, code: 1, academicYear: 1 }, { unique: true })
SubjectSchema.index({ schoolId: 1, name: 1, academicYear: 1 }, { unique: true })
SubjectSchema.index({ schoolId: 1, category: 1, status: 1 })
SubjectSchema.index({ schoolId: 1, department: 1, level: 1 })

// Teacher and class assignment indexes
SubjectSchema.index({ schoolId: 1, coordinator: 1 })
SubjectSchema.index({ schoolId: 1, teachers: 1 })
SubjectSchema.index({ schoolId: 1, classes: 1 })

// Grade and curriculum indexes
SubjectSchema.index({ schoolId: 1, grades: 1 })
SubjectSchema.index({ schoolId: 1, curriculum: 1 })

// Performance indexes
SubjectSchema.index({ schoolId: 1, 'statistics.averageGrade': -1 })

// Search indexes
SubjectSchema.index({ 
  schoolId: 1, 
  name: 'text', 
  code: 'text',
  shortName: 'text' 
})

// ============================================================================
// VIRTUAL FIELDS
// ============================================================================

SubjectSchema.virtual('id').get(function(this: ISubject) {
  return this._id.toHexString()
})

SubjectSchema.virtual('totalPeriods').get(function(this: ISubject) {
  return this.periods.perWeek
})

SubjectSchema.virtual('weeklyMinutes').get(function(this: ISubject) {
  return this.periods.perWeek * this.periods.duration
})

SubjectSchema.virtual('isCore').get(function(this: ISubject) {
  return this.category === 'core'
})

SubjectSchema.virtual('isElective').get(function(this: ISubject) {
  return this.category === 'elective'
})

SubjectSchema.virtual('isActive').get(function(this: ISubject) {
  return this.status === 'active' && !this.isDeleted
})

SubjectSchema.virtual('teacherCount').get(function(this: ISubject) {
  return this.teachers.length
})

SubjectSchema.virtual('classCount').get(function(this: ISubject) {
  return this.classes.length
})

// ============================================================================
// INSTANCE METHODS
// ============================================================================

SubjectSchema.methods.addTeacher = function(
  this: ISubject, 
  teacherId: mongoose.Types.ObjectId
): Promise<ISubject> {
  if (!this.teachers.includes(teacherId)) {
    this.teachers.push(teacherId)
  }
  return this.save()
}

SubjectSchema.methods.removeTeacher = function(
  this: ISubject, 
  teacherId: mongoose.Types.ObjectId
): Promise<ISubject> {
  this.teachers = this.teachers.filter(
    id => id.toString() !== teacherId.toString()
  )
  return this.save()
}

SubjectSchema.methods.addClass = function(
  this: ISubject, 
  classId: mongoose.Types.ObjectId
): Promise<ISubject> {
  if (!this.classes.includes(classId)) {
    this.classes.push(classId)
  }
  return this.save()
}

SubjectSchema.methods.updateStatistics = function(
  this: ISubject, 
  stats: Partial<typeof this.statistics>
): Promise<ISubject> {
  this.statistics = {
    ...this.statistics,
    ...stats,
    lastUpdated: new Date()
  }
  
  return this.save()
}

SubjectSchema.methods.addExamSchedule = function(
  this: ISubject, 
  examData: any
): Promise<ISubject> {
  this.examSchedule.push(examData)
  return this.save()
}

// ============================================================================
// STATIC METHODS
// ============================================================================

SubjectSchema.statics.findBySchool = function(schoolId: mongoose.Types.ObjectId) {
  return this.find({ 
    schoolId,
    isDeleted: false 
  }).sort({ department: 1, name: 1 })
}

SubjectSchema.statics.findByCategory = function(
  schoolId: mongoose.Types.ObjectId, 
  category: string
) {
  return this.find({ 
    schoolId,
    category,
    status: 'active',
    isDeleted: false 
  }).sort({ name: 1 })
}

SubjectSchema.statics.findByDepartment = function(
  schoolId: mongoose.Types.ObjectId, 
  department: string
) {
  return this.find({ 
    schoolId,
    department,
    status: 'active',
    isDeleted: false 
  }).sort({ name: 1 })
}

SubjectSchema.statics.findByGrade = function(
  schoolId: mongoose.Types.ObjectId, 
  grade: number
) {
  return this.find({ 
    schoolId,
    grades: grade,
    status: 'active',
    isDeleted: false 
  }).sort({ category: 1, name: 1 })
}

SubjectSchema.statics.findByTeacher = function(
  schoolId: mongoose.Types.ObjectId, 
  teacherId: mongoose.Types.ObjectId
) {
  return this.find({ 
    schoolId,
    $or: [
      { coordinator: teacherId },
      { teachers: teacherId }
    ],
    status: 'active',
    isDeleted: false 
  })
}

SubjectSchema.statics.getSchoolStats = function(schoolId: mongoose.Types.ObjectId) {
  return this.aggregate([
    { $match: { schoolId, isDeleted: false } },
    {
      $group: {
        _id: null,
        totalSubjects: { $sum: 1 },
        activeSubjects: { 
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } 
        },
        coreSubjects: { 
          $sum: { $cond: [{ $eq: ['$category', 'core'] }, 1, 0] } 
        },
        electiveSubjects: { 
          $sum: { $cond: [{ $eq: ['$category', 'elective'] }, 1, 0] } 
        },
        averageHoursPerWeek: { $avg: '$hoursPerWeek' },
        totalStudents: { $sum: '$statistics.totalStudents' },
        averagePassRate: { $avg: '$statistics.passRate' }
      }
    }
  ])
}

// ============================================================================
// MIDDLEWARE HOOKS
// ============================================================================

// Pre-save middleware
SubjectSchema.pre('save', function(next) {
  // Ensure code is uppercase
  if (this.code) {
    this.code = this.code.toUpperCase()
  }
  
  // Calculate total hours if not provided
  if (!this.totalHours && this.hoursPerWeek) {
    // Assume 40 weeks per academic year
    this.totalHours = this.hoursPerWeek * 40
  }
  
  // Validate grading scale
  if (this.gradingScale && this.gradingScale.scale) {
    this.gradingScale.scale.sort((a, b) => b.minScore - a.minScore)
  }
  
  next()
})

// Post-save middleware
SubjectSchema.post('save', function(doc) {
  if (doc.wasNew) {
    // Update school statistics
    mongoose.model('School').updateOne(
      { _id: doc.schoolId },
      { 
        $inc: { 'stats.totalSubjects': 1 },
        $set: { 'stats.lastActivityAt': new Date() }
      }
    ).exec()
  }
})

// ============================================================================
// MODEL EXPORT
// ============================================================================

export interface ISubjectModel extends Model<ISubject> {
  findBySchool(schoolId: mongoose.Types.ObjectId): Promise<ISubject[]>
  findByCategory(schoolId: mongoose.Types.ObjectId, category: string): Promise<ISubject[]>
  findByDepartment(schoolId: mongoose.Types.ObjectId, department: string): Promise<ISubject[]>
  findByGrade(schoolId: mongoose.Types.ObjectId, grade: number): Promise<ISubject[]>
  findByTeacher(schoolId: mongoose.Types.ObjectId, teacherId: mongoose.Types.ObjectId): Promise<ISubject[]>
  getSchoolStats(schoolId: mongoose.Types.ObjectId): Promise<any[]>
}

// Prevent re-compilation in development
const SubjectModel = (mongoose.models.Subject as ISubjectModel) || 
                    mongoose.model<ISubject, ISubjectModel>('Subject', SubjectSchema)

export default SubjectModel