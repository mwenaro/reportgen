<?php
error_reporting(1);
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
class student_model extends Model {

    private $admNoArr = array();

    //put your code here
    public function __construct() {
        parent::__construct();
    }

    /**
     * Adds a new student
     */
    function add() {
        $data = $_POST;
        if ($this->emptyArray($data)) {
            //Assigns an Admission Number to the Student
            //   $data['admNo'] = $this->getMaxADM() + 1;

            $sth = $this->db->insert('students', $data)->getFlag();


            if ($sth) {
                header('location:' . URL . 'student/dashboard?msg=Stuedent Successfully Added');
            } else {

                header('location:' . URL . 'student/dashboard?msg=Failed to insert ' . json_encode($this->db->errorInfo()));
            }
        } else {
            echo 'Failed';
            header('location:' . URL . 'student/dashboard?msg=All Fields Must be Filled');
        }
    }
    function update($table,$data,$where) {
        $flag=false;
        if ($this->db->updateForm($table,$data,$where)->getFlag()):
                $flag = true;
                echo '<br>here in delete student<br>';
                else:
                    
                print_r($this->db->error);
            endif;

        return $flag;
    }
    function delete($studentId) {
        // echo '<br> in dete model';
        $flag = false;
        $data=[];
        $data['isDeleted']=1;

        if ($this->db->update('students', $data, array('studentId' => $studentId))->getFlag()):
                $flag = true;
                echo '<br>here in delete student<br>';
                else:
                    
                print_r($this->db->error);
            endif;
//        if (in_array(Session::get('role'), $this->db->select('SELECT role From users')->getData())) {
//            if ($this->db->delete('students', "studentId='$studentId'")->getFlag()):
//                $flag = true;
//            else :
//                echo '<br>here in delete student<br>';
//                print_r($this->db->errorInfo());
//
//            endif;
//        }else {
//
//            if ($this->db->insert('students', array('isDeleted' => 1), array('sudentId' => $studentId))->getFlag()):
//                $flag = true;
//                echo '<br>here in delete student<br>';
//                print_r($this->db->errorInfo());
//            endif;
//        }
        return $flag;
    }

    function edit($studentId) {
        
    }

    function fetchAllStudents() {
        return $this->db->select('SELECT * FROM students');
    }
    function getRow($sql) {
        
        return $this->db->select($sql)->getData();
    }
    function getMaxADM($table = 'students', $filed = 'admNo') {
        $this->admNoArr = $this->db->select('SELECT MAX(' . $filed . ') AS ' . $filed . ' FROM ' . $table . ' LIMIT 1')[0];
        return $this->admNoArr[$filed];
    }

}
