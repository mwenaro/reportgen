<?php

require_once 'my_php_functions.php';
/* * *
 * The mks class
 */

class Maths {

    //put your code here

    private $inputMarks;
    private $command;

    function _construct($dataArr = array()) {
        $this->inputMarks = !empty($dataArr) ? $this->filterData($dataArr) : [];
    }

    function rank($var, $data) {
        $dat = array();
        $var = is_array($var) ? array_sum($var) : $var;
        if (is_array($data)):
            foreach ($data as $key => $value) {
                $dat[$key] = is_array($value) ? array_sum($value) : $value;
            }
        endif;
        rsort($dat);
        $n = 0;
        $pos = 0;
        $value = array();
        if (!empty($dat)):
            foreach ($dat as $key => $val) {
                // if (is_array($var) ? array_sum($var) : $var === is_array($val) ? array_sum($val) : $val) {
                if ($var === $val) {
                    $value['pos'] = $n;
                    $pos = $n + 1;
                    continue;
                }
                $n++;
            }
        endif;
        return $pos;
    }

    /*     * *
     * grades
     */

    function gradedmarks($input_marks = []) {
        $input_marks = !empty($input_marks) ? $input_marks : $this->inputMarks;
        $data = array();
        foreach ($input_marks as $key => $marks) {

            if (is_array($marks)) {
                //  $input_marks[$key . '_grade'] = $this->grade($marks);
                $data[$key] = $this->grade($marks);
                // $input_marks[$key] = $marks;
            }
//            else  {
//                foreach ($marks as $k => $mark) {
//                    $input_marks[$key][$k] = $this->grade($mark);
//                    $input_marks[$key][$k . '_grade'] = $this->grade($mark);
//                }
            // }
        }
        // return $input_marks;
        return $data;
    }

    function typeOfArray($param) {
        $counter = 0;
        $flag = false;
        if (is_array($param)):
            $flag = true;
            $counter += 1;
            foreach ($param as $value) {
                $counter+= $this->typeOfArray($value)['i'];
                continue;
            }
        endif;
        return array('f' => $flag, 'i' => $counter);
    }

    /*     * *
     * 
     */

    function allMarksInfo($param) {
        $students = array();
        $param = $this->filterData($param);
    }

    /*     * *
     * sum mks
     */

    function arraySum($param) {
        $this->sum($param);
    }

    function arraySums($param) {
        
    }

    function average($param,$dp = 0,$max_no=null) {
        $sum = $this->sum($param)['s'];
        $n = !is_null($max_no)?$max_no:$this->sum($param)['i'];
        return $sum > 0 ? round($sum / $n, $dp) < 1 ? 1 : round($sum / $n, $dp) : 0;
    }

    /*
     * It sums the data entered
     */

    function sum($param) {
        $sum = $n = 0;
        if (!empty($param) && is_array($param)):
            foreach ($param as $value) {
                // var_dump($value);
                //$sum+=is_array($value) ? array_map([$this, 'sum'], $value) : toNumeric($value);
                if (is_array($value)):
                    foreach ($value as $k => $v) {
                        $sum+=$v;
                    }
                else:
                    $sum+=toNumeric($value);
                endif;


                $n++;
            }
        endif;
        return array('s' => $sum, 'i' => $n);
    }

    function getPoints($mark) {
        $mark = is_array($mark) ? $this->average($mark) : toNumeric($mark);
//        if(){
//            
//        }
        switch ($mark) {
            case $mark >= 80 && $mark <= 100:
                return 12;
                break;
            case $mark >= 75 && $mark < 80:
                return 11;
                break;
            case $mark >= 70 && $mark < 75:
                return 10;
                break;
            case $mark >= 65 && $mark < 70:
                return 9;
                break;
            case $mark >= 60 && $mark < 65:
                return 8;
                break;
            case $mark >= 55 && $mark < 60:
                return 7;
                break;
            case $mark >= 50 && $mark < 55:
                return 6;
                break;
            case $mark >= 45 && $mark < 50:
                return $sciRule ? 6 : 5;
                break;
            case $mark >= 40 && $mark < 45:
                return $sciRule ? 5 : 4;
                break;
            case $mark >= 35 && $mark < 40:
                return $sciRule ? 4 : 3;
                break;
            case $mark >= 30 && $mark < 35:
                return $sciRule ? 3 : 2;
                break;
            case $mark >= 0 && $mark < 30:
                if ($sciRule && ($mark >= 25 && $mark < 30)):
                    return $sciRule ? 2 : 1;

                    break;
                else:
                    return 1;
                    break;
            endif;
        }
        // $this->grade($makrs_arr);
    }

    /*     * *
     * Assigns Grades to the input value.
     */

