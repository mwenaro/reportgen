
<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of marks
 *
 * @author Tsagwa Secondary
 */
class mark_model extends Model {

    //put your code here
    public function __construct() {
        parent::__construct();
    }

    /**
     * Adds a new mark
     */
    function add($data = array()) {
        if (is_array($data[0])) {
            foreach ($data as  $v1) {
                foreach ($v1 as $v2) {
//                    echo '<pre>';
//                    var_dump($v2);
//                    exit();
                     $sth = $this->db->insert('marks', $v2);
                }
               
            }
            header('location:' . URL . 'course/manage?msg=Marks Successfully Entered'); 
        } elseif(!is_array($data[0])) {
            if ($this->emptyArray($data)) {


                $sth = $this->db->insert('marks', $data)->getFlag();
                if ($sth) {

                    header('location:' . URL . 'course/mangeCourse?msg=Mark Successfully Added');
                }
            } else {
                header('location:' . URL . 'course/manage?msg=All Fields Must be Filled');
            }
        }
    }

    function delete($markId) {
        if ($this->db->delete('marks', "markId='$markId'")->getFlag()) {
            return true;
        }
    }

    function getExams($request = null) {
        $request = !is_null($request) ? $request : ''
                . 'SELECT examId,examType, examName FROM exams WHERE examType = "o" ORDER BY year$'
                . 'SELECT examId,examType, examName FROM exams WHERE examType = "m" ORDER BY year$'
                . 'SELECT examId,examType, examName FROM exams WHERE examType = "e" ORDER BY year$' .
                //  'SELECT teacherId,fName,lName FROM teachers$'.
                //     'SELECT subjectId,subjectName FROM subjects $'.
                'SELECT courseId, courseName FROM courses ORDER BY courseName';
        return $this->getData($request);
    }

    function edit($markId) {
        
    }

    function fetchAllMarks() {
        return $this->db->select('SELECT * FROM marks')->getData()->getData();
    }

    function getMaxADM($table = 'marks', $filed = 'admNo') {
        $this->admNoArr = $this->db->select('SELECT MAX(' . $filed . ') AS ' . $filed . ' FROM ' . $table . ' LIMIT 1')->getData()[0];
        return $this->admNoArr[$filed];
    }

}
