// Export all report generator components
export * from './constants';
export * from './validator';
export * from './maths-engine';
export * from './comment-generator';
export * from './graph-generator';
export * from './data-processor';
export * from './pdf-generator';
export * from './report-generator.service';

// Main service export for easy access
export { ReportGeneratorService as ReportGenerator } from './report-generator.service';

// Type exports
export type {
  StudentData,
  ReportConfig,
  ReportGenerationOptions,
  SchoolInfo,
  GraphData,
  PerformanceMetrics,
  ValidationResult,
  ApiResponse,
} from '@/types/report.types';