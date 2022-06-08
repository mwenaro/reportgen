<?php

class Report extends Controller {

//private $db;

    function __construct() {
        parent::__construct();
//        $this->db = new Database('sqlite');
        Session::init();
//        if (true === Session::get('isLoggedIn')) {
//            header('location:' . URL . 'dashboard/dashboard');
//        }
    }

    function _sql($where = null, $limit = null) {
        $sql1 = "SELECT DISTINCT students.adm,students.gen,exams.examId,students.name,oppener.kcpe,students.form,subjects.short_name as  sub,students.adm,COUNT(exams.examId) as exams,(marks.score*100/tests.max_score) as score
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
  JOIN exams ON tests.examId=exams.examId
  JOIN oppener ON students.adm=oppener.adm
 
 
{$where} {$limit}
 
GROUP BY students.adm,exams.examId,marks.markId


ORDER BY mean DESC,students.adm ,sub";
        $sql = "SELECT DISTINCT students.adm,students.gen,exams.examId,students.name,students.form,subjects.short_name as  sub,students.adm,marks.score
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
                
				FROM marks
  JOIN students ON marks.studentId=students.studentId
  JOIN subjects ON marks.subjectId=subjects.subjectId
  JOIN tests ON tests.testId=marks.testId
  JOIN courses ON tests.courseId=courses.courseId
  JOIN exams ON tests.examId=exams.examId
  JOIN oppener ON students.adm=oppener.adm
 
 {$where}  
 
GROUP BY students.adm,exams.examId,marks.markId

{$limit}


ORDER BY students.adm,sub";
        return $sql1;
    }

    function _pos($where = null) {
        $s = is_null($where) ? " students.form IS '{$where}' " : " {where}";
        $sql = "SELECT DISTINCT students.adm,students.studentId,students.name,students.form,marks.examId,count(marks.score) as sub,sum(marks.score) as total ,
  CASE WHEN students.form < '2'  THEN round(sum(marks.score)/11)
 WHEN students.form  >= '2' AND students.form  < '3'   THEN round(sum(marks.score)/8)
 WHEN students.form > '1' AND count(marks.score)>='7'  THEN round(avg(marks.score))
 WHEN students.form > '1' AND count(marks.score)<'7'  THEN round(sum(marks.score)/8)
 END   as mean 

 FROM marks
 JOIN students ON marks.studentId=students.studentId 
 
{$s}

  GROUP BY students.studentId ORDER BY form,mean DESC";

        return $this->db->select($sql)->getData();
    }

    function getclsdata() {
        $post = _Request::init()['post'];
        $where = array_key_exists('where', $post) ? $post['where'] : [];
//        $where = array_key_exists('where', $post) ? $post['where'] : ['students.form' => 1];
//        $where = ["students.form" => 1];
        $this->tracker->db_init($where);
//        exit();
        $where = $this->db->where($where);
        $sql = $this->_sql($where);
//        var_dump($sql);
//        exit();
        $handle = $this->db->select($sql);
        _Request::response($handle, $this, 'pro');
    }

    function rankMe() {

        $data = [];
        $box = [];
        foreach ($data as $std) {
            $box[$std['adm']] = $stud['mean'];
        }
    }

    function pro1($data = []) {
        $return = [];
        if (!empty($data)):
            $adms = [];
            foreach ($data as $row) {
                $adms[] = $row['adm'];
            }

//            $adms = array_unique(array_column($data, 'adm'));
            $adms = array_unique($adms);
            foreach ($adms as $adm) {
                $box = [];
                foreach ($data as $student) {
                    if ($adm === $student['adm']):


                        $box['adm'] = array_key_exists('adm', $student) ? $student['adm'] : null;
                        $box['name'] = array_key_exists('name', $student) ? ucwords($student['name']) : '';
                        $box['form'] = $student['form'];
                        $box['mean'] = $student['mean'];
                        $box['gen'] = $student['gen'];
                        $box['kcpe'] = $student['kcpe'];
                        $box['no_exam'] = $student['no_exam'];

                        $box['marks'][$student['sub']][] = $student['score'];


                    endif;
                }
                $return[] = $box;
            }

        endif;

        return $return;
    }

    function pro($input_data = []) {
        $return = [];
        $return = $this->data_complier($input_data);
        return $return;
    }

    function data_complier($data = []) {
        $return = [];
        if (!empty($data)):
            $adms = [];
            foreach ($data as $row) {
                $adms[] = $row['adm'];
            }

//            $adms = array_unique(array_column($data, 'adm'));
            $adms = array_unique($adms);
            foreach ($adms as $adm) {
                $box = [];
                foreach ($data as $student) {
                    if ($adm === $student['adm']):


                        $ent = array_keys($student);
                        $entries = $ent;
                        foreach ($entries as $field) {
                            if ($field === 'sub'):
                                $box['marks'][$student[$field]][] = $student['score'];
                            elseif ($field === 'name'):
                                $box['name'] = ucwords(strtolower($student['name']));
                            else :
                                $box[$field] = array_key_exists($field, $student) ? $student[$field] : $this->_field_defaults($field);
                            endif;
                        }


                    endif;
                }
                $return[] = $box;
            }

        endif;
//        var_dump($box);

        return $return;
    }

    function _field_extractor($field, $data) {
        $field_key = array_values($field[0]);
        $r_main_field = array_keys($field[0]);
        $main_field = $r_main_field === 'no' ? null : $r_main_field;

        $w_data = is_null($main_field) ? $data : array_column($data, $main_field);
        return array_column($w_data, $field_key);
    }

    function _field_defaults($field) {
        $arr_defaults = [
            'term' => 1,
            'name' => 'mwero abdalla',
            'form' => '4',
            'year' => 2018,
            'kcpe' => 120,
            'exam_type' => 'e',
        ];
//        $return = array_key_exists($field, $arr_defaults) ? $arr_defaults[$field] : '';
        return array_key_exists($field, $arr_defaults) ? $arr_defaults[$field] : '';
    }

}
