<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of teachers
 *
 * @author Tsagwa Secondary
 */
class teacher_model extends Model {

    private $admNoArr = array();

    //put your code here
    public function __construct() {
        parent::__construct();
    }

    /**
     * Adds a new teacher
     */
    function add($data) {
        //$data = $_POST;
        if ($this->emptyArray($data)) {
            //Assigns an Admission Number to the Student
            //$data['admNo'] = $this->getMaxADM() + 1;
//            echo 'This is frm teacher model';
//            var_dump($data);            
            $sth = $this->db->insert('teachers', $data);
            if ($sth) {
                echo 'Teacher Successfully Added';
                header('location:' . URL . 'teacher/index?msg=Teacher Successfully Added');
            }
        } else {
            header('location:' . URL . 'teacher/index?msg=All Fields Must be Filled');
        }
    }

    function delete($teacherId) {
        if ($this->db->delete('teachers', "teacherId='$teacherId'")) {
            return true;
        }
    }

    function edit($teacherId) {
        
    }

    function fetchAllTeachers() {
        return $this->db->select('SELECT * FROM teachers');
    }

    function getMaxADM($table = 'teachers', $filed = 'admNo') {
        $this->admNoArr = $this->db->select('SELECT MAX(' . $filed . ') AS ' . $filed . ' FROM ' . $table . ' LIMIT 1')[0];
        return $this->admNoArr[$filed];
    }

}
