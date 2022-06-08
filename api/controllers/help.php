<?php

class Help extends Controller {

    function __construct() {
        parent::__construct();
    }
    
    function index() {
        $this->view->title = 'Help';
        
        $this->view->render('header');
        $this->view->render('help/index');    
        $this->view->render('footer');
    }

}