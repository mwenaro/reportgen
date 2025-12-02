import { jsPDF } from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';

// Type definitions for autoTable options
interface AutoTableOptions extends UserOptions {}

export interface Subject {
  code: string;
  name: string;
  marks: number[];
  grade: string;
  points: number;
  position: string;
  remark: string;
  teacher: string;
}

export interface StudentData {
  name: string;
  admissionNumber: string;
  form: string;
  class: string;
  term: string;
  year: string;
  gender: 'M' | 'F';
  kcpe: number;
  subjects: Subject[];
  totalMarks: number;
  meanGrade: string;
  meanPoints: number;
  position: number;
  outOf: number;
  kcpeGrade: string;
  kcpePoints: number;
  schoolInfo: {
    name: string;
    level: string;
    box: string;
    telephone: string;
    motto: string;
    logoPath?: string;
  };
}

export class MathUtils {
  static gradeMapping = [
    { min: 80, max: 100, grade: 'A', points: 12, remark: 'Excellent!', kiswahili: 'Bora Sana!' },
    { min: 75, max: 79, grade: 'A-', points: 11, remark: 'Very Good!', kiswahili: 'Heko!' },
    { min: 70, max: 74, grade: 'B+', points: 10, remark: 'Very Good!', kiswahili: 'Vizuri Sana!' },
    { min: 65, max: 69, grade: 'B', points: 9, remark: 'Good!', kiswahili: 'Vizuri!' },
    { min: 60, max: 64, grade: 'B-', points: 8, remark: 'Good!', kiswahili: 'Vizuri!' },
    { min: 55, max: 59, grade: 'C+', points: 7, remark: 'Fairly Good!', kiswahili: 'Umejaribu!' },
    { min: 50, max: 54, grade: 'C', points: 6, remark: 'Fair!', kiswahili: 'Umejaribu!' },
    { min: 45, max: 49, grade: 'C-', points: 5, remark: 'Fair!', kiswahili: 'Juhudi Zaidi!' },
    { min: 40, max: 44, grade: 'D+', points: 4, remark: 'Pull up!', kiswahili: 'Juhudi Zaidi!' },
    { min: 35, max: 39, grade: 'D', points: 3, remark: 'Can do better!', kiswahili: 'Ongeza Bidii!' },
    { min: 30, max: 34, grade: 'D-', points: 2, remark: 'Can do better!', kiswahili: 'Ongeza Bidii!' },
    { min: 0, max: 29, grade: 'E', points: 1, remark: 'Can do better!', kiswahili: 'Ongeza Bidii!' },
  ];

  static calculateGrade(marks: number | number[]): { grade: string; points: number; mark: number; remark: string; kiswahili: string } {
    const avgMark = Array.isArray(marks) ? this.average(marks) : marks;
    
    if (avgMark <= 0 || avgMark > 100) {
      return { grade: 'E', points: 1, mark: avgMark, remark: 'Can do better!', kiswahili: 'Ongeza Bidii!' };
    }

    const gradeInfo = this.gradeMapping.find(g => avgMark >= g.min && avgMark <= g.max) || this.gradeMapping[this.gradeMapping.length - 1];
    
    return {
      grade: gradeInfo.grade,
      points: gradeInfo.points,
      mark: Math.round(avgMark),
      remark: gradeInfo.remark,
      kiswahili: gradeInfo.kiswahili
    };
  }

  static average(marks: number[]): number {
    if (!marks || marks.length === 0) return 0;
    const validMarks = marks.filter(mark => !isNaN(mark) && mark >= 0);
    if (validMarks.length === 0) return 0;
    return validMarks.reduce((sum, mark) => sum + mark, 0) / validMarks.length;
  }

  static sum(marks: number[]): number {
    if (!marks || marks.length === 0) return 0;
    return marks.filter(mark => !isNaN(mark) && mark >= 0).reduce((sum, mark) => sum + mark, 0);
  }

  static calculateMeanPoints(subjects: Subject[]): number {
    if (!subjects || subjects.length === 0) return 0;
    const totalPoints = subjects.reduce((sum, subject) => sum + subject.points, 0);
    return Math.round((totalPoints / subjects.length) * 100) / 100;
  }
}

export class StudentReportGenerator {
  private pdf: jsPDF;
  private studentData: StudentData;
  private pageWidth: number = 210;
  private pageHeight: number = 297;
  private margin: number = 10;
  private reportFrameWidth: number;
  private reportFrameHeight: number;
  private currentY: number = 10;

