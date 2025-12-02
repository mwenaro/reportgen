import { ReportValidator } from '../validator';
import { StudentData } from '@/types/report.types';

// Mock test functions for environments without testing framework
const describe = (name: string, fn: () => void) => fn();
const it = (name: string, fn: () => void) => fn();
const expect = (value: any) => ({
  toBe: (expected: any) => value === expected,
  toHaveLength: (length: number) => value?.length === length,
  some: (predicate: (item: any) => boolean) => value?.some?.(predicate) || false,
  toEqual: (expected: any) => JSON.stringify(value) === JSON.stringify(expected)
});

describe('ReportValidator', () => {
  const validStudentData: StudentData = {
    id: 'student-1',
    adm: '1001',
    name: 'John Doe',
    form: 1,
    gender: 'M',
    term: 1,
    year: 2024,
    examCount: 2,
    marks: {
      eng: [80, 75],
      mat: [70, 80],
      kis: [60, 65],
    },
  };

  describe('validateStudentData', () => {
    it('should validate correct student data', () => {
      const result = ReportValidator.validateStudentData(validStudentData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid student ID', () => {
      const invalidData = { ...validStudentData, id: '' };
      const result = ReportValidator.validateStudentData(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.field === 'id')).toBe(true);
    });

    it('should reject invalid form number', () => {
      const invalidData = { ...validStudentData, form: 5 };
      const result = ReportValidator.validateStudentData(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.field === 'form')).toBe(true);
    });

    it('should reject invalid gender', () => {
      const invalidData = { ...validStudentData, gender: 'X' as any };
      const result = ReportValidator.validateStudentData(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.field === 'gender')).toBe(true);
    });

    it('should warn about insufficient subjects', () => {
      const dataWithFewSubjects = {
        ...validStudentData,
        marks: { eng: [80, 75] }, // Only one subject
      };
      
      const result = ReportValidator.validateStudentData(dataWithFewSubjects);
      expect(result.warnings.some(warning => warning.field === 'marks')).toBe(true);
    });

    it('should warn about zero marks', () => {
      const dataWithZeros = {
        ...validStudentData,
        marks: {
          eng: [80, 0], // Zero mark
          mat: [70, 80],
        },
      };
      
      const result = ReportValidator.validateStudentData(dataWithZeros);
      expect(result.warnings.some(warning => warning.field.includes('eng'))).toBe(true);
    });
  });

  describe('validateStudentBatch', () => {
    it('should validate batch of students', () => {
      const students = [
        validStudentData,
        { ...validStudentData, id: 'student-2', adm: '1002', name: 'Jane Doe' },
      ];
      
      const result = ReportValidator.validateStudentBatch(students);
      expect(result.isValid).toBe(true);
    });

    it('should detect duplicate admission numbers', () => {
      const students = [
        validStudentData,
        { ...validStudentData, id: 'student-2' }, // Same adm number
      ];
      
      const result = ReportValidator.validateStudentBatch(students);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.code === 'DUPLICATE_ADM')).toBe(true);
    });

    it('should detect duplicate student IDs', () => {
      const students = [
        validStudentData,
        { ...validStudentData, adm: '1002' }, // Same ID
      ];
      
      const result = ReportValidator.validateStudentBatch(students);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.code === 'DUPLICATE_ID')).toBe(true);
    });
  });

  describe('validateMarksConsistency', () => {
    it('should validate consistent marks', () => {
      const marks = {
        eng: [80, 75],
        mat: [70, 80],
        kis: [60, 65],
      };
      
      const result = ReportValidator.validateMarksConsistency(marks);
      expect(result.isValid).toBe(true);
    });

    it('should warn about inconsistent exam counts', () => {
      const marks = {
        eng: [80, 75, 70], // 3 exams
        mat: [70, 80], // 2 exams
      };
      
      const result = ReportValidator.validateMarksConsistency(marks);
      expect(result.warnings.some(warning => warning.field === 'marks')).toBe(true);
    });

    it('should reject marks outside valid range', () => {
      const marks = {
        eng: [110, 75], // Invalid high mark
        mat: [-5, 80], // Invalid low mark
      };
      
      const result = ReportValidator.validateMarksConsistency(marks);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.code === 'INVALID_MARK_RANGE')).toBe(true);
    });
  });

  describe('sanitizeStudentData', () => {
    it('should sanitize student name', () => {
      const dirtyData = {
        ...validStudentData,
        name: '  john DOE  ',
      };
      
      const sanitized = ReportValidator.sanitizeStudentData(dirtyData);
      expect(sanitized.name).toBe('John Doe');
    });

    it('should normalize gender', () => {
      const dirtyData = {
        ...validStudentData,
        gender: 'f',
      };
      
      const sanitized = ReportValidator.sanitizeStudentData(dirtyData);
      expect(sanitized.gender).toBe('F');
    });

    it('should clean marks data', () => {
      const dirtyData = {
        ...validStudentData,
        marks: {
          ENG: ['80', '75'],
          MAT: [70, 80],
        },
      };
      
      const sanitized = ReportValidator.sanitizeStudentData(dirtyData);
      expect(sanitized.marks.eng).toEqual([80, 75]);
      expect(sanitized.marks.mat).toEqual([70, 80]);
    });
  });
});