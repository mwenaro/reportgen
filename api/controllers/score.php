<?php

class Score extends Controller {

    function __construct() {
        parent::__construct();
//        $this->db = new Database('sqlite');
        Session::init();
//        if (true === Session::get('isLoggedIn')) {
//            header('location:' . URL . 'dashboard/dashboard');
//        }
    }

    function _sql($where = null, $limit = null) {
        $sql = "SELECT DISTINCT students.adm,exams.examId,students.name,students.form,subjects.short_name as  sub,students.adm,marks.score
,case WHEN round(marks.score*100/courses.max_score) >=80 then 'A' 
                 WHEN round(marks.score*100/courses.max_score) >= 75 AND round(marks.score*100/courses.max_score) < 80 then 'A-' 
                 WHEN round(marks.score*100/courses.max_score) >= 70 AND round(marks.score*100/courses.max_score) < 75 then 'B+' 
                WHEN round(marks.score*100/courses.max_score) >= 65 AND round(marks.score*100/courses.max_score) < 70 then 'B' 
                WHEN round(marks.score*100/courses.max_score) >= 60 AND round(marks.score*100/courses.max_score) < 65 then 'B-' 
                WHEN round(marks.score*100/courses.max_score) >= 55 AND round(marks.score*100/courses.max_score) < 60 then 'C+' 
                WHEN round(marks.score*100/courses.max_score) >= 50 AND round(marks.score*100/courses.max_score) < 55 then 'C' 
                WHEN round(marks.score*100/courses.max_score) >= 45 AND round(marks.score*100/courses.max_score) < 50 then 'C-' 
                WHEN round(marks.score*100/courses.max_score) >= 40 AND round(marks.score*100/courses.max_score) < 45 then 'D+' 
                WHEN round(marks.score*100/courses.max_score) >= 35 AND round(marks.score*100/courses.max_score) < 40 then 'D' 
                WHEN round(marks.score*100/courses.max_score) >= 30 AND round(marks.score*100/courses.max_score) < 35 then 'D-' 
                WHEN round(marks.score*100/courses.max_score) < 30 then 'E' 
                END as grade
				,case WHEN round(marks.score*100/courses.max_score) >=80 then '12' 
                 WHEN round(marks.score*100/courses.max_score) >= 75 AND round(marks.score*100/courses.max_score) < 80 then '11' 
                 WHEN round(marks.score*100/courses.max_score) >= 70 AND round(marks.score*100/courses.max_score) < 75 then '10' 
                WHEN round(marks.score*100/courses.max_score) >= 65 AND round(marks.score*100/courses.max_score) < 70 then '9' 
                WHEN round(marks.score*100/courses.max_score) >= 60 AND round(marks.score*100/courses.max_score) < 65 then '8' 
                WHEN round(marks.score*100/courses.max_score) >= 55 AND round(marks.score*100/courses.max_score) < 60 then '7' 
                WHEN round(marks.score*100/courses.max_score) >= 50 AND round(marks.score*100/courses.max_score) < 55 then '6' 
                WHEN round(marks.score*100/courses.max_score) >= 45 AND round(marks.score*100/courses.max_score) < 50 then '5' 
                WHEN round(marks.score*100/courses.max_score) >= 40 AND round(marks.score*100/courses.max_score) < 45 then '4' 
                WHEN round(marks.score*100/courses.max_score) >= 35 AND round(marks.score*100/courses.max_score) < 40 then '3' 
                WHEN round(marks.score*100/courses.max_score) >= 30 AND round(marks.score*100/courses.max_score) < 35 then '2' 
                WHEN round(marks.score*100/courses.max_score) < 30 then '1' 
                END as points
				FROM marks
  JOIN students ON marks.studentId=students.studentId
  JOIN subjects ON marks.subjectId=subjects.subjectId
  JOIN courses ON marks.courseId=courses.courseId
  JOIN exams ON marks.examId=exams.examId
 
 {{$where}}  
 
GROUP BY students.adm,exams.examId,marks.markId

{{$limit}}


ORDER BY students.adm,sub";
        return $sql;
    }

    function fetchClassData() {
        $post = _Request::post();
//        $where = array_key_exists('where', $post)? post['where'] : ['students.form' => 1];
        $where = ['students.form' => 1];
        $where = $this->db->where($where);

        $this->_sql($where);
        $errors = [];
        $handle = $this->db->select($sql);
        if (!$handle->getFlag()) {
            $errors = $handle->getError();
        }
        $data = $this->pro($handle->getData());
        echo json_encode(['flag' => empty($errors), 'errors' => $return, 'data' => $data]);
    }

    function pro($data = []) {
        $return = [];
        if (!empty($data)):
            $adms = array_unique(array_column($data, 'adm'));
            foreach ($adms as $adm) {
                $box = [];
                foreach ($data as $student) {
                    if ($adm === $student['adm']):
                        $box['adm'] = $student['adm'];
                        $box['name'] = $student['name'];
                        $box['form'] = $student['form'];
                        $box['gen'] = $student['gen'];
                        $box['marks'][$student['sub']][] = $student['score'];
                    endif;
                }
                $return[$adm] = $box;
            }

        endif;

        return $return;
    }

}
