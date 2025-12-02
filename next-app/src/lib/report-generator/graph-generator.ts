import { StudentData, GraphData } from '@/types/report.types';
import { MathsEngine } from './maths-engine';

/**
 * Performance graph generation utilities
 */
export class GraphGenerator {
  /**
   * Generates performance comparison graph data
   */
  static generatePerformanceGraph(
    student: StudentData,
    classData?: StudentData[]
  ): GraphData {
    const labels = ['KCPE', `F${student.form}T${student.term}`];
    
    // Student's performance data
    const studentData = [
      student.kcpe ? Math.round(student.kcpe / 50) : 1, // Normalize KCPE to points scale
      student.meanPoints || 1,
    ];

    // Class average if available
    let classAverageData: number[] = [];
    if (classData && classData.length > 0) {
      const classKcpeAvg = MathsEngine.calculateAverage(
        classData.map(s => s.kcpe || 0).filter(k => k > 0)
      );
      const classMeanPointsAvg = MathsEngine.calculateAverage(
        classData.map(s => s.meanPoints || 0)
      );
      
      classAverageData = [
        Math.round(classKcpeAvg / 50),
        classMeanPointsAvg,
      ];
    }

    const datasets = [
      {
        label: 'Student Performance',
        data: studentData,
        backgroundColor: '#3b82f6',
        borderColor: '#1d4ed8',
      },
    ];

    if (classAverageData.length > 0) {
      datasets.push({
        label: 'Class Average',
        data: classAverageData,
        backgroundColor: '#10b981',
        borderColor: '#059669',
      });
    }

    return {
      labels,
      datasets,
      options: {
        title: 'Performance Comparison',
        xAxisLabel: 'Academic Level',
        yAxisLabel: 'Points',
        showLegend: datasets.length > 1,
      },
    };
  }

  /**
   * Generates subject performance radar chart data
   */
  static generateSubjectRadarChart(student: StudentData): GraphData {
    const subjects: string[] = [];
    const scores: number[] = [];

    Object.entries(student.marks).forEach(([subject, marks]) => {
      if (marks.length > 0) {
        const average = MathsEngine.calculateAverage(marks);
        subjects.push(this.getSubjectDisplayName(subject));
        scores.push(average);
      }
    });

    return {
      labels: subjects,
      datasets: [
        {
          label: 'Subject Performance',
          data: scores,
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: '#3b82f6',
        },
      ],
      options: {
        title: 'Subject Performance Overview',
        showLegend: false,
      },
    };
  }

  /**
   * Generates grade distribution chart for class analysis
   */
  static generateGradeDistribution(students: StudentData[]): GraphData {
    const gradeOrder = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E'];
    const gradeCounts: Record<string, number> = {};

    // Initialize all grades with 0
    gradeOrder.forEach(grade => {
      gradeCounts[grade] = 0;
    });

    // Count students in each grade
    students.forEach(student => {
      const grade = student.meanGrade || 'E';
      if (gradeCounts.hasOwnProperty(grade)) {
        gradeCounts[grade]++;
      }
    });

    const data = gradeOrder.map(grade => gradeCounts[grade]);
    const colors = this.generateGradeColors();

    return {
      labels: gradeOrder,
      datasets: [
        {
          label: 'Number of Students',
          data,
          backgroundColor: colors[0],
          borderColor: colors[0],
        },
      ],
      options: {
        title: 'Class Grade Distribution',
        xAxisLabel: 'Grades',
        yAxisLabel: 'Number of Students',
        showLegend: false,
      },
    };
  }

  /**
   * Generates performance trend chart
   */
  static generatePerformanceTrend(
    student: StudentData,
    historicalData?: { term: number; year: number; meanPoints: number }[]
  ): GraphData {
    if (!historicalData || historicalData.length === 0) {
      // Single point data
      return {
        labels: [`Form ${student.form} Term ${student.term}`],
        datasets: [
          {
            label: 'Mean Points',
            data: [student.meanPoints || 0],
            backgroundColor: '#3b82f6',
            borderColor: '#1d4ed8',
          },
        ],
        options: {
          title: 'Performance Trend',
          xAxisLabel: 'Academic Period',
          yAxisLabel: 'Mean Points',
          showLegend: false,
        },
      };
    }

    const labels = historicalData.map(
      (data) => `F${Math.ceil(data.term / 3)}T${data.term % 3 || 3}`
    );
    const data = historicalData.map((data) => data.meanPoints);

    return {
      labels,
      datasets: [
        {
          label: 'Mean Points',
          data,
          backgroundColor: '#3b82f6',
          borderColor: '#1d4ed8',
        },
      ],
      options: {
        title: 'Performance Trend Over Time',
        xAxisLabel: 'Academic Period',
        yAxisLabel: 'Mean Points',
        showLegend: false,
      },
    };
  }

  /**
   * Generates subject comparison chart
   */
  static generateSubjectComparison(
    student: StudentData,
    classAverages: Record<string, number>
  ): GraphData {
    const subjects: string[] = [];
    const studentScores: number[] = [];
    const classAverageScores: number[] = [];

    Object.entries(student.marks).forEach(([subject, marks]) => {
      if (marks.length > 0 && classAverages[subject]) {
        const studentAverage = MathsEngine.calculateAverage(marks);
        subjects.push(this.getSubjectDisplayName(subject));
        studentScores.push(studentAverage);
        classAverageScores.push(classAverages[subject]);
      }
    });

    return {
      labels: subjects,
      datasets: [
        {
          label: 'Student Score',
          data: studentScores,
          backgroundColor: '#3b82f6',
          borderColor: '#1d4ed8',
        },
        {
          label: 'Class Average',
          data: classAverageScores,
          backgroundColor: '#10b981',
          borderColor: '#059669',
        },
      ],
      options: {
        title: 'Student vs Class Average',
        xAxisLabel: 'Subjects',
        yAxisLabel: 'Percentage Score',
        showLegend: true,
      },
    };
  }

