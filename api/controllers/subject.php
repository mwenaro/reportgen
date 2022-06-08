<?php

class Subject extends Controller {

    function __construct() {
        parent::__construct();
    }
    
    function index() {
        $this->view->render('header');
//        $this->view->render('subject/index');
        $this->view->render('footer');
    }

}