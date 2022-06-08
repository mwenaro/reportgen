<?php

class Login_Model extends Model {

    public function __construct() {
        parent::__construct();
        //  echo '<p>login model</p>';
    }

    public function run() {
        if ($_POST) {
            $d = $this->db->select("SELECT userId, role FROM users WHERE 
                role = :role AND password = :password", $_POST)->getData();
            $data = !empty($d) ? $d[0] : [];
            // echo '<br>In run';
            $count = count($data); //$sth->rowCount();
            if ($count > 0) {
                //  echo '<br>In run data';
                // login
                Session::init();
                Session::set('role', $data['role']);
                Session::set('loggedIn', true);
                Session::set('userId', $data['userId']);
                // header('location:' . URL . 'student/studentsDashboard');
//                header('location:' . URL . 'dashboard/dashboard');
                header('location:' . URL . 'app/index');
                // var_dump($data);
            } else {
                //echo '<br>out run no data';
                header('location:' . URL . 'login');
            }
        }
    }

}
