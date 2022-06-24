<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of courses
 *
 * @author Tsagwa Secondary
 */
class Course extends Controller {

    private $term;
    private $type;
    

    //put your code here
    function __construct() {
        parent::__construct();
           Session::init();
           if(true!== Session::get('loggedIn')){
               header('location:'.URL.'login');
           }
        $this->type = array('e' => 'end of', 'o' => 'opener', 'm' => 'mid of');
        $this->term = array('1' => ' term one ', '2' => 'term two', '3' => 'term three');
        $this->view->title = __CLASS__ . 's';
        $this->view->pageData = array('flag' => true);
    }

    function index() {
   
        $this->view->render('header');
        $this->view->render('course/courseDashboard');
        $this->view->render('footer');
    }

    function deleteCourse($courseId = null) {
        $courseId = $_GET['courseId'];
        if ($this->model->delete($courseId)) {
            $this->view->msg = 'Course Successfully Delete';
            //     $this->view->render('course/coursesdashboard');
            header('location:' . URL . 'course/coursesdahboard?msg=course Successfully Delete');
        }
    }

    function edditCourse($courseId) {
        $this->model->eddit($courseId);
    }
     function manageCourse() {
         if(empty($_POST)){
             $this->view->render('header');
             $this->view->render('course/manageCourse');
             $this->view->render('footer');
         }else{
             echo json_encode($_POST);
              //var_dump($_POST);
         }
        
    }

    function addCourse() {
        $data = $_POST;

        if (!empty($data)) {
          //  var_dump($data);
           
             $data['courseName'] = explode("%",$data['subjectId'])[1] . ' form ' . $data['form'];
             $data['subjectId'] = explode("%",$data['subjectId'])[0];
           
            if($this->model->addCourse($data)){
                $this->courseDashboard();
            }
        } else {
            $this->view->errorMsg = 'All the fields must be filled!';
            $this->view->title = 'courses';
            $this->view->render('header');
            $this->view->render('course/coursesdahboard');
            $this->view->render('footer');
        }
    }

    function courseDashboard() {
//        if ($this->model->fetchAllCourses()) {
//
//            $this->view->pageData['data'] = $this->model->fetchAllCourses();
//             $this->view->pageData['flag'] =true;
//             $this->view->pageData['typeArr']= $this->type;
            $this->view->render('header');
            $this->view->render('course/courseDashboard');
            $this->view->render('footer');
//        } else {
//            // echo 'no data';
//        }
    }

    function getMaxADM() {
        //echo '<br>FRM GET max ADM'.var_dump($this->model->getMaxADM());
        return $this->model->getMaxADM();
    }

}
