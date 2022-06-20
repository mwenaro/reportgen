<?php

class App extends Controller {

    function __construct() {
        parent::__construct();
       
    }

    function index() {
          // $this->view->render('app/view');
         $this->view->render('app/view');
    }

}
