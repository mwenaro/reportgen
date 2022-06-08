<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of marks_model
 *
 * @author BARASHY
 */
class marks_model {

    //put your code here
    private $db;
    private $sql;

    function __construct(Database $db) {
        $this->db = $db;
    }

    function mark_init($where) {
        $where = is_array($where) ? $this->db->where($where) : $where;
        $where .= ' AND students.active is 1 ';
        $this->_sql($where);
    }

    function _sql($where = null, $limit = null) {
        $where .= empty($where) ? '' : " AND students.active ='1'";
        $sql = "SELECT DISTINCT students.adm,exams.term,students.gen,exams.examId,exams.type AS exam_type,students.name,oppener.kcpe,classes.classId,students.form,streams.short_name AS stream,subjects.short_name as  sub,students.adm,COUNT(exams.examId) as exams,(marks.score*100/tests.max_score) as score
,case WHEN round(marks.score*100/tests.max_score) >=80 then 'A' 
                 WHEN round(marks.score*100/tests.max_score) >= 75 AND round(marks.score*100/tests.max_score) < 80 then 'A-' 
                 WHEN round(marks.score*100/tests.max_score) >= 70 AND round(marks.score*100/tests.max_score) < 75 then 'B+' 
                WHEN round(marks.score*100/tests.max_score) >= 65 AND round(marks.score*100/tests.max_score) < 70 then 'B' 
                WHEN round(marks.score*100/tests.max_score) >= 60 AND round(marks.score*100/tests.max_score) < 65 then 'B-' 
                WHEN round(marks.score*100/tests.max_score) >= 55 AND round(marks.score*100/tests.max_score) < 60 then 'C+' 
                WHEN round(marks.score*100/tests.max_score) >= 50 AND round(marks.score*100/tests.max_score) < 55 then 'C' 
                WHEN round(marks.score*100/tests.max_score) >= 45 AND round(marks.score*100/tests.max_score) < 50 then 'C-' 
                WHEN round(marks.score*100/tests.max_score) >= 40 AND round(marks.score*100/tests.max_score) < 45 then 'D+' 
                WHEN round(marks.score*100/tests.max_score) >= 35 AND round(marks.score*100/tests.max_score) < 40 then 'D' 
                WHEN round(marks.score*100/tests.max_score) >= 30 AND round(marks.score*100/tests.max_score) < 35 then 'D-' 
                WHEN round(marks.score*100/tests.max_score) < 30 then 'E' 
                END as grade
				,case WHEN round(marks.score*100/tests.max_score) >=80 then '12' 
                 WHEN round(marks.score*100/tests.max_score) >= 75 AND round(marks.score*100/tests.max_score) < 80 then '11' 
                 WHEN round(marks.score*100/tests.max_score) >= 70 AND round(marks.score*100/tests.max_score) < 75 then '10' 
                WHEN round(marks.score*100/tests.max_score) >= 65 AND round(marks.score*100/tests.max_score) < 70 then '9' 
                WHEN round(marks.score*100/tests.max_score) >= 60 AND round(marks.score*100/tests.max_score) < 65 then '8' 
                WHEN round(marks.score*100/tests.max_score) >= 55 AND round(marks.score*100/tests.max_score) < 60 then '7' 
                WHEN round(marks.score*100/tests.max_score) >= 50 AND round(marks.score*100/tests.max_score) < 55 then '6' 
                WHEN round(marks.score*100/tests.max_score) >= 45 AND round(marks.score*100/tests.max_score) < 50 then '5' 
                WHEN round(marks.score*100/tests.max_score) >= 40 AND round(marks.score*100/tests.max_score) < 45 then '4' 
                WHEN round(marks.score*100/tests.max_score) >= 35 AND round(marks.score*100/tests.max_score) < 40 then '3' 
                WHEN round(marks.score*100/tests.max_score) >= 30 AND round(marks.score*100/tests.max_score) < 35 then '2' 
                WHEN round(marks.score*100/tests.max_score) < 30 then '1' 
                END as points,
                (SELECT  COUNT( DISTINCT e1.examId)  FROM exams e1 JOIN marks m ON e1.examId = m.examId JOIN students s ON m.studentId=s.studentId WHERE m.studentId=students.studentId   GROUP  BY s.studentId ) no_exam,
				( SELECT 
CASE WHEN s.form < '2'  THEN round(sum(m.score)/(11*COUNT( DISTINCT e.examId)))
 WHEN s.form > '1' AND count(m.score)>=7*COUNT( DISTINCT e.examId)  THEN round(avg(m.score))
 WHEN s.form > '1' AND count(m.score)<7*COUNT( DISTINCT e.examId)  THEN round(sum(m.score)/(8*COUNT( DISTINCT e.examId)))
 END  
  FROM marks m JOIN students s ON m.studentId=s.studentId JOIN exams e ON m.examId=e.examId
 
 WHERE s.studentId=students.studentId 
 
 GROUP BY s.studentId 
   ) mean 
   				
				FROM marks
  JOIN students ON marks.studentId=students.studentId
  JOIN subjects ON marks.subjectId=subjects.subjectId
  JOIN tests ON tests.testId=marks.testId
  JOIN courses ON tests.courseId=courses.courseId
  JOIN exams ON marks.examId=exams.examId
  JOIN classes ON classes.classId=students.classId
  JOIN streams ON streams.streamId=classes.streamId
  JOIN oppener ON students.adm=oppener.adm
 
 
{$where} {$limit}
 
GROUP BY students.adm,exams.examId,marks.markId


ORDER BY mean DESC,students.adm ,sub";

        $this->sql = $sql;
        return $sql;
    }

