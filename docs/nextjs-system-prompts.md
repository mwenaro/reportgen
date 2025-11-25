# Multi-Tenant School Management System - Development Prompts

## **System Overview**
Create a modern multi-tenant school management system based on the existing ReportGen PHP system, using Next.js 16+, TypeScript, Tailwind CSS, ShadCN UI, Mongoose (MongoDB), and NeDB for offline support.

---

## **Phase 1: Foundation & Architecture (Prompts 1-8)**

### **Prompt 1: Project Structure & Configuration**
```
Set up the project structure for a multi-tenant school management system. Create:

1. **Folder Structure:**
   - `/src/app` - Next.js 16+ app router
     - `/(marketing)` - Landing page and public routes
     - `/(auth)` - Authentication pages
     - `/(dashboard)` - Protected admin dashboard
     - `/(tenant)/[subdomain]` - Tenant-specific routes
   - `/src/lib` - Utilities, database, auth
   - `/src/components` - Reusable UI components
     - `/landing` - Landing page specific components
     - `/dashboard` - Dashboard specific components
     - `/animations` - Animation components
   - `/src/types` - TypeScript type definitions
   - `/src/hooks` - Custom React hooks
   - `/src/store` - State management (Zustand)
   - `/src/middleware` - Tenant resolution, auth middleware

2. **Configuration Files:**
   - `next.config.js` - Multi-tenant subdomain routing
   - `tailwind.config.js` - Extended with custom school themes
   - `tsconfig.json` - Strict TypeScript configuration
   - `.env.example` - Environment variables template

3. **Package Dependencies:**
   - Database: mongoose, nedb-promises
   - Auth: next-auth, bcryptjs, jsonwebtoken
   - State: zustand, react-query/tanstack-query
   - Forms: react-hook-form, zod
   - Charts: recharts, chart.js
   - PDF: jspdf, html2canvas
   - Animation: framer-motion, lottie-react, react-spring
   - UI Enhancement: react-intersection-observer, react-countup
   - Utils: date-fns, lodash

Create the basic folder structure and configuration files.
```

### **Prompt 2: Multi-Tenant Architecture & Middleware**
```
Implement multi-tenant architecture with subdomain-based tenant resolution:

1. **Tenant Middleware** (`src/middleware.ts`):
   - Extract subdomain from request URL
   - Validate tenant existence and status
   - Set tenant context in headers
   - Redirect invalid tenants to main site

2. **Tenant Context Provider** (`src/lib/tenant-context.tsx`):
   - React context for current tenant data
   - Tenant switching functionality
   - Tenant-specific configurations

3. **Database Connection Manager** (`src/lib/database.ts`):
   - Multi-tenant database connection pooling
   - Tenant-isolated collections
   - Connection switching based on tenant
   - Support both MongoDB (online) and NeDB (offline)

4. **Tenant Resolver Utilities**:
   - Extract tenant from subdomain/domain
   - Validate tenant permissions
   - Handle tenant not found scenarios

Implement the complete multi-tenant infrastructure.
```

### **Prompt 3: TypeScript Type System**
```
Create comprehensive TypeScript type definitions for the school management system:

1. **Core Entity Types** (`src/types/entities.ts`):
   ```typescript
   interface School {
     id: string;
     name: string;
     subdomain: string;
     logo?: string;
     address: Address;
     contact: ContactInfo;
     settings: SchoolSettings;
     subscription: SubscriptionPlan;
     createdAt: Date;
     updatedAt: Date;
   }

   interface Student {
     id: string;
     schoolId: string;
     admissionNumber: string;
     name: string;
     email?: string;
     phone?: string;
     dateOfBirth: Date;
     gender: 'male' | 'female';
     address: Address;
     guardian: Guardian;
     classId: string;
     kcpeMarks?: number;
     status: 'active' | 'inactive' | 'graduated';
     enrollmentDate: Date;
     profileImage?: string;
   }
   ```

2. **Academic Types** (`src/types/academics.ts`):
   - Class, Subject, Teacher, Course interfaces
   - Exam, Mark, Grade, Report interfaces
   - Academic periods (terms, years)

3. **API Types** (`src/types/api.ts`):
   - Request/Response interfaces
   - Pagination, filtering, sorting types
   - Error handling types

4. **UI Component Types** (`src/types/components.ts`):
   - Form validation schemas
   - Table column definitions
   - Chart data structures

Create all necessary TypeScript interfaces and types.
```

