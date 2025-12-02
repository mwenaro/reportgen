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
    this.pdf = new jsPDF('p', 'mm', 'A4');
    this.studentData = studentData;
    this.reportFrameWidth = this.pageWidth - (2 * this.margin);
    this.reportFrameHeight = this.pageHeight - (2 * this.margin);
  }

  // Helper method to wrap text and ensure it fits within width
  private wrapText(text: string, maxWidth: number, fontSize: number = 8): string[] {
    this.pdf.setFontSize(fontSize);
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = this.pdf.getTextWidth(testLine);
      
      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          // Word is too long, truncate it
          lines.push(word.substring(0, Math.floor(word.length * maxWidth / testWidth)));
        }
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  }

  // Helper method to truncate text to fit within width
  private truncateText(text: string, maxWidth: number, fontSize: number = 8): string {
    this.pdf.setFontSize(fontSize);
    if (this.pdf.getTextWidth(text) <= maxWidth) {
      return text;
    }
    
    // Try to break at word boundaries first
    const words = text.split(' ');
    if (words.length > 1) {
      for (let i = words.length - 1; i > 0; i--) {
        const truncated = words.slice(0, i).join(' ') + '...';
        if (this.pdf.getTextWidth(truncated) <= maxWidth) {
          return truncated;
        }
      }
    }
    
    // Fall back to character truncation
    for (let i = text.length - 1; i > 0; i--) {
      const truncated = text.substring(0, i) + '...';
      if (this.pdf.getTextWidth(truncated) <= maxWidth) {
        return truncated;
      }
    }
    
    return '...';
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
    const maxTextWidth = this.reportFrameWidth - 4; // 2mm margin on each side
    
    // School logo (if available)
    if (schoolInfo.logoPath) {
      try {
        this.pdf.addImage(schoolInfo.logoPath, 'PNG', this.margin + 2, this.margin + 2, 25, this.headerHeight - 4);
      } catch (error) {
        console.warn('Could not load school logo:', error);
      }
    }

    // School name - ensure it fits
    this.pdf.setFontSize(18); // Reduced from 20
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(220, 50, 50);
    
    const schoolTitle = `${schoolInfo.name.toUpperCase()} ${schoolInfo.level.toUpperCase()} SCHOOL`;
    const truncatedTitle = this.truncateText(schoolTitle, maxTextWidth, 18);
    const titleWidth = this.pdf.getTextWidth(truncatedTitle);
    const titleX = Math.max(this.margin + 2, (this.pageWidth - titleWidth) / 2);
    
    this.pdf.text(truncatedTitle, titleX, this.margin + 12);

    // School address
    this.pdf.setFontSize(12); // Reduced from 13
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(50, 50, 50);
    
    const address = `P.O. BOX ${schoolInfo.box.toUpperCase()}`;
    const truncatedAddress = this.truncateText(address, maxTextWidth, 12);
    const addressWidth = this.pdf.getTextWidth(truncatedAddress);
    const addressX = Math.max(this.margin + 2, (this.pageWidth - addressWidth) / 2);
    
    this.pdf.text(truncatedAddress, addressX, this.margin + 20);

    // Telephone
    this.pdf.setFontSize(11); // Reduced from 12
    this.pdf.setFont('helvetica', 'italic');
    
    const tel = `TEL: ${schoolInfo.telephone}`;
    const truncatedTel = this.truncateText(tel, maxTextWidth, 11);
    const telWidth = this.pdf.getTextWidth(truncatedTel);
    const telX = Math.max(this.margin + 2, (this.pageWidth - telWidth) / 2);
    
    this.pdf.text(truncatedTel, telX, this.margin + 26);

    // Motto
    this.pdf.setFontSize(10); // Reduced from 12
    this.pdf.setFont('helvetica', 'bolditalic');
    
    const motto = `Motto: ${schoolInfo.motto}`;
    const truncatedMotto = this.truncateText(motto, maxTextWidth, 10);
    const mottoWidth = this.pdf.getTextWidth(truncatedMotto);
    const mottoX = Math.max(this.margin + 2, (this.pageWidth - mottoWidth) / 2);
    
    this.pdf.text(truncatedMotto, mottoX, this.margin + 32);
  }

  private drawStudentDetails(): void {
    const startY = this.margin + this.headerHeight + 2;
    const maxWidth = this.reportFrameWidth - 4;
    
    // Report title
    this.pdf.setFontSize(14); // Reduced from 15
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0, 150, 0); // Darker green for better readability
    
    const reportTitle = 'STUDENT TERMINAL REPORT FORM';
    const truncatedTitle = this.truncateText(reportTitle, maxWidth, 14);
    const titleWidth = this.pdf.getTextWidth(truncatedTitle);
    const titleX = Math.max(this.margin + 2, (this.pageWidth - titleWidth) / 2);
    
    this.pdf.text(truncatedTitle, titleX, startY + 6);

    // Student details - Row 1 with better spacing
    this.pdf.setFontSize(7); // Reduced from 8
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFont('helvetica', 'normal');
    
    let currentX = this.margin + 2;
    let currentY = startY + 12;
    const fieldSpacing = 2; // Space between fields
    const availableWidth = this.reportFrameWidth - 4;

    // Name field
    this.pdf.text('NAME:', currentX, currentY);
    currentX += 18;
    
    this.pdf.setFont('helvetica', 'bold');
    const truncatedName = this.truncateText(this.studentData.name.toUpperCase(), 45, 7);
    this.pdf.text(truncatedName, currentX, currentY);
    this.pdf.line(currentX, currentY + 1, currentX + 45, currentY + 1);
    currentX += 45 + fieldSpacing;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('ADM:', currentX, currentY);
    currentX += 12;
    
    this.pdf.setFont('helvetica', 'bold');
    const truncatedAdm = this.truncateText(this.studentData.admissionNumber, 15, 7);
    this.pdf.text(truncatedAdm, currentX, currentY);
    this.pdf.line(currentX, currentY + 1, currentX + 15, currentY + 1);
    currentX += 15 + fieldSpacing;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('FORM:', currentX, currentY);
    currentX += 15;
    
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(this.studentData.class, currentX, currentY);
    this.pdf.line(currentX, currentY + 1, currentX + 12, currentY + 1);
    currentX += 12 + fieldSpacing;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('TERM:', currentX, currentY);
    currentX += 15;
    
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(this.studentData.term, currentX, currentY);
    this.pdf.line(currentX, currentY + 1, currentX + 8, currentY + 1);
    currentX += 8 + fieldSpacing;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('YEAR:', currentX, currentY);
    currentX += 12;
    
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(this.studentData.year, currentX, currentY);
    this.pdf.line(currentX, currentY + 1, currentX + 12, currentY + 1);

    // Performance details - Row 2
    currentX = this.margin + 2;
    currentY += 8;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('TOTAL MARKS:', currentX, currentY);
    currentX += 25;
    
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(this.studentData.totalMarks.toString(), currentX, currentY);
    this.pdf.line(currentX, currentY + 1, currentX + 20, currentY + 1);
    currentX += 20 + fieldSpacing;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('MEAN GRADE:', currentX, currentY);
    currentX += 26;
    
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(this.studentData.meanGrade, currentX, currentY);
    this.pdf.line(currentX, currentY + 1, currentX + 15, currentY + 1);
    currentX += 15 + fieldSpacing;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('POINTS:', currentX, currentY);
    currentX += 18;
    
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(this.studentData.meanPoints.toString(), currentX, currentY);
    this.pdf.line(currentX, currentY + 1, currentX + 15, currentY + 1);
    currentX += 15 + fieldSpacing;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('POS:', currentX, currentY);
    currentX += 12;
    
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(this.studentData.position.toString(), currentX, currentY);
    this.pdf.line(currentX, currentY + 1, currentX + 10, currentY + 1);
    currentX += 10 + fieldSpacing;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('OUT OF:', currentX, currentY);
    currentX += 18;
    
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(this.studentData.outOf.toString(), currentX, currentY);
    this.pdf.line(currentX, currentY + 1, currentX + 12, currentY + 1);

    // KCPE details - Row 3
    currentX = this.margin + 2;
    currentY += 8;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('KCPE MARKS:', currentX, currentY);
    currentX += 25;
    
    this.pdf.setFont('helvetica', 'bold');
    const kcpeMark = this.studentData.kcpe > 0 ? this.studentData.kcpe.toString() : '-';
    this.pdf.text(kcpeMark, currentX, currentY);
    this.pdf.line(currentX, currentY + 1, currentX + 20, currentY + 1);
    currentX += 20 + fieldSpacing;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('MEAN GRADE:', currentX, currentY);
    currentX += 26;
    
    this.pdf.setFont('helvetica', 'bold');
    const kcpeGrade = this.studentData.kcpe > 0 ? this.studentData.kcpeGrade : '-';
    this.pdf.text(kcpeGrade, currentX, currentY);
    this.pdf.line(currentX, currentY + 1, currentX + 15, currentY + 1);
    currentX += 15 + fieldSpacing;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('POINTS:', currentX, currentY);
    currentX += 18;
    
    this.pdf.setFont('helvetica', 'bold');
    const kcpePoints = this.studentData.kcpe > 0 ? this.studentData.kcpePoints.toString() : '-';
    this.pdf.text(kcpePoints, currentX, currentY);
    this.pdf.line(currentX, currentY + 1, currentX + 15, currentY + 1);
  }

  private drawResultsTable(): void {
    const startY = this.margin + this.headerHeight + this.studentDetailsHeight;
    const tableData: string[][] = [];
    const headers = ['Subject', 'CAT', 'Exam', 'Total', 'Grade', 'Points', 'Pos', 'Remark', 'Teacher'];

    // Calculate available width for optimal column distribution
    const availableWidth = this.reportFrameWidth - 2; // Account for table borders
    
    // Precise column widths that sum to 100%
    const columnWidths = {
      subject: availableWidth * 0.24,   // 24%
      cat: availableWidth * 0.07,      // 7%
      exam: availableWidth * 0.07,     // 7%
      total: availableWidth * 0.08,    // 8%
      grade: availableWidth * 0.08,    // 8%
      points: availableWidth * 0.08,   // 8%
      position: availableWidth * 0.07, // 7%
      remark: availableWidth * 0.23,   // 23%
      teacher: availableWidth * 0.08   // 8%
    }; // Total: 100%
    
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

    // Draw table using autoTable with proportional column sizing
    const mainTableResult = autoTable(this.pdf, {
      startY: startY + 2,
      head: [headers],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: { top: 2, right: 2, bottom: 2, left: 2 },
        lineColor: [0, 0, 0],
        lineWidth: 0.4,
        overflow: 'linebreak',
        cellWidth: 'auto',
        valign: 'middle',
        halign: 'left',
      },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 8,
        halign: 'center',
        valign: 'middle',
      },
      columnStyles: {
        0: { 
          cellWidth: columnWidths.subject,
          overflow: 'linebreak',
          halign: 'left'
        },
        1: { 
          cellWidth: columnWidths.cat,
          halign: 'center' 
        },
        2: { 
          cellWidth: columnWidths.exam,
          halign: 'center' 
        },
        3: { 
          cellWidth: columnWidths.total,
          halign: 'center',
          fontStyle: 'bold'
        },
        4: { 
          cellWidth: columnWidths.grade,
          halign: 'center',
          fontStyle: 'bold'
        },
        5: { 
          cellWidth: columnWidths.points,
          halign: 'center' 
        },
        6: { 
          cellWidth: columnWidths.position,
          halign: 'center' 
        },
        7: { 
          cellWidth: columnWidths.remark,
          overflow: 'linebreak',
          halign: 'left'
        },
        8: { 
          cellWidth: columnWidths.teacher,
          halign: 'center',
          fontSize: 7
        },
      },
      margin: { left: this.margin + 1, right: this.margin + 1 },
      tableWidth: availableWidth,
      showHead: 'everyPage',
    });

    // Performance summary table - positioned below the main table
    const summaryY = (this.pdf as any).lastAutoTable.finalY + 8;
    // Create a more compact summary table
    const summaryData = [[
      `${this.studentData.term} ${this.studentData.year}`,
      `${this.studentData.totalMarks}/${this.studentData.subjects.length * 100}`,
      `${this.studentData.subjects.reduce((sum, s) => sum + s.points, 0)}/${this.studentData.subjects.length * 12}`,
      this.studentData.meanPoints.toString(),
      this.studentData.meanGrade,
      `${this.studentData.position}/${this.studentData.outOf}`
    ]];

    const summaryHeaders = ['Term/Year', 'Total Marks', 'Total Points', 'Mean Points', 'Mean Grade', 'Position'];

    autoTable(this.pdf, {
      startY: summaryY,
      head: [summaryHeaders],
      body: summaryData,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: { top: 1.5, right: 1, bottom: 1.5, left: 1 },
        lineColor: [0, 0, 0],
        lineWidth: 0.4,
        cellWidth: 'auto',
        halign: 'center',
        valign: 'middle',
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 8,
        halign: 'center',
      },
      columnStyles: {
        0: { cellWidth: availableWidth * 0.18 }, // Term/Year - 18%
        1: { cellWidth: availableWidth * 0.18, fontStyle: 'bold' }, // Total Marks - 18%
        2: { cellWidth: availableWidth * 0.18, fontStyle: 'bold' }, // Total Points - 18%
        3: { cellWidth: availableWidth * 0.15, fontStyle: 'bold' }, // Mean Points - 15%
        4: { cellWidth: availableWidth * 0.15, fontStyle: 'bold', fillColor: [255, 255, 0] }, // Mean Grade - 15%
        5: { cellWidth: availableWidth * 0.16, fontStyle: 'bold' }, // Position - 16%
      },
      margin: { left: this.margin + 1, right: this.margin + 1 },
      tableWidth: availableWidth,
    });
  }

  private drawPerformanceAnalysis(): void {
    const startY = this.margin + this.headerHeight + this.studentDetailsHeight + this.resultsHeight + 5;
    const maxWidth = this.reportFrameWidth - 4;
    
    // Simple performance graph (bar chart simulation)
    this.pdf.setFontSize(9); // Reduced from 10
    this.pdf.setFont('helvetica', 'bold');
    const analysisTitle = 'PERFORMANCE ANALYSIS';
    const truncatedAnalysis = this.truncateText(analysisTitle, maxWidth * 0.6, 9);
    this.pdf.text(truncatedAnalysis, this.margin + 5, startY + 10);

    // Draw bars for KCPE vs Current performance - ensure they fit
    const barWidth = 25; // Reduced from 30
    const barHeight = 35; // Reduced from 40
    const startX = this.margin + 15; // Reduced margin
    const maxBarX = this.margin + this.reportFrameWidth - barWidth - 5;
    
    // KCPE bar
    if (this.studentData.kcpe > 0 && startX <= maxBarX) {
      const kcpeHeight = (this.studentData.kcpePoints / 12) * barHeight;
      this.pdf.setFillColor(100, 150, 200);
      this.pdf.rect(startX, startY + barHeight - kcpeHeight + 15, barWidth, kcpeHeight, 'F');
      
      this.pdf.setFontSize(7); // Reduced from 8
      this.pdf.text('KCPE', startX + 3, startY + barHeight + 25);
      this.pdf.text(this.studentData.kcpePoints.toString(), startX + 6, startY + barHeight + 30);
    }

    // Current performance bar
    const currentBarX = startX + 35; // Reduced spacing
    if (currentBarX <= maxBarX) {
      const currentHeight = (this.studentData.meanPoints / 12) * barHeight;
      this.pdf.setFillColor(200, 100, 100);
      this.pdf.rect(currentBarX, startY + barHeight - currentHeight + 15, barWidth, currentHeight, 'F');
      
      this.pdf.setFontSize(7);
      const currentLabel = `F${this.studentData.form}T${this.studentData.term}`;
      const truncatedLabel = this.truncateText(currentLabel, barWidth, 7);
      this.pdf.text(truncatedLabel, currentBarX + 1, startY + barHeight + 25);
      this.pdf.text(this.studentData.meanPoints.toString(), currentBarX + 6, startY + barHeight + 30);
    }

    // Draw histogram placeholder - adjust position based on available space
    const histogramX = Math.min(startX + 80, this.margin + this.reportFrameWidth * 0.5);
    const histogramMaxWidth = this.margin + this.reportFrameWidth - histogramX - 5;
    
    if (histogramMaxWidth > 40) { // Only draw if there's enough space
      this.pdf.setFontSize(8); // Reduced from 9
      const histogramTitle = 'Mean Grades Histogram';
      const truncatedHistogram = this.truncateText(histogramTitle, histogramMaxWidth, 8);
      this.pdf.text(truncatedHistogram, histogramX, startY + 15);
      
      // Simple line showing progression - fit within available space
      const lineWidth = Math.min(50, histogramMaxWidth - 5);
      this.pdf.line(histogramX, startY + 25, histogramX + lineWidth, startY + 25);
      this.pdf.line(histogramX, startY + 25, histogramX, startY + 45);
      
      // Plot points for years - adjust spacing
      const years = ['F1', 'F2', 'F3', 'F4'];
      const yearSpacing = Math.min(10, lineWidth / years.length);
      years.forEach((year, index) => {
        const x = histogramX + 5 + (index * yearSpacing);
        if (x < this.margin + this.reportFrameWidth - 10) { // Ensure within bounds
          this.pdf.text(year, x, startY + 50);
          
          if (year === `F${this.studentData.form}`) {
            this.pdf.setFillColor(200, 0, 0);
            this.pdf.circle(x + 3, startY + 30, 1.5, 'F'); // Smaller circle
          }
        }
      });
    }
  }

  private drawComments(): void {
    const startY = this.margin + this.headerHeight + this.studentDetailsHeight + this.resultsHeight + this.graphHeight + 5;
    const maxWidth = this.reportFrameWidth - 4;
    const commentWidth = maxWidth * 0.7; // Leave space for initials
    
    this.pdf.setFontSize(8); // Reduced from 9
    this.pdf.setFont('helvetica', 'normal');

    // Class Teacher's Comments
    this.pdf.setFont('helvetica', 'bold');
    const classLabel = "CLASS TEACHER'S REMARKS:";
    const truncatedClassLabel = this.truncateText(classLabel, maxWidth, 8);
    this.pdf.text(truncatedClassLabel, this.margin + 2, startY + 8);
    
    this.pdf.setFont('helvetica', 'normal');
    const classTeacherComment = this.generateClassTeacherComment();
    const truncatedClassComment = this.truncateText(classTeacherComment, commentWidth, 8);
    this.pdf.text(truncatedClassComment, this.margin + 2, startY + 15);
    
    const classLineEnd = Math.min(this.margin + commentWidth, this.margin + this.reportFrameWidth - 25);
    this.pdf.line(this.margin + 2, startY + 17, classLineEnd, startY + 17);
    
    // Teacher initials
    this.pdf.setFont('helvetica', 'italic');
    const initialsX = Math.min(classLineEnd + 5, this.margin + this.reportFrameWidth - 15);
    this.pdf.text('C.M', initialsX, startY + 15);
    this.pdf.line(initialsX - 2, startY + 17, initialsX + 12, startY + 17);

    // Principal's Comments
    this.pdf.setFont('helvetica', 'bold');
    const principalLabel = "PRINCIPAL'S REMARKS:";
    const truncatedPrincipalLabel = this.truncateText(principalLabel, maxWidth, 8);
    this.pdf.text(truncatedPrincipalLabel, this.margin + 2, startY + 25);
    
    this.pdf.setFont('helvetica', 'normal');
    const principalComment = this.generatePrincipalComment();
    const truncatedPrincipalComment = this.truncateText(principalComment, commentWidth, 8);
    this.pdf.text(truncatedPrincipalComment, this.margin + 2, startY + 32);
    
    const principalLineEnd = Math.min(this.margin + commentWidth, this.margin + this.reportFrameWidth - 25);
    this.pdf.line(this.margin + 2, startY + 34, principalLineEnd, startY + 34);
    
    // Principal initials
    this.pdf.setFont('helvetica', 'italic');
    const principalInitialsX = Math.min(principalLineEnd + 5, this.margin + this.reportFrameWidth - 15);
    this.pdf.text('R.K', principalInitialsX, startY + 32);
    this.pdf.line(principalInitialsX - 2, startY + 34, principalInitialsX + 12, startY + 34);

    // School stamp area - ensure it fits
    const stampWidth = Math.min(80, this.reportFrameWidth - 20);
    const stampX = this.margin + (this.reportFrameWidth - stampWidth) / 2;
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.rect(stampX, startY + 42, stampWidth, 12);
    this.pdf.setFontSize(7);
    this.pdf.text('School Stamp', stampX + stampWidth / 2 - 15, startY + 50);

    // Closing comment - wrap text properly
    this.pdf.setFontSize(8); // Reduced from 11
    this.pdf.setFont('helvetica', 'normal');
    const closingY = startY + 60;
    const closingText1 = 'The School has been officially closed today';
    const closingText2 = 'and Next Term begins';
    
    const truncatedClosing1 = this.truncateText(closingText1, maxWidth * 0.6, 8);
    const truncatedClosing2 = this.truncateText(closingText2, maxWidth * 0.4, 8);
    
    this.pdf.text(truncatedClosing1, this.margin + 2, closingY);
    const text1Width = this.pdf.getTextWidth(truncatedClosing1);
    this.pdf.line(this.margin + text1Width + 5, closingY + 1, this.margin + text1Width + 25, closingY + 1);
    
    const text2X = this.margin + text1Width + 30;
    if (text2X < this.margin + this.reportFrameWidth - 40) {
      this.pdf.text(truncatedClosing2, text2X, closingY);
      const text2Width = this.pdf.getTextWidth(truncatedClosing2);
      this.pdf.line(text2X + text2Width + 5, closingY + 1, text2X + text2Width + 25, closingY + 1);
    }
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

// Export utility functions are included above