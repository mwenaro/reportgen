import mongoose, { Schema, Document, Model } from 'mongoose'
import bcrypt from 'bcryptjs'
import { User, UserProfile, UserPermissions, UserPreferences } from '@/types/auth'
import { Address } from '@/types/entities'

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

const UserProfileSchema = new Schema<UserProfile>({
  firstName: { type: String, required: true, trim: true, maxlength: 50 },
  lastName: { type: String, required: true, trim: true, maxlength: 50 },
  middleName: { type: String, trim: true, maxlength: 50 },
  dateOfBirth: { type: Date },
  gender: { 
    type: String, 
    enum: ['male', 'female', 'other'],
    lowercase: true 
  },
  nationality: { type: String, trim: true, default: 'Kenyan' },
  phone: { 
    type: String, 
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number']
  },
  alternativePhone: { type: String, trim: true },
  address: AddressSchema,
  profileImage: { type: String, trim: true },
  bio: { type: String, trim: true, maxlength: 500 },
  website: { type: String, trim: true },
  socialLinks: {
    linkedin: { type: String, trim: true },
    twitter: { type: String, trim: true },
    facebook: { type: String, trim: true }
  }
}, { _id: false })

const UserPermissionsSchema = new Schema<UserPermissions>({
  schools: [{
    schoolId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'School',
      required: true 
    },
    role: { 
      type: String,
      enum: ['super_admin', 'school_admin', 'teacher', 'student', 'parent', 'accountant', 'librarian', 'nurse'],
      required: true 
    },
    permissions: [{ 
      type: String, 
      trim: true 
    }],
    isActive: { type: Boolean, default: true },
    assignedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    assignedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date }
  }],
  globalPermissions: [{ 
    type: String, 
    trim: true 
  }],
  isSuperAdmin: { type: Boolean, default: false }
}, { _id: false })

const UserPreferencesSchema = new Schema<UserPreferences>({
  language: { type: String, default: 'en' },
  theme: { 
    type: String, 
    enum: ['light', 'dark', 'auto'],
    default: 'light' 
  },
  timezone: { type: String, default: 'Africa/Nairobi' },
  dateFormat: { 
    type: String, 
    enum: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
    default: 'DD/MM/YYYY' 
  },
  timeFormat: { 
    type: String, 
    enum: ['12h', '24h'],
    default: '24h' 
  },
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: true },
    inApp: { type: Boolean, default: true },
    desktop: { type: Boolean, default: false }
  },
  privacy: {
    showProfile: { type: Boolean, default: true },
    showEmail: { type: Boolean, default: false },
    showPhone: { type: Boolean, default: false },
    allowMessaging: { type: Boolean, default: true },
    shareData: { type: Boolean, default: false }
  }
}, { _id: false })

// ============================================================================
// MAIN USER SCHEMA
// ============================================================================

export interface IUser extends Omit<User, 'id'>, Document {
  _id: mongoose.Types.ObjectId
  comparePassword(password: string): Promise<boolean>
  generateAuthToken(): string
  hasPermission(permission: string, schoolId?: mongoose.Types.ObjectId): boolean
  hasRole(role: string, schoolId?: mongoose.Types.ObjectId): boolean
  getSchoolRole(schoolId: mongoose.Types.ObjectId): string | null
}