### **Prompt 4: Database Schema & Models**
```
Implement database schemas using Mongoose for MongoDB and NeDB compatibility:

1. **Mongoose Schemas** (`src/lib/models/`):
   ```typescript
   // src/lib/models/school.model.ts
   const SchoolSchema = new Schema({
     name: { type: String, required: true },
     subdomain: { type: String, required: true, unique: true },
     logo: String,
     settings: {
       academicYear: { start: Date, end: Date },
       termSystem: { type: String, enum: ['trimester', 'semester'] },
       gradingSystem: {
         scale: String,
         passingGrade: Number,
         gradePoints: Map
       }
     },
     subscription: {
       plan: { type: String, enum: ['free', 'basic', 'premium'] },
       status: { type: String, enum: ['active', 'suspended', 'cancelled'] },
       expiresAt: Date
     }
   }, { timestamps: true });
   ```

2. **Student Model** with academic tracking
3. **Teacher Model** with subject assignments
4. **Class/Subject/Course Models**
5. **Exam/Mark/Grade Models**
6. **User/Role/Permission Models**

3. **NeDB Adapters** for offline functionality:
   - Schema validation for NeDB
   - Data synchronization utilities
   - Conflict resolution strategies

4. **Database Utilities**:
   - Connection management
   - Tenant isolation
   - Migration scripts
   - Seeding utilities

Implement complete database layer with both MongoDB and NeDB support.
```

### **Prompt 5: Authentication & Authorization System**
```
Create a comprehensive authentication and authorization system:

1. **NextAuth Configuration** (`src/lib/auth.ts`):
   - Multiple providers (credentials, Google OAuth, GitHub, etc.)
   - Email/password authentication
   - Username + school-unique-code authentication
   - Google OAuth integration
   - Custom user model with school association
   - Session management with tenant context
   - JWT token with school permissions
   - Magic link authentication for password reset

2. **Role-Based Access Control**:
   ```typescript
   enum UserRole {
     SUPER_ADMIN = 'super_admin',     // System administrator
     SCHOOL_ADMIN = 'school_admin',   // School administrator
     TEACHER = 'teacher',             // Teaching staff
     STUDENT = 'student',             // Students
     PARENT = 'parent',               // Parents/Guardians
     ACCOUNTANT = 'accountant'        // Finance staff
   }

   interface Permission {
     resource: string;
     actions: ('create' | 'read' | 'update' | 'delete')[];
   }
   ```

3. **Authentication Components**:
   - Login/Register forms with ShadCN UI
   - Password reset functionality
   - Email verification system
   - Multi-factor authentication support

4. **Authorization Hooks & Utilities**:
   - `useAuth()` - Current user and permissions
   - `usePermissions()` - Check specific permissions
   - `withAuth()` - HOC for protected components
   - Route protection middleware

5. **Tenant-Specific User Management**:
   - User invitation system
   - Role assignment within schools
   - Bulk user import/export

Implement the complete authentication and authorization system.
```

### **Prompt 6: State Management & Data Fetching**
```
Set up state management and data fetching architecture:

1. **Zustand Store Setup** (`src/store/`):
   ```typescript
   // src/store/auth-store.ts
   interface AuthState {
     user: User | null;
     school: School | null;
     permissions: Permission[];
     isLoading: boolean;
     login: (credentials: LoginCredentials) => Promise<void>;
     logout: () => void;
     switchSchool: (schoolId: string) => Promise<void>;
   }

   // src/store/students-store.ts
   interface StudentsState {
     students: Student[];
     selectedStudent: Student | null;
     filters: StudentFilters;
     pagination: PaginationState;
     fetchStudents: (filters?: StudentFilters) => Promise<void>;
     updateStudent: (id: string, data: Partial<Student>) => Promise<void>;
   }
   ```

2. **TanStack Query Setup**:
   - API client configuration
   - Query key factories
   - Mutation handling with optimistic updates
   - Error boundary integration

3. **Custom Hooks** (`src/hooks/`):
   - `useStudents()` - Student data management
   - `useTeachers()` - Teacher data management
   - `useClasses()` - Class management
   - `useExams()` - Examination management
   - `useReports()` - Report generation

4. **Offline Support**:
   - Service worker for caching
   - Background sync for data updates
   - Conflict resolution strategies
   - Local storage backup

5. **Real-time Updates**:
   - WebSocket connection management
   - Live data synchronization
   - Notification system

Implement complete state management with offline support.
```

### **Prompt 7: UI Component Library**
```
Create a comprehensive UI component library using ShadCN UI with animations:

1. **Base Components** (`src/components/ui/`):
   - Extend ShadCN components with school-specific styling
   - Custom theme provider with school branding
   - Responsive layout components with smooth transitions
   - Animated loading states and skeletons
   - Framer Motion wrapper components
   - Interactive hover and focus animations

2. **Data Display Components** (`src/components/data/`):
   ```typescript
   // StudentTable with advanced filtering
   interface StudentTableProps {
     students: Student[];
     onEdit: (student: Student) => void;
     onDelete: (id: string) => void;
     filters: StudentFilters;
     onFilterChange: (filters: StudentFilters) => void;
   }

   // GradeChart for performance visualization
   interface GradeChartProps {
     data: GradeData[];
     type: 'bar' | 'line' | 'pie';
     period: 'term' | 'year';
   }
   ```

3. **Form Components** (`src/components/forms/`):
   - StudentForm with validation
   - TeacherForm with subject assignment
   - ExamForm with mark entry
   - ReportConfigForm for report generation

4. **Layout Components** (`src/components/layout/`):
   - Sidebar navigation with role-based menu
   - Header with school branding and user menu
   - Breadcrumb navigation
   - Page headers with action buttons

5. **Specialized Components**:
   - GradingMatrix for mark entry
   - ReportCard preview component
   - ClassAttendance tracker
   - PerformanceAnalytics dashboard

Create all necessary UI components with proper TypeScript interfaces.
```

