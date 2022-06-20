<?php

class _Request {

    static $post;
    static $hii;
    private $where;
    private $table;
    private $sql;

    function __construct() {
//        echo 'this is from _request';
    }

    static function _int($post = null) {
        
    }

    /**
     * 
     * @param type $handle - db handle
     * @param type $ob - the cls object from which the processor func comes from
     * @param type $processorFun - Optional function to process the response data
     */
    static function response($handle, $ob = null, $processorFun = null) {
        $errors = [];
        if (!$handle->getFlag()) {
            $errors = $handle->getError();
        }
        $data = is_null($processorFun) && is_null($processorFun) ? $handle->getData() : $ob->{$processorFun}($handle->getData());
        echo json_encode(['flag' => empty($errors), 'errors' => $errors, 'data' => $data]);
    }

    static function setCorsHearders() {
//        header("Access-Control-Allow-Origin:http://localhost:4200");
        header("Access-Control-Allow-Origin:*");
        header("Access-Control-Allow-Methods:POST, GET , OPTIONS, DELETE, PUT ");
        header("Access-Control-Allow-Max-Age:3000");
//        header("Content-Type:Application/Json");
//        header("Access-Control-Allow-Headers:X-Requested-With,"
//                . "Content-Type,Origin,Authorization,Accept,"
//                . "Client-Security-Token, Accept-Encoding");
    }

    static function post() {
        $post = file_get_contents("php://input");

        self::$hii = $post;
//        $p = is_object(json_decode($post)) ? json_decode($post, true) : json_decode($post);
        //self::$post = $p;
//        return self::$post;
        self::$post = is_object(json_decode($post)) ? json_decode($post, true) : json_decode($post);
        return !empty(self::$post) ? self::$post : [];
    }

    static function init() {
        $post = self::post();
//        $keys = array_keys($post);
        //initialization
        //Getting request string
        $req = array_key_exists('request', $post) ? $post['request'] : '';
        //getting orderBy string
        $orderBy = array_key_exists('orderBy', $post) ? " ORDER BY " . $post['orderBy'] : '';
        //getting table string
        $table = array_key_exists('table', $post) ? $post['table'] : '';
        //getting table string
        $table_short = rtrim(array_key_exists('table', $post) ? $post['table'] : '', 's');

        //getting data to be inserted
        $data = array_key_exists('data', $post) ? $post['data'] : array();
        //getting row id if exits
        $id = array_key_exists("{$table_short}Id", $data) && !empty($data) ? $data[$table_short . 'Id'] : (array_key_exists('id', $post) ? $post['id'] : '');

        //getting the condition , where

        $where1 = array_key_exists("where", $data) && !empty($data) ? $data['where'] : (array_key_exists('where', $post) ? $post['where'] : []);
        $where = !empty($where1) ? $where1 : ('' !== $id ? array("{$table_short}Id" => $id) : array());

        return ['post' => $post, 'orderBy' => $orderBy, 'table' => $table, 'id' => $id, 'data' => $data];
    }

}
