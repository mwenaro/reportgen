# Report Generator TypeScript Implementation

A comprehensive, TypeScript-based report generation system for academic institutions, built with modern development practices and clean architecture.

## 🚀 Features

### Core Functionality
- **Single & Batch Report Generation**: Generate individual student reports or process entire classes
- **Comprehensive Grade Calculation**: Automated A-E grading system with points calculation
- **Performance Analytics**: Class statistics, subject analysis, and trend identification  
- **Automated Comments**: Context-aware teacher and principal comments
- **Data Validation**: Robust input validation with detailed error reporting
- **Multiple Export Formats**: HTML, PDF-ready, JSON, CSV exports

### Architecture Highlights
- **Clean Architecture**: Proper separation of concerns with dedicated services
- **Type Safety**: Full TypeScript implementation with comprehensive type definitions
- **Modular Design**: Easily extensible and maintainable component structure
- **Error Handling**: Comprehensive validation and error management
- **Performance Optimized**: Efficient algorithms for ranking and calculations

## 📁 Project Structure

```
src/lib/report-generator/
├── index.ts                          # Main exports
├── constants.ts                      # Grade boundaries and configurations
├── validator.ts                      # Data validation using Zod
├── maths-engine.ts                   # Grade calculations and statistics
├── comment-generator.ts              # Automated comment system
├── graph-generator.ts               # Performance visualization
├── data-processor.ts                # Data transformation utilities
├── pdf-generator.ts                 # HTML report generation
├── report-generator.service.ts       # Main orchestration service
└── __tests__/                       # Unit tests
    ├── maths-engine.test.ts
    └── validator.test.ts
```

## 🛠 Installation & Setup

```bash
# Install dependencies
npm install zod

# For PDF generation (optional)
npm install puppeteer
# or
npm install jspdf html2canvas
```

## 📖 Quick Start

### Basic Usage

```typescript
import { ReportGeneratorService } from '@/lib/report-generator';
import type { StudentData } from '@/types/report.types';

// Initialize the service
const reportService = new ReportGeneratorService({
  school: {
    name: 'Demo Secondary School',
    level: 'secondary',
    box: 'P.O. Box 123, Nairobi',
    telephone: '+254 700 000 000',
    motto: 'Excellence Through Education'
  },
  term: 1,
  year: 2024,
  reportTitle: 'End of Term Report'
});

// Student data
const studentData: StudentData = {
  id: 'student-001',
  adm: '1001',
  name: 'John Doe',
  form: 3,
  gender: 'M',
  kcpe: 320,
  term: 1,
  year: 2024,
  examCount: 2,
  marks: {
    eng: [75, 80],
    mat: [85, 90],
    kis: [70, 75],
    bio: [80, 85],
    che: [75, 80],
    phy: [70, 75],
    geo: [65, 70],
    his: [75, 80]
  }
};

// Generate single report
const result = await reportService.generateStudentReport(studentData);

if (result.success) {
  console.log('Report generated successfully!');
  console.log('HTML:', result.data?.html);
} else {
  console.error('Error:', result.message);
}
```

### Batch Report Generation

```typescript
// Process multiple students
const studentsData = [
  // Array of student data objects
];

const batchResult = await reportService.generateBatchReports(studentsData, {
  format: 'pdf',
  batchMode: true
});

if (batchResult.success) {
  console.log(`Generated reports for ${batchResult.data?.metadata.studentCount} students`);
}
```

### Class Analysis

```typescript
// Generate class analysis
const analysisResult = await reportService.generateClassAnalysis(studentsData, {
  form: 3,
  stream: 'A'
});

if (analysisResult.success) {
  console.log('Performance Metrics:', analysisResult.data?.performanceMetrics);
  console.log('At Risk Students:', analysisResult.data?.atRiskAnalysis);
}
```

## 🏗 Component Overview

### 1. MathsEngine
Handles all mathematical calculations and grading logic.

```typescript
import { MathsEngine } from '@/lib/report-generator';

// Calculate grade from percentage
const gradeData = MathsEngine.calculateGrade(75);
console.log(gradeData); // { grade: 'B+', points: 10, percentage: 75, comment: {...} }

// Process student marks
const processedStudent = MathsEngine.processStudentMarks(studentData);

// Rank students
const rankedStudents = MathsEngine.rankStudents(students, 'meanPoints');
```

### 2. ReportValidator
Comprehensive data validation using Zod schemas.

```typescript
import { ReportValidator } from '@/lib/report-generator';

// Validate student data
const validation = ReportValidator.validateStudentData(studentData);

if (!validation.isValid) {
  console.log('Errors:', validation.errors);
  console.log('Warnings:', validation.warnings);
}

// Sanitize data
const cleanData = ReportValidator.sanitizeStudentData(rawData);
```

