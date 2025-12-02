import {
  StudentData,
  ReportConfig,
  ReportGenerationOptions,
  ReportGenerationResponse,
  ReportMetadata,
  ApiResponse,
} from '@/types/report.types';
import { PDFGenerator } from './pdf-generator';
import { DataProcessor } from './data-processor';
import { ReportValidator } from './validator';
import { MathsEngine } from './maths-engine';

/**
 * Main report generation service that orchestrates all components
 */
export class ReportGeneratorService {
  private pdfGenerator: PDFGenerator;
  private config: ReportConfig;

  constructor(config?: Partial<ReportConfig>) {
    this.config = this.initializeConfig(config);
    this.pdfGenerator = new PDFGenerator(this.config);
  }

  /**
   * Generates a single student report
   */
  async generateStudentReport(
    studentData: StudentData | any,
    options: ReportGenerationOptions = { format: 'pdf' }
  ): Promise<ApiResponse<{ html: string; metadata: ReportMetadata }>> {
    try {
      const startTime = Date.now();

      // Clean and validate data
      const cleanedStudent = typeof studentData === 'object' && 'id' in studentData 
        ? studentData as StudentData
        : DataProcessor.cleanStudentData(studentData);

      if (!cleanedStudent) {
        return {
          success: false,
          message: 'Invalid student data provided',
          errors: ['Student data could not be processed'],
        };
      }

      // Validate student data
      const validation = ReportValidator.validateStudentData(cleanedStudent);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Validation failed',
          errors: validation.errors.map(e => e.message),
        };
      }

      // Process student marks
      const processedStudent = MathsEngine.processStudentMarks(cleanedStudent);

      // Generate report
      const html = await this.pdfGenerator.generateStudentReport(
        processedStudent,
        undefined,
        options
      );

      const metadata: ReportMetadata = {
        generatedAt: new Date(),
        generatedBy: 'ReportGeneratorService',
        version: '1.0.0',
        studentCount: 1,
        processingTime: Date.now() - startTime,
      };

