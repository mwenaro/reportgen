<?php
error_reporting(1);
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of admin
 *
 * @author Tsagwa Secondary
 */
class admin_model extends Model {

    private $admNoArr = array();

    //put your code here
    public function __construct() {
        parent::__construct();
    }

    /**
     * Adds a new admin
     */
    function add() {
        $data = $_POST;
        if ($this->emptyArray($data)) {
            //Assigns an Admission Number to the Student
            //   $data['admNo'] = $this->getMaxADM() + 1;

            $sth = $this->db->insert('admin', $data)->getFlag();


            if ($sth) {
                header('location:' . URL . 'admin/dashboard?msg=Stuedent Successfully Added');
            } else {

                header('location:' . URL . 'admin/dashboard?msg=Failed to insert ' . json_encode($this->db->errorInfo()));
            }
        } else {
            echo 'Failed';
            header('location:' . URL . 'admin/dashboard?msg=All Fields Must be Filled');
        }
    }

    function delete($adminId) {
        // echo '<br> in dete model';
        $flag = false;
        $data=[];
        $data['isDeleted']=1;

        if ($this->db->update('admin', $data, array('adminId' => $adminId))->getFlag()):
                $flag = true;
                echo '<br>here in delete admin<br>';
                else:
                    
                print_r($this->db->error);
            endif;
//        if (in_array(Session::get('role'), $this->db->select('SELECT role From users')->getData())) {
//            if ($this->db->delete('admin', "adminId='$adminId'")->getFlag()):
//                $flag = true;
//            else :
//                echo '<br>here in delete admin<br>';
//                print_r($this->db->errorInfo());
//
//            endif;
//        }else {
//
//            if ($this->db->insert('admin', array('isDeleted' => 1), array('sudentId' => $adminId))->getFlag()):
//                $flag = true;
//                echo '<br>here in delete admin<br>';
//                print_r($this->db->errorInfo());
//            endif;
//        }
        return $flag;
    }

    function edit($adminId) {
        
    }

    function fetchAllStudents() {
        return $this->db->select('SELECT * FROM admin');
    }

    function getMaxADM($table = 'admin', $filed = 'admNo') {
        $this->admNoArr = $this->db->select('SELECT MAX(' . $filed . ') AS ' . $filed . ' FROM ' . $table . ' LIMIT 1')[0];
        return $this->admNoArr[$filed];
    }

}
