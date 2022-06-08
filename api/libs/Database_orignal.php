<?php

error_reporting(1);

//namespace Libs;
class Database extends PDO {

    private $flag = false;
    private $data = array();
    private $error;

    public function __construct($DB_TYPE, $DB_NAME, $DB_HOST = null, $DB_USER = null, $DB_PASS = null) {
        if (null !== $DB_HOST || $DB_TYPE !== 'sqlite'):

            parent::__construct($DB_TYPE . ':host=' . $DB_HOST . ';dbname=' . $DB_NAME, $DB_USER, $DB_PASS);
        //  parent::setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        else:

            //parent::__construct($DB_TYPE . ':dbname=' . $DB_NAME);
            parent::__construct($DB_TYPE . ':' . $DB_NAME);

        endif;
        //parent::setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    function reoveEmpty($inPut) {
        $output = [];

        foreach ($inPut as $key => $val) {
            if ($val !== null && !empty($val)) {
                $output[$key] = $val;
            }
        }
        return $output;
    }

    function getData() {
        return $this->data;
    }

    function getError() {
        return $this->error;
    }

    function getFlag() {
        return $this->flag;
    }

    private function where(array $where = array(), $option = '') {
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
        return $str_where;
    }

    /**
     * select
     * @param string $sql An SQL string
     * @param array $array Paramters to bind
     * @param constant $fetchMode A PDO Fetch mode
     * @return mixed
     */
    public function select($sql, $array = array(), $fetchMode = PDO::FETCH_ASSOC) {
        // echo '<br> in select DB';
        try {
            $sth = $this->prepare($sql);
            foreach ($array as $key => $value) {
                $sth->bindValue("$key", $value);
            }
            $this->flag = $sth->execute();

            $this->data = $this->flag ? $sth->fetchAll($fetchMode) : $this->data;
        } catch (PDOException $exc) {
            echo $exc->getTraceAsString();
            print_r($sth->errorInfo());
        }

        return $this;
        // var_dump(json_encode($sth->fetchAll($fetchMode)));
    }

    function getRow($table, $where, $array = array(), $fetchMode = PDO::FETCH_ASSOC) {
        //$sql = "SELECT * FROM {$table} " . $this->where(array(rtrim($table, 's') . 'Id' => $id)) . ' Limit 1';
        $sql = "SELECT * FROM {$table} " . $this->where($where) . ' Limit 1';
        // echo '<br>'.$sql;
        $sth = $this->prepare($sql);
        foreach ($array as $key => $value) {
            $sth->bindValue("$key", $value);
        }
        $sth->execute();
        return $sth->fetch($fetchMode);
    }

    /**
     * insert
     * @param string $table A name of table to insert into
     * @param string $data An associative array
     */
    public function insert($table, $data, $where = array(), $option = '') {
        $where = $this->where($where);
        try {
            ksort($data);

            $fieldNames = implode('`, `', array_keys($data));
            $fieldValues = ':' . implode(', :', array_keys($data));

            $sth = $this->prepare("INSERT INTO $table (`$fieldNames`) VALUES ($fieldValues) $where");
            //  echo '<br>' . "INSERT INTO $table (`$fieldNames`) VALUES ($fieldValues) $where";

            foreach ($data as $key => $value) {

                $sth->bindValue(":$key", $value);
            }

            $this->flag = $sth->execute();
        } catch (Exception $exc) {
            // echo $exc->getTraceAsString();
            // print_r( 'Error '.$sth->errorInfo());
        }


        return $this;
    }

    /**
     * update
     * @param string $table A name of table to insert into
     * @param string $data An associative array
     * @param string $where the WHERE query part
     */
    public function update($table, $data, $where) {
        // $flag = false;
        //$data= $this->reoveEmpty($data);
        // var_dump($data);
        $where = $this->where($where);
        try {
            ksort($data);

            $fieldDetails = NULL;
            foreach ($data as $key => $value) {
                $fieldDetails .= "`$key` = :$key,";
            }
            $fieldDetails = rtrim($fieldDetails, ',');


            // echo '<br>'  .    "UPDATE $table SET $fieldDetails {$where}"; 
            $sth = $this->prepare("UPDATE $table SET $fieldDetails $where");

            foreach ($data as $key => $value) {
                $sth->bindValue(":$key", $value);
                // var_dump($sth->errorInfo());
            }

            $this->flag = $sth->execute();
            if ($this->flag) {
                // echo '<p><deleted></p>';
            } else {

                // echo '<p style="background:red">Error</p>';
                print_r($sth->errorInfo());
                $this->error = $sth->errorInfo();
            }
            //exit();
        } catch (PDOException $exc) {
            echo $exc->getTraceAsString();
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
        $where = $this->where($where);
        try {
            $this->flag = $this->exec("DELETE FROM $table  $where LIMIT $limit");
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
        return $this;
    }

    function create(String $sql, Array $sql1 = array()) {
        try {
            $this->flag = ($this->exec($sql) === true ? true : false);
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }

        return $this;
    }

    function exists($table, $data, $where = array()) {
        
    }

}