      return {
        success: true,
        data: { html, metadata },
        message: 'Report generated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        errors: [String(error)],
      };
    }
  }

  /**
   * Generates batch reports for multiple students
   */
  async generateBatchReports(
    studentsData: (StudentData | any)[],
    options: ReportGenerationOptions = { format: 'pdf', batchMode: true }
  ): Promise<ApiResponse<{ html: string; metadata: ReportMetadata }>> {
    try {
      const startTime = Date.now();

      // Process raw data
      let processedStudents: StudentData[];
      
      if (Array.isArray(studentsData) && studentsData.length > 0) {
        if ('id' in studentsData[0] && 'marks' in studentsData[0]) {
          // Already processed StudentData
          processedStudents = studentsData as StudentData[];
        } else {
          // Raw data from database
          processedStudents = await DataProcessor.processStudentData(studentsData);
        }
      } else {
        return {
          success: false,
          message: 'No student data provided',
          errors: ['Empty or invalid students data array'],
        };
      }

      if (processedStudents.length === 0) {
        return {
          success: false,
          message: 'No valid students found in the data',
          errors: ['All student records failed validation'],
        };
      }

      // Validate batch
      const validation = ReportValidator.validateStudentBatch(processedStudents);
      if (!validation.isValid) {
        console.warn('Batch validation warnings:', validation.warnings);
        // Continue with warnings, but fail on errors
        if (validation.errors.length > 0) {
          return {
            success: false,
            message: 'Batch validation failed',
            errors: validation.errors.map(e => e.message),
          };
        }
      }

      // Rank students
      const rankedStudents = MathsEngine.rankStudents(processedStudents);

      // Generate batch report
      const result = await this.pdfGenerator.generateBatchReports(rankedStudents, options);

      return {
        success: true,
        data: result,
        message: `Batch report generated successfully for ${rankedStudents.length} students`,
        metadata: {
          total: rankedStudents.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Batch generation failed',
        errors: [String(error)],
      };
    }
  }

  /**
   * Generates class analysis report
   */
  async generateClassAnalysis(
    studentsData: (StudentData | any)[],
    filters?: {
      form?: number;
      stream?: string;
      gender?: 'M' | 'F';
    }
  ): Promise<ApiResponse<any>> {
    try {
      // Process data
      let students: StudentData[];
      
      if (Array.isArray(studentsData) && studentsData.length > 0) {
        if ('id' in studentsData[0] && 'marks' in studentsData[0]) {
          students = studentsData as StudentData[];
        } else {
          students = await DataProcessor.processStudentData(studentsData);
        }
      } else {
        return {
          success: false,
          message: 'No student data provided',
        };
      }

      // Apply filters
      if (filters) {
        students = DataProcessor.filterStudents(students, filters);
      }

      // Calculate performance metrics
      const performanceMetrics = DataProcessor.calculatePerformanceMetrics(students);
      
      // Analyze trends
      const trends = DataProcessor.analyzeGradeTrends(students);
      
      // Identify at-risk students
      const atRiskAnalysis = DataProcessor.identifyAtRiskStudents(students);
      
      // Subject performance comparison
      const subjectComparison = DataProcessor.compareSubjectPerformance(students);
      
      // Group students
      const groupings = {
        byForm: DataProcessor.groupStudents(students, 'form'),
        byGender: DataProcessor.groupStudents(students, 'gender'),
        byGrade: DataProcessor.groupStudents(students, 'grade'),
      };

      return {
        success: true,
        data: {
          summary: {
            totalStudents: students.length,
            averageScore: performanceMetrics.averageScore,
            filters: filters || {},
          },
          performanceMetrics,
          trends,
          atRiskAnalysis,
          subjectComparison,
          groupings,
        },
        message: 'Class analysis completed successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Analysis failed',
        errors: [String(error)],
      };
    }
  }

  /**
   * Processes raw database data into StudentData format
   */
  async processRawData(rawData: any[]): Promise<ApiResponse<StudentData[]>> {
    try {
      const processedStudents = await DataProcessor.processStudentData(rawData);
      
      return {
        success: true,
        data: processedStudents,
        message: `Processed ${processedStudents.length} student records`,
        metadata: {
          total: processedStudents.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Data processing failed',
        errors: [String(error)],
      };
    }
  }

  /**
   * Validates student data
   */
  validateStudentData(data: any): ApiResponse<{ isValid: boolean }> {
    try {
      const validation = ReportValidator.validateStudentData(data);
      
      return {
        success: validation.isValid,
        data: { isValid: validation.isValid },
        message: validation.isValid ? 'Data is valid' : 'Data validation failed',
        errors: validation.errors.map(e => e.message),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Validation process failed',
        errors: [String(error)],
      };
    }
  }

  /**
   * Updates service configuration
   */
  updateConfig(config: Partial<ReportConfig>): void {
    this.config = { ...this.config, ...config };
    this.pdfGenerator.updateConfig(this.config);
  }

  /**
   * Gets current configuration
   */
  getConfig(): ReportConfig {
    return { ...this.config };
  }

  /**
   * Exports data in various formats
   */
  exportData(
    students: StudentData[],
    format: 'json' | 'csv' | 'excel'
  ): ApiResponse<string | object> {
    try {
      const exportedData = DataProcessor.exportData(students, format);
      
      return {
        success: true,
        data: exportedData,
        message: `Data exported successfully as ${format.toUpperCase()}`,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Export failed',
        errors: [String(error)],
      };
    }
  }

  /**
   * Gets service health and statistics
   */
  getServiceHealth(): ApiResponse<any> {
    return {
      success: true,
      data: {
        status: 'healthy',
        version: '1.0.0',
        config: {
          schoolName: this.config.school.name,
          currentTerm: this.config.term,
          currentYear: this.config.year,
        },
        capabilities: [
          'Single student reports',
          'Batch report generation',
          'Class analysis',
          'Data validation',
          'Multiple export formats',
          'Performance analytics',
        ],
      },
      message: 'Service is running normally',
    };
  }

  /**
   * Initializes default configuration
   */
  private initializeConfig(config?: Partial<ReportConfig>): ReportConfig {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentTerm = currentMonth < 4 ? 1 : currentMonth < 8 ? 2 : 3;

    return {
      school: {
        name: 'Demo School',
        level: 'secondary',
        box: 'P.O. Box 123, Demo City',
        telephone: '+254 700 000 000',
        motto: 'Excellence Through Education',
        ...config?.school,
      },
      term: config?.term || currentTerm,
      year: config?.year || currentYear,
      reportTitle: config?.reportTitle || 'Student Terminal Report',
      layout: {
        pageSize: 'A4',
        margins: { top: 20, bottom: 20, left: 15, right: 15 },
        colors: {
          primary: '#2563eb',
          secondary: '#64748b',
          text: '#1f2937',
          border: '#d1d5db',
        },
        fonts: {
          title: 'Arial Black',
          heading: 'Arial Bold',
          body: 'Arial',
          caption: 'Arial Italic',
        },
        ...config?.layout,
      },
    };
  }

  /**
   * Utility method to generate sample data for testing
   */
  generateSampleData(count = 10): StudentData[] {
    const subjects = ['eng', 'mat', 'kis', 'bio', 'che', 'phy', 'geo', 'his'];
    const names = [
      'John Doe', 'Jane Smith', 'Michael Johnson', 'Emily Davis', 'David Wilson',
      'Sarah Brown', 'James Jones', 'Lisa Miller', 'Robert Taylor', 'Mary Anderson'
    ];

    return Array.from({ length: count }, (_, index) => {
      const marks: Record<string, number[]> = {};
      
      subjects.forEach(subject => {
        marks[subject] = [
          Math.floor(Math.random() * 40) + 40, // 40-80
          Math.floor(Math.random() * 40) + 40,
          Math.floor(Math.random() * 40) + 40,
        ];
      });

      const student: StudentData = {
        id: `student_${index + 1}`,
        adm: `${1000 + index}`,
        name: names[index % names.length],
        form: Math.floor(Math.random() * 4) + 1,
        gender: Math.random() > 0.5 ? 'M' : 'F',
        kcpe: Math.floor(Math.random() * 200) + 250,
        term: this.config.term,
        year: this.config.year,
        examCount: 3,
        marks,
      };

      return MathsEngine.processStudentMarks(student);
    });
  }
}