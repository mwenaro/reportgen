<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of _array_funfcs
 *
 * @author Kaingu
 */
class _Array_Funcs {

    //put your code here

    static function _field_extractor($field, $data, $return_key = null) {
        $field_key = array_keys($field)[0];
        $r_main_field = array_values($field)[0];
        $main_field = $r_main_field === 'no' ? null : $r_main_field;

        $w_data = is_null($main_field) ? $data : array_column($data, $main_field);
//        print_r($w_data);
        $d = [];
        if (!is_null($return_key)):
            $d = array_column($w_data, $field_key, $return_key);
        else:
            $d = array_column($w_data, $field_key);
        endif;

//        print_r($d);
        return $d;
    }

}
