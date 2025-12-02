import { z } from 'zod';
import { ValidationResult, ValidationError, ValidationWarning } from '@/types/report.types';

// Validation schemas
export const studentDataSchema = z.object({
  id: z.string().min(1, 'Student ID is required'),
  adm: z.string().min(1, 'Admission number is required'),
  name: z.string().min(2, 'Student name must be at least 2 characters'),
  form: z.number().int().min(1).max(4, 'Form must be between 1 and 4'),
  stream: z.string().optional(),
  gender: z.enum(['M', 'F'], { message: 'Gender must be M or F' }),
  kcpe: z.number().min(0).max(500).optional(),
  term: z.number().int().min(1).max(3, 'Term must be between 1 and 3'),
  year: z.number().int().min(2000).max(2100, 'Invalid year'),
  rank: z.number().int().positive().optional(),
  marks: z.record(z.string(), z.array(z.number().min(0).max(100))),
  examCount: z.number().int().positive('Exam count must be positive'),
});

export const schoolInfoSchema = z.object({
  name: z.string().min(1, 'School name is required'),
  level: z.enum(['primary', 'secondary']),
  box: z.string().min(1, 'P.O. Box is required'),
  telephone: z.string().min(10, 'Valid telephone number is required'),
  motto: z.string().min(1, 'School motto is required'),
  logo: z.string().url().optional(),
});

export const reportConfigSchema = z.object({
  school: schoolInfoSchema,
  term: z.number().int().min(1).max(3),
  year: z.number().int().min(2000).max(2100),
  reportTitle: z.string().min(1, 'Report title is required'),
});

export class ReportValidator {
  /**
   * Validates student data
   */
  static validateStudentData(data: unknown): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    try {
      const result = studentDataSchema.safeParse(data);
      
      if (!result.success) {
        result.error.issues.forEach(issue => {
          errors.push({
            field: issue.path.join('.'),
            message: issue.message,
            code: issue.code,
          });
        });
      } else {
        // Additional business logic validations
        const student = result.data;
        
        // Check for missing subjects
        if (Object.keys(student.marks).length < 7) {
          warnings.push({
            field: 'marks',
            message: 'Student has fewer than 7 subjects',
            suggestion: 'Consider adding more subjects for comprehensive evaluation',
          });
        }

        // Check KCPE consistency with form level
        if (student.kcpe && student.form > 1) {
          if (student.kcpe < 250 && student.form > 2) {
            warnings.push({
              field: 'kcpe',
              message: 'KCPE score seems low for current form level',
              suggestion: 'Verify KCPE marks or consider additional support',
            });
          }
        }

        // Check for zero marks
        Object.entries(student.marks).forEach(([subject, marks]) => {
          if (marks.some(mark => mark === 0)) {
            warnings.push({
              field: `marks.${subject}`,
              message: `Zero marks detected in ${subject}`,
              suggestion: 'Verify if student was absent or if marks are correct',
            });
          }
        });
      }
    } catch (error) {
      errors.push({
        field: 'general',
        message: 'Invalid data format',
        code: 'INVALID_FORMAT',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validates multiple student records for batch processing
   */
  static validateStudentBatch(students: unknown[]): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const admNumbers = new Set<string>();
    const studentIds = new Set<string>();

    students.forEach((student, index) => {
      const validation = this.validateStudentData(student);
      
      // Add index to field names for batch validation
      validation.errors.forEach(error => {
        errors.push({
          ...error,
          field: `students[${index}].${error.field}`,
        });
      });

      validation.warnings.forEach(warning => {
        warnings.push({
          ...warning,
          field: `students[${index}].${warning.field}`,
        });
      });

      // Check for duplicates if validation passed
      if (validation.isValid && typeof student === 'object' && student !== null) {
        const s = student as any;
        
        if (admNumbers.has(s.adm)) {
          errors.push({
            field: `students[${index}].adm`,
            message: 'Duplicate admission number found',
            code: 'DUPLICATE_ADM',
          });
        } else {
          admNumbers.add(s.adm);
        }

        if (studentIds.has(s.id)) {
          errors.push({
            field: `students[${index}].id`,
            message: 'Duplicate student ID found',
            code: 'DUPLICATE_ID',
          });
        } else {
          studentIds.add(s.id);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validates report configuration
   */
  static validateReportConfig(config: unknown): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    try {
      const result = reportConfigSchema.safeParse(config);
      
      if (!result.success) {
        result.error.issues.forEach(issue => {
          errors.push({
            field: issue.path.join('.'),
            message: issue.message,
            code: issue.code,
          });
        });
      }
    } catch (error) {
      errors.push({
        field: 'general',
        message: 'Invalid configuration format',
        code: 'INVALID_CONFIG',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validates marks data for consistency
   */
  static validateMarksConsistency(marks: Record<string, number[]>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    const examCounts = Object.values(marks).map(subjectMarks => subjectMarks.length);
    const uniqueCounts = [...new Set(examCounts)];

    // Check if all subjects have the same number of exams
    if (uniqueCounts.length > 1) {
      warnings.push({
        field: 'marks',
        message: 'Inconsistent number of exams across subjects',
        suggestion: 'Ensure all subjects have marks for the same number of exams',
      });
    }

    // Check for marks outside valid range
    Object.entries(marks).forEach(([subject, subjectMarks]) => {
      subjectMarks.forEach((mark, index) => {
        if (mark < 0 || mark > 100) {
          errors.push({
            field: `marks.${subject}[${index}]`,
            message: `Invalid mark: ${mark}. Must be between 0 and 100`,
            code: 'INVALID_MARK_RANGE',
          });
        }
      });
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Sanitizes and normalizes student data
   */
  static sanitizeStudentData(data: any): any {
    return {
      ...data,
      name: data.name?.toString().trim().toLowerCase()
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      adm: data.adm?.toString().trim(),
      gender: data.gender?.toString().toUpperCase(),
      marks: Object.fromEntries(
        Object.entries(data.marks || {}).map(([subject, marks]) => [
          subject.toLowerCase(),
          Array.isArray(marks) ? marks.map((m: any) => Number(m)) : []
        ])
      ),
    };
  }
}