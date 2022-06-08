<?php

class Error extends Controller {

    function __construct() {
        parent::__construct(); 
        Session::init();
            
    }
    
    function index($page=null) {
        $this->view->title = '404 Error';
        $this->view->msg = 'This page doesnt'.$page.' exist';
        
        $this->view->render('error/inc/header');
        $this->view->render('error/index');
        $this->view->render('error/inc/footer');
//        if(Session::get('loggedIn')){
//          //$bootstrap->init();
//         //header("location:".URL.'');
//        }
//        header("location:".URL.'login');
  }

}