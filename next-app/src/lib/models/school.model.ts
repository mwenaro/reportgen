import mongoose, { Schema, Document, Model } from 'mongoose'
import { School, SchoolSettings, SubscriptionPlan, ContactInfo, Address } from '@/types/entities'

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

const SchoolSettingsSchema = new Schema<SchoolSettings>({
  academicYear: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    current: { type: String, required: true }
  },
  termSystem: { 
    type: String, 
    enum: ['trimester', 'semester', 'quarterly'], 
    required: true, 
    default: 'trimester' 
  },
  gradingSystem: {
    scale: { type: String, required: true, default: 'A-F' },
    passingGrade: { type: Number, required: true, default: 50 },
    gradePoints: {
      type: Map,
      of: Number,
      default: new Map([
        ['A', 12], ['A-', 11], ['B+', 10], ['B', 9], ['B-', 8],
        ['C+', 7], ['C', 6], ['C-', 5], ['D+', 4], ['D', 3], ['D-', 2], ['E', 1]
      ])
    }
  },
  currency: { type: String, required: true, default: 'KES' },
  timezone: { type: String, required: true, default: 'Africa/Nairobi' },
  language: { type: String, required: true, default: 'en' },
  logo: { type: String },
  theme: {
    primaryColor: { type: String, default: '#0066CC' },
    secondaryColor: { type: String, default: '#FF6B35' },
    accentColor: { type: String, default: '#4CAF50' }
  },
  features: {
    examManagement: { type: Boolean, default: true },
    reportGeneration: { type: Boolean, default: true },
    parentPortal: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    onlineAdmissions: { type: Boolean, default: false },
    feeManagement: { type: Boolean, default: true },
    libraryManagement: { type: Boolean, default: false },
    transportManagement: { type: Boolean, default: false }
  },
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: true }
  }
}, { _id: false })

const SubscriptionPlanSchema = new Schema<SubscriptionPlan>({
  type: { 
    type: String, 
    enum: ['free', 'basic', 'premium', 'enterprise'], 
    required: true, 
    default: 'free' 
  },
  status: { 
    type: String, 
    enum: ['active', 'suspended', 'cancelled', 'expired'], 
    required: true, 
    default: 'active' 
  },
  startDate: { type: Date, required: true, default: Date.now },
  expiresAt: { type: Date, required: true },
  maxStudents: { type: Number, required: true, default: 100 },
  maxTeachers: { type: Number, required: true, default: 10 },
  maxAdmins: { type: Number, required: true, default: 2 },
  features: [{
    name: { type: String, required: true },
    enabled: { type: Boolean, required: true, default: true },
    limit: { type: Number }
  }],
  billing: {
    amount: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, default: 'KES' },
    interval: { type: String, enum: ['monthly', 'yearly', 'lifetime'], default: 'yearly' },
    nextBillingDate: { type: Date },
    paymentMethod: { type: String },
    billingAddress: AddressSchema
  },
  trial: {
    isActive: { type: Boolean, default: false },
    startDate: { type: Date },
    endDate: { type: Date },
    daysRemaining: { type: Number, default: 0 }
  }
}, { _id: false })

// ============================================================================
// MAIN SCHOOL SCHEMA
// ============================================================================

export interface ISchool extends Omit<School, 'id'>, Document {
  _id: mongoose.Types.ObjectId
}