    function grade($mark, $sciRule = false, $points = false,$max_no=null) {
        $mark = is_array($mark) ? $this->average($mark,0,$max_no) : toNumeric($mark);
        if ($mark === 0 || $mark < 0 || $mark > 100) {
            return array('g' => 'E', 'm' => $mark, 'c' => 'Can do better!', 'k' => 'Ongeza Bidii!', 'p' => 1);
        }
        switch ($mark) {
            case $points ? round($mark) == 12 : $mark >= 80 && $mark <= 100:
                return array('g' => 'A', 'm' => $mark, 'c' => 'Excellent!', 'k' => 'Kongole!', 'p' => 12);
                break;
            case $points ? round($mark) == 11 : $mark >= 75 && $mark < 80:
                return array('g' => 'A-', 'm' => $mark, 'c' => 'Very Good!', 'k' => 'Heko!', 'p' => 11);
                break;
            case $points ? round($mark) == 10 : $mark >= 70 && $mark < 75:
                return array('g' => 'B+', 'm' => $mark, 'c' => 'Very Good!', 'k' => 'Vizuri Sana!', 'p' => 10);
                break;
            case $points ? round($mark) == 9 : $mark >= 65 && $mark < 70:
                return array('g' => 'B', 'm' => $mark, 'c' => 'Good!', 'k' => 'Vizuri!', 'p' => 9);
                break;
            case $points ? round($mark) == 8 : $mark >= 60 && $mark < 65:
                return array('g' => 'B-', 'm' => $mark, 'c' => 'Good!', 'k' => 'Vizuri!', 'p' => 8);
                break;
            case $points ? round($mark) == 7 : $mark >= 55 && $mark < 60:
                return array('g' => 'C+', 'm' => $mark, 'c' => 'Fairly Good!', 'k' => 'Umejaribu!', 'p' => 7);
                break;
            case $points ? round($mark) == 6 : $mark >= 50 && $mark < 55:
                return array('g' => 'C', 'm' => $mark, 'c' => 'Fair!', 'k' => 'Umejaribu!', 'p' => 6);
                break;
            case $points ? round($mark) == 5 : $mark >= 45 && $mark < 50:
                return $sciRule ? array('g' => 'C', 'm' => $mark, 'c' => 'Fair!', 'p' => 6) : array('g' => 'C-', 'm' => $mark, 'c' => 'Fair!', 'k' => 'Umejaribu!', 'p' => 5);
                break;
            case $points ? round($mark) == 4 : $mark >= 40 && $mark < 45:
                return $sciRule ? array('g' => 'C-', 'm' => $mark, 'c' => 'Fair!', 'p' => 5) : array('g' => 'D+', 'm' => $mark, 'c' => 'Pull up!', 'k' => 'Juhudi Zaidi!', 'p' => 4);
                break;
            case $points ? round($mark) == 3 : $mark >= 35 && $mark < 40:
                return $sciRule ? array('g' => 'D+', 'm' => $mark, 'c' => 'Pull up!', 'p' => 4) : array('g' => 'D', 'm' => $mark, 'c' => 'Can do better!', 'k' => 'Ongeza Bidii!', 'p' => 3);
                break;
            case $points ? round($mark) == 2 : $mark >= 30 && $mark < 35:
                return $sciRule ? array('g' => 'D', 'm' => $mark, 'c' => 'Can do better!', 'p' => 3) : array('g' => 'D-', 'm' => $mark, 'c' => 'Can do better!', 'k' => 'Ongeza Bidii!', 'p' => 2);
                break;
            case $points ? round($mark) == 1 : $mark >= 0 && $mark < 30:
                if ($sciRule && ($mark >= 25 && $mark < 30)):
                    return $sciRule ? array('g' => 'D-', 'm' => $mark, 'c' => 'Can do better!', 'p' => 2) : array('g' => 'E', 'm' => $mark, 'c' => 'Can do better!', 'k' => 'Ongeza Bidii!', 'p' => 1);
                    break;
                else:
                    return array('g' => 'E', 'm' => $mark, 'c' => 'Can do better!', 'k' => 'Ongeza Bidii!', 'p' => 1);
                    break;
            endif;

            case $points ? round($mark) == 1 : $mark == 0 :
                return array('g' => 'E', 'm' => $mark, 'c' => 'Can do better!', 'k' => 'Ongeza Bidii!', 'p' => 1);
                break;
        }
        // $this->grade($makrs_arr);
    }

    /*     * *
     * filters data entered.
     */

    function filterData($dataArr) {
        $data = [];

        foreach ($dataArr as $key => $value) {
            $data1 = [];
            if (is_array($value)) {
                foreach ($value as $k => $val) {
                    $data1[htmlspecialchars($k)] = htmlspecialchars($val);
                }
                $data[$key] = $data1;
            } else {
                $data[htmlspecialchars($key)] = htmlspecialchars($value);
            }
        }
        return $data;
    }

}
