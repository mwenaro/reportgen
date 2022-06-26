<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of _date_tracker
 *
 * @author Kaingu
 */
class _Date_Tracker {

    private $year_lastest = null;

    public function __construct(Database $db) {
        $this->db = $db;
    }

    //put your code here
    function db_init($where) {
//        $this->db = $db;
        $hundle = $this->db->select("SELECT MAX(year)AS year_max FROM exams");
        $system_year_latest = $hundle->getData()[0]['year_max'];
        $year_latest = date('Y');
        $this->year_lastest = $year_latest > $system_year_latest ? $year_latest : $system_year_latest;
    
//        var_dump($this->_year_form_extractor($where));
//        exit();
    }

    function _year_form_extractor($where) {
        $out_where = [];
        $items_wanted = ['form', 'year'];
        foreach ($where as $key => $val) {
            $arr_key = explode('.', $key);
            foreach ($items_wanted as $value) :
                if (in_array($value, $arr_key)) {
                    $out_where[$value] = $val;
                }
            endforeach;
        }
        return $out_where;
    }

    function get_req_form($req_year, $form) {

        $year_latest = 0;
    }

}