### **Prompt 8: API Routes & Server Actions**
```
Implement comprehensive API routes using Next.js 16+ App Router:

1. **API Route Structure** (`src/app/api/`):
   ```
   /api/
   ├── auth/
   ├── schools/
   ├── students/
   │   ├── route.ts (GET, POST)
   │   ├── [id]/route.ts (GET, PUT, DELETE)
   │   └── [id]/grades/route.ts
   ├── teachers/
   ├── classes/
   ├── subjects/
   ├── exams/
   ├── reports/
   └── sync/ (for offline synchronization)
   ```

2. **Server Actions** (`src/lib/actions/`):
   - Student management actions
   - Grade calculation actions
   - Report generation actions
   - Bulk data operations

3. **API Utilities** (`src/lib/api/`):
   - Request validation with Zod
   - Error handling middleware
   - Rate limiting
   - Pagination helpers
   - Filtering and sorting utilities

4. **Integration Endpoints**:
   - Data export/import APIs
   - Third-party integrations (SMS, Email)
   - Webhook handlers
   - File upload handling

Implement all API routes with proper error handling and validation.
```

---

## **Phase 2: Core Features (Prompts 9-21)**

### **Prompt 9: Landing Page & Marketing Site**
```
Create a comprehensive landing page with modern animations and conversion optimization:

1. **Landing Page Structure** (`src/app/(marketing)/page.tsx`):
   - Hero section with animated hero image/video
   - Features showcase with interactive animations
   - Testimonials and social proof
   - Pricing plans comparison
   - FAQ section with expandable items
   - Contact form with validation
   - Footer with comprehensive links

2. **Hero Section Components**:
   ```typescript
   interface HeroSectionProps {
     title: string;
     subtitle: string;
     ctaText: string;
     backgroundVideo?: string;
     animatedStats: {
       schools: number;
       students: number;
       teachers: number;
       reports: number;
     };
   }
   ```

3. **Animation Features**:
   - Framer Motion for page transitions and scroll animations
   - Lottie animations for feature illustrations
   - React Spring for micro-interactions
   - Intersection Observer for scroll-triggered animations
   - CountUp animations for statistics
   - Parallax scrolling effects

4. **Landing Page Sections**:
   - **Hero**: Animated tagline, CTA buttons, demo video
   - **Features**: Animated feature cards with hover effects
   - **How It Works**: Step-by-step animated workflow
   - **Benefits**: Animated statistics and testimonials
   - **Pricing**: Interactive pricing cards with animations
   - **Demo**: Interactive product showcase
   - **Testimonials**: Carousel with smooth transitions
   - **FAQ**: Animated accordion component
   - **CTA**: Final conversion section with urgency

5. **SEO & Performance**:
   - Next.js SEO optimization
   - Open Graph and Twitter card meta tags
   - Schema markup for rich snippets
   - Image optimization with lazy loading
   - Core Web Vitals optimization

6. **Conversion Optimization**:
   - A/B testing setup with feature flags
   - Analytics integration (Google Analytics, Mixpanel)
   - Heat mapping integration
   - Lead capture forms throughout
   - Exit-intent popups
   - Social proof badges

Create a high-converting landing page with modern animations.
```

### **Prompt 10: Enhanced Authentication System**
```
Implement comprehensive authentication system using NextAuth with multiple login methods:

1. **Authentication Pages** (`src/app/(auth)/`):
   - `/login` - Multi-method login page
   - `/register` - School registration and user signup
   - `/forgot-password` - Password reset flow
   - `/verify-email` - Email verification
   - `/reset-password` - Password reset form

2. **Login Methods Implementation**:
   ```typescript
   // Email/Password Login
   interface EmailLoginForm {
     email: string;
     password: string;
     rememberMe: boolean;
   }

   // Username + School Code Login
   interface SchoolLoginForm {
     username: string;
     schoolCode: string; // Unique identifier per school
     password: string;
   }

   // Social Login Options
   interface SocialLogins {
     google: GoogleProvider;
     github?: GitHubProvider;
     microsoft?: MicrosoftProvider;
   }
   ```

3. **NextAuth Configuration** (`src/app/api/auth/[...nextauth]/route.ts`):
   - Credentials provider for email/password
   - Custom credentials provider for username + school code
   - Google OAuth provider
   - Custom sign-in pages with animations
   - Session callbacks with school context
   - JWT callbacks with user roles and permissions

4. **Authentication Components**:
   - Animated login form with smooth transitions
   - Social login buttons with hover effects
   - Form validation with real-time feedback
   - Loading states with skeleton animations
   - Success/error notifications with animations

5. **Advanced Features**:
   - Magic link authentication
   - Two-factor authentication (2FA)
   - Session management across devices
   - Account linking (merge social accounts)
   - Audit logging for security

6. **School Code System**:
   - Unique school codes generation
   - Code validation and verification
   - School-specific login branding
   - Custom subdomain redirection after login

Implement secure, user-friendly authentication with multiple login options.
```

