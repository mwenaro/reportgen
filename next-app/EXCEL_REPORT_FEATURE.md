# Excel Report Generation Feature

## Overview

The Excel Report Generation feature allows schools to easily import academic data from Excel files and generate comprehensive reports including:

- Individual student terminal reports
- Class performance analysis
- Subject analysis across all classes
- Summary reports with recommendations

## Supported Grading Systems

### 8-4-4 System (Secondary School)
- **Grades**: A (80-100) to E (0-29)
- **Points**: 12 (A) to 1 (E)
- **Pass Grade**: D (35-39)
- **Subjects**: Mathematics, English, Kiswahili, Biology, Chemistry, Physics, History, Geography, CRE, Business Studies, etc.

### CBC System (Competency-Based Curriculum)
- **Ratings**: EE (Exceeding Expectations) to BE (Below Expectations)
- **Points**: 4 (EE) to 1 (BE)
- **Pass Rating**: AE (Approaching Expectations)
- **Subjects**: Mathematics, English Activities, Kiswahili Activities, Integrated Science, Social Studies, Life Skills Education, etc.

## Excel File Format Requirements

### Sheet 1: School Details
The first sheet must contain school information in two columns:

| Column A (Field) | Column B (Value) |
|------------------|------------------|
| Name | Your School Name |
| Education System | 8-4-4 or CBC |
| Box | P.O. Box 123, City |
| Tel | +254 123 456 789 |
| Email | info@school.ac.ke |
| Motto | Your School Motto |

### Subsequent Sheets: Class Data
Each class should have its own sheet with the format: `"Grade - Exam Name - Term"`

**Examples:**
- `Form 1A - End Term Exam - Term 1`
- `Grade 6B - Summative Assessment - Term 2`

**Column Structure:**
| No | Name | Gender | Mat | Eng | Kis | Bio | Che | ... |
|----|------|--------|-----|-----|-----|-----|-----|-----|
| 1 | John Doe | M | 78 | 82 | 75 | 88 | 73 | ... |
| 2 | Jane Smith | F | 85 | 90 | 87 | 92 | 88 | ... |

**Required Columns:**
- `No` - Student number (optional, will be auto-generated)
- `Name` - Student full name (required)
- `Gender` - M or F (required)
- Subject columns with marks (0-100)

## Subject Name Mappings

The system automatically maps common abbreviations to full subject names:

### 8-4-4 System
- `mat` → Mathematics
- `eng` → English
- `kis` → Kiswahili
- `bio` → Biology
- `che` → Chemistry
- `phy` → Physics
- `his` → History
- `geo` → Geography
- `cre` → CRE
- `bst` → Business Studies
- `agr` → Agriculture
- `com` → Computer Studies

### CBC System
- `mat` → Mathematics
- `eng` → English Activities
- `kis` → Kiswahili Activities
- `sci` → Integrated Science
- `sst` → Social Studies
- `lse` → Life Skills Education
- `pte` → Pre-Technical Education

## Generated Reports

### 1. Individual Student Terminal Reports
- Student details and class information
- Subject-wise scores, grades, and points
- Performance summary with mean grade
- Class position and rank
- Teacher and principal comments
- Performance recommendations

### 2. Class Performance Analysis
- Class overview and statistics
- Subject performance summary
- Top 10 performers list
- Grade distribution analysis
- Pass rate analysis
- Performance trends

### 3. Subject Analysis Reports
- Cross-class subject performance
- Subject-wise statistics and rankings
- Top performers by subject
- Grade distribution by subject
- Comparative analysis across classes

### 4. Comprehensive Summary Report
- School-wide performance overview
- Key performance indicators
- Class comparison analysis
- Recommendations for improvement
- Statistical summaries

## Features

### Data Validation
- Automatic validation of Excel file structure
- Detection of missing required fields
- Warning for incomplete data
- Error reporting with specific issues

### Grade Calculations
- Automatic grade assignment based on scores
- Mean grade calculation using points system
- Class ranking and positioning
- Pass/fail determination based on system thresholds

### Performance Analytics
- Statistical analysis of student performance
- Class and subject-level insights
- Trend identification and reporting
- Comparative performance metrics

### Report Customization
- Choose which report types to generate
- Support for both grading systems
- Automatic system detection from Excel data
- Flexible report formatting

## Usage Instructions

### Step 1: Prepare Your Excel File
1. Download the appropriate template (8-4-4 or CBC)
2. Fill in school details in the first sheet
3. Create class sheets with student data
4. Ensure all required columns are present

### Step 2: Upload and Validate
1. Navigate to Reports → Excel Import
2. Select your grading system
3. Upload your Excel file
4. Review validation results and warnings

### Step 3: Generate Reports
1. Select report types to generate
2. Review data preview
3. Click "Generate All Reports"
4. Monitor progress and download generated files

### Step 4: Review Reports
1. Individual PDFs for each student
2. Class analysis reports
3. Subject performance reports
4. Summary report with recommendations

## Best Practices

### Data Preparation
- Use consistent naming for students
- Ensure accurate gender information
- Include admission numbers where available
- Validate all scores are between 0-100

### Excel Structure
- Keep sheet names descriptive and consistent
- Avoid special characters in sheet names
- Ensure subject names are spelled correctly
- Use standard abbreviations for subjects

### Quality Assurance
- Review validation warnings before generating
- Check sample data preview
- Verify grading system selection
- Confirm all classes are included

## Troubleshooting

### Common Issues

**File Upload Errors**
- Ensure file is in .xlsx or .xls format
- Check file size (should be under 10MB)
- Verify no sheets are password protected

**Validation Warnings**
- Missing student names → Add names or remove empty rows
- No subject data → Ensure subject columns have marks
- Invalid scores → Check all marks are 0-100

**Report Generation Issues**
- Select at least one report type
- Ensure data validation passed
- Check browser console for errors

### Support
For technical support or questions about the Excel import feature:
1. Check validation messages for specific issues
2. Review sample templates for proper format
3. Ensure data matches expected structure
4. Contact system administrator if issues persist

## Sample Data

Download sample Excel templates from the application to see properly formatted data structures for both 8-4-4 and CBC systems.

## Updates and Maintenance

The Excel import feature is regularly updated to:
- Support new curriculum requirements
- Improve data validation
- Enhance report formats
- Add new analytical features

Keep your Excel templates updated and follow the specified format for optimal results.