
<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of exams
 *
 * @author Tsagwa Secondary
 */
class exam_model extends Model {

    //put your code here
    public function __construct() {
        parent::__construct();
    }

    /**
     * Adds a new exam
     */
    function add($data = array()) {

        if ($this->emptyArray($data)) {


            $sth = $this->db->insert('exams', $data)->getFlag();
            if ($sth) {

                header('location:' . URL . 'exam/dashboard?msg=Stuedent Successfully Added');
            }
        } else {
            header('location:' . URL . 'exam/dashboard?msg=All Fields Must be Filled');
        }
    }

    function delete($examId) {
        if ($this->db->delete('exams', "examId='$examId'")->getFlag()) {
            return true;
        }
    }

    function eddit($examId) {
        
    }

    function fetchAllExams() {
        return $this->db->select('SELECT * FROM exams')->getData();
    }

    function getMaxADM($table = 'exams', $filed = 'admNo') {
        $this->admNoArr = $this->db->select('SELECT MAX(' . $filed . ') AS ' . $filed . ' FROM ' . $table . ' LIMIT 1')->getData()[0];
        return $this->admNoArr[$filed];
    }

}
