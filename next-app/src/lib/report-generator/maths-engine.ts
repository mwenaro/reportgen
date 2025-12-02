import { GradeData, StudentData, SubjectData } from '@/types/report.types';
import { GRADE_BOUNDARIES } from './constants';

/**
 * Mathematics and grading utilities
 */
export class MathsEngine {
  /**
   * Calculates grade based on percentage
   */
  static calculateGrade(percentage: number, usePoints = false): GradeData {
    if (percentage < 0 || percentage > 100) {
      return {
        grade: 'E',
        points: 1,
        percentage,
        comment: {
          english: 'Invalid score',
          kiswahili: 'Alama batili',
        },
      };
    }

    for (const [grade, boundary] of Object.entries(GRADE_BOUNDARIES)) {
      if (percentage >= boundary.min && percentage <= boundary.max) {
        return {
          grade,
          points: boundary.points,
          percentage,
          comment: this.getGradeComment(grade, percentage),
        };
      }
    }

    // Fallback to E grade
    return {
      grade: 'E',
      points: 1,
      percentage,
      comment: {
        english: 'Can do better!',
        kiswahili: 'Ongeza Bidii!',
      },
    };
  }

  /**
   * Gets comment based on grade
   */
  private static getGradeComment(grade: string, percentage: number): { english: string; kiswahili: string } {
    const comments: Record<string, { english: string; kiswahili: string }> = {
      A: { english: 'Excellent!', kiswahili: 'Bora Sana!' },
      'A-': { english: 'Very Good!', kiswahili: 'Vizuri Sana!' },
      'B+': { english: 'Very Good!', kiswahili: 'Vizuri Sana!' },
      B: { english: 'Good!', kiswahili: 'Vizuri!' },
      'B-': { english: 'Good!', kiswahili: 'Vizuri!' },
      'C+': { english: 'Fairly Good!', kiswahili: 'Umejaribu!' },
      C: { english: 'Fair!', kiswahili: 'Umejaribu!' },
      'C-': { english: 'Fair!', kiswahili: 'Umejaribu!' },
      'D+': { english: 'Pull up!', kiswahili: 'Juhudi Zaidi!' },
      D: { english: 'Can do better!', kiswahili: 'Ongeza Bidii!' },
      'D-': { english: 'Can do better!', kiswahili: 'Ongeza Bidii!' },
      E: { english: 'Can do better!', kiswahili: 'Ongeza Bidii!' },
    };

    return comments[grade] || { english: 'Keep trying!', kiswahili: 'Endelea kujaribu!' };
  }

  /**
   * Calculates average from array of numbers
   */
  static calculateAverage(numbers: number[], decimalPlaces = 1): number {
    if (numbers.length === 0) return 0;
    
    const sum = numbers.reduce((acc, num) => acc + (isNaN(num) ? 0 : num), 0);
    const validNumbers = numbers.filter(num => !isNaN(num));
    
    if (validNumbers.length === 0) return 0;
    
    return Number((sum / validNumbers.length).toFixed(decimalPlaces));
  }

  /**
   * Calculates sum of array of numbers
   */
  static calculateSum(numbers: number[]): number {
    return numbers.reduce((acc, num) => acc + (isNaN(num) ? 0 : num), 0);
  }

  /**
   * Ranks students based on mean points or total marks
   */
  static rankStudents(
    students: StudentData[],
    rankBy: 'meanPoints' | 'totalMarks' | 'meanScore' = 'meanPoints'
  ): StudentData[] {
    return students
      .sort((a, b) => {
        const aValue = a[rankBy] || 0;
        const bValue = b[rankBy] || 0;
        return bValue - aValue; // Descending order
      })
      .map((student, index) => ({
        ...student,
        rank: index + 1,
      }));
  }

  /**
   * Calculates position of a value in a sorted array
   */
  static calculatePosition(value: number, sortedArray: number[]): number {
    const descendingArray = [...sortedArray].sort((a, b) => b - a);
    return descendingArray.indexOf(value) + 1;
  }