const UserSchema = new Schema<IUser>({
  // Authentication Fields
  username: { 
    type: String, 
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [50, 'Username cannot exceed 50 characters'],
    match: [/^[a-zA-Z0-9._-]+$/, 'Username can only contain letters, numbers, dots, underscores, and hyphens'],
    index: true
  },
  
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    index: true
  },
  
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  
  // Profile Information
  profile: { 
    type: UserProfileSchema, 
    required: true 
  },
  
  // Role and Permissions
  permissions: { 
    type: UserPermissionsSchema, 
    required: true,
    default: () => ({
      schools: [],
      globalPermissions: [],
      isSuperAdmin: false
    })
  },
  
  // User Preferences
  preferences: { 
    type: UserPreferencesSchema, 
    required: true,
    default: () => ({})
  },
  
  // Account Status and Security
  isActive: { 
    type: Boolean, 
    default: true,
    index: true 
  },
  
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  
  verificationToken: { 
    type: String, 
    sparse: true 
  },
  
  verifiedAt: { type: Date },
  
  emailChangeToken: { 
    type: String, 
    sparse: true 
  },
  
  newEmail: { 
    type: String, 
    trim: true,
    lowercase: true 
  },
  
  // Password Reset
  resetPasswordToken: { 
    type: String, 
    sparse: true 
  },
  
  resetPasswordExpires: { type: Date },
  
  // Two-Factor Authentication
  twoFactorEnabled: { 
    type: Boolean, 
    default: false 
  },
  
  twoFactorSecret: { type: String },
  
  backupCodes: [{ 
    type: String 
  }],
  
  // Login Tracking
  lastLoginAt: { type: Date },
  
  lastLoginIP: { type: String },
  
  loginAttempts: { 
    type: Number, 
    default: 0,
    max: 10 
  },
  
  lockUntil: { type: Date },
  
  // Session Management
  sessions: [{
    sessionId: { type: String, required: true },
    deviceInfo: {
      userAgent: { type: String },
      platform: { type: String },
      browser: { type: String },
      device: { type: String }
    },
    ipAddress: { type: String },
    location: {
      country: { type: String },
      city: { type: String },
      timezone: { type: String }
    },
    createdAt: { type: Date, default: Date.now },
    lastActivity: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
  }],
  
  // OAuth/Social Login
  providers: [{
    provider: { 
      type: String, 
      enum: ['google', 'github', 'microsoft', 'facebook'],
      required: true 
    },
    providerId: { type: String, required: true },
    email: { type: String },
    profile: {
      name: { type: String },
      picture: { type: String },
      locale: { type: String }
    },
    connectedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
  }],
  
  // API Access
  apiKeys: [{
    name: { type: String, required: true },
    key: { type: String, required: true, unique: true },
    permissions: [{ type: String }],
    lastUsed: { type: Date },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Audit and Compliance
  agreementAccepted: { 
    type: Boolean, 
    default: false 
  },
  
  agreementAcceptedAt: { type: Date },
  
  privacyPolicyAccepted: { 
    type: Boolean, 
    default: false 
  },
  
  privacyPolicyAcceptedAt: { type: Date },
  
  dataRetentionConsent: { 
    type: Boolean, 
    default: false 
  },
  
  marketingConsent: { 
    type: Boolean, 
    default: false 
  },
  
  // System Fields
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  
  updatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  
  // Soft Delete
  deletedAt: { type: Date },
  
  deletedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  
  isDeleted: { 
    type: Boolean, 
    default: false,
    index: true 
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
  collection: 'users',
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id.toString()
      delete ret._id
      delete ret.__v
      delete ret.password
      delete ret.twoFactorSecret
      delete ret.resetPasswordToken
      delete ret.verificationToken
      delete ret.emailChangeToken
      delete ret.backupCodes
      return ret
    }
  },
  toObject: { virtuals: true }
})

// ============================================================================
// INDEXES
// ============================================================================

// Authentication indexes
UserSchema.index({ email: 1 }, { unique: true })
UserSchema.index({ username: 1 }, { unique: true })
UserSchema.index({ 'providers.provider': 1, 'providers.providerId': 1 })

// Security indexes
UserSchema.index({ resetPasswordToken: 1 }, { sparse: true })
UserSchema.index({ verificationToken: 1 }, { sparse: true })
UserSchema.index({ lockUntil: 1 }, { sparse: true })

// Permission and role indexes
UserSchema.index({ 'permissions.schools.schoolId': 1, 'permissions.schools.role': 1 })
UserSchema.index({ 'permissions.isSuperAdmin': 1 })

// Status indexes
UserSchema.index({ isActive: 1, isDeleted: 1 })
UserSchema.index({ isVerified: 1 })

