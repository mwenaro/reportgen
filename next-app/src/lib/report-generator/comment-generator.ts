import { StudentData, CommentTemplate } from '@/types/report.types';
import { COMMENT_TEMPLATES } from './constants';

/**
 * Automated comment generation system
 */
export class CommentGenerator {
  private templates: typeof COMMENT_TEMPLATES;
  private customTemplates: CommentTemplate[];

  constructor(customTemplates: CommentTemplate[] = []) {
    this.templates = COMMENT_TEMPLATES;
    this.customTemplates = customTemplates;
  }

  /**
   * Generates class teacher comment
   */
  generateClassTeacherComment(student: StudentData): string {
    const performanceLevel = this.getPerformanceLevel(student);
    const behaviorComment = this.getBehaviorComment(student);
    const effortComment = this.getEffortComment(student);

    const templates = this.templates.classTeacher[performanceLevel];
    const baseComment = this.getRandomTemplate(templates);

    // Personalize the comment
    return this.personalizeComment(baseComment, student, {
      behavior: behaviorComment,
      effort: effortComment,
    });
  }

  /**
   * Generates principal comment
   */
  generatePrincipalComment(student: StudentData): string {
    const performanceLevel = this.getPerformanceLevel(student);
    const weakSubjects = this.getWeakSubjects(student);
    const strongSubjects = this.getStrongSubjects(student);

    const templates = this.templates.principal[performanceLevel];
    let baseComment = this.getRandomTemplate(templates);

    // Add subject-specific advice
    if (weakSubjects.length > 0) {
      const subjectAdvice = this.generateSubjectAdvice(weakSubjects, 'weak');
      baseComment += ` ${subjectAdvice}`;
    }

    if (strongSubjects.length > 0 && performanceLevel === 'excellent') {
      const subjectAdvice = this.generateSubjectAdvice(strongSubjects, 'strong');
      baseComment += ` ${subjectAdvice}`;
    }

    return this.personalizeComment(baseComment, student);
  }

  /**
   * Determines performance level based on grade and points
   */
  private getPerformanceLevel(student: StudentData): 'excellent' | 'good' | 'average' | 'poor' {
    const points = student.meanPoints || 0;
    const grade = student.meanGrade || 'E';

    if (points >= 10 || ['A', 'A-', 'B+'].includes(grade)) {
      return 'excellent';
    }
    if (points >= 7 || ['B', 'B-', 'C+'].includes(grade)) {
      return 'good';
    }
    if (points >= 4 || ['C', 'C-', 'D+'].includes(grade)) {
      return 'average';
    }
    return 'poor';
  }

  /**
   * Gets behavior comment based on performance consistency
   */
  private getBehaviorComment(student: StudentData): string {
    const behaviors = [
      'well-behaved',
      'disciplined',
      'respectful',
      'cooperative',
      'attentive',
    ];

    // For better performing students, use more positive behaviors
    const performanceLevel = this.getPerformanceLevel(student);
    if (performanceLevel === 'excellent') {
      return this.getRandomFromArray(['exemplary', 'outstanding', 'exceptional']);
    }
    if (performanceLevel === 'good') {
      return this.getRandomFromArray(behaviors.slice(0, 3));
    }
    return this.getRandomFromArray(['developing', 'improving', 'learning']);
  }

  /**
   * Gets effort comment based on grade trends
   */
  private getEffortComment(student: StudentData): string {
    const efforts = {
      high: ['dedicated', 'hardworking', 'committed', 'diligent'],
      medium: ['consistent', 'steady', 'regular', 'fair'],
      low: ['needs more effort', 'requires improvement', 'should work harder'],
    };

    const performanceLevel = this.getPerformanceLevel(student);
    if (performanceLevel === 'excellent' || performanceLevel === 'good') {
      return this.getRandomFromArray(efforts.high);
    }
    if (performanceLevel === 'average') {
      return this.getRandomFromArray(efforts.medium);
    }
    return this.getRandomFromArray(efforts.low);
  }

  /**
   * Identifies weak subjects (grades D+ and below)
   */
  private getWeakSubjects(student: StudentData): string[] {
    const weakSubjects: string[] = [];
    const weakGrades = ['D+', 'D', 'D-', 'E'];

    Object.entries(student.marks).forEach(([subject, marks]) => {
      if (marks.length > 0) {
        const average = marks.reduce((sum, mark) => sum + mark, 0) / marks.length;
        const grade = this.calculateGradeFromMark(average);
        
        if (weakGrades.includes(grade)) {
          weakSubjects.push(this.getSubjectFullName(subject));
        }
      }
    });

    return weakSubjects;
  }

  /**
   * Identifies strong subjects (grades B and above)
   */
  private getStrongSubjects(student: StudentData): string[] {
    const strongSubjects: string[] = [];
    const strongGrades = ['A', 'A-', 'B+', 'B'];

    Object.entries(student.marks).forEach(([subject, marks]) => {
      if (marks.length > 0) {
        const average = marks.reduce((sum, mark) => sum + mark, 0) / marks.length;
        const grade = this.calculateGradeFromMark(average);
        
        if (strongGrades.includes(grade)) {
          strongSubjects.push(this.getSubjectFullName(subject));
        }
      }
    });

    return strongSubjects;
  }

