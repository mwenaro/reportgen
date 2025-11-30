#!/usr/bin/env node
import mongoose from 'mongoose'
import { connectDB } from '../src/lib/db.js'
import TeacherModel from '../src/lib/models/teacher.model.js'
import SubjectModel from '../src/lib/models/subject.model.js'
import ClassModel from '../src/lib/models/class.model.js'
import UserModel from '../src/lib/models/user.model.js'

// Sample data
const sampleUsers = [
  {
    schoolId: new mongoose.Types.ObjectId(),
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@school.edu',
    password: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // bcrypt hash
    role: 'admin',
    permissions: ['read', 'write', 'delete', 'manage'],
    isActive: true
  }
]

const sampleSubjects = [
  {
    name: 'Advanced Mathematics',
    code: 'MATH301',
    description: 'Advanced mathematical concepts including calculus, algebra, and geometry',
    department: 'Mathematics',
    level: 'High School',
    credits: 3,
    isActive: true
  },
  {
    name: 'Physics Fundamentals', 
    code: 'PHYS101',
    description: 'Introduction to physics concepts and principles',
    department: 'Science',
    level: 'Foundation',
    credits: 2,
    isActive: true
  },
  {
    name: 'English Literature',
    code: 'ENG201',
    description: 'Study of literary works and critical analysis',
    department: 'English',
    level: 'Middle School',
    credits: 2,
    isActive: true
  },
  {
    name: 'Computer Science Basics',
    code: 'CS101', 
    description: 'Introduction to programming and computer science concepts',
    department: 'Computer Science',
    level: 'Foundation',
    credits: 3,
    isActive: true
  }
]

const sampleTeachers = [
  {
    employeeNumber: 'EMP001',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@school.edu',
    phone: '+254700123456',
    dateOfBirth: new Date('1985-03-15'),
    gender: 'female',
    
    address: {
      street: '123 Education Street',
      city: 'Nairobi',
      state: 'Nairobi',
      country: 'Kenya',
      postalCode: '00100'
    },
    
    qualifications: [{
      degree: 'master',
      field: 'Mathematics Education',
      institution: 'University of Nairobi',
      yearCompleted: 2010,
      verified: true
    }],
    
    employmentType: 'permanent',
    dateOfJoining: new Date('2020-08-15'),
    status: 'active',
    department: 'Mathematics',
    
    emergencyContact: {
      name: 'Michael Johnson',
      relationship: 'Spouse',
      phone: '+254700123457'
    }
  },
  {
    employeeNumber: 'EMP002',
    firstName: 'David',
    lastName: 'Williams',
    email: 'david.williams@school.edu',
    phone: '+254700234567',
    dateOfBirth: new Date('1979-11-22'),
    gender: 'male',
    
    address: {
      street: '456 Teaching Avenue',
      city: 'Mombasa',
      state: 'Mombasa',
      country: 'Kenya', 
      postalCode: '80100'
    },
    
    qualifications: [{
      degree: 'bachelor',
      field: 'Physics',
      institution: 'Kenyatta University',
      yearCompleted: 2005,
      verified: true
    }],
    
    employmentType: 'permanent',
    dateOfJoining: new Date('2018-01-20'),
    status: 'active',
    department: 'Science',
    
    emergencyContact: {
      name: 'Emma Williams',
      relationship: 'Spouse',
      phone: '+254700234568'
    }
  }
]

const sampleClasses = [
  {
    name: 'Grade 9A',
    level: 'Form 1',
    section: 'A',
    academicYear: '2024',
    currentEnrollment: 32,
    maxCapacity: 40,
    classroom: 'Room 101',
    description: 'Grade 9 Section A - Mathematics and Science Focus',
    isActive: true
  },
  {
    name: 'Grade 10B',
    level: 'Form 2',
    section: 'B', 
    academicYear: '2024',
    currentEnrollment: 28,
    maxCapacity: 35,
    classroom: 'Room 205',
    description: 'Grade 10 Section B - Liberal Arts Focus',
    isActive: true
  },
  {
    name: 'Grade 11A',
    level: 'Form 3',
    section: 'A',
    academicYear: '2024',
    currentEnrollment: 25,
    maxCapacity: 30,
    classroom: 'Room 301',
    description: 'Grade 11 Section A - Advanced Studies',
    isActive: true
  }
]

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...')
    await connectDB()
    
    // Get default school ID (create one if needed)
    const schoolId = new mongoose.Types.ObjectId()
    const adminUserId = new mongoose.Types.ObjectId()
    
    console.log('Clearing existing data...')
    await Promise.all([
      UserModel.deleteMany({}),
      TeacherModel.deleteMany({}),
      SubjectModel.deleteMany({}),
      ClassModel.deleteMany({})
    ])
    
    console.log('Creating admin user...')
    const adminUser = await UserModel.create({
      ...sampleUsers[0],
      _id: adminUserId,
      schoolId
    })
    console.log(`✓ Created admin user: ${adminUser.email}`)
    
    console.log('Creating subjects...')
    const createdSubjects = await SubjectModel.insertMany(
      sampleSubjects.map(subject => ({
        ...subject,
        schoolId
      }))
    )
    console.log(`✓ Created ${createdSubjects.length} subjects`)
    
    console.log('Creating teachers...')
    const createdTeachers = await TeacherModel.insertMany(
      sampleTeachers.map(teacher => ({
        ...teacher,
        schoolId,
        createdBy: adminUserId
      }))
    )
    console.log(`✓ Created ${createdTeachers.length} teachers`)
    
    console.log('Creating classes...')
    const createdClasses = await ClassModel.insertMany(
      sampleClasses.map(cls => ({
        ...cls,
        schoolId,
        // Assign first teacher as class teacher for first class
        classTeacher: createdTeachers[0]?._id,
        classTeacherName: createdTeachers[0] ? `${createdTeachers[0].firstName} ${createdTeachers[0].lastName}` : undefined,
        subjects: [createdSubjects[0]._id, createdSubjects[1]._id] // Assign some subjects
      }))
    )
    console.log(`✓ Created ${createdClasses.length} classes`)
    
    console.log('\n🎉 Database seeded successfully!')
    console.log('\nCredentials for testing:')
    console.log('Email: admin@school.edu')
    console.log('Password: password (you need to hash this properly)')
    console.log('\nSchool ID:', schoolId.toString())
    
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run seeder
seedDatabase()