const SchoolSchema = new Schema<ISchool>({
  name: { 
    type: String, 
    required: [true, 'School name is required'],
    trim: true,
    maxlength: [100, 'School name cannot exceed 100 characters'],
    index: 'text'
  },
  
  subdomain: { 
    type: String, 
    required: [true, 'Subdomain is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens'],
    minlength: [3, 'Subdomain must be at least 3 characters'],
    maxlength: [50, 'Subdomain cannot exceed 50 characters'],
    index: true
  },
  
  code: { 
    type: String, 
    required: [true, 'School code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    minlength: [3, 'School code must be at least 3 characters'],
    maxlength: [10, 'School code cannot exceed 10 characters'],
    index: true
  },
  
  type: { 
    type: String, 
    enum: {
      values: ['primary', 'secondary', 'mixed', 'university', 'college', 'kindergarten'],
      message: 'Invalid school type'
    },
    required: [true, 'School type is required'],
    index: true
  },
  
  level: { 
    type: String, 
    enum: {
      values: ['public', 'private', 'international', 'religious'],
      message: 'Invalid school level'
    },
    required: [true, 'School level is required']
  },
  
  address: { 
    type: AddressSchema, 
    required: [true, 'School address is required'] 
  },
  
  contact: { 
    type: ContactInfoSchema, 
    required: [true, 'School contact information is required'] 
  },
  
  settings: { 
    type: SchoolSettingsSchema, 
    required: true, 
    default: () => ({}) 
  },
  
  subscription: { 
    type: SubscriptionPlanSchema, 
    required: true,
    default: () => ({
      type: 'free',
      status: 'active',
      startDate: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      maxStudents: 100,
      maxTeachers: 10,
      maxAdmins: 2
    })
  },
  
  // Performance metrics
  stats: {
    totalStudents: { type: Number, default: 0, min: 0 },
    totalTeachers: { type: Number, default: 0, min: 0 },
    totalClasses: { type: Number, default: 0, min: 0 },
    totalSubjects: { type: Number, default: 0, min: 0 },
    lastActivityAt: { type: Date, default: Date.now },
    storageUsed: { type: Number, default: 0, min: 0 }, // in MB
    bandwidthUsed: { type: Number, default: 0, min: 0 } // in GB per month
  },
  
  // System fields
  isActive: { type: Boolean, default: true, index: true },
  isVerified: { type: Boolean, default: false },
  verifiedAt: { type: Date },
  suspendedAt: { type: Date },
  suspensionReason: { type: String },
  
  // Audit fields
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
  isDeleted: { type: Boolean, default: false, index: true }

}, {
  timestamps: true,
  collection: 'schools',
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
// INDEXES FOR PERFORMANCE
// ============================================================================

// Compound indexes for common queries
SchoolSchema.index({ isActive: 1, isDeleted: 1 })
SchoolSchema.index({ subscription: { status: 1, expiresAt: 1 } })
SchoolSchema.index({ createdAt: -1, isActive: 1 })
SchoolSchema.index({ 'stats.lastActivityAt': -1 })

// Text index for search functionality
SchoolSchema.index({ 
  name: 'text', 
  code: 'text', 
  subdomain: 'text',
  'address.city': 'text',
  'address.state': 'text'
})

// Geospatial index for location-based queries
SchoolSchema.index({ 'address.coordinates': '2dsphere' })

// ============================================================================
// VIRTUAL FIELDS
// ============================================================================

SchoolSchema.virtual('id').get(function(this: ISchool) {
  return this._id.toHexString()
})

SchoolSchema.virtual('url').get(function(this: ISchool) {
  return `https://${this.subdomain}.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
})

SchoolSchema.virtual('isTrialActive').get(function(this: ISchool) {
  return this.subscription.trial.isActive && 
         this.subscription.trial.endDate > new Date()
})

SchoolSchema.virtual('daysUntilExpiry').get(function(this: ISchool) {
  const now = new Date()
  const expiry = this.subscription.expiresAt
  const diffTime = expiry.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

SchoolSchema.virtual('storageUsagePercentage').get(function(this: ISchool) {
  const maxStorage = this.subscription.features.find(f => f.name === 'storage')?.limit || 1000 // 1GB default
  return (this.stats.storageUsed / maxStorage) * 100
})

// ============================================================================
// INSTANCE METHODS
// ============================================================================

SchoolSchema.methods.isFeatureEnabled = function(this: ISchool, featureName: string): boolean {
  return this.settings.features[featureName as keyof typeof this.settings.features] === true
}

SchoolSchema.methods.canAddStudents = function(this: ISchool, count: number = 1): boolean {
  return (this.stats.totalStudents + count) <= this.subscription.maxStudents
}

SchoolSchema.methods.canAddTeachers = function(this: ISchool, count: number = 1): boolean {
  return (this.stats.totalTeachers + count) <= this.subscription.maxTeachers
}

SchoolSchema.methods.updateLastActivity = function(this: ISchool): Promise<ISchool> {
  this.stats.lastActivityAt = new Date()
  return this.save()
}

SchoolSchema.methods.suspend = function(this: ISchool, reason: string, suspendedBy: mongoose.Types.ObjectId): Promise<ISchool> {
  this.isActive = false
  this.suspendedAt = new Date()
  this.suspensionReason = reason
  this.updatedBy = suspendedBy
  return this.save()
}

SchoolSchema.methods.activate = function(this: ISchool, activatedBy: mongoose.Types.ObjectId): Promise<ISchool> {
  this.isActive = true
  this.suspendedAt = undefined
  this.suspensionReason = undefined
  this.updatedBy = activatedBy
  return this.save()
}

// ============================================================================
// STATIC METHODS
// ============================================================================

SchoolSchema.statics.findBySubdomain = function(subdomain: string) {
  return this.findOne({ 
    subdomain: subdomain.toLowerCase(), 
    isActive: true, 
    isDeleted: false 
  })
}

SchoolSchema.statics.findByCode = function(code: string) {
  return this.findOne({ 
    code: code.toUpperCase(), 
    isActive: true, 
    isDeleted: false 
  })
}

SchoolSchema.statics.findActive = function() {
  return this.find({ 
    isActive: true, 
    isDeleted: false 
  }).sort({ createdAt: -1 })
}

SchoolSchema.statics.findExpiring = function(days: number = 30) {
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + days)
  
  return this.find({
    isActive: true,
    isDeleted: false,
    'subscription.expiresAt': { $lte: expiryDate },
    'subscription.status': 'active'
  }).sort({ 'subscription.expiresAt': 1 })
}

SchoolSchema.statics.getUsageStats = function() {
  return this.aggregate([
    { $match: { isActive: true, isDeleted: false } },
    {
      $group: {
        _id: null,
        totalSchools: { $sum: 1 },
        totalStudents: { $sum: '$stats.totalStudents' },
        totalTeachers: { $sum: '$stats.totalTeachers' },
        totalClasses: { $sum: '$stats.totalClasses' },
        averageStudentsPerSchool: { $avg: '$stats.totalStudents' },
        totalStorageUsed: { $sum: '$stats.storageUsed' },
        subscriptionBreakdown: {
          $push: '$subscription.type'
        }
      }
    }
  ])
}

// ============================================================================
// MIDDLEWARE HOOKS
// ============================================================================

// Pre-save middleware
SchoolSchema.pre('save', function(next) {
  // Generate school code if not provided
  if (!this.code && this.name) {
    this.code = this.name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 6)
    
    // Add random suffix if code is too short
    if (this.code.length < 3) {
      this.code += Math.random().toString(36).substring(2, 5).toUpperCase()
    }
  }
  
  // Ensure subdomain is URL-safe
  if (this.subdomain) {
    this.subdomain = this.subdomain
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .substring(0, 50)
  }
  
  // Set expiry date for new subscriptions
  if (this.isNew && !this.subscription.expiresAt) {
    const expiryDate = new Date()
    expiryDate.setFullYear(expiryDate.getFullYear() + 1) // 1 year from now
    this.subscription.expiresAt = expiryDate
  }
  
  next()
})

// Post-save middleware
SchoolSchema.post('save', function(doc) {
  // Log school creation/updates for auditing
  if (this.wasNew) {
    console.log(`New school created: ${doc.name} (${doc.subdomain})`)
  }
})

// Pre-delete middleware (for soft delete)
SchoolSchema.pre('deleteOne', { document: true, query: false }, function(next) {
  this.isDeleted = true
  this.deletedAt = new Date()
  next()
})

// ============================================================================
// MODEL EXPORT
// ============================================================================

export interface ISchoolModel extends Model<ISchool> {
  findBySubdomain(subdomain: string): Promise<ISchool | null>
  findByCode(code: string): Promise<ISchool | null>
  findActive(): Promise<ISchool[]>
  findExpiring(days?: number): Promise<ISchool[]>
  getUsageStats(): Promise<any[]>
}

// Prevent re-compilation in development
const SchoolModel = (mongoose.models.School as ISchoolModel) || 
                   mongoose.model<ISchool, ISchoolModel>('School', SchoolSchema)

export default SchoolModel