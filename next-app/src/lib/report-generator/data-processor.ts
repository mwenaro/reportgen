import { StudentData, PerformanceMetrics, ApiResponse } from '@/types/report.types';
import { MathsEngine } from './maths-engine';

/**
 * Data processor for handling raw student data and transforming it for reports
 */
export class DataProcessor {
  /**
   * Processes raw student data from database
   */
  static async processStudentData(rawData: any[]): Promise<StudentData[]> {
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return [];
    }

    const studentMap = new Map<string, any>();

    // Group marks by student
    rawData.forEach(record => {
      const key = record.adm || record.studentId;
      
      if (!studentMap.has(key)) {
        studentMap.set(key, {
          id: record.studentId || record.adm,
          adm: record.adm,
          name: record.name,
          form: parseInt(record.form) || 1,
          stream: record.stream,
          gender: record.gen || record.gender,
          kcpe: parseInt(record.kcpe) || 0,
          term: parseInt(record.term) || 1,
          year: parseInt(record.year) || new Date().getFullYear(),
          examCount: parseInt(record.no_exam) || 1,
          marks: {},
        });
      }

      const student = studentMap.get(key);
      const subject = record.sub || record.subject;
      const score = parseFloat(record.score) || 0;

      if (subject && !isNaN(score)) {
        if (!student.marks[subject]) {
          student.marks[subject] = [];
        }
        student.marks[subject].push(score);
      }
    });

