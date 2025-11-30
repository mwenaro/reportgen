import mongoose, { Schema, Document, Model } from 'mongoose'
import { Exam, ExamConfig, ExamStatistics, Mark, GradeDistribution } from '@/types/academics'

// ============================================================================
// SUBDOCUMENTS & EMBEDDED SCHEMAS
// ============================================================================

const ExamConfigSchema = new Schema<ExamConfig>({
  allowLateSubmission: { type: Boolean, default: false },
  lateSubmissionPenalty: { type: Number, default: 0, min: 0, max: 100 },
  showResultsImmediately: { type: Boolean, default: false },
  allowReview: { type: Boolean, default: true },
  randomizeQuestions: { type: Boolean, default: false },
  preventCheating: { type: Boolean, default: true },
  requireCamera: { type: Boolean, default: false },
  timeWarnings: [{ type: Number, min: 1 }] // minutes before end
}, { _id: false })

const GradeDistributionSchema = new Schema<GradeDistribution>({
  grade: { type: String, required: true, trim: true },
  count: { type: Number, required: true, min: 0 },
  percentage: { type: Number, required: true, min: 0, max: 100 }
}, { _id: false })

const ExamStatisticsSchema = new Schema<ExamStatistics>({
  totalStudents: { type: Number, default: 0, min: 0 },
  submitted: { type: Number, default: 0, min: 0 },
  pending: { type: Number, default: 0, min: 0 },
  average: { type: Number, min: 0, max: 100 },
  highest: { type: Number, min: 0, max: 100 },
  lowest: { type: Number, min: 0, max: 100 },
  passRate: { type: Number, min: 0, max: 100 },
  distribution: [GradeDistributionSchema]
}, { _id: false })

const MarkSchema = new Schema<Mark>({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student',
    required: true 
  },
  examId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Exam',
    required: true 
  },
  subjectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subject',
    required: true 
  },
  classId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Class',
    required: true 
  },
  marksObtained: { 
    type: Number, 
    required: true,
    min: 0 
  },
  totalMarks: { 
    type: Number, 
    required: true,
    min: 1 
  },
  percentage: { 
    type: Number, 
    min: 0, 
    max: 100 
  },
  grade: { 
    type: String, 
    required: true,
    trim: true 
  },
  gradePoints: { 
    type: Number, 
    min: 0 
  },
  position: { 
    type: Number, 
    min: 1 
  },
  remarks: { 
    type: String, 
    trim: true 
  },
  submittedAt: { type: Date },
  gradedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  gradedAt: { 
    type: Date, 
    default: Date.now 
  },
  isAbsent: { 
    type: Boolean, 
    default: false 
  },
  isCheating: { 
    type: Boolean, 
    default: false 
  },
  status: { 
    type: String, 
    enum: ['draft', 'submitted', 'graded', 'published'],
    default: 'draft' 
  },
  breakdown: [{
    section: { type: String, required: true, trim: true },
    marksObtained: { type: Number, required: true, min: 0 },
    totalMarks: { type: Number, required: true, min: 1 },
    percentage: { type: Number, min: 0, max: 100 }
  }]
}, { timestamps: true })

// ============================================================================
// MAIN EXAM SCHEMA
// ============================================================================

export interface IExam extends Omit<Exam, 'id'>, Document {
  _id: mongoose.Types.ObjectId
}