    /**
     * 
     * @param Array $ops -
     *  $ops[0]=where,
     *  $ops[1]=limit,
     *  $ops[2]=group by,
     *  $ops[3]=order by,
     */
    function get_students_marks_by_cls($where) {


        return $this->_sql($where, $limit);
    }

    /*     * *
     * BEST PER SUBJECT
     */

    function get_best_students_per_sub_per_exam_per_cls($limit = 3) {
        $limit = is_null() ? null : " LIMIT {$limit}";
//        $data = [];
        $sql = " SELECT   adm,name,classId,form,stream,sub,score,grade from (" .
                $this->sql
                . " )
  GROUP BY adm,classId,sub,score
 ORDER BY sub, classId desc,score desc 
 {$limit}";
    }

    /*     * *
     * *******************************************************************************************************
     */

    function get_best_students_per_sub_per_exam_per_form($limit = 3) {
        $limit = is_null() ? null : " LIMIT {$limit}";
//        $data = [];
        $sql = " SELECT   adm,name,form,stream,sub,score,grade from (" .
                $this->sql
                . " )
   GROUP BY adm,form,sub,score
 ORDER BY sub, form ,score desc 
 {$limit}
";
        return $sql;
    }

    /*     * *
     * *******************************************************************************************************
     */

    function get_best_students_per_sub_per_exam_overal($limit = 3) {
        $limit = is_null() ? null : " LIMIT {$limit}";
//        $data = [];
        $sql = " SELECT   adm,name,form,stream,sub,score,grade from (" .
                $this->sql
                . " )
  GROUP BY adm,sub,score
 ORDER BY sub,score desc 
 {$limit}
";
        return $sql;
    }

    /*     * *
     * *******************************************************************************************************
     */
    /*     * *
     * BEST student PER MG
     */

    function get_best_students_per_exam_per_cls($limit = 3) {
        $limit = is_null() ? null : " LIMIT {$limit}";
//        $data = [];
        $sql = " SELECT adm,name,form,classId,stream,count(score) AS subs, round(AVG(points),2) AS mp FROM (
SELECT   adm,name,classId,form,stream,sub,score,grade,points from (" .
                $this->sql
                . "  )
  GROUP BY adm,classId,sub,score
 ORDER BY sub, classId desc,score desc
 
)
GROUP BY adm
ORDER BY classId desc,mp DESC,ms desc
 {$limit}

";
        return $sql;
    }

    /*     * *
     * *******************************************************************************************************
     */

    function get_best_students_per_exam_per_form($limit = 3) {
        $limit = is_null() ? null : " LIMIT {$limit}";
//        $data = [];
        $sql = " SELECT adm,name,classId,form,stream,count(score) AS subs, round(AVG(points),2) AS mp FROM (
SELECT   adm,name,classId,form,stream,sub,score,grade,points from (" .
                $this->sql
                . "  )
  GROUP BY adm,classId,sub,score
 ORDER BY sub, classId desc,score desc
 
)
GROUP BY adm
ORDER BY form,mp DESC,ms desc
 {$limit}

";
        return $sql;
    }

    /*     * *
     * *******************************************************************************************************
     */

    function get_best_students_per_exam_overal($limit = 3) {
        $limit = is_null() ? null : " LIMIT {$limit}";
//        $data = [];
        $sql = " SELECT adm,name,form,classId,stream,count(score) AS subs,round(AVG(score),2) AS ms, round(AVG(points),2) AS mp FROM (
SELECT   adm,name,classId,form,stream,sub,score,grade,points from (" .
                $this->sql
                . "  )
  GROUP BY adm,classId,sub,score
 ORDER BY sub, classId desc,score desc
 
)
GROUP BY adm
ORDER BY mp DESC,ms desc
 {$limit}
";
        return $sql;
    }

    /*     * *
     * *******************************************************************************************************
     */


    /*     * *
     * CLASS RANKING
     */

    function cls_ranking_by_exam() {
//      $limit = is_null() ? null : " LIMIT {$limit}";
//        $data = [];
        $sql = " SELECT classId,form,stream,mg,round(avg(mp),2) as mp from (
 
SELECT   adm,name,classId,form,stream,ROUND(AVG(score),2) AS ms,ROUND(AVG(points),2) AS mp,
case WHEN ROUND(AVG(points), 0) == 12 THEN 'A'
WHEN ROUND(AVG(points), 0) >= 11.0 then  'A-' 
                 WHEN ROUND(AVG(points),0) ==10.0 then  'B+' 
                WHEN ROUND(AVG(points),0) ==9.0 then  'B' 
                WHEN ROUND(AVG(points),0)  ==8.0 then  'B-' 
                WHEN ROUND(AVG(points),0) ==7.0 then  'C+' 
                WHEN ROUND(AVG(points),0) ==6.0 then  'C' 
                WHEN ROUND(AVG(points),0) ==5.0 then  'C-' 
                WHEN ROUND(AVG(points),0) ==4.0 then  'D+' 
                WHEN ROUND(AVG(points),0) ==3.0 then  'D' 
                WHEN ROUND(AVG(points),0) ==2.0 then  'D-' 
                WHEN ROUND(AVG(points),0) ==1.0  then 'E' 
                END as mg
				
				

 from ( " .
                $this->sql
                . " )
 )
GROUP BY classId
order by mp desc
 ";
    }

}
