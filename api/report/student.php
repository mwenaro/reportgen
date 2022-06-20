<?php
error_reporting(1);
require_once 'maths.php';


class Student {

//
    private $mat;
    private $stream = '';
    public $student_data = [];
    public $name;
    public $adm;
    public $gen;
    public $form;
    public $marks = [];
    public $rank;
    public $kcpe;

    //public $kcpe;
    // public $oints;
    function __construct($student_data = [], $index = null) {
        $this->mat = new Maths();
        $this->student_data = $student_data;
        $this->student_init($student_data, $index);
    }

    function def_student() {
        $s_data=[
            
            
        ];
        
    }
    function student_init($student_data, $index) {
        $this->rank = $index + 1;
        $this->adm = $student_data['adm'];
        $this->form = $student_data['form'];
        $this->name = $student_data['name'];
        $this->gen = $student_data['gen'];
        // $this->total = round($student_data['total']/3,0);

        $this->mp = $student_data['mp'];
        $this->mg = $student_data['mg'];

        $this->mark['eng'] = array($student_data['eng1'], $student_data['eng2'], $student_data['eng3']);
        $this->mark['mat'] = array($student_data['mat1'], $student_data['mat2'], $student_data['mat3']);
        $this->mark['kis'] = array($student_data['kis1'], $student_data['kis2'], $student_data['kis3']);
        $this->mark['che'] = array($student_data['che1'], $student_data['che2'], $student_data['che3']);
        $this->mark['bio'] = array($student_data['bio1'], $student_data['bio2'], $student_data['bio3']);
        $this->mark['phy'] = array($student_data['phy1'], $student_data['phy2'], $student_data['phy3']);
        $this->mark['geo'] = array($student_data['geo1'], $student_data['geo2'], $student_data['geo3']);
        $this->mark['his'] = array($student_data['his1'], $student_data['his2'], $student_data['his3']);
        $this->mark['cre'] = array($student_data['cre1'], $student_data['cre2'], $student_data['cre3']);
        $this->mark['bst'] = array($student_data['bst1'], $student_data['bst2'], $student_data['bst3']);
        $this->mark['agr'] = array($student_data['agr1'], $student_data['agr2'], $student_data['agr3']);

        foreach ($this->mark as $sub => $mk) {
            if ($this->form < 3):
                $this->marks[$sub] = $mk;
                $this->sub_grades[] = $this->mat->grade($mk)['g'];
                $this->sub_points[] = $this->mat->grade($mk)['p'];
            else:
                if (is_numeric($this->mat->sum($mk)['s']) && $this->mat->sum($mk)['s'] > 0) {
                    $this->marks[$sub] = $mk;
                    $this->sub_grades[] = $this->mat->grade($mk)['g'];
                    $this->sub_points[] = $this->mat->grade($mk)['p'];
                }
            endif;
            
                      
        }
//        echo '<pre>';
//        print_r($this->mat->sum($this->marks)['s']);
        
        $this->total = $this->mat->sum($this->marks)['s']/3;
        $this->mean = $this->total > 1 ? round($this->total / count($this->marks)) : 0;
        ///$this->mg = $this->mat->grade($this->mean)['g'];
        
        $this->mp1 = $this->mat->grade($this->mean)['p'];
        $this->mp = round($this->mat->sum($this->sub_points)['s']/count($this->marks),2);
        $this->sub_no=count($this->marks);
        $this->points = $this->mat->sum($this->sub_points)['s'];
        $this->mg = $this->mat->grade($this->mp,false,true)['g'];
        



        
        $this->kcpe = (!is_numeric($student_data['kcpe'])||$student_data['kcpe']<=0)?120:$student_data['kcpe'];

        switch ($this->form) {
            case 1:
                $this->form_no = form1_no;

                break;
            case 2:
                $this->form_no = form2_no;

                break;
            case 3:
                $this->form_no = form3_no;

                break;
            case 4:
                $this->form_no = form4_no;

                break;
        }



    }

    function setName(String $name) {
        $this->name = $name;
        return $this;
    }

    function getName() {
        return $this->name;
    }

    function setAdm($adm) {
        $this->adm = $adm;
        return $this;
    }

    function getAdm() {
        return $this->adm;
    }

    function setForm($form) {
        $this->form = $form;
        return $this;
    }

    function getForm() {
        return $this->form;
    }

    function setStream($stream) {
        $this->stream = $stream;
        return $this;
    }

    function getStream() {
        return $this->stream;
    }

    function getClass() {
        return $this->form . $this->stream;
    }

    function setDob($dob) {
        $this->dob = $dob;
        return $this;
    }

    function getDob() {
        return $this->dob;
    }

    function setKcpeDetails($kcpe = array()) {
        $this->kcpe = $kcpe;
        return $this;
    }

    function getKcpeDetails() {
        return $this->kcpe;
    }

    function setMarks($marks = array()) {
        $this->marks = $marks;
    }

}