### **Prompt 11: Dashboard Architecture & Navigation**
```
Create a comprehensive dashboard system with proper route organization:

1. **Dashboard Route Structure** (`src/app/(dashboard)/`):
   ```
   (dashboard)/
   ├── layout.tsx              # Dashboard layout with sidebar
   ├── page.tsx                # Main dashboard overview
   ├── students/
   │   ├── page.tsx           # Students list
   │   ├── new/page.tsx       # Add new student
   │   ├── [id]/page.tsx      # Student details
   │   ├── [id]/edit/page.tsx # Edit student
   │   ├── import/page.tsx    # Bulk import students
   │   └── analytics/page.tsx # Student analytics
   ├── teachers/
   │   ├── page.tsx           # Teachers list
   │   ├── new/page.tsx       # Add new teacher
   │   ├── [id]/page.tsx      # Teacher profile
   │   └── assignments/page.tsx # Teacher assignments
   ├── subjects/              # Learning areas management
   │   ├── page.tsx           # Subjects list
   │   ├── new/page.tsx       # Create subject
   │   └── [id]/page.tsx      # Subject details
   ├── classes/
   │   ├── page.tsx           # Classes management
   │   ├── new/page.tsx       # Create class
   │   └── [id]/page.tsx      # Class details
   ├── exams/
   ├── reports/
   ├── analytics/
   ├── settings/
   └── profile/
   ```

2. **Dashboard Layout Component** (`src/components/dashboard/layout.tsx`):
   - Responsive sidebar with animated menu items
   - Collapsible navigation with smooth transitions
   - Breadcrumb navigation with animations
   - User profile dropdown with hover effects
   - Notification center with badge animations
   - Theme switcher with smooth transitions

3. **Navigation System**:
   ```typescript
   interface NavigationItem {
     id: string;
     label: string;
     href: string;
     icon: React.ComponentType;
     badge?: number;
     submenu?: NavigationItem[];
     permissions: string[];
     animation?: {
       hover: string;
       active: string;
     };
   }
   ```

4. **Dashboard Components**:
   - Animated stat cards with countup effects
   - Interactive charts with hover animations
   - Recent activity feed with smooth updates
   - Quick action buttons with micro-interactions
   - Notification toasts with slide animations

5. **Role-Based Dashboard Views**:
   - Super Admin: System-wide analytics and school management
   - School Admin: School-specific management tools
   - Teacher: Class and student management
   - Student: Personal academic dashboard
   - Parent: Child progress monitoring

6. **Performance Features**:
   - Route-based code splitting
   - Prefetching for faster navigation
   - Optimistic UI updates
   - Skeleton loading states
   - Error boundaries with retry mechanisms

Create a professional, animated dashboard with proper route organization.
```

### **Prompt 12: School Management Module**
```
Create the school management and multi-tenancy admin interface:

1. **Super Admin Dashboard** (`src/app/(super-admin)/`):
   - School registration and approval
   - Subscription management
   - System-wide analytics
   - Tenant monitoring and support

2. **School Admin Dashboard** (`src/app/(admin)/`):
   - School profile management
   - User role assignment
   - System configuration
   - Data backup/restore

3. **School Settings Pages**:
   - Academic year configuration
   - Grading system setup
   - Term/semester structure
   - Custom fields configuration

4. **Multi-tenant Features**:
   - Subdomain management
   - Custom branding per school
   - Feature toggles per subscription tier
   - Data isolation verification

5. **School Onboarding Flow**:
   - Registration wizard
   - Initial data setup
   - Admin account creation
   - Welcome tour

Implement complete school management with multi-tenant support.
```

### **Prompt 13: Student Management System**
```
Develop comprehensive student management functionality:

1. **Student Dashboard** (`src/app/(dashboard)/students/`):
   - Student list with advanced filtering
   - Quick actions (edit, view, delete)
   - Bulk operations (import, export, update)
   - Student search with autocomplete

2. **Student Profile Pages**:
   - Personal information management
   - Academic history tracking
   - Guardian/parent information
   - Document uploads and management

3. **Student Registration/Admission**:
   - Online admission form
   - Document verification workflow
   - Admission approval process
   - Automated admission number generation

4. **Student Analytics**:
   - Enrollment trends
   - Performance analytics
   - Attendance patterns
   - Graduation tracking

5. **Advanced Features**:
   - Student promotion/demotion
   - Transfer management
   - Alumni tracking
   - Medical records (if applicable)

Create complete student lifecycle management system.
```

