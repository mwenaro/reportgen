<?php

require "./api/vendor/autoload.php";

//require_once '../config.php';
//namespace Libs;

class MongoDBCls extends MongoDB\Client {

    private $flag = false;
    private $data = array();
    private $deburg = false;
    public $errors = [];
    private $manager = null;
    private $db_con = null;

// public function __construct($DB_TYPE, $DB_NAME = 'C:\software\repo\tmtsrg\api\resources\shule.sqlite3', $DB_HOST = null, $DB_USER = null, $DB_PASS = null) {
    public function __construct($mDB_NAME) {

        try {
            parent::__construct();
            $this->manager = parent::__construct();


            $this->db_con = $this->selectDatabase($mDB_NAME);
//            echo 'Connection Established!';
        } catch (Exception $exc) {
//            echo "Connection Falied " . $exc->getMessage();
        } finally {
//            echo '<pre>';
//            foreach($this->db_con->listCollections() as $col):
//                var_dump($col->toArray());
//            endforeach;
        }
    }

    function dumpData() {
        foreach ($this->data as $v) {
            $str = " ";
            foreach ($v as $k => $f) {
//        echo '<h2> Jina ni ' . $v['name'].' Role '.$v['role'].'<h2>';
                $f = is_array($f) ? join(",", $f) : (is_object($f) ? join(",", json_decode(json_encode($f), true)) : $f);
//        $f = is_array($f) ? join(",", $f) : (is_object($f)?"obj": $f);
                $str .= " {$k} is " . $f . ' ';
            }
            echo '<h3> ' . $str . ' </h3>';
        }
        return $this;
    }

    function setDeburg() {
        $this->deburg = true;
        return $this;
    }

    function getCon($db) {
        try {
            $this->db_con = $this->manager->{$db};
            echo 'Connection to Database Established!';
        } catch (Exception $exc) {
            echo "Connection Falied to the database {$db} " . $exc->getMessage();
        }
    }

    private function show($thing) {
        if ($this->deburg) {
            echo '<p>';
            print_r($thing);
            echo '</p>';
        }
    }

//    function orderBy($oder) {
//        
//    }
    function valuePair($pair_arr, $sep = ' = ', $end = null) {
        $this->end = is_null($end) ? ',' : $end;
        $sen = '';
        if (!empty($pair_arr)) {
            foreach ($pair_arr as $key => $value) {
                $value = is_null($value) ? $value : " '{$value}'";
                $sen .= "$key" . $sep . "{$value}" . "{$this->end}";
            }
        }
        $this->show($sen);
        return '' === $sen ? '' : rtrim($sen, $this->end);
    }

    function getData() {
        return $this->data;
    }

    function getError() {
        return $this->errors;
    }

    function getFlag() {
        return $this->flag;
    }

    /**
     * 
     * @param type $table
     * @param type $filter
     * @param type $options
     * @return $this
     */
    public function select($table, $filter = [], $options = array()) {
        try {
            $collection_handle = $this->db_con->selectCollection($table);
            $data = [];
            $data_handle = null;
            if ($data_handle = $collection_handle->find($filter, $options)):
                $this->flag = true;

                $this->data = $this->flag ? $data_handle->toArray() : $this->data;
            endif;
        } catch (Exception $exc) {
                 $this->errors[] = $exc->getMessage();
            $this->errors['sql'] = $collection_handle;
        }
//        var_dump($this->data);
        return $this;
    }

    /**
     * 
     * @param type $table
     * @param type $filter
     * @param type $options
     * @return $this
     */
    public function selectOne($table, $filter = [], $options = array()) {
        try {

            $collection_handle = $this->db_con->selectCollection($table);
            $data = [];
            $data_handle = null;
            if ($data_handle = $collection_handle->findOne($filter, $options)):
                $this->flag = true;
//                var_dump($data_handle);
                $this->data = $this->flag ? $data_handle : $this->data;
            endif;
        } catch (Exception $exc) {
       
            $this->errors[] = $exc->getMessage();
            $this->errors['sql'] = $collection_handle;
        }
//        var_dump($this->data);
        return $this;
    }

    function where(array $where = array(), $option = '') {
        $option = !empty($option) ? $option : ' AND ';
        $str_where = '';
        if (!empty($where) && is_array($where)) {
            $str_where = 'WHERE ';
            foreach ($where as $field => $value) {

                $str_where .= "{$field} = '{$value}' $option";
            }
            $str_where = rtrim($str_where, $option);
        } elseif (!empty($where) && !array($where)) {
            $str_where = $where;
        }
        $this->show($str_where);
        return $str_where;
    }

    /**
     * insert
     * @param string $table A name of table to insert into
     * @param string $data An associative array
     */
    public function insert($table, $data) {
        $data = is_array(array_shift($data)) ? $data : [$data];
        try {
            $res = $this->db_con->selectCollection($table)->insertMany($data);
            if (!empty($res->getInsertedIds())) {
                $this->flag = true;
            }
        } catch (Exception $exc) {
            $this->errors['error'] = $exc->getMessage();
            $this->errors['flag'] = $this->flag;
            $this->flag = false;
        }
        return $this;
    }

    /**
     * update
     * @param string $table A name of table to insert into
     * @param string $data An associative array
     * @param string $where the WHERE query part
     */
    public function update($table, $where, $data) {
        try {
            $res = $this->db_con->selectCollection($table)
                    ->updateMany($where, ['$set' => $data]);
        } catch (Exception $exc) {
            $this->errors[] = $exc->getMessage();
        }
        return $this;
    }

    /**
     * delete
     * 
     * @param string $table
     * @param string $where
     * @param integer $limit
     * @return integer Affected Rows
     */
    public function delete($table, $where, $limit = 1) {
       
       
        try {
            $this->flag = $this->exec($sql);
        } catch (Exception $exc) {
            $this->errors[] = $exc->getMessage();
        }
        return $this;
    }

    function exists($table, $where = array()) {
        $d = $this->getRow($table, $where);
        return !empty($d) || $d !== [] || count($d) > 0 ? true : false;
    }

}