const ExamSchema = new Schema<IExam>({
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
    required: [true, 'Exam name is required'],
    trim: true,
    maxlength: [100, 'Exam name cannot exceed 100 characters'],
    index: 'text'
  },
  
  code: { 
    type: String, 
    trim: true,
    uppercase: true,
    maxlength: [20, 'Exam code cannot exceed 20 characters']
  },
  
  description: { 
    type: String, 
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'] 
  },
  
  // Exam Type and Classification
  type: { 
    type: String,
    required: [true, 'Exam type is required'],
    enum: {
      values: ['cat', 'midterm', 'endterm', 'mock', 'national', 'assignment', 'project', 'practical'],
      message: 'Invalid exam type'
    },
    index: true
  },
  
  category: { 
    type: String,
    enum: ['continuous_assessment', 'mid_term', 'end_term', 'final', 'mock'],
    required: true,
    index: true
  },
  
  weight: { 
    type: Number, 
    min: [0, 'Weight cannot be negative'],
    max: [100, 'Weight cannot exceed 100'],
    default: 0
  },
  
  // Subject and Classes
  subjectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subject',
    required: [true, 'Subject is required'],
    index: true 
  },
  
  subjectName: { 
    type: String, 
    required: true,
    trim: true 
  },
  
  classIds: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Class',
    required: true 
  }],
  
  // Academic Period
  academicYear: { 
    type: String, 
    required: [true, 'Academic year is required'],
    trim: true,
    index: true 
  },
  
  term: { 
    type: String, 
    required: [true, 'Term is required'],
    trim: true,
    index: true 
  },
  
  // Scheduling
  date: { 
    type: Date, 
    required: [true, 'Exam date is required'],
    index: true 
  },
  
  startTime: { 
    type: String, 
    required: [true, 'Start time is required'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
  },
  
  endTime: { 
    type: String, 
    required: [true, 'End time is required'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
  },
  
  duration: { 
    type: Number, 
    required: [true, 'Duration is required'],
    min: [30, 'Duration must be at least 30 minutes'],
    max: [480, 'Duration cannot exceed 8 hours']
  },
  
  // Exam Venue and Logistics
  venue: { 
    type: String, 
    trim: true 
  },
  
  rooms: [{
    name: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    assigned: { type: Number, default: 0, min: 0 },
    invigilators: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Teacher'
    }]
  }],
  
  invigilators: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Teacher'
  }],
  
  // Marking and Grading
  totalMarks: { 
    type: Number, 
    required: [true, 'Total marks is required'],
    min: [1, 'Total marks must be at least 1'],
    max: [1000, 'Total marks cannot exceed 1000']
  },
  
  passingMarks: { 
    type: Number, 
    required: [true, 'Passing marks is required'],
    min: [0, 'Passing marks cannot be negative']
  },
  
  passingPercentage: { 
    type: Number, 
    min: [0, 'Passing percentage cannot be negative'],
    max: [100, 'Passing percentage cannot exceed 100']
  },
  
  gradingScheme: {
    type: { 
      type: String, 
      enum: ['percentage', 'letter', 'points'],
      default: 'percentage' 
    },
    scale: [{
      grade: { type: String, required: true, trim: true },
      minMark: { type: Number, required: true, min: 0 },
      maxMark: { type: Number, required: true, min: 0 },
      points: { type: Number, min: 0 },
      description: { type: String, trim: true }
    }]
  },
  
  // Instructions and Requirements
  instructions: { 
    type: String, 
    trim: true,
    maxlength: [2000, 'Instructions cannot exceed 2000 characters'] 
  },
  
  requirements: [{ 
    type: String, 
    trim: true 
  }],
  
  materialsAllowed: [{ 
    type: String, 
    trim: true 
  }],
  
  materialsNotAllowed: [{ 
    type: String, 
    trim: true 
  }],
  
  // Exam Configuration
  config: { 
    type: ExamConfigSchema,
    default: () => ({
      allowLateSubmission: false,
      lateSubmissionPenalty: 0,
      showResultsImmediately: false,
      allowReview: true,
      randomizeQuestions: false,
      preventCheating: true,
      requireCamera: false,
      timeWarnings: [30, 15, 5] // 30, 15, 5 minutes before end
    })
  },
  
  // Exam Content (for online exams)
  questions: [{
    number: { type: Number, required: true, min: 1 },
    type: { 
      type: String, 
      enum: ['multiple_choice', 'true_false', 'short_answer', 'essay', 'practical'],
      default: 'short_answer' 
    },
    question: { type: String, required: true, trim: true },
    options: [{ type: String, trim: true }], // for multiple choice
    correctAnswer: { type: String, trim: true },
    points: { type: Number, required: true, min: 0 },
    difficulty: { 
      type: String, 
      enum: ['easy', 'medium', 'hard'],
      default: 'medium' 
    },
    section: { type: String, trim: true },
    timeLimit: { type: Number, min: 1 }, // minutes per question
    attachments: [{ 
      type: String // URLs to files
    }]
  }],
  
  // Status and Workflow
  status: { 
    type: String, 
    enum: {
      values: ['draft', 'scheduled', 'in_progress', 'completed', 'cancelled', 'published'],
      message: 'Invalid exam status'
    },
    required: true,
    default: 'draft',
    index: true
  },
  
  publishedAt: { type: Date },
  
  resultsPublishedAt: { type: Date },
  
  // Statistics and Analytics
  statistics: { 
    type: ExamStatisticsSchema,
    default: () => ({
      totalStudents: 0,
      submitted: 0,
      pending: 0,
      distribution: []
    })
  },
  
  // Performance Analysis
  analysis: {
    difficultyLevel: { 
      type: String, 
      enum: ['very_easy', 'easy', 'moderate', 'difficult', 'very_difficult']
    },
    discriminationIndex: { type: Number, min: -1, max: 1 },
    reliability: { type: Number, min: 0, max: 1 },
    validity: { type: Number, min: 0, max: 1 },
    itemAnalysis: [{
      questionNumber: { type: Number, required: true },
      difficulty: { type: Number, min: 0, max: 1 },
      discrimination: { type: Number, min: -1, max: 1 },
      correctRate: { type: Number, min: 0, max: 100 }
    }]
  },
  
  // Moderation and Review
  moderation: {
    required: { type: Boolean, default: false },
    moderators: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Teacher'
    }],
    status: { 
      type: String, 
      enum: ['pending', 'in_review', 'approved', 'rejected'],
      default: 'pending' 
    },
    comments: [{
      moderator: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Teacher',
        required: true 
      },
      comment: { type: String, required: true, trim: true },
      category: { 
        type: String, 
        enum: ['content', 'difficulty', 'time', 'instructions', 'marking', 'other'],
        default: 'other' 
      },
      severity: { 
        type: String, 
        enum: ['info', 'warning', 'critical'],
        default: 'info' 
      },
      resolved: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    }],
    approvedAt: { type: Date },
    approvedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }
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
  collection: 'exams',
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
ExamSchema.index({ schoolId: 1, subjectId: 1, academicYear: 1, term: 1 })
ExamSchema.index({ schoolId: 1, date: 1, status: 1 })
ExamSchema.index({ schoolId: 1, type: 1, category: 1 })
ExamSchema.index({ schoolId: 1, classIds: 1 })