### **Prompt 14: Teacher & Staff Management**
```
Implement teacher and staff management system:

1. **Teacher Dashboard** (`src/app/(dashboard)/teachers/`):
   - Teacher directory with profiles
   - Subject assignments management
   - Workload distribution visualization
   - Performance metrics

2. **Teacher Profile Management**:
   - Personal and professional information
   - Qualification tracking
   - Subject specializations
   - Schedule and timetable management

3. **Staff Assignment System**:
   - Class teacher assignments
   - Subject teacher assignments
   - Exam supervision assignments
   - Administrative roles

4. **Teacher Portal** (`src/app/(teacher)/`):
   - Personal dashboard
   - Class management interface
   - Grade entry and management
   - Student progress tracking

5. **Professional Development**:
   - Training records
   - Certification tracking
   - Performance evaluations
   - Professional growth plans

Develop complete teacher and staff management system.
```

### **Prompt 15: Academic Structure (Classes, Subjects, Courses)**
```
Create the academic structure management system:

1. **Class Management** (`src/app/(dashboard)/classes/`):
   - Class creation and configuration
   - Student enrollment management
   - Class teacher assignment
   - Classroom resource allocation

2. **Subject Management**:
   - Subject catalog with descriptions
   - Prerequisite management
   - Credit hour assignments
   - Subject teacher assignments

3. **Course Management**:
   - Course structure (subject combinations)
   - Academic progression rules
   - Elective selection system
   - Course requirement tracking

4. **Academic Calendar**:
   - Term/semester management
   - Holiday and break planning
   - Examination schedule
   - Event management

5. **Curriculum Management**:
   - Curriculum mapping
   - Learning objectives tracking
   - Assessment criteria definition
   - Progress milestone setup

Build comprehensive academic structure management.
```

### **Prompt 16: Examination Management System**
```
Develop a comprehensive examination management system:

1. **Exam Configuration** (`src/app/(dashboard)/exams/`):
   - Exam type setup (CAT, Mid-term, Final)
   - Examination schedule management
   - Paper/test creation
   - Invigilation assignments

2. **Mark Entry System**:
   - Grade entry interfaces
   - Bulk mark upload (CSV/Excel)
   - Grade validation and verification
   - Missing mark tracking

3. **Grade Calculation Engine**:
   - Configurable grading scales
   - Weighted average calculations
   - Grade point computations
   - Ranking algorithms

4. **Exam Analytics**:
   - Performance distribution analysis
   - Subject-wise performance
   - Historical trends
   - Comparative analysis

5. **Exam Security**:
   - Access control for mark entry
   - Audit trails for grade changes
   - Secure grade publication
   - Grade dispute resolution

Create complete examination and grading system.
```

### **Prompt 17: Report Generation Engine**
```
Build a modern report generation system based on the original PHP system:

1. **Report Templates** (`src/components/reports/`):
   ```typescript
   interface ReportTemplate {
     id: string;
     name: string;
     type: 'student_report' | 'class_summary' | 'performance_analysis';
     layout: ReportLayout;
     sections: ReportSection[];
     branding: SchoolBranding;
   }
   ```

2. **Student Report Cards**:
   - Modern HTML/CSS report templates
   - PDF generation with jsPDF
   - Performance graphs and charts
   - Automated comment generation
   - Multi-language support

3. **Report Builder Interface**:
   - Drag-and-drop report designer
   - Template customization
   - Preview functionality
   - Bulk report generation

4. **Analytics Reports**:
   - Class performance summaries
   - Subject analysis reports
   - Trend analysis
   - Comparative reports

5. **Report Distribution**:
   - Email delivery system
   - Parent portal access
   - Print-ready formats
   - Digital signatures

Implement modern report generation with customizable templates.
```

### **Prompt 18: Grading & Performance Analytics**
```
Create advanced grading and performance analytics system:

1. **Grade Management** (`src/app/(dashboard)/grades/`):
   - Real-time grade tracking
   - Grade history and trends
   - Performance predictions
   - Alert system for declining performance

2. **Analytics Dashboard**:
   - Interactive performance charts
   - Subject-wise analysis
   - Class comparisons
   - Historical trends

3. **Performance Metrics**:
   ```typescript
   interface PerformanceMetrics {
     studentId: string;
     academicYear: string;
     term: string;
     overallGPA: number;
     subjectGrades: SubjectGrade[];
     classRank: number;
     improvementTrend: 'improving' | 'declining' | 'stable';
     predictions: PerformancePrediction[];
   }
   ```

4. **Advanced Analytics**:
   - Machine learning for performance prediction
   - Intervention recommendations
   - Risk identification
   - Success pattern analysis

5. **Parent/Student Insights**:
   - Progress visualization
   - Goal setting and tracking
   - Comparative analysis
   - Improvement recommendations

Build comprehensive performance analytics system.
```