### 3. CommentGenerator
Generates contextual comments for reports.

```typescript
import { CommentGenerator } from '@/lib/report-generator';

const commentor = new CommentGenerator();

const classTeacherComment = commentor.generateClassTeacherComment(student);
const principalComment = commentor.generatePrincipalComment(student);
```

### 4. GraphGenerator
Creates performance visualization data.

```typescript
import { GraphGenerator } from '@/lib/report-generator';

// Generate performance graph data
const graphData = GraphGenerator.generatePerformanceGraph(student, classData);

// Generate SVG chart
const svgChart = GraphGenerator.generateSVGChart(graphData, 400, 300);
```

### 5. DataProcessor
Handles data transformation and analysis.

```typescript
import { DataProcessor } from '@/lib/report-generator';

// Process raw database data
const processedStudents = await DataProcessor.processStudentData(rawData);

// Filter students
const filteredStudents = DataProcessor.filterStudents(students, {
  form: 3,
  gender: 'F'
});

// Export data
const csvData = DataProcessor.exportData(students, 'csv');
```

## 🔧 Configuration

### School Configuration
```typescript
const schoolConfig = {
  school: {
    name: 'Your School Name',
    level: 'secondary' as const,
    box: 'P.O. Box XXX, City',
    telephone: '+254 XXX XXX XXX',
    motto: 'Your School Motto',
    logo: 'path/to/logo.png' // optional
  }
};
```

### Layout Customization
```typescript
const layoutConfig = {
  layout: {
    pageSize: 'A4' as const,
    margins: { top: 20, bottom: 20, left: 15, right: 15 },
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      text: '#1f2937',
      border: '#d1d5db'
    },
    fonts: {
      title: 'Arial Black',
      heading: 'Arial Bold',
      body: 'Arial',
      caption: 'Arial Italic'
    }
  }
};
```

## 📊 Grade System

The system uses the Kenyan grading system:

| Grade | Points | Percentage Range |
|-------|---------|------------------|
| A     | 12      | 80-100          |
| A-    | 11      | 75-79           |
| B+    | 10      | 70-74           |
| B     | 9       | 65-69           |
| B-    | 8       | 60-64           |
| C+    | 7       | 55-59           |
| C     | 6       | 50-54           |
| C-    | 5       | 45-49           |
| D+    | 4       | 40-44           |
| D     | 3       | 35-39           |
| D-    | 2       | 30-34           |
| E     | 1       | 0-29            |

## ✅ Validation Rules

The system enforces these validation rules:

- **Student ID**: Required, non-empty string
- **Admission Number**: Required, non-empty string  
- **Name**: Minimum 2 characters
- **Form**: Integer between 1-4
- **Gender**: Must be 'M' or 'F'
- **Term**: Integer between 1-3
- **Year**: Between 2000-2100
- **Marks**: Numbers between 0-100
- **KCPE**: Between 0-500 (optional)

## 🧪 Testing

```bash
# Run tests
npm test

# Run specific test file
npm test maths-engine.test.ts

# Run with coverage
npm test -- --coverage
```

## 🚀 Performance Features

- **Batch Processing**: Efficiently handles large student datasets
- **Ranking Algorithms**: Optimized student ranking calculations
- **Memory Management**: Efficient data structures for large classes
- **Validation Caching**: Optimized validation for repeated operations
- **Asynchronous Processing**: Non-blocking report generation

## 🔄 Migration from PHP

This TypeScript implementation provides these improvements over the original PHP system:

### Security Enhancements
- ✅ Input validation with Zod schemas
- ✅ Type safety preventing runtime errors
- ✅ Sanitized data processing
- ✅ No SQL injection vulnerabilities

### Code Quality
- ✅ Modular, testable architecture
- ✅ Comprehensive error handling
- ✅ Clean separation of concerns
- ✅ Extensive unit test coverage
- ✅ TypeScript type safety

### Maintainability
- ✅ Configuration-driven design
- ✅ Extensible comment system
- ✅ Pluggable validation rules
- ✅ Easy styling customization

### Performance
- ✅ Optimized algorithms
- ✅ Efficient data structures
- ✅ Batch processing capabilities
- ✅ Memory-conscious operations

## 🤝 Contributing

1. Follow TypeScript best practices
2. Add tests for new features
3. Update type definitions
4. Document public APIs
5. Follow existing code patterns

## 📄 License

This implementation is part of the reportgen system and follows the same licensing terms as the parent project.

---

**Built with ❤️ using TypeScript, Zod, and modern web technologies**