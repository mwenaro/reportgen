<?php

class Login extends Controller {

    private $cls_data;
    private $stream_data = [];

//private $db;

    function __construct() {
        parent::__construct();
//        $this->db = new Database('sqlite');
        Session::init();
//        if (true === Session::get('isLoggedIn')) {
//            header('location:' . URL . 'dashboard/dashboard');
//        }
        
    }

    function logout() {
//        Session::destroy();
        if (Session::get('on')) {
            echo json_encode(['msg' => 'not logged out successfully']);
        } else {
            echo json_encode(['msg' => 'logged out successfully']);
        }
    }

    function get() {
        $post = _Request::post();
        $request = array_key_exists('request', $post) ? $post['request'] : '';

        $errors = [];
        $handle = $this->db->select($request);

        if (!$handle->getFlag()) {
            $errors = $handle->getError();
        }

        echo json_encode(['flag' => empty($errors), 'errors' => $errors, 'data' => $handle->getData()]);
    }

    function getLogin() {
        $user = _Request::post(); 
        $sql = '';
        $id_name = '';
if(!isset($user['username']) || !isset($user['password'])){
    http_response_code(404);
    die(json_encode(['flag' => false, 'usersata' => $user]));
}
        switch ($user) {
            case trim($user['username']) === 'admin' || trim($user['username']) === 'user':
// $sql = "SELECT userId,username,role FROM users WHERE role = :username AND password = :password LIMIT 1";
                $sql = "SELECT userId, username,role FROM users WHERE role = :username AND password = :password";
                $id_name = 'userId';
                break;
            default:
                $sql = "SELECT teacherId,role FROM teachers WHERE phone = :username AND password = :password LIMIT 1";
                $id_name = 'teacherId';
                break;
        }
        $d = $this->db->select($sql, $user)->getData();
        $data = !empty($d) ? $d[0] : [];
        if (count($data) > 0) {
            Session::init();
            Session::set('on', 1);
            Session::set('userId', $data[$id_name]);
            Session::set('isLoggedIn', true);
            Session::set('role', $data['role']);
            Session::set('user', ['role' => $data['role'], 'userId' => $data[$id_name]]);
//            Session::set('loggedInId', $data[$id_name]);
            print_r(json_encode(array('userId' => $data[$id_name], 'flag' => true, 'user' => ['userId' => $data[$id_name], 'role' => $data['role']])));
        } else {
            print_r(json_encode(array('userId' => null, 'flag' => false)));
        }
    }

    function getone($userId = null) {
        $post = _Request::post();
//        $data = $this->db->getRow('teachers', array('teacherId' => $post['userId']));
        $data = $this->db->getRow($post['table'], $post['data']);
        echo json_encode(['data' => $data ? $data : []]);
    }

    function isLoggedIn() {
        $post = _Request::post();
        if (true === Session::get('isLoggedIn')) {
            print_r(json_encode(array(
                'post' => $post,
                'role' => Session::get('role'),
                'userId' => Session::get('userId'),
                'flag' => true)));
        } else {
            print_r(json_encode(array('post' => $post, 'flag' => false)));
        }
    }

    function update() {
// $post = _Request::post();
        $post = _Request::init();
        $data = $post['data'];
        $table = $post['table'];
        $table_short = rtrim($table, 's');

        $data['dateUpdated'] = date("Y-m-d H:i:s");
        $data['updatorId'] = Session::get('isLoggedIn') ? Session::get('userId') : 1;
        $this->mult_model->update($table, $data, ["{$table_short}Id" => $data["{$table_short}Id"]]);
    }

    function getto() {
        echo json_encode(['flag' => [true]]);
    }

    function exits() {
        $post = _Request::post();
        $where = $post['data'];
        $table = $post['table'];
        $where = $post['where'];

        echo json_encode(['flag' => [true]]);
//        $data = $this->db->getRow($table, $where);
//        echo json_encode(['flag'=>!empty($data)?false:true]);
//        echo json_encode(['flag' => []]);
    }

    function exists() {
        $post = _Request::post();
        $table = $post['table'];
        $watu = $this->db->exists($table, [$post['property'] => $post['value']]);
        echo json_encode(['isUnique' => !$watu]);
    }