### **Prompt 19: Communication System**
```
Implement school-wide communication system:

1. **Messaging System** (`src/app/(dashboard)/messages/`):
   - Real-time messaging between users
   - Announcement broadcasts
   - Class/group messaging
   - Emergency notifications

2. **Parent Communication Portal**:
   - Parent dashboard access
   - Progress notifications
   - Event updates
   - Fee payment reminders

3. **Notification System**:
   - Push notifications
   - Email notifications
   - SMS integration
   - In-app alerts

4. **Communication Analytics**:
   - Message delivery tracking
   - Engagement metrics
   - Response rates
   - Communication effectiveness

5. **Integration Features**:
   - Third-party communication tools
   - Social media integration
   - Newsletter management
   - Event management system

Create comprehensive school communication platform.
```

### **Prompt 20: User Interface & Experience**
```
Develop comprehensive user interfaces for all user types:

1. **Responsive Design System**:
   - Mobile-first approach
   - Tablet optimization
   - Desktop layouts
   - Accessibility compliance (WCAG 2.1)

2. **Role-Based Dashboards**:
   - Super Admin dashboard
   - School Admin dashboard
   - Teacher dashboard
   - Student dashboard
   - Parent dashboard

3. **Navigation & Layout**:
   - Intuitive sidebar navigation
   - Breadcrumb trails
   - Quick action menus
   - Search functionality

4. **Interactive Components**:
   - Data tables with sorting/filtering
   - Interactive charts and graphs
   - Modal dialogs and forms
   - Drag-and-drop interfaces

5. **User Experience Features**:
   - Dark/light mode toggle
   - Customizable layouts
   - Keyboard shortcuts
   - Offline mode indicators

Build comprehensive, accessible user interfaces.
```

### **Prompt 21: Data Import/Export & Migration**
```
Create robust data management and migration system:

1. **Data Import System** (`src/app/(dashboard)/import/`):
   - CSV/Excel file processing
   - Data validation and error handling
   - Batch processing for large datasets
   - Progress tracking and reporting

2. **Data Export Functionality**:
   - Multiple format support (CSV, Excel, JSON, PDF)
   - Filtered data export
   - Scheduled exports
   - Custom report exports

3. **Migration Tools**:
   - Legacy system data migration
   - Database migration scripts
   - Data transformation utilities
   - Migration validation tools

4. **Backup & Recovery**:
   - Automated backup scheduling
   - Point-in-time recovery
   - Data integrity verification
   - Disaster recovery procedures

5. **Integration APIs**:
   - Third-party system integration
   - Standard education APIs
   - Webhook support
   - Real-time sync capabilities

Implement comprehensive data management system.
```

### **Prompt 22: Security & Compliance**
```
Implement comprehensive security and compliance measures:

1. **Security Framework**:
   - Input validation and sanitization
   - SQL injection prevention
   - XSS protection
   - CSRF protection
   - Rate limiting

2. **Data Protection**:
   - GDPR compliance features
   - Data encryption at rest and transit
   - Personal data anonymization
   - Right to be forgotten implementation

3. **Audit System**:
   - Comprehensive audit logging
   - User activity tracking
   - Data change history
   - Security event monitoring

4. **Access Control**:
   - Multi-factor authentication
   - Session management
   - IP-based restrictions
   - Device management

5. **Compliance Tools**:
   - Data retention policies
   - Consent management
   - Privacy policy enforcement
   - Regular security assessments

Build enterprise-grade security and compliance system.
```

### **Prompt 22: Mobile Application (Optional)**
```
Create companion mobile applications:

1. **React Native App Setup**:
   - Cross-platform mobile app
   - Shared codebase with web app
   - Native performance optimization
   - Push notification support

2. **Student Mobile App**:
   - Grade viewing
   - Schedule access
   - Assignment tracking
   - Communication features

3. **Teacher Mobile App**:
   - Quick grade entry
   - Attendance marking
   - Student progress tracking
   - Communication tools

4. **Parent Mobile App**:
   - Child progress monitoring
   - School communication
   - Event notifications
   - Fee payment integration

5. **Offline Functionality**:
   - Local data caching
   - Sync when online
   - Offline grade entry
   - Background sync

Develop comprehensive mobile application suite.
```

---

## **Phase 3: Advanced Features & Deployment (Prompts 23-32)**

### **Prompt 23: Performance Optimization**
```
Implement comprehensive performance optimization:

1. **Frontend Optimization**:
   - Code splitting and lazy loading
   - Image optimization with Next.js 16
   - Bundle size optimization
   - Caching strategies

2. **Database Optimization**:
   - Query optimization
   - Index strategy
   - Connection pooling
   - Data pagination

3. **API Optimization**:
   - Response caching
   - GraphQL for efficient queries
   - Background job processing
   - CDN integration

4. **Monitoring & Analytics**:
   - Performance monitoring
   - Error tracking
   - User analytics
   - System health checks

5. **Scalability Features**:
   - Horizontal scaling preparation
   - Load balancing support
   - Microservice architecture
   - Container optimization

Optimize system for production-level performance.
```