// Status and workflow indexes
ExamSchema.index({ status: 1, date: 1 })
ExamSchema.index({ schoolId: 1, publishedAt: -1 })

// Performance and analytics indexes
ExamSchema.index({ schoolId: 1, 'statistics.average': -1 })
ExamSchema.index({ schoolId: 1, 'statistics.passRate': -1 })

// Search indexes
ExamSchema.index({ 
  schoolId: 1, 
  name: 'text', 
  code: 'text',
  subjectName: 'text' 
})

// ============================================================================
// VIRTUAL FIELDS
// ============================================================================

ExamSchema.virtual('id').get(function(this: IExam) {
  return this._id.toHexString()
})

ExamSchema.virtual('isActive').get(function(this: IExam) {
  return ['scheduled', 'in_progress', 'published'].includes(this.status) && !this.isDeleted
})

ExamSchema.virtual('isCompleted').get(function(this: IExam) {
  return ['completed', 'published'].includes(this.status)
})

ExamSchema.virtual('isOngoing').get(function(this: IExam) {
  return this.status === 'in_progress'
})

ExamSchema.virtual('canEdit').get(function(this: IExam) {
  return ['draft', 'scheduled'].includes(this.status)
})

ExamSchema.virtual('durationHours').get(function(this: IExam) {
  return Math.round((this.duration / 60) * 100) / 100
})

ExamSchema.virtual('totalQuestions').get(function(this: IExam) {
  return this.questions.length
})

ExamSchema.virtual('submissionRate').get(function(this: IExam) {
  if (this.statistics.totalStudents === 0) return 0
  return Math.round((this.statistics.submitted / this.statistics.totalStudents) * 100)
})

