
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
class password_model extends Model {
    private $sucess=false;
    //put your code here
    public function __construct() {
        parent::__construct();
    }
    function flag() {
        return $this->sucess;
    }
    /**
     * Adds a new exam
     */
    function reset($table,$data) {
        $postData = array(
            'password' => $data['new_password'],
           // 'old_password' => $data['new'],
        );
        $table= Session::get('userId')===$data['userId']?'users':$data['table'];
        $target_id= Session::get('userId')===$data['userId']?$data['userId']:$data['userId'];
        $id_field= rtrim($table,'s').'Id';

        if($this->db->update($table, $postData, "`{$id_field}` = '{$target_id}' AND password = '{$data['current_password']}' ")->getFlag()){
       // . "OR `{$secuity_quiz}` ='security_quiz') OR (idNo='{$target_id} AND password = '{$data['current_password']}'")){
            $this->sucess=true;
        }
        
        return $this;
    }

    function delete($examId) {
        if ($this->db->delete('exams', "examId='$examId'"))
            return true;
    }

    function eddit($examId) {
        
    }

    function fetchAllExams() {
        return $this->db->select('SELECT * FROM exams');
    }

    function getMaxADM($table = 'exams', $filed = 'admNo') {
        $this->admNoArr = $this->db->select('SELECT MAX(' . $filed . ') AS ' . $filed . ' FROM ' . $table . ' LIMIT 1')[0];
        return $this->admNoArr[$filed];
    }

}
