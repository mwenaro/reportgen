<?php

/**
 *  - fetches array column data
 * 
 * @param array $data - the input array to get the culumn from
 * @param string $col_name - the column name /key
 * @param string $row_key - the array column that is to be used as the row keys for the fetched column data
 * @return array
 */
function getColumn1($data, $col_name, $row_key = null) {

    if (array_key_exists($col_name, $data[0])) {

//        $out_put[$col_name] = (is_null($row_key) || !array_key_exists($row_key, $data[0])) ? array_column($data, $col_name) : array_combine(array_column($data, $row_key), array_column($data, $col_name));
        $out_put[$col_name] = array_column($data, $col_name, $row_key);
    }
    return $out_put;
}

/**
 *  - fetches array column(s) data
 * 
 * @param array $data - the input array to get the culumn from
 * @param array $col_names - the column names /keys
 * @param string $row_key - the array column that is to be used as the row keys for the fetched column data
 * @return array
 */
function getColumns($data, $col_names, $row_key = null) {
    $out_put = [];
    if (is_array($col_names)) {
        foreach ($col_names as $col_name) {
            if (array_key_exists($col_name, $data[0])) {
                $out_put[$col_name] = array_column($data, $col_name, $row_key);
            }
        }
    } else {
        if (array_key_exists($col_names, $data[0])) {
            $out_put[$col_names] = array_column($data, $col_names, $row_key);
        } else {
            $out_put = array_column($data, null, $row_key);
        }
    }
    return $out_put;
}

/**
 * 
 * @param type $num
 * @return type
 */
function toNumeric($num) {
    $out_num = 0;
    if (is_array($num)):
        $out_num += array_map("toNumeric", $num);
    else :
        $out_num = is_numeric($num) ? $num : 0;
    endif;
    return $out_num;
}

/**
 * 
 * @param mixed $var
 * @return mixed 
 */
function trimy(String $var) {
    if (is_array($var)) {
        return array_map('trimy', $var);  ///$this->trimy($p);
    } else {
        return trim($var);
    }
}

/**
 * 
 * @param array $data_array
 * @param array $cols
 * @param array $unique
 * @param array $not_grped
 * @return type
 */
function group(Array $data_array, Array $cols = array(), array $unique = array(), array $not_grped = array()) {
    $d = [];

    $cols = array_map('strtolower', !empty($cols) ? $cols : array_keys($data_array[0]));

    foreach ($cols as $val) {
        // $val = strtolower($val);

        $n = 0;
        foreach ($data_array as $value) :
            $value = array_change_key_case($value);
            if (array_key_exists($val, $value) && !in_array($val, $not_grped)):
                foreach ($unique as $index1) {
                    $index = !empty($unique) && array_key_exists($index1, $value) ? $value[$index1] : '';
                }
                // $index = !empty($unique) && array_key_exists($unique[0], $value) ? $value[$unique[0]] : '';
                if (!$index == '') {
                    $d[$val][$index][] = $value[$val];
                } else {
                    $d[$val][] = $value[$val];
                }


            endif;
        endforeach;
    }

    return $d;
}

function groupBy1($data_arr, $cols = array(), $unique = array(), $not_grped = array()) {
    $d = [];
    $cols = array_map('strtolower', !empty($cols) ? $cols : array_keys($data_arr[0]));

    foreach ($cols as $val) {
        // $val = strtolower($val);

        $n = 0;
        foreach ($data_arr as $value) :
            $value = array_change_key_case($value);
            if (array_key_exists($val, $value) && !in_array($val, $not_grped)):
                foreach ($unique as $index1) {
                    $index = !empty($unique) && array_key_exists($index1, $value) ? $value[$index1] : '';
                }
                // $index = !empty($unique) && array_key_exists($unique[0], $value) ? $value[$unique[0]] : '';
                if (!$index == '') {
                    $d[$val][$index][] = $value[$val];
                } else {
                    $d[$val][] = $value[$val];
                }

            endif;
        endforeach;
    }

    return $d;
}

function groupingBy($data_arr, $cols = array(), $unique = array()) {
    $d = [];
    $cols = !empty($cols) ? $cols : array_keys($data_arr[0][0]);

    foreach ($cols as $val) {
        //$val
        foreach ($data_arr as $item) :

            foreach ($item as $key => $value) {
                if (array_key_exists($val, $value)):
                    if (!empty($unique) && !in_array($key, $unique)) {
                        //foreach ($unique as  $filter) {
                        $d[$val][] = $value[$val];
                        //}
                    } else {
                        $d[$val][] = $value[$val];
                    }

                endif;
            }



        endforeach;
    }

    return $d;
}

/***
 * function tghat obtains values fro an array1 using keys_array
 */

function getArrayValues($needle_keys,$hay_stack) {
 
}