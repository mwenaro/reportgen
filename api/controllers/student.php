<?php
header("Access-Control-Allow-Origin:*");
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of students
 *
 * @author Tsagwa Secondary
 */
class Student extends Controller {

    //put your code here
    function __construct() {
        parent::__construct();
        // echo '   <script src="'.URL.'public/js/angular.js" type="text/javascript"></script>';
        Session::init();
//        if (true !== Session::get('loggedIn')) {
//            header('location:' . URL . 'login');
//        }
    }

    function index() {
        
    }

    function get($table, $where = null, $order = null, $by = null, $limit = null) {
        echo  json_encode([
            'student/get'=>[
                'table'=>$table,
                'where'=>$where,
                'order'=>$order,
                'by'=>$by,
                'limit'=>$limit
            ]
        ]);
    }

    function create($table, $data) {
        
    }

    function update($table, $data, $id) {
        
    }

    function delete($table, $id) {
        
    }

}