  // Frame dimensions
  private headerHeight: number = 35;
  private studentDetailsHeight: number = 25;
  private resultsHeight: number = 80;
  private graphHeight: number = 60;
  private commentsHeight: number = 50;

  constructor(studentData: StudentData) {
    this.pdf = new jsPDF('P', 'mm', 'A4');
    this.studentData = studentData;
    this.reportFrameWidth = this.pageWidth - (2 * this.margin);
    this.reportFrameHeight = this.pageHeight - (2 * this.margin);
  }

  generateReport(): jsPDF {
    this.drawReportFrame();
    this.drawHeader();
    this.drawStudentDetails();
    this.drawResultsTable();
    this.drawPerformanceAnalysis();
    this.drawComments();
    this.drawFooter();
    
    return this.pdf;
  }

  private drawReportFrame(): void {
    // Main report frame
    this.pdf.rect(this.margin, this.margin, this.reportFrameWidth, this.reportFrameHeight);
    
    // Student details frame
    this.pdf.rect(this.margin, this.margin + this.headerHeight, this.reportFrameWidth, this.studentDetailsHeight);
    
    // Results frame
    this.pdf.rect(this.margin, this.margin + this.headerHeight + this.studentDetailsHeight, this.reportFrameWidth, this.resultsHeight);
    
    // Graph frame
    this.pdf.rect(this.margin, this.margin + this.headerHeight + this.studentDetailsHeight + this.resultsHeight, this.reportFrameWidth, this.graphHeight);
  }

  private drawHeader(): void {
    const schoolInfo = this.studentData.schoolInfo;
    
    // School logo (if available)
    if (schoolInfo.logoPath) {
      try {
        this.pdf.addImage(schoolInfo.logoPath, 'PNG', this.margin + 2, this.margin + 2, 25, this.headerHeight - 4);
      } catch (error) {
        console.warn('Could not load school logo:', error);
      }
    }

    // School name
    this.pdf.setFontSize(20);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(220, 50, 50);
    
    const schoolTitle = `${schoolInfo.name.toUpperCase()} ${schoolInfo.level.toUpperCase()} SCHOOL`;
    const titleWidth = this.pdf.getTextWidth(schoolTitle);
    const titleX = (this.pageWidth - titleWidth) / 2;
    
    this.pdf.text(schoolTitle, titleX, this.margin + 12);

    // School address
    this.pdf.setFontSize(13);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(50, 50, 50);
    
    const address = `P.O. BOX ${schoolInfo.box.toUpperCase()}`;
    const addressWidth = this.pdf.getTextWidth(address);
    const addressX = (this.pageWidth - addressWidth) / 2;
    
    this.pdf.text(address, addressX, this.margin + 20);

    // Telephone
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'italic');
    
    const tel = `TEL: ${schoolInfo.telephone}`;
    const telWidth = this.pdf.getTextWidth(tel);
    const telX = (this.pageWidth - telWidth) / 2;
    
    this.pdf.text(tel, telX, this.margin + 26);

    // Motto
    this.pdf.setFont('helvetica', 'bolditalic');
    
    const motto = `Motto: ${schoolInfo.motto}`;
    const mottoWidth = this.pdf.getTextWidth(motto);
    const mottoX = (this.pageWidth - mottoWidth) / 2;
    
