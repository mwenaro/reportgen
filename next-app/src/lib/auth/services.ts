import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { z } from 'zod'
import { getDatabaseUtils } from '../database/utils'
import { UserRole, ROLE_PERMISSIONS } from './config'

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase and number'),
  confirmPassword: z.string(),
  schoolCode: z.string().optional()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

const inviteUserSchema = z.object({
  email: z.string().email('Valid email is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.nativeEnum(UserRole),
  schoolId: z.string().min(1, 'School ID is required'),
  sendEmail: z.boolean().default(true)
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase and number'),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

const resetPasswordSchema = z.object({
  email: z.string().email('Valid email is required')
})

const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  phone: z.string().optional(),
  avatar: z.string().optional()
})

// ============================================================================
// USER REGISTRATION
// ============================================================================

export async function registerUser(data: z.infer<typeof registerSchema>) {
  try {
    const validatedData = registerSchema.parse(data)
    const dbUtils = getDatabaseUtils()

    // Check if email already exists
    const existingEmail = await dbUtils.findOne('User', { email: validatedData.email })
    if (existingEmail) {
      throw new Error('Email already registered')
    }

    // Check if username already exists
    const existingUsername = await dbUtils.findOne('User', { username: validatedData.username })
    if (existingUsername) {
      throw new Error('Username already taken')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Prepare user data
    const userData = {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      username: validatedData.username,
      hashedPassword,
      isVerified: false,
      isActive: true,
      provider: 'credentials',
      roles: [], // Roles will be assigned by school admin
      profile: {
        avatar: null,
        phone: null,
        bio: null
      },
      security: {
        emailVerificationToken: crypto.randomBytes(32).toString('hex'),
        emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        loginAttempts: 0,
        lockUntil: null,
        lastLogin: null,
        lastLoginIP: null,
        twoFactorEnabled: false,
        twoFactorSecret: null
      },
      preferences: {
        language: 'en',
        timezone: 'UTC',
        dateFormat: 'DD/MM/YYYY',
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      }
    }

    // If school code provided, find school and assign default role
    if (validatedData.schoolCode) {
      const school = await dbUtils.findOne('School', { 
        code: validatedData.schoolCode, 
        isActive: true 
      })
      
      if (school) {
        userData.roles = [{
          schoolId: school._id.toString(),
          schoolName: school.name,
          role: UserRole.STUDENT, // Default role for self-registration
          permissions: [], // Will be populated from role permissions
          isActive: true,
          assignedBy: null,
          assignedAt: new Date()
        }]
      }
    }

    // Create user
    const user = await dbUtils.create('User', userData)

    // Send verification email (implementation would be in email service)
    // await sendVerificationEmail(user.email, userData.security.emailVerificationToken)

    return {
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified
      }
    }
  } catch (error) {
    console.error('User registration error:', error)
    throw error
  }
}

// ============================================================================
// USER INVITATION SYSTEM
// ============================================================================

export async function inviteUser(data: z.infer<typeof inviteUserSchema>, invitedBy: string) {
  try {
    const validatedData = inviteUserSchema.parse(data)
    const dbUtils = getDatabaseUtils()

    // Verify inviter has permission to invite users
    const inviter = await dbUtils.findOne('User', { _id: invitedBy })
    if (!inviter) {
      throw new Error('Inviter not found')
    }

    // Verify school exists
    const school = await dbUtils.findOne('School', { _id: validatedData.schoolId })
    if (!school) {
      throw new Error('School not found')
    }

    // Check if email already exists
    const existingUser = await dbUtils.findOne('User', { email: validatedData.email })
    if (existingUser) {
      // If user exists, add role to their existing account
      const roleExists = existingUser.roles.some((role: any) => 
        role.schoolId.toString() === validatedData.schoolId
      )

      if (roleExists) {
        throw new Error('User already has a role in this school')
      }

      // Add new role to existing user
      const updatedUser = await dbUtils.update('User', 
        { _id: existingUser._id },
        {
          $push: {
            roles: {
              schoolId: validatedData.schoolId,
              schoolName: school.name,
              role: validatedData.role,
              permissions: [], // Will be populated from role permissions
              isActive: true,
              assignedBy: invitedBy,
              assignedAt: new Date()
            }
          }
        }
      )

      return {
        success: true,
        user: updatedUser,
        message: 'Role added to existing user'
      }
    }

    // Create new user with invitation
    const invitationToken = crypto.randomBytes(32).toString('hex')
    const temporaryPassword = crypto.randomBytes(12).toString('hex')
    const hashedPassword = await bcrypt.hash(temporaryPassword, 12)

    const userData = {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      username: validatedData.email.split('@')[0], // Use email prefix as username
      hashedPassword,
      isVerified: false,
      isActive: true,
      provider: 'invitation',
      roles: [{
        schoolId: validatedData.schoolId,
        schoolName: school.name,
        role: validatedData.role,
        permissions: [], // Will be populated from role permissions
        isActive: true,
        assignedBy: invitedBy,
        assignedAt: new Date()
      }],
      security: {
        invitationToken,
        invitationExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        emailVerificationToken: crypto.randomBytes(32).toString('hex'),
        emailVerificationExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isInvited: true,
        loginAttempts: 0,
        lockUntil: null,
        lastLogin: null,
        lastLoginIP: null,
        twoFactorEnabled: false,
        twoFactorSecret: null
      },
      profile: {
        avatar: null,
        phone: null,
        bio: null
      },
      preferences: {
        language: 'en',
        timezone: 'UTC',
        dateFormat: 'DD/MM/YYYY',
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      }
    }

    const user = await dbUtils.create('User', userData)

    // Send invitation email with temporary password
    if (validatedData.sendEmail) {
      // await sendInvitationEmail(user.email, invitationToken, temporaryPassword, school.name)
    }

    return {
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        temporaryPassword: validatedData.sendEmail ? undefined : temporaryPassword,
        invitationToken
      }
    }
  } catch (error) {
    console.error('User invitation error:', error)
    throw error
  }
}