### **Prompt 24: Testing Strategy**
```
Implement comprehensive testing strategy:

1. **Unit Testing**:
   - Component testing with Jest/React Testing Library
   - API route testing
   - Utility function testing
   - Database operation testing

2. **Integration Testing**:
   - API integration tests
   - Database integration tests
   - Authentication flow testing
   - Multi-tenant isolation testing

3. **End-to-End Testing**:
   - User workflow testing with Playwright
   - Cross-browser testing
   - Mobile responsiveness testing
   - Performance testing

4. **Test Infrastructure**:
   - CI/CD pipeline integration
   - Test data management
   - Mock services
   - Test environment setup

5. **Quality Assurance**:
   - Code coverage reporting
   - Automated testing workflows
   - Manual testing protocols
   - Bug tracking and resolution

Create comprehensive testing framework.
```

### **Prompt 25: Deployment & DevOps**
```
Set up production deployment infrastructure:

1. **Deployment Configuration**:
   - Docker containerization
   - Kubernetes orchestration
   - Environment configuration
   - Secrets management

2. **CI/CD Pipeline**:
   - GitHub Actions workflow
   - Automated testing
   - Build optimization
   - Deployment automation

3. **Infrastructure Setup**:
   - Cloud provider configuration (AWS/GCP/Azure)
   - Database cluster setup
   - Load balancer configuration
   - CDN setup

4. **Monitoring & Logging**:
   - Application monitoring
   - Error logging
   - Performance metrics
   - Alert systems

5. **Backup & Recovery**:
   - Automated backups
   - Disaster recovery plan
   - Data replication
   - Point-in-time recovery

Implement production-ready deployment infrastructure.
```

### **Prompt 26: Documentation & Training**
```
Create comprehensive documentation and training materials:

1. **Technical Documentation**:
   - API documentation with OpenAPI/Swagger
   - Database schema documentation
   - Architecture decision records
   - Deployment guides

2. **User Documentation**:
   - User manuals for each role
   - Feature tutorials
   - Troubleshooting guides
   - FAQ sections

3. **Training Materials**:
   - Video tutorials
   - Interactive demos
   - Onboarding checklists
   - Best practices guides

4. **Developer Documentation**:
   - Code style guidelines
   - Contributing guidelines
   - Local development setup
   - Testing procedures

5. **Maintenance Documentation**:
   - System administration guides
   - Backup procedures
   - Security protocols
   - Update procedures

Create complete documentation suite.
```

### **Prompt 27: Integration & APIs**
```
Develop external integration capabilities:

1. **Education System APIs**:
   - Student Information System integration
   - Learning Management System integration
   - Assessment platform integration
   - Government reporting APIs

2. **Payment Integration**:
   - Fee payment gateways
   - Subscription billing
   - Financial reporting
   - Receipt generation

3. **Communication APIs**:
   - SMS service integration
   - Email service integration
   - Push notification services
   - Video conferencing integration

4. **Third-Party Services**:
   - Cloud storage integration
   - Analytics services
   - Backup services
   - Identity providers

5. **Webhook System**:
   - Event-driven integrations
   - Real-time notifications
   - Data synchronization
   - Custom integrations

Build comprehensive integration ecosystem.
```

### **Prompt 28: Accessibility & Internationalization**
```
Implement accessibility and internationalization features:

1. **Accessibility (a11y)**:
   - WCAG 2.1 AA compliance
   - Screen reader support
   - Keyboard navigation
   - High contrast mode
   - Focus management

2. **Internationalization (i18n)**:
   - Multi-language support
   - RTL language support
   - Cultural date/number formats
   - Timezone handling
   - Currency support

3. **Localization (l10n)**:
   - Translation management
   - Context-aware translations
   - Pluralization handling
   - Dynamic content translation
   - Regional customization

4. **Inclusive Design**:
   - Color accessibility
   - Font size adjustment
   - Motion preference respect
   - Cognitive accessibility
   - Mobile accessibility

5. **Testing & Validation**:
   - Accessibility testing tools
   - Translation validation
   - Cultural review process
   - User testing with disabilities
   - Compliance verification

Create globally accessible and inclusive system.
```

### **Prompt 29: Analytics & Business Intelligence**
```
Implement comprehensive analytics and business intelligence:

1. **Academic Analytics**:
   - Student performance trends
   - Teacher effectiveness metrics
   - Curriculum analysis
   - Predictive modeling

2. **Operational Analytics**:
   - System usage metrics
   - Performance monitoring
   - Resource utilization
   - Cost analysis

3. **Business Intelligence Dashboard**:
   - Executive dashboards
   - KPI tracking
   - Trend analysis
   - Comparative benchmarking

4. **Data Visualization**:
   - Interactive charts and graphs
   - Real-time data displays
   - Custom report builders
   - Export capabilities

5. **Machine Learning Features**:
   - Performance prediction
   - Risk identification
   - Recommendation engine
   - Anomaly detection

Build comprehensive analytics platform.
```

