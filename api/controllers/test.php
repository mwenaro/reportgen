<?php

class Test extends Controller {

//private $db;

    function __construct() {
        parent::__construct();
//        $this->db = new Database('sqlite');
        Session::init();
//        if (true === Session::get('isLoggedIn')) {
//            header('location:' . URL . 'dashboard/dashboard');
//        }
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

    function get_exam_tests($examId) {
        $sql="SELECT tests.testId,courses.courseId,courses.subjectId,tests.examId,courses.form,subjects.name,subjects.short_name,tests.max_score from courses 
 JOIN subjects  ON courses.subjectId=subjects.subjectId 
 JOIN tests ON tests.courseId=courses.courseId 
 WHERE tests.examId IS '{$examId}'";
// $sql="SELECT courses.courseId,courses.subjectId,tests.examId,courses.form,subjects.name,subjects.short_name,tests.max_score from courses 
// JOIN subjects  ON courses.subjectId=subjects.subjectId 
// JOIN tests ON tests.courseId=courses.courseId 
// WHERE tests.examId IS '6' ";
        $handle = $this->db->select($sql);
//        var_dump($handle);
        _Request::response($handle, $this);
    }
}