  /**
   * Processes individual student marks and calculates grades
   */
  static processStudentMarks(student: StudentData): StudentData {
    const subjects: Record<string, SubjectData> = {};
    let totalMarks = 0;
    let totalPoints = 0;
    let subjectCount = 0;

    // Process each subject
    Object.entries(student.marks).forEach(([subjectCode, marks]) => {
      if (marks.length === 0) return;

      const averageMark = this.calculateAverage(marks);
      const totalSubjectMarks = this.calculateSum(marks);
      const gradeData = this.calculateGrade(averageMark);

      subjects[subjectCode] = {
        code: subjectCode,
        name: this.getSubjectName(subjectCode),
        marks,
        grade: gradeData.grade,
        points: gradeData.points,
        percentage: gradeData.percentage,
        remark: gradeData.comment.english,
      };

      totalMarks += totalSubjectMarks;
      totalPoints += gradeData.points;
      subjectCount++;
    });

    // Calculate overall performance
    const meanScore = subjectCount > 0 ? totalMarks / (subjectCount * student.examCount) : 0;
    const meanPoints = subjectCount > 0 ? totalPoints / subjectCount : 0;
    const meanGrade = this.calculateGrade(meanPoints, true).grade;

    return {
      ...student,
      totalMarks: Math.round(totalMarks),
      meanScore: Math.round(meanScore),
      meanPoints: Number(meanPoints.toFixed(2)),
      meanGrade,
    };
  }

  /**
   * Gets full subject name from code
   */
  private static getSubjectName(code: string): string {
    const subjectNames: Record<string, string> = {
      eng: 'English',
      mat: 'Mathematics',
      kis: 'Kiswahili',
      bio: 'Biology',
      che: 'Chemistry',
      phy: 'Physics',
      geo: 'Geography',
      his: 'History',
      cre: 'Christian Religious Education',
      ire: 'Islamic Religious Education',
      bst: 'Business Studies',
      agr: 'Agriculture',
      fre: 'French',
      ger: 'German',
      art: 'Art & Design',
      mus: 'Music',
      hom: 'Home Science',
      pow: 'Power Mechanics',
    };

    return subjectNames[code.toLowerCase()] || code.toUpperCase();
  }

  /**
   * Calculates class statistics
   */
  static calculateClassStatistics(students: StudentData[]) {
    if (students.length === 0) {
      return {
        totalStudents: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        passRate: 0,
        gradeDistribution: {},
      };
    }

    const scores = students.map(s => s.meanScore || 0);
    const points = students.map(s => s.meanPoints || 0);
    
    const averageScore = this.calculateAverage(scores);
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);
    
    // Calculate pass rate (C- and above = points >= 5)
    const passCount = students.filter(s => (s.meanPoints || 0) >= 5).length;
    const passRate = (passCount / students.length) * 100;

    // Grade distribution
    const gradeDistribution: Record<string, number> = {};
    students.forEach(student => {
      const grade = student.meanGrade || 'E';
      gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1;
    });

    return {
      totalStudents: students.length,
      averageScore: Math.round(averageScore),
      highestScore: Math.round(highestScore),
      lowestScore: Math.round(lowestScore),
      passRate: Math.round(passRate),
      gradeDistribution,
    };
  }

  /**
   * Calculates subject-wise analysis
   */
  static calculateSubjectAnalysis(students: StudentData[]) {
    const subjectStats: Record<string, {
      average: number;
      highest: number;
      lowest: number;
      passRate: number;
      studentCount: number;
    }> = {};

    // Collect all subject codes
    const allSubjects = new Set<string>();
    students.forEach(student => {
      Object.keys(student.marks).forEach(subject => allSubjects.add(subject));
    });

    // Analyze each subject
    allSubjects.forEach(subjectCode => {
      const subjectScores: number[] = [];
      
      students.forEach(student => {
        if (student.marks[subjectCode] && student.marks[subjectCode].length > 0) {
          const average = this.calculateAverage(student.marks[subjectCode]);
          subjectScores.push(average);
        }
      });

      if (subjectScores.length > 0) {
        const average = this.calculateAverage(subjectScores);
        const highest = Math.max(...subjectScores);
        const lowest = Math.min(...subjectScores);
        const passCount = subjectScores.filter(score => score >= 50).length;
        const passRate = (passCount / subjectScores.length) * 100;

        subjectStats[subjectCode] = {
          average: Math.round(average),
          highest: Math.round(highest),
          lowest: Math.round(lowest),
          passRate: Math.round(passRate),
          studentCount: subjectScores.length,
        };
      }
    });

    return subjectStats;
  }

  /**
   * Normalizes marks to percentage if needed
   */
  static normalizeMarks(marks: number[], maxScore = 100): number[] {
    return marks.map(mark => {
      if (maxScore === 100) return mark;
      return Math.round((mark / maxScore) * 100);
    });
  }

  /**
   * Validates numeric data
   */
  static isValidNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
  }

  /**
   * Safely converts value to number
   */
  static toNumber(value: any, defaultValue = 0): number {
    const num = Number(value);
    return this.isValidNumber(num) ? num : defaultValue;
  }
}