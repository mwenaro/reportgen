<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of students
 *
 * @author Tsagwa Secondary
 */
class Student extends Controller {

    //put your code here
    function __construct() {
        parent::__construct();
        // echo '   <script src="'.URL.'public/js/angular.js" type="text/javascript"></script>';
        Session::init();
//        if (true !== Session::get('loggedIn')) {
//            header('location:' . URL . 'login');
//        }
    }

    function index() {
        //echo Hash::create('sha256', 'jesse', HASH_PASSWORD_KEY);
        //echo Hash::create('sha256', 'test2', HASH_PASSWORD_KEY);

        $this->view->title = 'Students';
        $this->view->render('header');
//        $this->view->render('student/index');
        $this->view->render('footer');
    }

    function delete($studentId = null) {
        $studentId = $_GET['studentId'];
        if ($this->model->delete($studentId)) {
            $this->view->msg = 'Student Successfully Delete';
            //     $this->view->render('student/dashboard');
            header('location:' . URL . 'student/dashboard');
        } else {
            echo '<br>Could not delete';
        }
    }

    function edit($inputData) {

        $this->model->edit($table, $data, $studentId);
    }

    function update($ng_data = array()) {
        $data = $_POST;
        $flag = false;
        $table = 'students';
        $where = array_key_exists('studentId', $data) ? array('studentId' => $data['studentId']) : array();
        if (!empty($where)) {
            $flag = $this->model->update($table, $data, $where);
        }

        if (array() !== $where || $flag === false) {

            // $this->_goTO($this, 'student/add', array('msg' => ' Could not update student'));
            $this->_goTO($this, 'student/update', array('data' => $data, 'flag' => true, 'msg' => ' Could not update student'));
            exit();
        } else if ($flag) {
            $this->_goTO($this, 'student/add', array('msg' => ' Student Successfully updated'));
            exit();
        } else {
            $this->_goTO($this, 'student/update', array('data' => $data, 'flag' => true, 'msg' => ' Could not update student'));
            exit();
        }
    }

    function add() {
        $data = $_POST;

        if (!empty($data)) {

            $this->model->add($data);
        } else {
            $this->view->errorMsg = 'All the fields must be filled!';
            $this->view->title = 'Students';
            $this->view->render('header');
            $this->view->render('student/add');
            $this->view->render('footer');
        }
    }

    function get_row($data = null) {
       // $post = json_encode($_POST);
        $post = json_encode(file_get_contents("php://input"));
       // print_r($post);        
        //$id = $post['studentId'];
        $sql = $post;
//        var_dump($sql);
//        exit();
        print_r(json_encode($this->model->getRow($sql)));
    }

    function dashboard() {
        if ($this->model->fetchAllStudents()) {
            $this->view->stdnts = ($this->model->fetchAllStudents());
            $this->view->render('header');
            $this->view->render('student/dashboard');
            $this->view->render('footer');
        } else {
            // echo 'no data';
        }
    }

    function getMaxADM() {
        //echo '<br>FRM GET max ADM'.var_dump($this->model->getMaxADM());
        return $this->model->getMaxADM();
    }

}
