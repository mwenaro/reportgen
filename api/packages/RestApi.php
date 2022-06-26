<?php
require_once 'RestApiModel.php';
require_once 'RestApiProcessor.php';
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of restapi
 *
 * @author amd
 */
class RestApi {

    private $model = null;

    function __construct() {
        Session::init();
        $this->db = new Database('sqlite', DB_NAME);
        $this->model = new RestApiModel($this->db);
    }

//put your code here
    function get($table, $where = [], $by = null, $order = null, $limit = null) {
        $handle = array_key_exists('id', $where) ? $this->model->selectOne($table, $where) : $this->model->selectAll($table, $where, $by, $order, $limit);
        _Request::response($handle);
    }

    function create($table, $data) {
//        $handle = $this->model->create($table, $data);
        $handle = $this->model->insert($table, $data);
        _Request::response($handle);
    }

    function update($table, $where, $data) {
        $handle = $this->model->update($table, $data, $where);
        _Request::response($handle);
    }

    function delete($table, $where) {
        $handle = $this->model->delete($table, $data, $where);
        _Request::response($handle);
    }

}
