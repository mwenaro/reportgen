<?php

// require_once 'Database.php';

class Tempmodel  {

    private $db;

  

    function __construct() {
        $this->db = new Database('sqlite', DB_NAME);

    }

    function db_kil() {
        $this->db = null;
    }

    function _tbl($table) {
        return ucfirst(rtrim($table, 's'));
    }

    function insert($table, $data, $show = true) {
       $handle = $this->db->insert($table, $data, []);

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
        foreach ($data as $row) {
            print_r(json_encode($row));

           $return[] = $this->insert($table, $value,false)->getError();
        }
if($show){
    print_r(json_encode($return));
}
       
       return $return;
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