  /**
   * Generates exam progression chart for a student
   */
  static generateExamProgression(student: StudentData): GraphData {
    const examLabels = ['Exam 1', 'Exam 2', 'Exam 3'].slice(0, student.examCount);
    const subjectNames = Object.keys(student.marks).slice(0, 6); // Limit to 6 subjects for clarity
    
    const datasets = subjectNames.map((subject, index) => {
      const marks = student.marks[subject] || [];
      const color = this.getSubjectColor(index);
      
      return {
        label: this.getSubjectDisplayName(subject),
        data: marks,
        backgroundColor: color.background,
        borderColor: color.border,
      };
    });

    return {
      labels: examLabels,
      datasets,
      options: {
        title: 'Exam Performance Progression',
        xAxisLabel: 'Exams',
        yAxisLabel: 'Marks',
        showLegend: true,
      },
    };
  }

  /**
   * Generates points vs KCPE comparison
   */
  static generateKcpeComparison(students: StudentData[]): GraphData {
    const validStudents = students.filter(s => s.kcpe && s.kcpe > 0 && s.meanPoints);
    
    if (validStudents.length === 0) {
      return {
        labels: [],
        datasets: [],
        options: { title: 'Insufficient data for KCPE comparison' },
      };
    }

    // Group students by KCPE ranges
    const kcpeRanges = ['200-249', '250-299', '300-349', '350-399', '400-449', '450-500'];
    const averagePoints = kcpeRanges.map(range => {
      const [min, max] = range.split('-').map(Number);
      const studentsInRange = validStudents.filter(s => s.kcpe! >= min && s.kcpe! <= max);
      
      if (studentsInRange.length === 0) return 0;
      
      return MathsEngine.calculateAverage(studentsInRange.map(s => s.meanPoints!));
    });

    return {
      labels: kcpeRanges,
      datasets: [
        {
          label: 'Average Points',
          data: averagePoints,
          backgroundColor: '#8b5cf6',
          borderColor: '#7c3aed',
        },
      ],
      options: {
        title: 'KCPE vs Current Performance',
        xAxisLabel: 'KCPE Score Range',
        yAxisLabel: 'Average Points',
        showLegend: false,
      },
    };
  }

  /**
   * Gets display name for subject
   */
  private static getSubjectDisplayName(code: string): string {
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
      bst: 'Bus. Studies',
      agr: 'Agriculture',
    };
    return names[code.toLowerCase()] || code.toUpperCase();
  }

  /**
   * Generates colors for grades
   */
  private static generateGradeColors(): string[] {
    return [
      '#10b981', // A - Green
      '#34d399', // A- - Light Green
      '#60a5fa', // B+ - Blue
      '#3b82f6', // B - Blue
      '#6366f1', // B- - Indigo
      '#8b5cf6', // C+ - Purple
      '#a78bfa', // C - Light Purple
      '#f59e0b', // C- - Orange
      '#f97316', // D+ - Dark Orange
      '#ef4444', // D - Red
      '#dc2626', // D- - Dark Red
      '#991b1b', // E - Very Dark Red
    ];
  }

  /**
   * Gets color for subject based on index
   */
  private static getSubjectColor(index: number): { background: string; border: string } {
    const colors = [
      { background: '#3b82f6', border: '#1d4ed8' },
      { background: '#10b981', border: '#059669' },
      { background: '#f59e0b', border: '#d97706' },
      { background: '#ef4444', border: '#dc2626' },
      { background: '#8b5cf6', border: '#7c3aed' },
      { background: '#06b6d4', border: '#0891b2' },
      { background: '#84cc16', border: '#65a30d' },
      { background: '#f97316', border: '#ea580c' },
    ];
    
    return colors[index % colors.length];
  }

  /**
   * Converts graph data to SVG string for PDF embedding
   */
  static generateSVGChart(graphData: GraphData, width = 400, height = 300): string {
    // This is a simplified SVG generator
    // In a real implementation, you might use a library like D3.js or Chart.js
    
    const { labels, datasets } = graphData;
    if (!labels.length || !datasets.length) return '';

    const margin = 40;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;
    
    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Background
    svg += `<rect width="${width}" height="${height}" fill="white" stroke="#e5e7eb"/>`;
    
    // Title
    if (graphData.options?.title) {
      svg += `<text x="${width/2}" y="20" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold">${graphData.options.title}</text>`;
    }
    
    // Simple bar chart implementation
    const barWidth = chartWidth / labels.length;
    const maxValue = Math.max(...datasets.flatMap(d => d.data));
    
    datasets.forEach((dataset, datasetIndex) => {
      dataset.data.forEach((value, index) => {
        const barHeight = (value / maxValue) * chartHeight;
        const x = margin + index * barWidth + datasetIndex * (barWidth / datasets.length);
        const y = margin + chartHeight - barHeight;
        
        svg += `<rect x="${x}" y="${y}" width="${barWidth / datasets.length - 2}" height="${barHeight}" fill="${dataset.backgroundColor}" stroke="${dataset.borderColor}"/>`;
      });
    });
    
    // Labels
    labels.forEach((label, index) => {
      const x = margin + index * barWidth + barWidth / 2;
      const y = height - 10;
      svg += `<text x="${x}" y="${y}" text-anchor="middle" font-family="Arial" font-size="10">${label}</text>`;
    });
    
    svg += '</svg>';
    return svg;
  }
}