### **Prompt 30: Quality Assurance & Bug Tracking**
```
Implement quality assurance and bug tracking system:

1. **Bug Tracking System**:
   - Issue reporting interface
   - Bug categorization and prioritization
   - Assignment and tracking workflow
   - Resolution verification

2. **Quality Assurance Process**:
   - Code review procedures
   - Testing protocols
   - Release verification
   - Performance benchmarking

3. **User Feedback System**:
   - Feedback collection interface
   - Feature request tracking
   - User satisfaction surveys
   - Beta testing program

4. **Continuous Improvement**:
   - Performance monitoring
   - User behavior analysis
   - A/B testing framework
   - Feature flag management

5. **Release Management**:
   - Version control strategy
   - Release planning
   - Rollback procedures
   - Change documentation

Establish comprehensive quality assurance framework.
```

### **Prompt 31: Backup & Disaster Recovery**
```
Implement comprehensive backup and disaster recovery system:

1. **Backup Strategy**:
   - Automated daily backups
   - Point-in-time recovery
   - Cross-region replication
   - Backup verification

2. **Disaster Recovery Plan**:
   - Recovery time objectives (RTO)
   - Recovery point objectives (RPO)
   - Failover procedures
   - Business continuity planning

3. **Data Protection**:
   - Encryption at rest and transit
   - Access control for backups
   - Retention policies
   - Compliance requirements

4. **Testing & Validation**:
   - Regular disaster recovery drills
   - Backup integrity verification
   - Recovery time testing
   - Documentation updates

5. **Monitoring & Alerting**:
   - Backup status monitoring
   - Failure alerts
   - Performance metrics
   - Compliance reporting

Create robust backup and disaster recovery system.
```

### **Prompt 32: Final Integration & Launch**
```
Complete final integration and prepare for launch:

1. **System Integration Testing**:
   - End-to-end workflow testing
   - Multi-tenant isolation verification
   - Performance load testing
   - Security penetration testing

2. **Launch Preparation**:
   - Production environment setup
   - Data migration procedures
   - User training completion
   - Support team preparation

3. **Go-Live Strategy**:
   - Phased rollout plan
   - User onboarding process
   - Support escalation procedures
   - Monitoring and alerting setup

4. **Post-Launch Support**:
   - 24/7 monitoring setup
   - User support procedures
   - Bug fixing workflows
   - Performance optimization

5. **Success Metrics**:
   - User adoption tracking
   - Performance benchmarking
   - Feature utilization analysis
   - Feedback collection and analysis

Complete system integration and launch preparation.
```

---

## **Summary**

This comprehensive set of 32 prompts will guide you through building a complete multi-tenant school management system that modernizes and enhances the original PHP-based ReportGen system. Each prompt is designed to be self-contained while building upon previous work, ensuring a systematic approach to development.

## **New Features Added:**

### **🚀 Professional Landing Page (Prompt 9)**
- Modern hero section with animated elements
- Feature showcase with interactive animations
- Testimonials, pricing, and FAQ sections
- Conversion-optimized design with A/B testing
- SEO optimization and performance monitoring

### **🔐 Enhanced Authentication (Prompt 10)**
- Multiple login methods: email/password, username+school-code, OAuth
- NextAuth integration with Google, GitHub providers
- Magic link authentication and 2FA support
- Animated login forms with smooth transitions
- School-specific login branding

### **📊 Organized Dashboard Architecture (Prompt 11)**
- Proper route organization for all user types
- Animated sidebar navigation with role-based menus
- Responsive layout with smooth transitions
- Quick actions and notification systems
- Performance-optimized with route splitting

### **✨ Rich Animation System**
- Framer Motion for page transitions and micro-interactions
- Lottie animations for feature illustrations
- React Spring for smooth UI interactions
- Intersection Observer for scroll-triggered animations
- CountUp animations for statistics and metrics

**Key Features of the Modernized System:**
- ✅ Multi-tenant architecture with subdomain-based isolation
- ✅ Modern tech stack (Next.js 16+, TypeScript, Tailwind, ShadCN UI)
- ✅ Comprehensive landing page with conversion optimization
- ✅ Multi-method authentication (email, username+school-code, OAuth)
- ✅ Rich animations with Framer Motion, Lottie, and React Spring
- ✅ Proper dashboard route organization for all user roles
- ✅ Offline support with NeDB and online sync with MongoDB
- ✅ Comprehensive user management with role-based access
- ✅ Advanced report generation with modern UI/UX
- ✅ Real-time analytics and performance tracking
- ✅ Mobile-responsive design with PWA capabilities
- ✅ Enterprise-grade security and compliance
- ✅ Scalable architecture ready for thousands of schools

The prompts are organized in three phases:
1. **Foundation** (1-8): Architecture, database, auth, state management
2. **Core Features** (9-22): Landing page, auth, dashboard, and all main functionality modules
3. **Advanced Features** (23-32): Optimization, testing, deployment, launch

Each prompt can be executed independently by an AI assistant or development team, with clear specifications and expected outcomes.