// ============================================================================
// INSTANCE METHODS
// ============================================================================

ExamSchema.methods.updateStatistics = function(
  this: IExam,
  marks: any[]
): Promise<IExam> {
  if (marks.length === 0) {
    return this.save()
  }
  
  const totalStudents = marks.length
  const submitted = marks.filter(mark => mark.status === 'graded' || mark.status === 'published').length
  const pending = totalStudents - submitted
  
  const scores = marks.filter(mark => !mark.isAbsent).map(mark => mark.percentage || 0)
  const average = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0
  const highest = scores.length > 0 ? Math.max(...scores) : 0
  const lowest = scores.length > 0 ? Math.min(...scores) : 0
  const passRate = scores.length > 0 ? (scores.filter(score => score >= this.passingPercentage).length / scores.length) * 100 : 0
  
  // Calculate grade distribution
  const distribution: GradeDistribution[] = []
  const gradeMap = new Map<string, number>()
  
  marks.forEach(mark => {
    if (!mark.isAbsent && mark.grade) {
      gradeMap.set(mark.grade, (gradeMap.get(mark.grade) || 0) + 1)
    }
  })
  
  gradeMap.forEach((count, grade) => {
    distribution.push({
      grade,
      count,
      percentage: totalStudents > 0 ? (count / totalStudents) * 100 : 0
    })
  })
  
  this.statistics = {
    totalStudents,
    submitted,
    pending,
    average: Math.round(average * 100) / 100,
    highest,
    lowest,
    passRate: Math.round(passRate * 100) / 100,
    distribution
  }
  
  return this.save()
}

ExamSchema.methods.addQuestion = function(
  this: IExam,
  questionData: any
): Promise<IExam> {
  questionData.number = this.questions.length + 1
  this.questions.push(questionData)
  return this.save()
}

ExamSchema.methods.removeQuestion = function(
  this: IExam,
  questionNumber: number
): Promise<IExam> {
  this.questions = this.questions.filter(q => q.number !== questionNumber)
  
  // Renumber remaining questions
  this.questions.forEach((question, index) => {
    question.number = index + 1
  })
  
  return this.save()
}

ExamSchema.methods.publish = function(
  this: IExam,
  publishedBy: mongoose.Types.ObjectId
): Promise<IExam> {
  this.status = 'published'
  this.publishedAt = new Date()
  this.updatedBy = publishedBy
  return this.save()
}

ExamSchema.methods.publishResults = function(
  this: IExam,
  publishedBy: mongoose.Types.ObjectId
): Promise<IExam> {
  this.resultsPublishedAt = new Date()
  this.updatedBy = publishedBy
  return this.save()
}

// ============================================================================
// STATIC METHODS
// ============================================================================

ExamSchema.statics.findBySchool = function(schoolId: mongoose.Types.ObjectId) {
  return this.find({ 
    schoolId,
    isDeleted: false 
  }).sort({ date: -1, createdAt: -1 })
}

ExamSchema.statics.findBySubject = function(
  schoolId: mongoose.Types.ObjectId, 
  subjectId: mongoose.Types.ObjectId
) {
  return this.find({ 
    schoolId,
    subjectId,
    status: { $ne: 'draft' },
    isDeleted: false 
  }).sort({ date: -1 })
}

ExamSchema.statics.findByClass = function(
  schoolId: mongoose.Types.ObjectId, 
  classId: mongoose.Types.ObjectId
) {
  return this.find({ 
    schoolId,
    classIds: classId,
    status: { $ne: 'draft' },
    isDeleted: false 
  }).sort({ date: -1 })
}

ExamSchema.statics.findByDateRange = function(
  schoolId: mongoose.Types.ObjectId,
  startDate: Date,
  endDate: Date
) {
  return this.find({
    schoolId,
    date: { $gte: startDate, $lte: endDate },
    status: { $ne: 'draft' },
    isDeleted: false
  }).sort({ date: 1 })
}

