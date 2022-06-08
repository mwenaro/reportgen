<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of marksData
 *
 * @author USER-PC
 */
class marksData {

    //put your code here

    private $inputMarks;
    private $command;

    function _construct($dataArr = array()) {
        
    }

    function filterData($dataArr) {
        $data = [];

        foreach ($dataArr as $key => $value) {
            $data1 = [];
            if (is_array($value)) {
                foreach ($value as $k => $val) {
                    $data1[htmlspecialchars($key)] = htmlspecialchars($val);
                }
                $data[] = $data1;
            } else {
                $data[htmlspecialchars($key)] = htmlspecialchars($value);
            }
        }
        return $data;
    }

}

$s = array('1' => 'ar', '2' => 'john', '3' => 'mwero', '4' => 'abdalla');
$d = new marksData();
echo $d->filterData($s);