    this.pdf.text(motto, mottoX, this.margin + 32);
  }

  private drawStudentDetails(): void {
    const startY = this.margin + this.headerHeight + 2;
    
    // Report title
    this.pdf.setFontSize(15);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0, 255, 0);
    
    const reportTitle = 'STUDENT TERMINAL REPORT FORM';
    const titleWidth = this.pdf.getTextWidth(reportTitle);
    const titleX = (this.pageWidth - titleWidth) / 2;
    
    this.pdf.text(reportTitle, titleX, startY + 6);

    // Student details - Row 1
    this.pdf.setFontSize(8);
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFont('helvetica', 'normal');
    
    const rowHeight = 4;
    const colWidth = this.reportFrameWidth / 9;
    let currentX = this.margin;
    let currentY = startY + 12;

    // Name, Admission, Form, Term, Year
    this.pdf.text('STUDENT NAME:', currentX, currentY);
    currentX += colWidth * 1.2;
    
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(this.studentData.name.toUpperCase(), currentX, currentY);
    this.pdf.line(currentX, currentY + 1, currentX + colWidth * 2.5, currentY + 1);
    currentX += colWidth * 2.5 + 5;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('ADM NO:', currentX, currentY);
    currentX += colWidth * 0.8;
    
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(this.studentData.admissionNumber, currentX, currentY);
    this.pdf.line(currentX, currentY + 1, currentX + colWidth * 0.5, currentY + 1);
    currentX += colWidth * 0.5 + 5;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('FORM:', currentX, currentY);
    currentX += colWidth * 0.8;
    
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(this.studentData.class, currentX, currentY);
    this.pdf.line(currentX, currentY + 1, currentX + colWidth * 0.5, currentY + 1);
    currentX += colWidth * 0.5 + 5;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('TERM:', currentX, currentY);
    currentX += colWidth * 0.8;
    
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(this.studentData.term, currentX, currentY);
    this.pdf.line(currentX, currentY + 1, currentX + colWidth * 0.5, currentY + 1);
    currentX += colWidth * 0.5 + 5;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('YEAR:', currentX, currentY);
    currentX += colWidth * 0.8;
    
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(this.studentData.year, currentX, currentY);
    this.pdf.line(currentX, currentY + 1, currentX + colWidth * 0.5, currentY + 1);

    // Performance details - Row 2
    currentX = this.margin;
    currentY += 8;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('TOTAL MARKS:', currentX, currentY);
    currentX += colWidth * 1.2;
    
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(this.studentData.totalMarks.toString(), currentX, currentY);
    this.pdf.line(currentX, currentY + 1, currentX + colWidth * 1.1, currentY + 1);
    currentX += colWidth * 1.1 + 5;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('MEAN GRADE:', currentX, currentY);
    currentX += colWidth * 1.2;
    
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(this.studentData.meanGrade, currentX, currentY);
    this.pdf.line(currentX, currentY + 1, currentX + colWidth * 1.0, currentY + 1);
    currentX += colWidth * 1.0 + 5;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('POINTS:', currentX, currentY);
    currentX += colWidth * 0.8;
    
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(this.studentData.meanPoints.toString(), currentX, currentY);
    this.pdf.line(currentX, currentY + 1, currentX + colWidth * 0.8, currentY + 1);
    currentX += colWidth * 0.8 + 5;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('POS:', currentX, currentY);
    currentX += colWidth * 0.8;
    
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(this.studentData.position.toString(), currentX, currentY);
    this.pdf.line(currentX, currentY + 1, currentX + colWidth * 0.5, currentY + 1);
    currentX += colWidth * 0.5 + 5;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('OUT OF:', currentX, currentY);
    currentX += colWidth * 1.0;
    
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(this.studentData.outOf.toString(), currentX, currentY);
    this.pdf.line(currentX, currentY + 1, currentX + colWidth * 0.5, currentY + 1);

    // KCPE details - Row 3
    currentX = this.margin;
    currentY += 8;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('KCPE MARKS:', currentX, currentY);
    currentX += colWidth * 1.2;
    
    this.pdf.setFont('helvetica', 'bold');
    const kcpeMark = this.studentData.kcpe > 0 ? this.studentData.kcpe.toString() : '-';
    this.pdf.text(kcpeMark, currentX, currentY);
    this.pdf.line(currentX, currentY + 1, currentX + colWidth * 1.1, currentY + 1);
    currentX += colWidth * 1.1 + 5;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('MEAN GRADE:', currentX, currentY);
    currentX += colWidth * 1.2;
    
    this.pdf.setFont('helvetica', 'bold');
    const kcpeGrade = this.studentData.kcpe > 0 ? this.studentData.kcpeGrade : '-';
    this.pdf.text(kcpeGrade, currentX, currentY);
    this.pdf.line(currentX, currentY + 1, currentX + colWidth * 1.0, currentY + 1);
    currentX += colWidth * 1.0 + 5;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('POINTS:', currentX, currentY);
    currentX += colWidth * 0.8;
    
    this.pdf.setFont('helvetica', 'bold');
    const kcpePoints = this.studentData.kcpe > 0 ? this.studentData.kcpePoints.toString() : '-';
    this.pdf.text(kcpePoints, currentX, currentY);
    this.pdf.line(currentX, currentY + 1, currentX + colWidth * 0.8, currentY + 1);
  }

  private drawResultsTable(): void {
    const startY = this.margin + this.headerHeight + this.studentDetailsHeight;
    const tableData = [];
    const headers = ['Subject', 'Opener', 'End Term', '% Mark', 'Grade', 'Points', 'Pos', 'Remark', 'Initials'];

    // Prepare table data
    this.studentData.subjects.forEach(subject => {
      const row = [
        subject.name.toUpperCase(),
        subject.marks[0] ? subject.marks[0].toString() : '-',
        subject.marks[1] ? subject.marks[1].toString() : '-',
        MathUtils.calculateGrade(subject.marks).mark.toString(),
        subject.grade,
        subject.points.toString(),
        subject.position,
        subject.code === 'kis' ? MathUtils.calculateGrade(subject.marks).kiswahili : subject.remark,
        subject.teacher
      ];
      tableData.push(row);
    });

    // Draw table using autoTable
    autoTable(this.pdf, {
      startY: startY + 2,
      head: [headers],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 8,
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Subject
        1: { cellWidth: 15, halign: 'center' }, // Opener
        2: { cellWidth: 15, halign: 'center' }, // End Term
        3: { cellWidth: 15, halign: 'center' }, // % Mark
        4: { cellWidth: 12, halign: 'center' }, // Grade
        5: { cellWidth: 12, halign: 'center' }, // Points
        6: { cellWidth: 15, halign: 'center' }, // Pos
        7: { cellWidth: 30 }, // Remark
        8: { cellWidth: 15, halign: 'center' }, // Initials
      },
      margin: { left: this.margin, right: this.margin },
      tableWidth: 'wrap',
    });

    // Performance summary table
    const summaryY = startY + this.resultsHeight - 25;
    const summaryData = [[
      this.studentData.term,
      this.studentData.year,
      this.studentData.totalMarks.toString(),
      (this.studentData.subjects.length * 100).toString(),
      this.studentData.subjects.reduce((sum, s) => sum + s.points, 0).toString(),
      (this.studentData.subjects.length * 12).toString(),
      this.studentData.meanPoints.toString(),
      this.studentData.meanGrade,
      this.studentData.position.toString(),
      this.studentData.outOf.toString(),
      '-',
      '-',
      '-'
    ]];

    const summaryHeaders = ['Term', 'Year', 'Marks Total', 'Marks Of', 'Points', 'Of', 'M.P', 'M.G', 'Pos', 'Of', 'Pos', 'Of', 'Dev'];

    autoTable(this.pdf, {
      startY: summaryY,
      head: [summaryHeaders],
      body: summaryData,
      theme: 'grid',
      styles: {
        fontSize: 7,
        cellPadding: 1,
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 7,
      },
      margin: { left: this.margin, right: this.margin },
    });
  }

  private drawPerformanceAnalysis(): void {
    const startY = this.margin + this.headerHeight + this.studentDetailsHeight + this.resultsHeight + 5;
    
    // Simple performance graph (bar chart simulation)
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('PERFORMANCE ANALYSIS', this.margin + 5, startY + 10);

    // Draw bars for KCPE vs Current performance
    const barWidth = 30;
    const barHeight = 40;
    const startX = this.margin + 20;
    
    // KCPE bar
    if (this.studentData.kcpe > 0) {
      const kcpeHeight = (this.studentData.kcpePoints / 12) * barHeight;
      this.pdf.setFillColor(100, 150, 200);
      this.pdf.rect(startX, startY + barHeight - kcpeHeight + 15, barWidth, kcpeHeight, 'F');
      
      this.pdf.setFontSize(8);
      this.pdf.text('KCPE', startX + 5, startY + barHeight + 25);
      this.pdf.text(this.studentData.kcpePoints.toString(), startX + 8, startY + barHeight + 30);
    }

    // Current performance bar
    const currentHeight = (this.studentData.meanPoints / 12) * barHeight;
    this.pdf.setFillColor(200, 100, 100);
    this.pdf.rect(startX + 50, startY + barHeight - currentHeight + 15, barWidth, currentHeight, 'F');
    
    this.pdf.setFontSize(8);
    this.pdf.text(`F${this.studentData.form}T${this.studentData.term}`, startX + 55, startY + barHeight + 25);
    this.pdf.text(this.studentData.meanPoints.toString(), startX + 58, startY + barHeight + 30);

    // Draw histogram placeholder
    this.pdf.setFontSize(9);
    this.pdf.text('A Histogram Showing Annual Mean Grades', startX + 100, startY + 15);
    
    // Simple line showing progression
    this.pdf.line(startX + 100, startY + 25, startX + 160, startY + 25);
    this.pdf.line(startX + 100, startY + 25, startX + 100, startY + 45);
    
    // Plot points for years
    const years = ['F1', 'F2', 'F3', 'F4'];
    years.forEach((year, index) => {
      const x = startX + 105 + (index * 12);
      this.pdf.text(year, x, startY + 50);
      
      if (year === `F${this.studentData.form}`) {
        this.pdf.setFillColor(200, 0, 0);
        this.pdf.circle(x + 3, startY + 30, 2, 'F');
      }
    });
  }

  private drawComments(): void {
    const startY = this.margin + this.headerHeight + this.studentDetailsHeight + this.resultsHeight + this.graphHeight + 5;
    
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'normal');

    // Class Teacher's Comments
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text("CLASS TEACHER'S REMARKS:", this.margin, startY + 8);
    
    this.pdf.setFont('helvetica', 'normal');
    const classTeacherComment = this.generateClassTeacherComment();
    this.pdf.text(classTeacherComment, this.margin, startY + 15);
    this.pdf.line(this.margin, startY + 17, this.margin + 140, startY + 17);
    
    // Teacher initials
    this.pdf.setFont('helvetica', 'italic');
    this.pdf.text('C.M', this.margin + 150, startY + 15);
    this.pdf.line(this.margin + 145, startY + 17, this.margin + 165, startY + 17);

    // Principal's Comments
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text("PRINCIPAL'S REMARKS:", this.margin, startY + 25);
    
    this.pdf.setFont('helvetica', 'normal');
    const principalComment = this.generatePrincipalComment();
    this.pdf.text(principalComment, this.margin, startY + 32);
    this.pdf.line(this.margin, startY + 34, this.margin + 140, startY + 34);
    
    // Principal initials
    this.pdf.setFont('helvetica', 'italic');
    this.pdf.text('R.K', this.margin + 150, startY + 32);
    this.pdf.line(this.margin + 145, startY + 34, this.margin + 165, startY + 34);

    // School stamp area
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.rect(this.margin + 50, startY + 42, 100, 15);
    this.pdf.text('School Stamp', this.margin + 90, startY + 52);

    // Closing comment
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    const closingY = startY + 65;
    this.pdf.text('The School has been officially closed today', this.margin, closingY);
    this.pdf.line(this.margin + 95, closingY + 1, this.margin + 130, closingY + 1);
    this.pdf.text('and Next Term begins', this.margin + 135, closingY);
    this.pdf.line(this.margin + 170, closingY + 1, this.margin + 200, closingY + 1);
  }

  private generateClassTeacherComment(): string {
    const meanPoints = this.studentData.meanPoints;
    
    if (meanPoints >= 10) {
      return 'Excellent performance! Keep up the outstanding work.';
    } else if (meanPoints >= 8) {
      return 'Very good performance. Continue with the same effort.';
    } else if (meanPoints >= 6) {
      return 'Good performance but you can do better with more effort.';
    } else if (meanPoints >= 4) {
      return 'Fair performance. You need to work harder in your studies.';
    } else {
      return 'Your performance needs improvement. Seek help and work harder.';
    }
  }

  private generatePrincipalComment(): string {
    const meanPoints = this.studentData.meanPoints;
    
    if (meanPoints >= 10) {
      return 'Outstanding academic achievement. Well done!';
    } else if (meanPoints >= 8) {
      return 'Commendable performance. Strive for excellence.';
    } else if (meanPoints >= 6) {
      return 'Satisfactory performance with room for improvement.';
    } else if (meanPoints >= 4) {
      return 'Below average performance. More dedication required.';
    } else {
      return 'Poor performance. Immediate intervention needed.';
    }
  }

  private drawFooter(): void {
    this.pdf.setFontSize(8);
    this.pdf.setFont('helvetica', 'italic');
    this.pdf.text(`Page 1 of 1`, this.pageWidth / 2 - 10, this.pageHeight - 5);
  }

  // Static method to generate and download report
  static async generateAndDownload(studentData: StudentData, filename?: string): Promise<void> {
    const generator = new StudentReportGenerator(studentData);
    const pdf = generator.generateReport();
    
    const fileName = filename || `${studentData.name.replace(/\s+/g, '_')}_Terminal_Report_${studentData.term}_${studentData.year}.pdf`;
    pdf.save(fileName);
  }

  // Static method to generate report as blob for preview
  static async generateBlob(studentData: StudentData): Promise<Blob> {
    const generator = new StudentReportGenerator(studentData);
    const pdf = generator.generateReport();
    
    return new Promise((resolve) => {
      const blob = pdf.output('blob');
      resolve(blob);
    });
  }
}

// Export utility functions
export { MathUtils };