ExamSchema.statics.findUpcoming = function(
  schoolId: mongoose.Types.ObjectId,
  days: number = 7
) {
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + days)
  
  return this.find({
    schoolId,
    date: { $gte: new Date(), $lte: endDate },
    status: 'scheduled',
    isDeleted: false
  }).sort({ date: 1 })
}

ExamSchema.statics.getSchoolStats = function(schoolId: mongoose.Types.ObjectId) {
  return this.aggregate([
    { $match: { schoolId, isDeleted: false } },
    {
      $group: {
        _id: null,
        totalExams: { $sum: 1 },
        publishedExams: { 
          $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } 
        },
        completedExams: { 
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } 
        },
        averagePassRate: { $avg: '$statistics.passRate' },
        averageScore: { $avg: '$statistics.average' },
        totalStudentsExamined: { $sum: '$statistics.totalStudents' }
      }
    }
  ])
}

// ============================================================================
// MIDDLEWARE HOOKS
// ============================================================================

// Pre-save middleware
ExamSchema.pre('save', function(next) {
  // Ensure code is uppercase if provided
  if (this.code) {
    this.code = this.code.toUpperCase()
  }
  
  // Calculate passing percentage if not provided
  if (!this.passingPercentage && this.passingMarks && this.totalMarks) {
    this.passingPercentage = Math.round((this.passingMarks / this.totalMarks) * 100)
  }
  
  // Validate date is not in the past for new exams
  if (this.isNew && this.date < new Date()) {
    return next(new Error('Exam date cannot be in the past'))
  }
  
  // Validate end time is after start time
  const startTime = new Date(`2000-01-01 ${this.startTime}`)
  const endTime = new Date(`2000-01-01 ${this.endTime}`)
  
  if (endTime <= startTime) {
    return next(new Error('End time must be after start time'))
  }
  
  next()
})

// Pre-save middleware for status transitions
ExamSchema.pre('save', function(next) {
  if (!this.isModified('status')) {
    return next()
  }
  
  const now = new Date()
  
  // Auto-transition to in_progress if exam is scheduled and date/time has passed
  if (this.status === 'scheduled' && this.date < now) {
    const examStartDateTime = new Date(`${this.date.toDateString()} ${this.startTime}`)
    const examEndDateTime = new Date(`${this.date.toDateString()} ${this.endTime}`)
    
    if (now >= examStartDateTime && now <= examEndDateTime) {
      this.status = 'in_progress'
    } else if (now > examEndDateTime) {
      this.status = 'completed'
    }
  }
  
  next()
})

// Post-save middleware
ExamSchema.post('save', function(doc) {
  if (doc.wasNew) {
    // Could trigger notifications to teachers/students
    console.log(`New exam created: ${doc.name} for ${doc.subjectName}`)
  }
})

// ============================================================================
// MODEL EXPORT
// ============================================================================

export interface IExamModel extends Model<IExam> {
  findBySchool(schoolId: mongoose.Types.ObjectId): Promise<IExam[]>
  findBySubject(schoolId: mongoose.Types.ObjectId, subjectId: mongoose.Types.ObjectId): Promise<IExam[]>
  findByClass(schoolId: mongoose.Types.ObjectId, classId: mongoose.Types.ObjectId): Promise<IExam[]>
  findByDateRange(schoolId: mongoose.Types.ObjectId, startDate: Date, endDate: Date): Promise<IExam[]>
  findUpcoming(schoolId: mongoose.Types.ObjectId, days?: number): Promise<IExam[]>
  getSchoolStats(schoolId: mongoose.Types.ObjectId): Promise<any[]>
}

// Prevent re-compilation in development
const ExamModel = (mongoose.models.Exam as IExamModel) || 
                 mongoose.model<IExam, IExamModel>('Exam', ExamSchema)

export default ExamModel

// ============================================================================
// MARK MODEL (Related to Exam)
// ============================================================================

export interface IMark extends Omit<Mark, 'id'>, Document {
  _id: mongoose.Types.ObjectId
}

// Mark model with its own collection for better performance
const MarkModel = (mongoose.models.Mark as Model<IMark>) || 
                 mongoose.model<IMark>('Mark', MarkSchema)

export { MarkModel }