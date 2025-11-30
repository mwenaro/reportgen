// Export all Mongoose models for the school management system
export { default as SchoolModel } from './school.model'
export { default as StudentModel } from './student.model'
export { default as TeacherModel } from './teacher.model'
export { default as ClassModel } from './class.model'
export { default as SubjectModel } from './subject.model'
export { default as UserModel } from './user.model'
export { default as ExamModel, MarkModel } from './exam.model'

// Export model types for TypeScript
export type { ISchool, ISchoolModel } from './school.model'
export type { IStudent, IStudentModel } from './student.model'
export type { ITeacher, ITeacherModel } from './teacher.model'
export type { IClass, IClassModel } from './class.model'
export type { ISubject, ISubjectModel } from './subject.model'
export type { IUser, IUserModel } from './user.model'
export type { IExam, IExamModel, IMark } from './exam.model'

// Model registry for dynamic model access
export const ModelRegistry = {
  School: 'SchoolModel',
  Student: 'StudentModel', 
  Teacher: 'TeacherModel',
  Class: 'ClassModel',
  Subject: 'SubjectModel',
  User: 'UserModel',
  Exam: 'ExamModel',
  Mark: 'MarkModel'
} as const

// Collection names for reference
export const Collections = {
  SCHOOLS: 'schools',
  STUDENTS: 'students',
  TEACHERS: 'teachers',
  CLASSES: 'classes',
  SUBJECTS: 'subjects',
  USERS: 'users',
  EXAMS: 'exams',
  MARKS: 'marks'
} as const

// Model initialization function
export const initializeModels = () => {
  // Models are automatically initialized when imported
  // This function can be used for any additional setup
  console.log('All Mongoose models initialized successfully')
}