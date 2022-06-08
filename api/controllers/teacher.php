<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of teachers
 *
 * @author USER-PC
 */
class Teacher extends Controller {

    //put your code here
    function __construct() {
        parent::__construct();
        
        Session::init();
           if(true!== Session::get('loggedIn')){
               header('location:'.URL.'login');
           }
        $this->view->title = __CLASS__.'s';
        $this->view->teachers = [];
    }

    function index() {
        if ($this->model->fetchAllTeachers()) {
            $this->view->teachers = $this->model->fetchAllTeachers();
        }
        $this->view->render('header');
        $this->view->render('teacher/index');
        $this->view->render('footer');
    }

    function delete($teacherId = null) {
        $teacherId = $_GET['teacherId'];
        if ($this->model->delete($teacherId)) {
            $this->view->msg = 'Teacher Successfully Delete';
             header('location:' . URL . 'teacher/index?msg=Student Successfully Delete');
        }
    }

    function edit($teacherId) {
        $this->model->eddit($teacherId);
    }

    function add() {
        $data = $_POST;

        if (!empty($data)) {
            $intials = str_split($data['fName'])[0] . '' . str_split($data['mName'])[0] . '' . str_split($data['lName'])[0];
            $data['initials'] = strtoupper($intials);
            $this->model->add($data);
        } else {
            $this->view->errorMsg = 'All the fields must be filled!';
            $this->view->title = 'Teachers';
            $this->view->render('header');
            $this->view->render('teacher/AddStudent');
            $this->view->render('footer');
            echo 'Incomplete Form';
        }
    }

    function dashboard() {
        if ($this->model->fetchAllStudents()) {
            $data = $this->model->fetchAllStudents();
            $this->view->stdnts = $data;
            $this->view->render('header');
            $this->view->render('teacher/dashboard');
            $this->view->render('footer');
        } else {
            
        }
    }

    function getMaxADM() {
        //echo '<br>FRM GET max ADM'.var_dump($this->model->getMaxADM());
        return $this->model->getMaxADM();
    }

}