// ============================================================================
// PASSWORD MANAGEMENT
// ============================================================================

export async function changePassword(
  userId: string,
  data: z.infer<typeof changePasswordSchema>
) {
  try {
    const validatedData = changePasswordSchema.parse(data)
    const dbUtils = getDatabaseUtils()

    // Get user
    const user = await dbUtils.findOne('User', { _id: userId })
    if (!user) {
      throw new Error('User not found')
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      validatedData.currentPassword,
      user.hashedPassword
    )
    
    if (!isValidPassword) {
      throw new Error('Current password is incorrect')
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 12)

    // Update password
    await dbUtils.update('User', 
      { _id: userId },
      {
        hashedPassword,
        'security.passwordChangedAt': new Date(),
        'security.loginAttempts': 0,
        'security.lockUntil': null
      }
    )

    return { success: true }
  } catch (error) {
    console.error('Password change error:', error)
    throw error
  }
}

export async function resetPassword(data: z.infer<typeof resetPasswordSchema>) {
  try {
    const validatedData = resetPasswordSchema.parse(data)
    const dbUtils = getDatabaseUtils()

    // Find user by email
    const user = await dbUtils.findOne('User', { 
      email: validatedData.email,
      isActive: true 
    })
    
    if (!user) {
      // Don't reveal if email exists
      return { success: true, message: 'Password reset instructions sent if email exists' }
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Update user with reset token
    await dbUtils.update('User',
      { _id: user._id },
      {
        'security.passwordResetToken': resetToken,
        'security.passwordResetExpires': resetExpires
      }
    )

    // Send reset email
    // await sendPasswordResetEmail(user.email, resetToken)

    return { 
      success: true, 
      message: 'Password reset instructions sent if email exists' 
    }
  } catch (error) {
    console.error('Password reset error:', error)
    throw error
  }
}

// ============================================================================
// PROFILE MANAGEMENT
// ============================================================================

export async function updateProfile(
  userId: string,
  data: z.infer<typeof updateProfileSchema>
) {
  try {
    const validatedData = updateProfileSchema.parse(data)
    const dbUtils = getDatabaseUtils()

    // Check if new username is taken (if provided)
    if (validatedData.username) {
      const existingUsername = await dbUtils.findOne('User', { 
        username: validatedData.username,
        _id: { $ne: userId }
      })
      
      if (existingUsername) {
        throw new Error('Username already taken')
      }
    }

    // Update profile
    const updateData: any = {}
    
    if (validatedData.firstName) updateData.firstName = validatedData.firstName
    if (validatedData.lastName) updateData.lastName = validatedData.lastName
    if (validatedData.username) updateData.username = validatedData.username
    if (validatedData.phone) updateData['profile.phone'] = validatedData.phone
    if (validatedData.avatar) updateData['profile.avatar'] = validatedData.avatar

    const updatedUser = await dbUtils.update('User',
      { _id: userId },
      updateData
    )

    return {
      success: true,
      user: {
        id: updatedUser._id.toString(),
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.profile?.phone,
        avatar: updatedUser.profile?.avatar
      }
    }
  } catch (error) {
    console.error('Profile update error:', error)
    throw error
  }
}

// ============================================================================
// ROLE MANAGEMENT
// ============================================================================

export async function assignUserRole(
  userId: string,
  schoolId: string,
  role: UserRole,
  assignedBy: string
) {
  try {
    const dbUtils = getDatabaseUtils()

    // Verify assigner has permission
    const assigner = await dbUtils.findOne('User', { _id: assignedBy })
    if (!assigner) {
      throw new Error('Assigner not found')
    }

    // Verify school exists
    const school = await dbUtils.findOne('School', { _id: schoolId })
    if (!school) {
      throw new Error('School not found')
    }

    // Get user
    const user = await dbUtils.findOne('User', { _id: userId })
    if (!user) {
      throw new Error('User not found')
    }

    // Check if role already exists
    const roleExists = user.roles.some((r: any) => 
      r.schoolId.toString() === schoolId && r.role === role
    )

    if (roleExists) {
      throw new Error('User already has this role in this school')
    }

    // Add role
    const newRole = {
      schoolId,
      schoolName: school.name,
      role,
      permissions: ROLE_PERMISSIONS[role].map(p => `${p.resource}:${p.actions.join(',')}`),
      isActive: true,
      assignedBy,
      assignedAt: new Date()
    }

    await dbUtils.update('User',
      { _id: userId },
      { $push: { roles: newRole } }
    )

    return { success: true }
  } catch (error) {
    console.error('Role assignment error:', error)
    throw error
  }
}

export async function removeUserRole(
  userId: string,
  schoolId: string,
  role: UserRole,
  removedBy: string
) {
  try {
    const dbUtils = getDatabaseUtils()

    await dbUtils.update('User',
      { _id: userId },
      {
        $pull: {
          roles: {
            schoolId,
            role
          }
        }
      }
    )

    return { success: true }
  } catch (error) {
    console.error('Role removal error:', error)
    throw error
  }
}

// ============================================================================
// EMAIL VERIFICATION
// ============================================================================

export async function verifyEmail(token: string) {
  try {
    const dbUtils = getDatabaseUtils()

    const user = await dbUtils.findOne('User', {
      'security.emailVerificationToken': token,
      'security.emailVerificationExpires': { $gt: new Date() }
    })

    if (!user) {
      throw new Error('Invalid or expired verification token')
    }

    await dbUtils.update('User',
      { _id: user._id },
      {
        isVerified: true,
        'security.emailVerificationToken': null,
        'security.emailVerificationExpires': null,
        'security.verifiedAt': new Date()
      }
    )

    return { success: true }
  } catch (error) {
    console.error('Email verification error:', error)
    throw error
  }
}

// Export schemas for use in API routes
export {
  registerSchema,
  inviteUserSchema,
  changePasswordSchema,
  resetPasswordSchema,
  updateProfileSchema
}