import {
  StudentData,
  ReportConfig,
  ReportGenerationOptions,
  ReportMetadata,
  SchoolInfo,
  SubjectData,
} from '@/types/report.types';
import { MathsEngine } from './maths-engine';
import { CommentGenerator } from './comment-generator';
import { GraphGenerator } from './graph-generator';
import { ReportValidator } from './validator';
import { DEFAULT_SCHOOL_CONFIG, DEFAULT_LAYOUT_CONFIG } from './constants';

/**
 * Main PDF report generator using HTML to PDF conversion
 */
export class PDFGenerator {
  private config: ReportConfig;
  private commentGenerator: CommentGenerator;

  constructor(config: Partial<ReportConfig> = {}) {
    this.config = {
      school: { ...DEFAULT_SCHOOL_CONFIG, ...config.school },
      term: config.term || 1,
      year: config.year || new Date().getFullYear(),
      reportTitle: config.reportTitle || 'Student Terminal Report',
      layout: { ...DEFAULT_LAYOUT_CONFIG, ...config.layout },
    };
    
    this.commentGenerator = new CommentGenerator();
  }

  /**
   * Generates HTML report for a single student
   */
  async generateStudentReport(
    student: StudentData,
    classData?: StudentData[],
    options: ReportGenerationOptions = { format: 'pdf' }
  ): Promise<string> {
    // Validate student data
    const validation = ReportValidator.validateStudentData(student);
    if (!validation.isValid) {
      throw new Error(`Invalid student data: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    // Process student data
    const processedStudent = MathsEngine.processStudentMarks(student);
    
    // Generate report sections
    const html = this.generateReportHTML(processedStudent, classData, options);
    
    return html;
  }

  /**
   * Generates batch reports for multiple students
   */
  async generateBatchReports(
    students: StudentData[],
    options: ReportGenerationOptions = { format: 'pdf', batchMode: true }
  ): Promise<{ html: string; metadata: ReportMetadata }> {
    const startTime = Date.now();

    // Validate batch data
    const validation = ReportValidator.validateStudentBatch(students);
    if (!validation.isValid) {
      throw new Error(`Invalid batch data: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    // Process and rank students
    const processedStudents = students.map(student => MathsEngine.processStudentMarks(student));
    const rankedStudents = MathsEngine.rankStudents(processedStudents);

    // Generate individual reports
    const reportPromises = rankedStudents.map(student => 
      this.generateReportHTML(student, rankedStudents, options)
    );
    
    const reports = await Promise.all(reportPromises);
    const combinedHTML = reports.join('\n<div style="page-break-before: always;"></div>\n');

    const metadata: ReportMetadata = {
      generatedAt: new Date(),
      generatedBy: 'System',
      version: '1.0.0',
      studentCount: students.length,
      processingTime: Date.now() - startTime,
    };

    return { html: combinedHTML, metadata };
  }

  /**
   * Generates complete HTML report for a student
   */
  private generateReportHTML(
    student: StudentData,
    classData?: StudentData[],
    options: ReportGenerationOptions = { format: 'pdf' }
  ): string {
    const sections = options.sections || {
      header: true,
      studentDetails: true,
      resultsTable: true,
      performanceGraph: true,
      comments: true,
      footer: true,
    };

    let html = this.generateHTMLStructure();
    
    if (sections.header) {
      html += this.generateHeader();
    }
    
    if (sections.studentDetails) {
      html += this.generateStudentDetails(student);
    }
    
    if (sections.resultsTable) {
      html += this.generateResultsTable(student);
    }
    
    if (sections.performanceGraph) {
      html += this.generatePerformanceSection(student, classData);
    }
    
    if (sections.comments) {
      html += this.generateComments(student);
    }
    
    if (sections.footer) {
      html += this.generateFooter();
    }

    html += this.closeHTMLStructure();
    
    return html;
  }

  /**
   * Generates HTML document structure with styles
   */
  private generateHTMLStructure(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.config.reportTitle}</title>
    <style>
        ${this.getReportStyles()}
    </style>
</head>
<body>
    <div class="report-container">`;
  }

  /**
   * Closes HTML structure
   */
  private closeHTMLStructure(): string {
    return `
    </div>
</body>
</html>`;
  }

  /**
   * Generates CSS styles for the report
   */
  private getReportStyles(): string {
    const { colors, fonts } = this.config.layout!;
    
    return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${fonts.body}, Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: ${colors.text};
        }
        
        .report-container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }
        
        .report-frame {
            border: 2px solid ${colors.border};
            padding: 15px;
            min-height: 280mm;
        }
        
        .header-section {
            text-align: center;
            border-bottom: 1px solid ${colors.border};
            padding-bottom: 15px;
            margin-bottom: 15px;
        }
        
        .school-logo {
            width: 60px;
            height: 60px;
            float: left;
            margin-right: 15px;
        }
        
        .school-info h1 {
            font-family: ${fonts.title}, Arial, sans-serif;
            color: ${colors.primary};
            font-size: 20px;
            margin-bottom: 5px;
        }
        
        .school-info h2 {
            font-family: ${fonts.heading}, Arial, sans-serif;
            font-size: 16px;
            margin-bottom: 3px;
        }
        
        .school-details {
            font-size: 11px;
            color: ${colors.secondary};
        }
        
        .student-details {
            border: 1px solid ${colors.border};
            padding: 10px;
            margin-bottom: 15px;
        }
        
        .student-info-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-bottom: 10px;
        }
        
        .info-item {
            display: flex;
            align-items: center;
        }
        
        .info-label {
            font-weight: bold;
            margin-right: 5px;
            min-width: 80px;
        }
        
        .info-value {
            border-bottom: 1px solid ${colors.border};
            flex: 1;
            padding: 2px 5px;
        }
        
        .results-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            font-size: 10px;
        }
        
        .results-table th,
        .results-table td {
            border: 1px solid ${colors.border};
            padding: 4px;
            text-align: center;
        }
        
        .results-table th {
            background-color: #f8f9fa;
            font-weight: bold;
        }
        
        .subject-name {
            text-align: left;
            font-weight: bold;
        }
        
        .performance-section {
            border: 1px solid ${colors.border};
            padding: 10px;
            margin-bottom: 15px;
        }
        
        .graph-container {
            text-align: center;
            margin: 10px 0;
        }
        
        .comments-section {
            margin-bottom: 15px;
        }
        
        .comment-box {
            border: 1px solid ${colors.border};
            padding: 10px;
            margin-bottom: 10px;
        }
        
        .comment-header {
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .comment-text {
            min-height: 30px;
            border-bottom: 1px dotted ${colors.border};
            padding-bottom: 5px;
        }
        
        .signature-area {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
        }
        
        .signature-box {
            width: 100px;
            height: 40px;
            border: 1px solid ${colors.border};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
        }
        
        .footer {
            text-align: center;
            border-top: 1px solid ${colors.border};
            padding-top: 10px;
            margin-top: 20px;
            font-size: 10px;
            color: ${colors.secondary};
        }
        
        .closing-info {
            text-align: center;
            margin: 15px 0;
            font-size: 11px;
        }
        
        .school-stamp {
            border: 2px solid ${colors.border};
            width: 150px;
            height: 80px;
            margin: 15px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        
        @media print {
            .report-container {
                margin: 0;
                padding: 0;
            }
            
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    `;
  }

  /**
   * Generates report header section
   */
  private generateHeader(): string {
    const { school } = this.config;
    
    return `
        <div class="report-frame">
            <div class="header-section">
                ${school.logo ? `<img src="${school.logo}" alt="School Logo" class="school-logo" />` : ''}
                <div class="school-info">
                    <h1>${school.name.toUpperCase()} ${school.level.toUpperCase()} SCHOOL</h1>
                    <div class="school-details">
                        <p>P.O. BOX ${school.box.toUpperCase()}</p>
                        <p>TEL. ${school.telephone}</p>
                        <p><em>Motto: ${school.motto}</em></p>
                    </div>
                </div>
                <div style="clear: both;"></div>
                <h2 style="margin-top: 15px; color: #059669;">${this.config.reportTitle}</h2>
            </div>`;
  }

  /**
   * Generates student details section
   */
  private generateStudentDetails(student: StudentData): string {
    return `
        <div class="student-details">
            <div class="student-info-grid">
                <div class="info-item">
                    <span class="info-label">STUDENT NAME:</span>
                    <span class="info-value">${student.name.toUpperCase()}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">ADM NO:</span>
                    <span class="info-value">${student.adm}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">FORM:</span>
                    <span class="info-value">${student.form}${student.stream || ''}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">TERM:</span>
                    <span class="info-value">${student.term}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">YEAR:</span>
                    <span class="info-value">${student.year}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">GENDER:</span>
                    <span class="info-value">${student.gender}</span>
                </div>
            </div>
            <div class="student-info-grid">
                <div class="info-item">
                    <span class="info-label">TOTAL MARKS:</span>
                    <span class="info-value">${student.totalMarks || 0}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">MEAN GRADE:</span>
                    <span class="info-value">${student.meanGrade || 'E'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">POINTS:</span>
                    <span class="info-value">${student.meanPoints || 1}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">POSITION:</span>
                    <span class="info-value">${student.rank || '-'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">OUT OF:</span>
                    <span class="info-value">-</span>
                </div>
                <div class="info-item">
                    <span class="info-label">KCPE:</span>
                    <span class="info-value">${student.kcpe || '-'}</span>
                </div>
            </div>
        </div>`;
  }

  /**
   * Generates results table
   */
  private generateResultsTable(student: StudentData): string {
    const examHeaders = Array.from({ length: student.examCount }, (_, i) => 
      `<th>Exam ${i + 1}</th>`
    ).join('');

    let tableRows = '';
    
    Object.entries(student.marks).forEach(([subjectCode, marks]) => {
      if (marks.length === 0) return;

      const subjectName = this.getSubjectFullName(subjectCode);
      const average = MathsEngine.calculateAverage(marks);
      const grade = MathsEngine.calculateGrade(average);
      
      const markCells = Array.from({ length: student.examCount }, (_, i) => 
        `<td>${marks[i] !== undefined ? marks[i] : '-'}</td>`
      ).join('');

      tableRows += `
        <tr>
          <td class="subject-name">${subjectName}</td>
          ${markCells}
          <td><strong>${Math.round(average)}%</strong></td>
          <td><strong>${grade.grade}</strong></td>
          <td><strong>${grade.points}</strong></td>
          <td>-</td>
          <td style="text-align: left; font-style: italic;">${grade.comment.english}</td>
          <td>-</td>
        </tr>`;
    });

    return `
        <table class="results-table">
            <thead>
                <tr>
                    <th rowspan="2">SUBJECT</th>
                    ${examHeaders}
                    <th rowspan="2">% MARK</th>
                    <th rowspan="2">GRADE</th>
                    <th rowspan="2">POINTS</th>
                    <th rowspan="2">POS</th>
                    <th rowspan="2">REMARK</th>
                    <th rowspan="2">INITIALS</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>`;
  }

  /**
   * Generates performance section with graphs
   */
  private generatePerformanceSection(student: StudentData, classData?: StudentData[]): string {
    const graphData = GraphGenerator.generatePerformanceGraph(student, classData);
    const svgChart = GraphGenerator.generateSVGChart(graphData, 400, 200);

    return `
        <div class="performance-section">
            <h3 style="text-align: center; margin-bottom: 10px;">PERFORMANCE ANALYSIS</h3>
            <div class="graph-container">
                ${svgChart}
            </div>
        </div>`;
  }

  /**
   * Generates comments section
   */
  private generateComments(student: StudentData): string {
    const classTeacherComment = this.commentGenerator.generateClassTeacherComment(student);
    const principalComment = this.commentGenerator.generatePrincipalComment(student);

    return `
        <div class="comments-section">
            <div class="comment-box">
                <div class="comment-header">CLASS TEACHER'S REMARKS:</div>
                <div class="comment-text">${classTeacherComment}</div>
                <div class="signature-area">
                    <div class="signature-box">SIGN</div>
                    <div class="signature-box">DATE</div>
                </div>
            </div>
            
            <div class="comment-box">
                <div class="comment-header">PRINCIPAL'S REMARKS:</div>
                <div class="comment-text">${principalComment}</div>
                <div class="signature-area">
                    <div class="signature-box">SIGN</div>
                    <div class="signature-box">DATE</div>
                </div>
            </div>
            
            <div class="school-stamp">SCHOOL STAMP</div>
        </div>`;
  }

  /**
   * Generates footer section
   */
  private generateFooter(): string {
    const currentDate = new Date().toLocaleDateString();
    
    return `
            <div class="closing-info">
                <p>School officially closes today <u>${currentDate}</u> and reopens on <u>_______________</u></p>
            </div>
            
            <div class="footer">
                <p>Generated on ${new Date().toLocaleString()} | Report Generation System v1.0</p>
            </div>
        </div>`; // Closes report-frame
  }

  /**
   * Gets full subject name from code
   */
  private getSubjectFullName(code: string): string {
    const names: Record<string, string> = {
      eng: 'ENGLISH',
      mat: 'MATHEMATICS',
      kis: 'KISWAHILI',
      bio: 'BIOLOGY',
      che: 'CHEMISTRY',
      phy: 'PHYSICS',
      geo: 'GEOGRAPHY',
      his: 'HISTORY',
      cre: 'CRE',
      ire: 'IRE',
      bst: 'BUSINESS STUDIES',
      agr: 'AGRICULTURE',
    };
    return names[code.toLowerCase()] || code.toUpperCase();
  }

  /**
   * Updates configuration
   */
  updateConfig(config: Partial<ReportConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Gets current configuration
   */
  getConfig(): ReportConfig {
    return { ...this.config };
  }
}