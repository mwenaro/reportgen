<?php

class Password extends Controller {

    function __construct() {
        parent::__construct();
        $this->title = __CLASS__ . 'Reset';
        Session::init();
           if(true!== Session::get('loggedIn')){
               header('location:'.URL.'login');
           }
    }

    function trial($post=array()) {
        if (!empty($_POST)) {
            $data = $_POST;
            $data['father'] = 'mangale mwero';
            echo json_encode('"father":"mwero"');
        } else {
            $this->view->title = $this->title;
            $this->view->render('header');
            $this->view->render('password/trial');
            $this->view->render('footer');
        }
    }

    function index() {
        $this->view->title = $this->title;
        $this->view->smg = "Forgot Password? Dont You worry, we will help reset your passowrd Just Click the <b>Reset Password</b> below";
        $this->view->render('header');
        $this->view->render('password/index');
        $this->view->render('footer');
    }

    function create($data) {
        
    }

    function reset(array $data) {
        $msg = false;
        if ($this->model->reset($data)->$flag()) {
            $smg = true;
        }
        $this->view->title = $this->title;
        $this->view->smg = $msg;
        $this->view->render('header');
        $this->view->render('password/index');
        $this->view->render('footer');
    }

    function edditStudent($studentId) {
        $this->model->eddit($studentId);
    }

}
