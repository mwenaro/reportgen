<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of exams
 *
 * @author Tsagwa Secondary
 */
class Exam extends Controller {

    private $term;
    private $type;

    //put your code here
    function __construct() {
        parent::__construct();

        Session::init();
//        if (true !== Session::get('loggedIn')) {
////            header('location:' . URL . 'login');
//        }
        $this->type = array('e' => 'end of', 'o' => 'opener', 'm' => 'mid of');
        $this->term = array('1' => ' term one ', '2' => 'term two', '3' => 'term three');
        $this->view->title = __CLASS__ . 's';
        $this->view->pageData = array('flag' => true);
    }

    function index() {

        $this->view->render('header');
        $this->view->render('exam/dashboard');
        $this->view->render('footer');
    }

    function delete($examId = null) {
        $examId = $_GET['examId'];
        if ($this->model->delete($examId)) {
            $this->view->msg = 'Exam Successfully Delete';
            //     $this->view->render('exam/examsdashboard');
            header('location:' . URL . 'exam/dashboard?msg=exam Successfully Delete');
        }
    }

    function eddit($examId) {
        $this->model->eddit($examId);
    }

    function add() {
        $data = $_POST;
//first term oppener exam 2016
        //end of term two exam
        if (!empty($data)) {
            $data['examName'] = $this->type[$data['examType']] . ' ' . $this->term[$data['term']] . ' exam ' . $data['year'];
            $data['status'] = 'done';
            if ($this->model->addExam($data)) {
                $this->dashboard();
            }
        } else {
            $this->view->errorMsg = 'All the fields must be filled!';
            $this->view->title = 'exams';
            $this->view->render('header');
            $this->view->render('exam/dashboard');
            $this->view->render('footer');
        }
    }

    function dashboard() {
        if ($this->model->fetchAllExams()) {

            $this->view->pageData['data'] = $this->model->fetchAllExams();
            $this->view->pageData['flag'] = true;
            $this->view->pageData['typeArr'] = $this->type;
            $this->view->render('header');
            $this->view->render('exam/dashboard');
            $this->view->render('footer');
        } else {
            // echo 'no data';
        }
    }

    function getMaxADM() {
        //echo '<br>FRM GET max ADM'.var_dump($this->model->getMaxADM());
        return $this->model->getMaxADM();
    }

    function get() {
        $sql=" SELECT * FROM exams ";
        $handle= $this->db->select($sql);
        _Request::response($handle, $this);
    }
    function get_all() {
        $sql=" SELECT * FROM exams ";
        $handle= $this->db->select($sql);
        _Request::response($handle, $this);
    }

    function get_by_Id($examId) {
        $sql=" SELECT * FROM exams WHERE examId = '{$examId}' ";
        
        $handle= $this->db->select($sql);
        _Request::response($handle, $this);
    }
    
    function create_tests() {
        
    }

}