// Activity indexes
UserSchema.index({ lastLoginAt: -1 })
UserSchema.index({ createdAt: -1 })

// Search indexes
UserSchema.index({ 
  username: 'text', 
  email: 'text',
  'profile.firstName': 'text',
  'profile.lastName': 'text'
})

// ============================================================================
// VIRTUAL FIELDS
// ============================================================================

UserSchema.virtual('id').get(function(this: IUser) {
  return this._id.toHexString()
})

UserSchema.virtual('fullName').get(function(this: IUser) {
  const parts = [this.profile.firstName]
  if (this.profile.middleName) parts.push(this.profile.middleName)
  parts.push(this.profile.lastName)
  return parts.join(' ')
})

UserSchema.virtual('isLocked').get(function(this: IUser) {
  return !!(this.lockUntil && this.lockUntil > new Date())
})

UserSchema.virtual('hasActiveSession').get(function(this: IUser) {
  return this.sessions.some(session => 
    session.isActive && 
    new Date(session.lastActivity.getTime() + 24 * 60 * 60 * 1000) > new Date()
  )
})

UserSchema.virtual('primaryRole').get(function(this: IUser) {
  if (this.permissions.isSuperAdmin) return 'super_admin'
  
  const activeSchools = this.permissions.schools.filter(school => school.isActive)
  if (activeSchools.length > 0) {
    return activeSchools[0].role
  }
  
  return 'user'
})

// ============================================================================
// INSTANCE METHODS
// ============================================================================

UserSchema.methods.comparePassword = async function(this: IUser, password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password)
}

UserSchema.methods.hasPermission = function(
  this: IUser, 
  permission: string, 
  schoolId?: mongoose.Types.ObjectId
): boolean {
  // Super admin has all permissions
  if (this.permissions.isSuperAdmin) return true
  
  // Check global permissions
  if (this.permissions.globalPermissions.includes(permission)) return true
  
  // Check school-specific permissions
  if (schoolId) {
    const schoolPermission = this.permissions.schools.find(
      school => school.schoolId.toString() === schoolId.toString() && school.isActive
    )
    
    if (schoolPermission && schoolPermission.permissions.includes(permission)) {
      return true
    }
  }
  
  return false
}

UserSchema.methods.hasRole = function(
  this: IUser, 
  role: string, 
  schoolId?: mongoose.Types.ObjectId
): boolean {
  if (this.permissions.isSuperAdmin && role === 'super_admin') return true
  
  if (schoolId) {
    const schoolPermission = this.permissions.schools.find(
      school => school.schoolId.toString() === schoolId.toString() && school.isActive
    )
    
    return schoolPermission?.role === role
  }
  
  // Check if user has this role in any school
  return this.permissions.schools.some(
    school => school.role === role && school.isActive
  )
}

UserSchema.methods.getSchoolRole = function(
  this: IUser, 
  schoolId: mongoose.Types.ObjectId
): string | null {
  const schoolPermission = this.permissions.schools.find(
    school => school.schoolId.toString() === schoolId.toString() && school.isActive
  )
  
  return schoolPermission?.role || null
}

UserSchema.methods.addSchoolRole = function(
  this: IUser,
  schoolId: mongoose.Types.ObjectId,
  role: string,
  permissions: string[] = [],
  assignedBy?: mongoose.Types.ObjectId
): Promise<IUser> {
  // Remove existing role for this school
  this.permissions.schools = this.permissions.schools.filter(
    school => school.schoolId.toString() !== schoolId.toString()
  )
  
  // Add new role
  this.permissions.schools.push({
    schoolId,
    role,
    permissions,
    isActive: true,
    assignedBy,
    assignedAt: new Date()
  } as any)
  
  return this.save()
}

UserSchema.methods.removeSchoolRole = function(
  this: IUser,
  schoolId: mongoose.Types.ObjectId
): Promise<IUser> {
  this.permissions.schools = this.permissions.schools.filter(
    school => school.schoolId.toString() !== schoolId.toString()
  )
  
  return this.save()
}

