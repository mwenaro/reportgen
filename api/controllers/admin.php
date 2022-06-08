<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of admins
 *
 * @author Tsagwa Secondary
 */
class Admin extends Controller {

    //put your code here
    function __construct() {
        parent::__construct();
        // echo '   <script src="'.URL.'public/js/angular.js" type="text/javascript"></script>';
        Session::init();
        if (true !== Session::get('loggedIn')) {
            header('location:' . URL . 'login');
        }
    }

    function index() {
        //echo Hash::create('sha256', 'jesse', HASH_PASSWORD_KEY);
        //echo Hash::create('sha256', 'test2', HASH_PASSWORD_KEY);

        $this->view->title = 'Admin';
        $this->view->render('header');
        $this->view->render('admin/dashboard');
        $this->view->render('footer');
    }

    function delete($adminId = null) {
        $adminId = $_GET['adminId'];
        if ($this->model->delete($adminId)) {
            $this->view->msg = 'Student Successfully Delete';
            //     $this->view->render('admin/dashboard');
            header('location:' . URL . 'admin/dashboard');
        } else {
            echo '<br>Could not delete';
        }
    }

    function edit($adminId) {
        $this->model->edit($adminId);
    }

    function add() {
        $data = $_POST;

        if (!empty($data)) {

            $this->model->add();
        } else {
            $this->view->errorMsg = 'All the fields must be filled!';
             $this->view->render('header');
            $this->view->render('admin/AddStudent');
            $this->view->render('footer');
        }
    }

    function dashboard() {
        if ($this->model->fetchAllStudents()) {
            $this->view->stdnts = ($this->model->fetchAllStudents());
            $this->view->render('header');
            $this->view->render('admin/dashboard');
            $this->view->render('footer');
        } else {
            // echo 'no data';
        }
    }

    function getMaxADM() {
        //echo '<br>FRM GET max ADM'.var_dump($this->model->getMaxADM());
        return $this->model->getMaxADM();
    }

}
