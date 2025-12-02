// Grade calculation constants and utilities
export const GRADE_BOUNDARIES = {
  A: { min: 80, max: 100, points: 12 },
  'A-': { min: 75, max: 79, points: 11 },
  'B+': { min: 70, max: 74, points: 10 },
  B: { min: 65, max: 69, points: 9 },
  'B-': { min: 60, max: 64, points: 8 },
  'C+': { min: 55, max: 59, points: 7 },
  C: { min: 50, max: 54, points: 6 },
  'C-': { min: 45, max: 49, points: 5 },
  'D+': { min: 40, max: 44, points: 4 },
  D: { min: 35, max: 39, points: 3 },
  'D-': { min: 30, max: 34, points: 2 },
  E: { min: 0, max: 29, points: 1 },
} as const;

export const SUBJECT_CODES = {
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
} as const;

export const COMMENT_TEMPLATES = {
  classTeacher: {
    excellent: [
      'An exceptional student with outstanding performance.',
      'Demonstrates excellent academic abilities and discipline.',
      'A role model student who consistently performs well.',
    ],
    good: [
      'A well-behaved student with good academic performance.',
      'Shows consistent effort and improvement in studies.',
      'A disciplined student with commendable results.',
    ],
    average: [
      'A student of average ability who needs encouragement.',
      'Shows potential but requires more effort in studies.',
      'Can perform better with consistent effort.',
    ],
    poor: [
      'Needs significant improvement in academic performance.',
      'Requires more dedication and effort in studies.',
      'Should seek additional help to improve grades.',
    ],
  },
  principal: {
    excellent: [
      'Excellent performance! Keep up the outstanding work.',
      'Congratulations on your exceptional academic achievement.',
      'Your dedication to excellence is truly commendable.',
    ],
    good: [
      'Good performance. Continue working hard to maintain this standard.',
      'Well done! Strive for even better results next term.',
      'Your efforts are paying off. Keep up the good work.',
    ],
    average: [
      'You can do better than this. More effort is required.',
      'Work harder to improve your performance next term.',
      'With dedication, you can achieve much better results.',
    ],
    poor: [
      'This performance is not acceptable. You must work much harder.',
      'Serious effort is needed to improve your academic standing.',
      'Focus on your studies and seek help where necessary.',
    ],
  },
} as const;

export const DEFAULT_SCHOOL_CONFIG = {
  name: 'Demo School',
  level: 'secondary' as const,
  box: 'P.O. Box 123, Demo City',
  telephone: '+254 700 000 000',
  motto: 'Excellence Through Education',
};

export const DEFAULT_LAYOUT_CONFIG = {
  pageSize: 'A4' as const,
  margins: {
    top: 20,
    bottom: 20,
    left: 15,
    right: 15,
  },
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
};

export const REPORT_SECTIONS = {
  header: true,
  studentDetails: true,
  resultsTable: true,
  performanceGraph: true,
  comments: true,
  footer: true,
} as const;