UserSchema.methods.addSession = function(
  this: IUser,
  sessionData: any
): Promise<IUser> {
  // Remove old inactive sessions (keep last 5)
  this.sessions = this.sessions
    .filter(session => session.isActive)
    .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
    .slice(0, 4)
  
  // Add new session
  this.sessions.unshift(sessionData)
  
  return this.save()
}

UserSchema.methods.updateLastActivity = function(
  this: IUser,
  sessionId: string
): Promise<IUser> {
  const session = this.sessions.find(s => s.sessionId === sessionId)
  if (session) {
    session.lastActivity = new Date()
  }
  
  this.lastLoginAt = new Date()
  
  return this.save()
}

// ============================================================================
// STATIC METHODS
// ============================================================================

UserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ 
    email: email.toLowerCase(),
    isDeleted: false 
  })
}

UserSchema.statics.findByUsername = function(username: string) {
  return this.findOne({ 
    username: username.toLowerCase(),
    isDeleted: false 
  })
}

UserSchema.statics.findBySchool = function(schoolId: mongoose.Types.ObjectId) {
  return this.find({ 
    'permissions.schools.schoolId': schoolId,
    'permissions.schools.isActive': true,
    isActive: true,
    isDeleted: false 
  })
}

UserSchema.statics.findByRole = function(role: string, schoolId?: mongoose.Types.ObjectId) {
  const query: any = {
    isActive: true,
    isDeleted: false
  }
  
  if (role === 'super_admin') {
    query['permissions.isSuperAdmin'] = true
  } else if (schoolId) {
    query['permissions.schools'] = {
      $elemMatch: {
        schoolId,
        role,
        isActive: true
      }
    }
  } else {
    query['permissions.schools.role'] = role
    query['permissions.schools.isActive'] = true
  }
  
  return this.find(query)
}

UserSchema.statics.searchUsers = function(searchTerm: string, schoolId?: mongoose.Types.ObjectId) {
  const query: any = {
    $or: [
      { username: { $regex: searchTerm, $options: 'i' } },
      { email: { $regex: searchTerm, $options: 'i' } },
      { 'profile.firstName': { $regex: searchTerm, $options: 'i' } },
      { 'profile.lastName': { $regex: searchTerm, $options: 'i' } }
    ],
    isActive: true,
    isDeleted: false
  }
  
  if (schoolId) {
    query['permissions.schools.schoolId'] = schoolId
  }
  
  return this.find(query).limit(50)
}

// ============================================================================
// MIDDLEWARE HOOKS
// ============================================================================

// Pre-save middleware
UserSchema.pre('save', async function(next) {
  // Hash password if modified
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
  }
  
  // Ensure email and username are lowercase
  if (this.email) {
    this.email = this.email.toLowerCase()
  }
  
  if (this.username) {
    this.username = this.username.toLowerCase()
  }
  
  next()
})

// Pre-save middleware for account lockout
UserSchema.pre('save', function(next) {
  // If account is not locked and we have login attempts
  if (!this.isModified('loginAttempts') && !this.isModified('lockUntil')) {
    return next()
  }
  
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < new Date()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    })
  }
  
  // Otherwise we're incrementing
  const updates: any = { $inc: { loginAttempts: 1 } }
  
  // If we've hit max attempts and it's not locked yet, lock the account
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = {
      lockUntil: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours
    }
  }
  
  return this.updateOne(updates)
})

// ============================================================================
// MODEL EXPORT
// ============================================================================

export interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>
  findByUsername(username: string): Promise<IUser | null>
  findBySchool(schoolId: mongoose.Types.ObjectId): Promise<IUser[]>
  findByRole(role: string, schoolId?: mongoose.Types.ObjectId): Promise<IUser[]>
  searchUsers(searchTerm: string, schoolId?: mongoose.Types.ObjectId): Promise<IUser[]>
}

// Prevent re-compilation in development
const UserModel = (mongoose.models.User as IUserModel) || 
                 mongoose.model<IUser, IUserModel>('User', UserSchema)

export default UserModel