    function del() {
        $post = _Request::post();
        $request = $post['request'];
        $return = [];
        $handle = $this->db->cmd($request);
        if (!$handle->getFlag()) {
            $return = $handle->getError();
        }
        echo json_encode(['flag' => empty($return), 'return' => $return]);
    }

    function create() {
// $post = _Request::post();
        $post = _Request::init();
        $data = $post['data'];
        $table = $post['table'];
        $data['dateCreated'] = date("Y-m-d H:i:s");
        $data['creatorId'] = Session::get('isLoggedIn') ? Session::get('userId') : 1;
        $this->mult_model->insert($table, $data);
    }

    function delete() {
        $post = _Request::init();
        $data = [];
        $data = $post['data'];
        $id = $post['post']['id'];
        $table = $post['post']['table'];
        $table_short = rtrim($table, 's');

        $data['dateDeleted'] = date("Y-m-d H:i:s");
        $data['deletorId'] = Session::get('isLoggedIn') ? Session::get('userId') : 1;

        if (in_array(Session::get('isLoggedIn') ? Session::get('role') : '', ['admin', 'super_user', 'developer'])) {
            $this->mult_model->delete($table, ["{$table_short}Id" => $id]);
        } else {
            $this->mult_model->update($table, $data, ["{$table_short}Id" => $id], 'delete');
        }
    }

    function index() {
        $this->view->title = 'Login';

        $this->view->render('login/inc/header');
        $this->view->render('login/index');
        $this->view->render('login/inc/footer');
    }

    function run() {
        $this->model->run();
    }

    function _sql($where = null, $limit = null) {
        $where .= " AND students.active ='1'";
        $sql1 = "SELECT DISTINCT students.adm,exams.term,students.gen,exams.examId,exams.type AS exam_type,students.name,oppener.kcpe,students.form,classes.classId,streams.short_name AS stream,subjects.short_name as  sub,COUNT(exams.examId) as exams,COUNT(exams.examId) as noexam,(marks.score*100/tests.max_score) as score
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

        return
" SELECT adm,term,gen,examId,exam_type,name,kcpe,form,stream,classId,sub,score,grade,points"
. " FROM ({$sql1}"
. ")"

                ;
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

        $post = _Request::post();
        $raw_where = array_key_exists('where', $post) ? $post['where'] : ['students.form' => 1];
//        $where = ["students.form" => 1];
//        var_dump($raw_where);
//        $this->tracker->db_init($raw_where);
//        exit();
        $where = $this->db->where($raw_where);
        $sql = $this->_sql($where);
//        var_dump($sql);
//        exit();
        $handle = $this->db->select($sql);
//        $this->tracker->db_init($raw_where);
        _Request::response($handle, $this, 'pro');
    }

    function rankMe() {

        $data = [];
        $box = [];
        foreach ($data as $std) {
            $box[$std['adm']] = $stud['mean'];
        }
    }

    function pro($input_data = []) {
        $return = [];
        $return = $this->data_complier($input_data);
        foreach ($return as $adm => $student) {



            /*             * *
             * kcpe ranking
             */
            $kcpe_data = $sub_data = $this->_field_extractor(['kcpe' => 'no'], $return);
            $student_kcpe = $return[$adm]['kcpe'];
            $student_kcpe_rank = _Sta::rank_one($student_kcpe, $kcpe_data);
            $return[$adm]['kcpe_rank'] = $student_kcpe_rank;

            /*             * *
             * subject ranking 
             */
            $subs = array_keys($return[$adm]['marks']);
            $box = 0;
            $no_subs = count($subs);
            $form = $return[$adm]['form'];
            $dev = $this->_devider_finder($form, $no_subs);


            foreach ($subs as $sub) :
                $sub_data = $this->_field_extractor([$sub => 'marks'], $return);
                $student_score = $return[$adm]['marks'][$sub];
                $student_sub_rank = _Sta::rank_one($student_score, $sub_data);
                $outof = count($sub_data);
                $return[$adm]['marks'][$sub]['sub_rank'] = $student_sub_rank;
                $return[$adm]['marks'][$sub]['outof'] = $outof;
                $return[$adm]['marks'][$sub]['mark'] = $student_score;
                $return[$adm]['marks'][$sub]['sub'] = $sub;
//                $box += array_sum($student_score);
                $box += $student_score[0];
            endforeach;

            /**
             * finding mean
             */
            $mean = $dev !== 0 && !empty($dev) ? $box / $dev : 0;
            $return[$adm]['mean'] = $mean;
            $return[$adm]['sum'] = $box;
            $mean = $dev = $box = 0;

            /*             * *
             * class ranking
             */
//            $cls_means = $sub_data = $this->_field_extractor(['mean' => 'no'], $return);
//            $student_mean = $return[$adm]['mean'];
//            $student_cls_rank = _Sta::rank_one($student_mean, $cls_means);
//            $return[$adm]['rank'] = $student_cls_rank;
        }

//        $adms = $this->_field_extractor(['adm' => 'no'], $return);
//        $d = $this->_field_extractor(['mat' => 'marks'], $return);
////        var_dump($d);
//        var_dump($return);
//        exit();
        $return = $this->_rank_cls($return);

        return $return;
    }