    // Convert to array and process each student
    const students = Array.from(studentMap.values());
    return students.map(student => MathsEngine.processStudentMarks(student));
  }

  /**
   * Filters students by form and stream
   */
  static filterStudents(
    students: StudentData[],
    filters: {
      form?: number;
      stream?: string;
      gender?: 'M' | 'F';
      minGrade?: string;
      maxGrade?: string;
    }
  ): StudentData[] {
    return students.filter(student => {
      if (filters.form && student.form !== filters.form) return false;
      if (filters.stream && student.stream !== filters.stream) return false;
      if (filters.gender && student.gender !== filters.gender) return false;
      
      if (filters.minGrade || filters.maxGrade) {
        const gradeOrder = ['E', 'D-', 'D', 'D+', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A'];
        const studentGradeIndex = gradeOrder.indexOf(student.meanGrade || 'E');
        
        if (filters.minGrade) {
          const minIndex = gradeOrder.indexOf(filters.minGrade);
          if (studentGradeIndex < minIndex) return false;
        }
        
        if (filters.maxGrade) {
          const maxIndex = gradeOrder.indexOf(filters.maxGrade);
          if (studentGradeIndex > maxIndex) return false;
        }
      }
      
      return true;
    });
  }

  /**
   * Calculates comprehensive class performance metrics
   */
  static calculatePerformanceMetrics(students: StudentData[]): PerformanceMetrics {
    if (students.length === 0) {
      return {
        totalStudents: 0,
        averageScore: 0,
        topPerformers: [],
        subjectAnalysis: {},
      };
    }

    // Calculate basic statistics
    const classStats = MathsEngine.calculateClassStatistics(students);
    const subjectStats = MathsEngine.calculateSubjectAnalysis(students);

    // Get top performers (top 10% or minimum 3)
    const topCount = Math.max(3, Math.ceil(students.length * 0.1));
    const rankedStudents = MathsEngine.rankStudents(students);
    const topPerformers = rankedStudents.slice(0, topCount);

    return {
      totalStudents: classStats.totalStudents,
      averageScore: classStats.averageScore,
      topPerformers,
      subjectAnalysis: subjectStats,
    };
  }

  /**
   * Groups students by various criteria
   */
  static groupStudents(
    students: StudentData[],
    groupBy: 'form' | 'stream' | 'gender' | 'grade'
  ): Record<string, StudentData[]> {
    const groups: Record<string, StudentData[]> = {};

    students.forEach(student => {
      let key: string;
      
      switch (groupBy) {
        case 'form':
          key = `Form ${student.form}`;
          break;
        case 'stream':
          key = student.stream || 'No Stream';
          break;
        case 'gender':
          key = student.gender === 'M' ? 'Male' : 'Female';
          break;
        case 'grade':
          key = student.meanGrade || 'E';
          break;
        default:
          key = 'All';
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(student);
    });

    return groups;
  }

  /**
   * Identifies students needing special attention
   */
  static identifyAtRiskStudents(students: StudentData[]): {
    failing: StudentData[];
    declining: StudentData[];
    absenteeism: StudentData[];
  } {
    const failing = students.filter(student => 
      (student.meanPoints || 0) < 4 // Below C- grade
    );

    // For declining performance, we'd need historical data
    // This is a placeholder implementation
    const declining = students.filter(student => {
      // Simple heuristic: if they have subjects with very low marks
      const hasLowMarks = Object.values(student.marks).some(marks =>
        marks.some(mark => mark < 30)
      );
      return hasLowMarks && !failing.includes(student);
    });

    // Students with potential absenteeism (missing many marks)
    const absenteeism = students.filter(student => {
      const totalMarksExpected = Object.keys(student.marks).length * student.examCount;
      const totalMarksActual = Object.values(student.marks)
        .flat()
        .filter(mark => mark > 0).length;
      
      return totalMarksActual < totalMarksExpected * 0.7; // Less than 70% attendance
    });

    return { failing, declining, absenteeism };
  }

  /**
   * Calculates grade trends and predictions
   */
  static analyzeGradeTrends(students: StudentData[]): {
    improvingStudents: StudentData[];
    decliningStudents: StudentData[];
    stableStudents: StudentData[];
  } {
    // This would typically require historical data
    // For now, we'll use a simple heuristic based on subject performance variation
    
    const improvingStudents: StudentData[] = [];
    const decliningStudents: StudentData[] = [];
    const stableStudents: StudentData[] = [];

    students.forEach(student => {
      const subjectAverages = Object.values(student.marks).map(marks =>
        MathsEngine.calculateAverage(marks)
      );

      if (subjectAverages.length < 2) {
        stableStudents.push(student);
        return;
      }

      const variance = this.calculateVariance(subjectAverages);
      const mean = MathsEngine.calculateAverage(subjectAverages);

      // High variance might indicate inconsistent performance
      if (variance > 400) { // Large variance in marks
        if (mean > 60) {
          improvingStudents.push(student);
        } else {
          decliningStudents.push(student);
        }
      } else {
        stableStudents.push(student);
      }
    });

    return { improvingStudents, decliningStudents, stableStudents };
  }

  /**
   * Generates subject performance comparison
   */
  static compareSubjectPerformance(students: StudentData[]): {
    bestPerformingSubjects: Array<{ subject: string; average: number; passRate: number }>;
    worstPerformingSubjects: Array<{ subject: string; average: number; passRate: number }>;
  } {
    const subjectStats = MathsEngine.calculateSubjectAnalysis(students);
    
    const subjects = Object.entries(subjectStats).map(([subject, stats]) => ({
      subject,
      average: stats.average,
      passRate: stats.passRate,
    }));

    // Sort by average score and pass rate
    const sortedByAverage = [...subjects].sort((a, b) => b.average - a.average);
    
    const bestPerformingSubjects = sortedByAverage.slice(0, 3);
    const worstPerformingSubjects = sortedByAverage.slice(-3).reverse();

    return { bestPerformingSubjects, worstPerformingSubjects };
  }

  /**
   * Validates and cleans student data
   */
  static cleanStudentData(rawStudent: any): StudentData | null {
    try {
      const cleaned: StudentData = {
        id: String(rawStudent.id || rawStudent.adm || ''),
        adm: String(rawStudent.adm || ''),
        name: String(rawStudent.name || '').trim().toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        form: Math.max(1, Math.min(4, parseInt(rawStudent.form) || 1)),
        stream: rawStudent.stream ? String(rawStudent.stream).toUpperCase() : undefined,
        gender: (rawStudent.gender || rawStudent.gen || 'M').toUpperCase() === 'F' ? 'F' : 'M',
        kcpe: this.parseNumber(rawStudent.kcpe, 0, 500) || undefined,
        term: Math.max(1, Math.min(3, parseInt(rawStudent.term) || 1)),
        year: Math.max(2000, Math.min(2100, parseInt(rawStudent.year) || new Date().getFullYear())),
        rank: rawStudent.rank ? parseInt(rawStudent.rank) : undefined,
        examCount: Math.max(1, parseInt(rawStudent.examCount || rawStudent.no_exam) || 1),
        marks: this.cleanMarksData(rawStudent.marks || {}),
      };

      // Validate required fields
      if (!cleaned.id || !cleaned.adm || !cleaned.name) {
        return null;
      }

      return cleaned;
    } catch (error) {
      console.error('Error cleaning student data:', error);
      return null;
    }
  }

  /**
   * Cleans marks data
   */
  private static cleanMarksData(marks: any): Record<string, number[]> {
    const cleaned: Record<string, number[]> = {};

    if (typeof marks !== 'object' || marks === null) {
      return cleaned;
    }

    Object.entries(marks).forEach(([subject, subjectMarks]) => {
      if (!subject || typeof subject !== 'string') return;

      const cleanSubject = subject.toLowerCase().trim();
      if (!cleanSubject) return;

      let marksArray: number[] = [];
      
      if (Array.isArray(subjectMarks)) {
        marksArray = subjectMarks
          .map(mark => this.parseNumber(mark, 0, 100))
          .filter(mark => mark !== null) as number[];
      } else if (typeof subjectMarks === 'number') {
        const parsedMark = this.parseNumber(subjectMarks, 0, 100);
        if (parsedMark !== null) {
          marksArray = [parsedMark];
        }
      }

      if (marksArray.length > 0) {
        cleaned[cleanSubject] = marksArray;
      }
    });

    return cleaned;
  }

  /**
   * Safely parses number with bounds checking
   */
  private static parseNumber(value: any, min?: number, max?: number): number | null {
    const num = parseFloat(value);
    
    if (isNaN(num) || !isFinite(num)) {
      return null;
    }

    if (min !== undefined && num < min) return null;
    if (max !== undefined && num > max) return null;

    return num;
  }

  /**
   * Calculates variance for an array of numbers
   */
  private static calculateVariance(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    
    const mean = MathsEngine.calculateAverage(numbers);
    const squaredDifferences = numbers.map(num => Math.pow(num - mean, 2));
    
    return MathsEngine.calculateAverage(squaredDifferences);
  }

  /**
   * Exports processed data to various formats
   */
  static exportData(
    students: StudentData[],
    format: 'json' | 'csv' | 'excel'
  ): string | object {
    switch (format) {
      case 'json':
        return JSON.stringify(students, null, 2);
        
      case 'csv':
        return this.convertToCSV(students);
        
      case 'excel':
        // This would typically integrate with a library like xlsx
        return { message: 'Excel export requires additional implementation' };
        
      default:
        return students;
    }
  }

  /**
   * Converts student data to CSV format
   */
  private static convertToCSV(students: StudentData[]): string {
    if (students.length === 0) return '';

    const headers = [
      'ID', 'Admission No', 'Name', 'Form', 'Stream', 'Gender',
      'KCPE', 'Term', 'Year', 'Total Marks', 'Mean Score',
      'Mean Grade', 'Mean Points', 'Rank'
    ];

    // Add subject headers
    const allSubjects = new Set<string>();
    students.forEach(student => {
      Object.keys(student.marks).forEach(subject => allSubjects.add(subject));
    });
    
    headers.push(...Array.from(allSubjects).map(subject => `${subject.toUpperCase()}_AVG`));

    const csvRows = [headers.join(',')];

    students.forEach(student => {
      const row = [
        student.id,
        student.adm,
        `"${student.name}"`,
        student.form,
        student.stream || '',
        student.gender,
        student.kcpe || '',
        student.term,
        student.year,
        student.totalMarks || '',
        student.meanScore || '',
        student.meanGrade || '',
        student.meanPoints || '',
        student.rank || ''
      ];

      // Add subject averages
      allSubjects.forEach(subject => {
        const marks = student.marks[subject];
        const average = marks && marks.length > 0 
          ? MathsEngine.calculateAverage(marks) 
          : '';
        row.push(String(average));
      });

      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }
}