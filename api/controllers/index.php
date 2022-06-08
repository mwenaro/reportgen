<?php

class Index extends Controller {

    function __construct() {
        parent::__construct();
//        $this->view->render('header');
//        $this->view->render('student/index');
//         $this->view->render('footer');
//        Session::init();
//           if(true!== Session::get('loggedIn')){
//               header('location:'.URL.'login');
//           }
    }
    
    function index() {
//        echo json_encode(['we r in index/index']);        exit();
        //echo Hash::create('sha256', 'jesse', HASH_PASSWORD_KEY);
        //echo Hash::create('sha256', 'test2', HASH_PASSWORD_KEY);
        $this->view->title = 'Home';
//        $this->view->render('header');
        //$this->view->render('index/index');
        $this->view->render('dashboard/dashboard');
//        $this->view->render('footer');
    }
    
}