    function _rank_stream($return) {
        foreach ($return as $adm => $student) {
            /*             * *
             * class ranking
             */
            $cls_means = $sub_data = $this->_field_extractor(['mean' => 'no'], $return);
            $student_mean = $return[$adm]['mean'];
            $cls_means = $sub_data = $this->_field_extractor(['sum' => 'no'], $return);
            $student_mean = $return[$adm]['sum'];
            $student_cls_rank = _Sta::rank_one($student_mean, $cls_means);
            $return[$adm]['rank'] = $student_cls_rank;
        }

        return $return;
    }

    function _rank_cls($return) {
        foreach ($return as $adm => $student) {
            /*             * *
             * class ranking
             */
            $cls_means = $sub_data = $this->_field_extractor(['mean' => 'no'], $return);
            $student_mean = $return[$adm]['mean'];
            $cls_means = $sub_data = $this->_field_extractor(['sum' => 'no'], $return);
            $student_mean = $return[$adm]['sum'];
            $student_cls_rank = _Sta::rank_one($student_mean, $cls_means);
            $return[$adm]['rank'] = $student_cls_rank;
        }

        return $return;
    }

    function data_complier($data = [], $stream = '') {
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
//                    if ($adm === $student['adm']&&$stream===$student['stream']):


                        $ent = array_keys($student);
                        $entries = $ent;
                        $n = 0;
                        foreach ($entries as $field) {
                            if ($field === 'sub'):
                                if ($n === 0):

                                    $box['marks'][$student[$field]][0] = $student['score'];

                                endif;
                            else :
                                $box[$field] = array_key_exists($field, $student) ? $student[$field] : $this->_field_defaults($field);
                            endif;
                        }


                    endif;
                }
                $n = 0;
                $return[$adm] = $box;
            }

        endif;
//        var_dump($box);

        return $return;
    }

    function _field_extractor($field, $data) {

        $field_key = array_keys($field)[0];
        $r_main_field = array_values($field)[0];
        $main_field = $r_main_field === 'no' ? null : $r_main_field;

        $w_data = is_null($main_field) ? $data : array_column($data, $main_field);
//        print_r($w_data);
        $d = array_column($w_data, $field_key);
//        print_r($d);
        return $d;
    }

    function _field_defaults($field) {
        $arr_defaults = [
            'term' => 1,
            'name' => 'mwero abdalla',
            'form' => '4',
            'year' => 2019,
            'kcpe' => 120,
            'exam_type' => 'e',
        ];
        $return = array_key_exists($field, $arr_defaults) ? $arr_defaults[$field] : '';
        return $return;
    }

    function _arr_sum($data) {
        
    }

    function _devider_finder($form, $subs) {
        $rounds = round($subs / 7, 0);

        $devider = $form > 2 ? ($subs >= 7 * $rounds ? $subs : 8 * $rounds) : 11 * $rounds;

        return $devider;
    }

    function _mean_mark($form, $student_data = [], $subs) {
        $total = array_sum($student_data);
        $subs = count($student_data);
        return $devider !== 0 ? ronud($total / $devider, 3) : 0;
    }

}
