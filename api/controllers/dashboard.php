<?php

class Dashboard extends Controller {

    function __construct() {
        parent::__construct();
        Session::init();
           if(true!== Session::get('loggedIn')){
               header('location:'.URL.'login');
           }
       // Auth::handleLogin();
        $this->view->js = array('dashboard/js/default.js');
    }
    
     function index() 
    {    
        $this->view->title = 'Dashboard';
        
        $this->view->render('header');
        $this->view->render('dashboard/index');
        $this->view->render('footer');
    }
    function dashboard() 
    {    
        $this->view->title = 'Dashboard';
        
       // $this->view->render('header');
        $this->view->render('dashboard/dashboard');
       // $this->view->render('footer');
    }
    
    function logout()
    {
        Session::destroy();
        header('location: ' . URL .  'login');
        exit;
    }
    
    function xhrInsert()
    {
        $this->model->xhrInsert();
    }
    
    function xhrGetListings()
    {
        $this->model->xhrGetListings();
    }
    
    function xhrDeleteListing()
    {
        $this->model->xhrDeleteListing();
    }

}