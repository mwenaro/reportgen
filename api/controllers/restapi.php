<?php

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

    private $restmodel = null;

    function __construct() {
        $this->db = new Database('sqlite', DB_NAME);
        $this->resmodel = new RestApiModel($this->db);
    }

//put your code here
    function get($table, $where = [], $order = null, $sort = null, $limit = null) {
        $b= $this->restmodel->selectAll();
    }

    function create($table, $where = [], $order = null, $sort = null, $limit = null) {
        
    }

    function update($table, $where = []) {
        
    }

    function delete($table, $where = []) {
        
    }

}

class RestApiModel {

    function __construct($db) {
        $this->db = $db;
    }

    function insert($table, $data) {
        $handle = $this->db->insert($table, $data);
        _Request::response($handle);
    }

    function selectAll($table, $where = [], $orderBy = null, $sort = null, $limit = null) {
        $where = $this->db->where($where);
        $orderBy = $orderBy ? " ORDER BY {$orderBy}" : null;
        $sort = $sort ? strtoupper(" $sort") : null;
        $limit = $limit ? " LIMIT {$limit}" : null;
        $sql = "SELECT * FROM {$table} {$where}  {$orderBy} {$sort} {$limit}";
        $handle = $this->db->select($sql, []);
        _Request::response($handle);
    }

    function selectOne($table, $where = []) {
        $where = $this->db->where($where);

        // $sql = "SELECT * FROM {$table} {$where}  {$orderBy} {$sort} {$limit}";
        $handle = $this->db->row($sql, $where);
        _Request::response($handle);
    }

    function update($table, $data, $where) {
        $handle = $this->db->insert($table, $data);
        _Request::response($handle);
    }

    function delete() {
        
    }

}

class RestApiProcessor {

    private $req_methods = [
        'get' => 'get',
        'post' => 'create',
        'add' => 'create',
        'put' => 'update',
        'update' => 'update',
        'del' => 'delete',
        'delete' => 'delete'
    ];
    private $request_method = null;
    private $db_table = null;
    private $controller = null;
    private $controller_method = null;
    private $where = array();
    private $by = null;
    private $limit = null;
    private $order = null;

    function __construct($request_string) {
        $this->init($request_string);
    }

    function init($req_string) {
//        $req_string = "users/2/";
//        $req_string1 = "users/name/mwero/age/30/";
//        $req_string2 = "users/name/mwero/age/30/?by=date&order=desc&limit=50&dm=getusers";
//        var_dump($req_string);
        /**
         * Cutting the request string $req_string into url & options
         */
        $req_string_array = explode("/?", $req_string);
        $url = array_shift($req_string_array);
//        $url_options = !empty($req_string_array) ? array_shift($req_string_array) : null;

        /*
         * Check if there is a request method in the url and thre is, obtain it
         */
        $url_array = explode("/", trim($url, "/"));
//        $this->request_method = array_key_exists($url_array[0], $this->req_methods) ? array_shift($url_array) : $_SERVER["REQUEST_METHOD"];
        $request_method = array_key_exists($url_array[0], $this->req_methods) ? $this->req_methods[array_shift($url_array)] : $_SERVER["REQUEST_METHOD"];
        $this->request_method = strtolower($request_method);


        /**
         * Extract the db_table/controller from the url_array
         */
        $db_table = array_shift($url_array);
        $this->set_db_table($db_table);

        /**
         * Obtain where/ coloumns from the url
         */
        $this->set_where($url_array);
        /**
         * 
         * check for a controller method, if the isn't, controller_method=request_method
         */
        $method = $this->_extract_modifiers($req_string, 'dm');
        $this->controller_method = $method ? $method : $this->request_method;


        /**
         * Set by,order,limit
         */
        $this->set_by($this->_extract_modifiers($req_string, 'by'));
        $this->set_order($this->_extract_modifiers($req_string, 'order'));
        $this->set_limit($this->_extract_modifiers($req_string, 'limit'));
    }

    function set_by($by) {
        if ($by):
            $this->by = $by;
        endif;
    }

    function set_limit($limit) {
        if ($limit):
            $this->limit = $limit;
        endif;
    }

    function set_order($order) {
        if ($order):
            $this->order = $order;
        endif;
    }

    function set_db_table($tb_table) {
        $this->db_table = $tb_table;
        $this->controller = rtrim($tb_table, "s");
    }

    private function _where_extractor($raw_where) {
        $len = count($raw_where);
//        var_dump($raw_where);
        $return = [];
        if ($len === 1) {
            $id = array_shift($raw_where);
            $return = ctype_digit($id) ? ['id' => $id] : [];
        } elseif ($len > 1 && $len % 2 === 0) {
            if ($len === 2 && $this->controller === 'login') :
                $return = array_combine(['username', 'password'], $raw_where);
            else:
                $odd = $even = [];
                $n = 1;
                foreach ($raw_where as $value) {
                    if ($n % 2 === 0):
                        $even[] = $value;
                    else:
                        $odd[] = $value;
                    endif;
                    $n++;
                }

                $return = array_combine($odd, $even);
            endif;
        }
        return $return;
    }

    function set_where($where) {
        $this->where = $this->_where_extractor($where);
    }

    function where() {
        return $this->where;
    }

    function by() {
        return $this->by;
    }

    function limit() {
        return $this->limit;
    }

    function order() {
        return $this->order;
    }

    function db_table() {
        return $this->db_table;
    }

    /**
     * 
     * @param type $req_string
     * @param type $modifier_key
     * @return type
     */
    private function _extract_modifiers($req_string, $modifier_key = null) {
        $modifier_key = !is_null($modifier_key) ? strtolower($modifier_key) : null;
        $return = false;
        /**
         * check if there's modifiers ('/?')on the req_string
         */
        $is_there_modifiers = strpos($req_string, "/?");

        if ($is_there_modifiers):
            /**
             * Getting the modifier string and explode it to $modifier_array
             */
            $arr = explode("/?", $req_string);
            $modifier_string = array_pop($arr);
            $modifier_array = explode("&", $modifier_string);

            /**
             * Chopping the modifier substrings into proper modifier_value _pairs
             */
            $modifier_value_pair_arr = [];

            foreach ($modifier_array as $modifier_sub_str) {
                $box = [];
                $box = explode('=', $modifier_sub_str);

                $modifier_value_pair_arr[$box[0]] = $box[1];
            }
            /**
             * get the requested modifier
             */
            $return = is_null($modifier_key) ? $modifier_value_pair_arr : (array_key_exists($modifier_key, $modifier_value_pair_arr) ? $modifier_value_pair_arr[$modifier_key] : false);
        endif;

        return $return;
    }

    function request_method() {
        return $this->request_method;
    }

    function controller() {
        return $this->controller;
    }

    function controller_method() {
        return $this->controller_method;
    }

}
