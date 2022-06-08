<?php

//error_reporting(1);
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
    public $rank=0;
    public $kcpe;
    public $cls_data;

    //public $kcpe;
    // public $oints;
    function __construct($cls_data,$student_data = [], $index = null) {
        $this->mat = new Maths();
        $this->student_data = $student_data;
        $this-> cls_data = $cls_data;
        $this->student_init($student_data, $index);
//        var_dump($student_data);
    }

    function functionName($param) {
        $sdt = [
            'adm' => '',
            'name' => '',
            'gen' => '',
            'form' => '',
            'rank' => '2',
            'marks' => [
                'mat'
            ]
        ];



        $students = [
        ];
    }

    function student_init($student_data, $index) {
//var_dump($student_data);
//exit();
       
        $this->rank = array_key_exists('rank',$student_data) ? $student_data['rank']:$index+1;
       
//     nt_data['rank'] ;
        $this->adm = array_key_exists('adm',$student_data)?$student_data['adm']:7173;
        $this->form = array_key_exists('form',$student_data)?$student_data['form']:3;
        $this->name = array_key_exists('name',$student_data)?$student_data['name']:"mwero abdalla";
        $this->gen = array_key_exists('gen',$student_data)?$student_data['gen']:'m';
        $this->no_exam = array_key_exists('no_exam',$student_data)?$student_data['no_exam']:1;
//        $this->mean = $student_data['mean'];
        $this->term = array_key_exists('term',$student_data)?$student_data['term']:3;
        $this->year= array_key_exists('year',$student_data)? $student_data['year']:2018;
       
        // $this->total = round($student_data['total']/3,0);

//        $this->mp = $student_data['mp'];
//        $this->mg = $student_data['mg'];
        $this->mark=array_key_exists('marks',$student_data)?$student_data['marks']:[];


        foreach ($this->mark as $sub => $mk) {
                $this->marks[$sub] = $mk;
                $this->sub_grades[] = $this->mat->grade($mk)['g'];
                $this->sub_points[] = $this->mat->grade($mk)['p'];
                   }


//        $this->total = $this->mat->sum($this->marks)['s'] / 2;
        $this->total = $this->mat->sum($this->marks)['s'] / $this->no_exam;
        $this->mean = $this->total > 1 ? round($this->total / count($this->marks)) : 0;
//        /$this->mg = $this->mat->grade($this->mean)['g'];

        $this->mp1 = $this->mat->grade($this->mean)['p'];
        $this->mp = round($this->mat->sum($this->sub_points)['s'] / count($this->marks), 2);
        $this->sub_no = count($this->marks);
        $this->points = $this->mat->sum($this->sub_points)['s'];
        $this->mg = $this->mat->grade($this->mp, false, true)['g'];

        $this->kcpe = (!is_numeric($student_data['kcpe']) || $student_data['kcpe'] <= 0) ? 120 : $student_data['kcpe'];
        $this->form_no=count($this->cls_data);
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