  /**
   * Generates subject-specific advice
   */
  private generateSubjectAdvice(subjects: string[], type: 'weak' | 'strong'): string {
    if (subjects.length === 0) return '';

    const subjectList = this.formatSubjectList(subjects);
    
    if (type === 'weak') {
      const advice = [
        `More effort is required in ${subjectList}.`,
        `Focus on improving performance in ${subjectList}.`,
        `Seek additional help in ${subjectList}.`,
        `Pay special attention to ${subjectList}.`,
      ];
      return this.getRandomFromArray(advice);
    } else {
      const advice = [
        `Excellent performance in ${subjectList}.`,
        `Keep up the good work in ${subjectList}.`,
        `Outstanding achievement in ${subjectList}.`,
      ];
      return this.getRandomFromArray(advice);
    }
  }

  /**
   * Formats list of subjects for comments
   */
  private formatSubjectList(subjects: string[]): string {
    if (subjects.length === 1) {
      return subjects[0];
    }
    if (subjects.length === 2) {
      return `${subjects[0]} and ${subjects[1]}`;
    }
    
    const lastSubject = subjects[subjects.length - 1];
    const otherSubjects = subjects.slice(0, -1);
    return `${otherSubjects.join(', ')} and ${lastSubject}`;
  }

  /**
   * Personalizes comment with student-specific information
   */
  private personalizeComment(
    baseComment: string,
    student: StudentData,
    extras?: { behavior?: string; effort?: string }
  ): string {
    let comment = baseComment;

    // Replace gender pronouns
    const pronoun = student.gender === 'M' ? 'He' : 'She';
    const pronounLower = student.gender === 'M' ? 'he' : 'she';
    const possessive = student.gender === 'M' ? 'his' : 'her';

    comment = comment.replace(/\bHe\b/g, pronoun);
    comment = comment.replace(/\bhe\b/g, pronounLower);
    comment = comment.replace(/\bhis\b/g, possessive);
    comment = comment.replace(/\bher\b/g, possessive);

    // Add behavior and effort if provided
    if (extras?.behavior && extras?.effort) {
      comment = comment.replace('student', `${extras.behavior} and ${extras.effort} student`);
    }

    return comment;
  }

  /**
   * Gets random template from array
   */
  private getRandomTemplate(templates: readonly string[]): string {
    const randomIndex = Math.floor(Math.random() * templates.length);
    return templates[randomIndex];
  }

  /**
   * Gets random item from array
   */
  private getRandomFromArray<T>(array: T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  /**
   * Calculates grade from mark
   */
  private calculateGradeFromMark(mark: number): string {
    if (mark >= 80) return 'A';
    if (mark >= 75) return 'A-';
    if (mark >= 70) return 'B+';
    if (mark >= 65) return 'B';
    if (mark >= 60) return 'B-';
    if (mark >= 55) return 'C+';
    if (mark >= 50) return 'C';
    if (mark >= 45) return 'C-';
    if (mark >= 40) return 'D+';
    if (mark >= 35) return 'D';
    if (mark >= 30) return 'D-';
    return 'E';
  }

  /**
   * Gets full subject name
   */
  private getSubjectFullName(code: string): string {
    const names: Record<string, string> = {
      eng: 'English',
      mat: 'Mathematics',
      kis: 'Kiswahili',
      bio: 'Biology',
      che: 'Chemistry',
      phy: 'Physics',
      geo: 'Geography',
      his: 'History',
      cre: 'CRE',
      ire: 'IRE',
      bst: 'Business Studies',
      agr: 'Agriculture',
    };
    return names[code.toLowerCase()] || code.toUpperCase();
  }

  /**
   * Adds custom comment templates
   */
  addCustomTemplates(templates: CommentTemplate[]): void {
    this.customTemplates.push(...templates);
  }

  /**
   * Gets context-aware comment based on custom conditions
   */
  getContextualComment(student: StudentData, context: string): string {
    const applicableTemplates = this.customTemplates.filter(template => {
      if (!template.conditions) return true;

      const { conditions } = template;
      
      if (conditions.gender && conditions.gender !== student.gender) return false;
      if (conditions.formLevel && !conditions.formLevel.includes(student.form)) return false;
      if (conditions.performanceLevel && conditions.performanceLevel !== this.getPerformanceLevel(student)) return false;

      return true;
    });

    if (applicableTemplates.length === 0) {
      return this.generateClassTeacherComment(student);
    }

    const template = this.getRandomFromArray(applicableTemplates);
    const comments = context === 'principal' ? template.templates.principal : template.templates.classTeacher;
    
    return this.personalizeComment(this.getRandomFromArray(comments), student);
  }
}