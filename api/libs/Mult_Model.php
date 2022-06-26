<?php

require_once 'Database.php';

class Mult_Model {

    private $db;

    //private static $db;

    function __construct() {
        $this->db = new Database('sqlite', DB_NAME);
//        self::$db = new Database('sqlite');
    }

    function db_kil() {
        $this->db = null;
    }

    function _tbl($table) {
        return ucfirst(rtrim($table, 's'));
    }

    function insert($table, $data, $show = true) {
        //var_dump($expression);
        $return = [];
        $return ['error'] = '';
        $return ['msg'] = $this->_tbl($table) . ' Successfully Added';
        $handle = $this->db->insert($table, $data, []);
        //$this->db = null;
//        $handle = $this->db->insert($table, $data, $where);
        if (!$handle->getFlag()) {
            $return ['error'] = $handle->getError();
            $return ['msg'] = 'An error has Occured. Please try Again';
        }
        $return ['flag'] = $handle->getFlag();
        if ($show) {
            print_r(json_encode($return));
        } else {
            return $return;
        }
    }

    function insertMany($table, $data, $show = true) {
        $return = [];
        foreach ($data as $ks => $value) {
            print_r(json_encode($value));
//            exit();
//            $return[] = $this->insert($table, $value,false);
        }

//        print_r(json_encode($return));
    }

    function update($table, $data, $where, $cmd = null, $show = false) {
        $return = [];
        $return ['error'] = '';
        $return ['msg'] = $cmd === null ? 'Information Successfully Updated' : $this->_tbl($table) . ' Successfully Removed';
//        $return ['msg'] =  'Information Successfully Updated';
        $handle = $this->db->update($table, $data, $where);
        $this->db = null;

//        $handle = $this->db->insert($table, $data, $where);
        if (!$handle->getFlag()) {
            $return ['error'] = $handle->getError();
            $return ['msg'] = 'An error has Occured. Please try Again';
        }
        $return ['flag'] = $handle->getFlag();
        $return ['data'] = $data;
        if ($show) {
            print_r(json_encode($return));
        }
        return $return;
    }

    function select($table, $data, $where) {
        $return = [];
        $return ['error'] = '';
        $return ['msg'] = 'Information Successfully Obtained';
        $handle = $this->db->update($table, $data, $where);
        $this->db = null;
//        $handle = $this->db->insert($table, $data, $where);
        if (!$handle->getFlag()) {
            $return ['error'] = $handle->getError();
            $return ['msg'] = 'An error has Occured. Please try Again';
        }
        $return ['flag'] = $handle->getFlag();
        if ($show) {
            print_r(json_encode($return));
        }
        return $return;
    }

    function delete($table, $where) {
        $return = [];
        $return ['error'] = '';
        $return ['msg'] = $this->_tbl($table) . ' Successfully Removed';
        $handle = $this->db->delete($table, $where);
        $this->db = null;

        if (!$handle->getFlag()) {
            $return ['error'] = $handle->getError();
            $return ['msg'] = 'An error has Occured. Please try Again';
        }
        $return ['flag'] = $handle->getFlag();
        if ($show) {
            print_r(json_encode($return));
        }
        return $return;
    }

}
