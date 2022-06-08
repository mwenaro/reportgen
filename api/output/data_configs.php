<?php
//students view configs

$configs=[];
//$configs['student']['table']='students';
//$configs['students']['row']="studentId,first_name,middle_name,last_name,gen,dob,religion,form,adm,residence,county,subcounty,ward ";
$configs['students']['all']="SELECT score,studentId,name,first_name,middle_name,last_name,gen,dob,religion,form,adm,residence,county,subcounty,ward,active FROM students WHERE active is  1 AND hasLeft IS NOT 1 ";
//$configs['students']['all']="SELECT studentId,first_name,middle_name,last_name,gen,dob,religion,form,adm,residence,county,subcounty,ward FROM students WHERE isDeleted IS NOT 1";
$configs['students']['where']=array("isDeleted"=>0);
/*******************************************************************************************************
 *                        TRS
*******************************************************************************************************/
$configs['teachers']['all']="SELECT teacherId,title,first_name,last_name,gen,type,phone,staff_code,sub1,sub2 FROM teachers WHERE isDeleted IS NOT 1";
//$configs['teachers']['row_fields']="teacherId,first_name,middle_name,last_name,gen,dob,religion,type,phone,mail,code,";
//$configs['students']['where']=array("isDeleted"=>0);

/*******************************************************************************************************
 *                        subjects
*******************************************************************************************************/
$configs['subjects']['all']="SELECT subjectId,name,short_name,isOffered,isCompulsory,departmentId FROM subjects WHERE isDeleted IS NOT 1";
//$configs['teachers']['row_fields']="teacherId,first_name,middle_name,last_name,gen,dob,religion,type,phone,mail,code,";
//$configs['students']['where']=array("isDeleted"=>0);

/*******************************************************************************************************
 *                       courses
*******************************************************************************************************/
//$configs['courses']['all']="SELECT class,stream,courseId,name,teacherId,short_name,subjectId FROM courses WHERE isDeleted IS NOT 1";
//$configs['teachers']['row_fields']="teacherId,first_name,middle_name,last_name,gen,dob,religion,type,phone,mail,code,";
//$configs['students']['where']=array("isDeleted"=>0);

/*******************************************************************************************************
 *                      forms
*******************************************************************************************************/
$configs['forms']['all']="SELECT formId,name FROM forms WHERE isDeleted IS NOT 1";
//$configs['teachers']['row_fields']="teacherId,first_name,middle_name,last_name,gen,dob,religion,type,phone,mail,code,";
//$configs['students']['where']=array("isDeleted"=>0);

/*******************************************************************************************************
 *                     stream
*******************************************************************************************************/
$configs['streams']['all']="SELECT streamId,name,colour,short_name FROM streams WHERE isDeleted IS NOT 1";


/*******************************************************************************************************
 *                     houses
*******************************************************************************************************/
$configs['houses']['all']="SELECT houseId,masterId,name,colour,gen FROM houses WHERE isDeleted IS NOT 1";

/*******************************************************************************************************
 *                     classes
*******************************************************************************************************/
$configs['classes']['all']="SELECT classId,name,short_name FROM classes WHERE isDeleted IS NOT 1";

/*******************************************************************************************************
 *                     school
*******************************************************************************************************/
$configs['school']['all']="SELECT schoolId,name,box,head,tel,level,gen,isDay,town,motto,mission,vission,short_name FROM school WHERE isDeleted IS NOT 1";

/*******************************************************************************************************
 *                     subject_combination
*******************************************************************************************************/
$configs['sub_selecs']['all']="SELECT sub_selecId,subjectId,term,studentId FROM sub_selecs WHERE isDeleted IS NOT 1";
/*******************************************************************************************************
 *                     department
*******************************************************************************************************/
$configs['departments']['all']="SELECT departmentId,name,short_name,hodId,type FROM departments WHERE isDeleted IS NOT 1";
/*******************************************************************************************************
 *                     usres
*******************************************************************************************************/
$configs['users']['all']="SELECT userId,username,role FROM users WHERE isDeleted IS 0 ";

/*******************************************************************************************************
 *                     marks
*******************************************************************************************************/
$configs['marks']['all']="SELECT markId,examId,courseId,studentId,mark,testId FROM marks WHERE isDeleted IS 0 ";

/*******************************************************************************************************
 *                     tests
*******************************************************************************************************/
$configs['tests']['all']="SELECT testId,examId,courseId,max_score FROM tests WHERE isDeleted IS 0 ";

/*******************************************************************************************************
 *                     exams
*******************************************************************************************************/
$configs['exams']['all']="SELECT examId,name,term,type,year,isInternal FROM exams WHERE isDeleted IS 0 ";
/*******************************************************************************************************
 *                     exams
*******************************************************************************************************/
$configs['workload']['all']="SELECT workloadId,teacherId,subjectId,form,term,lessons,year FROM exams WHERE isDeleted IS 0 ";
/*******************************************************************************************************
 *                     sub_configs
*******************************************************************************************************/
$configs['subject_configs']['all']="SELECT subject_configId,form,examId,subjectId,max_score FROM subject_configs WHERE isDeleted IS 0 ";
/*******************************************************************************************************
 *                     sub_configs
*******************************************************************************************************/
$configs['courses']['all']="SELECT courseId,form,examId,subjectId,max_score FROM courses WHERE isDeleted IS 0 ";




