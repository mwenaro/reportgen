
<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of courses
 *
 * @author Tsagwa Secondary
 */
class course_model extends Model {
      //put your code here
    public function __construct() {
        parent::__construct();
    }
/**
 * Adds a new course
 */
    function add($data=array()) {
        
        if ($this->emptyArray($data)) {
            
            
            $sth = $this->db->insert('courses', $data)->getFlag();
            if ($sth) {
                
                header('location:'.URL.'course/dashboard?msg=Course Successfully Added');
            }
        } else {
            header('location:' . URL . 'course/dashboard?msg=All Fields Must be Filled');
        }
    }
    function delete($courseId) {
        if($this->db->delete('courses',"courseId='$courseId'")->getFlag())            return true;
    }
    function edit($courseId) {
        
    }
    function fetchAllCourses() {
        return $this->db->select('SELECT * FROM courses')->getData();
    }

    function getMaxADM($table = 'courses', $filed = 'admNo') {
        $this->admNoArr = $this->db->select('SELECT MAX(' . $filed . ') AS ' . $filed . ' FROM ' . $table . ' LIMIT 1')->getData()[0];
        return $this->admNoArr[$filed];
    }

}
