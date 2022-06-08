<?php

//
//  add: function (test) {
//                        return $http.post(api + 'output1.php', {request: 'insert', table: 'tests',data:test});
//                    },
//                    get: function () {
//                        return $http.post(api + 'output1.php', {request: 'all', table: 'tests'});
//                    },
//                    getRow: function (id) {
//                        return  $http.post(api + 'output1.php', {request: 'get_row', table: 'tests', data: {testId: id, isDeleted: 0}});
//                    },
//                    remove: function (id) {
//                        return  $http.post(api + 'output1.php', {request: 'delete', table: 'tests', data: {id: id, isDeleted: 0}});
//                    },
//                    update: function (id) {
//                        return  $http.post(api + 'output1.php', {request: 'update', table: 'tests', data: {id: id}});
//                    }
//
?>
<?php

//require_once '../config.php';
//namespace Libs;
class Database extends PDO {

    private $flag = false;
    private $data = array();
    private $deburg = false;
    public $errors = [];

// public function __construct($DB_TYPE, $DB_NAME = 'C:\software\repo\tmtsrg\api\resources\shule.sqlite3', $DB_HOST = null, $DB_USER = null, $DB_PASS = null) {
    public function __construct($DB_TYPE, $DB_NAME = 'C:\Users\Tsagwa Secondary\Desktop\app\software\software\repo\tmtsrg\api\resources\shule.sqlite3', $DB_HOST = null, $DB_USER = null, $DB_PASS = null) {

        if (null !== $DB_HOST || $DB_TYPE !== 'sqlite'):

            parent::__construct($DB_TYPE . ':host=' . $DB_HOST . ';dbname=' . $DB_NAME, $DB_USER, $DB_PASS);
//  parent::setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        else:

//parent::__construct($DB_TYPE . ':dbname=' . $DB_NAME);
//var_dump($DB_NAME);
            parent::__construct($DB_TYPE . ':' . $DB_NAME);
// $this->path = $DB_NAME;

        endif;
        parent::setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    function setDeburg() {
        $this->deburg = true;
        return $this;
    }

    private function show($thing) {
        if ($this->deburg) {
            echo '<p>';
            print_r($thing);
            echo '</p>';
        }
    }

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
     * select
     * @param string $sql An SQL string
     * @param array $array Paramters to bind
     * @param constant $fetchMode A PDO Fetch mode
     * @return mixed
     */
    public function select($sql, $array = array(), $fetchMode = PDO::FETCH_ASSOC) {
        try {
            $sth = $this->prepare($sql);
            foreach ($array as $key => $value) {
                $sth->bindValue("$key", $value);
            }
            $this->show($sql);
            $this->flag = $sth->execute();

            $this->data = $this->flag ? $sth->fetchAll($fetchMode) : $this->data;
//            $this->process_update($this->data, 'students', $sql);
        } catch (PDOException $exc) {
            $exc->getMessage();
            $this->errors[] = $exc->getMessage();
            $this->errors['sql'] = $sql;
        }
        return $this;
    }

    function process_update($data, $table, $sql = null) {
//        $people = [];
        if (empty($data) || $table !== 'students' || strpos($sql, $table) > 0) {
            return;
        }

        foreach ($data as $d) {
            $p = [];

            $name = $d['name'];
            $names = explode(' ', $name);
            $len = count($names);

            switch ($len) {
                case 2:
                    $this->update($table, ['first_name' => $names[0], 'last_name' => $names[1]], ['adm' => $d['adm']]);
                    break;

                case 3:
                    $this->update($table, ['first_name' => $names[0], 'middle_name' => $names[1], 'last_name' => $names[2]], ['adm' => $d['adm']]);
                    break;
            }
        }
    }

    function process_mks($mk) {
        $keys = ['term', 'form', 'examId', 'subjectId', 'score', 'year', 'studentId'];
        foreach ($keys as $key) {
            $$key = array_key_exists($key, $mk) ? $mk[$key] : '';
        }
        $data = [];

//  if ($students) {
        $n = 0;
        foreach ($studentId as $id) {
            $data[$n] = [
                'studentId' => $id,
                'score' => $score[$n],
                'examId' => $examId,
                'subjectId' => $subjectId,
                'term' => $term,
                'year' => $year,
                'dateCreated' => date("Y-m-d H:i:s")
            ];
            $n++;
        }
//}
//        var_dump($data);
//exit();
        return $data;
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
            $sql = "INSERT INTO `{$table}` (`$fieldNames`) VALUES ($fieldValues) $where";
            $sth = $this->prepare($sql);
            foreach ($data as $key => $value) {

                $sth->bindValue(":$key", $value);
            }
            $this->flag = $sth->execute();

//$this->flag =
        } catch (Exception $exc) {
            $this->errors[] = $exc->getMessage();
            $this->errors['sql'] = $sql;
            $this->errors['flag'] = $this->flag;
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
        $data = $this->removeEmpty($data);
        $where = $this->where($where);
        try {
            ksort($data);

            $fieldDetails = NULL;
            foreach ($data as $key => $value) {
                $fieldDetails .= "`$key` = :$key,";
            }
            $fieldDetails = rtrim($fieldDetails, ',');
            $sql = "UPDATE $table SET $fieldDetails $where";
            $sth = $this->prepare($sql);
            $this->show($sql);
            foreach ($data as $key => $value) {
                $sth->bindValue(":$key", $value);
            }

            $this->flag = $sth->execute();
        } catch (PDOException $exc) {
            $this->errors[] = $exc->getMessage();
            $this->errors['sql'] = $sql;
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
        $sql = "DELETE FROM $table  $where LIMIT $limit";
        $this->show($sql);

        try {
            $this->flag = $this->exec($sql);
        } catch (Exception $exc) {
            $this->errors[] = $exc->getMessage();
        }
        return $this;
    }

    function fetch($sql) {
        try {
            $this->flag = ($this->exec($sql) === true ? true : false);
        } catch (PDOException $exc) {
            $this->errors[] = $exc->getMessage();
        }

        return $this;
    }

    function cmd($sql) {
        try {
            $this->flag = ($this->exec($sql) === true ? true : false);
        } catch (PDOException $exc) {
            $this->errors[] = $exc->getMessage();
        }

        return $this;
    }

    function create($sql, Array $sql1 = array()) {
// echo $sql;
        try {
            $this->flag = ($this->exec($sql) === true ? true : false);
        } catch (PDOException $exc) {
            $this->errors[] = $exc->getMessage();
        }

        return $this;
    }

    function removeEmpty($inPut) {
        $output = [];

        foreach ($inPut as $key => $val) {
            if ($val !== null && !empty($val)) {
                $output[$key] = $val;
            }
        }
        return $output;
    }

    function updateForm($table, $data, $where) {
        $where = $this->where($where, ' AND ');
        $data = $this->removeEmpty($data);
        $fieldDetails = $this->valuePair($data);
        $sql = "UPDATE $table SET $fieldDetails $where";
        echo '<br>' . $sql;
        $this->flag = ($this->exec($sql) === true ? true : false);
        return $this;
    }

    function row($table, $where, $array = [], $fetchMode = PDO::FETCH_ASSOC) {
        $sql = "SELECT * FROM {$table} " . $this->where($where) . ' Limit 1';
        $this->show($sql);
        try {
            $sth = $this->prepare($sql);
            foreach ($array as $key => $value) {
                $sth->bindValue("$key", $value);
            }
            $this->flag = $sth->execute();
            $this->data = $this->flag ? $sth->fetch($fetchMode) : [];
        } catch (Exception $exc) {
            $this->errors[] = $exc->getMessage();
            $this->errors[] = $sql;
        }

        return $this;
    }

    function getRow($table, $where, $array = array(), $fetchMode = PDO::FETCH_ASSOC) {
//$sql = "SELECT * FROM {$table} " . $this->where(array(rtrim($table, 's') . 'Id' => $id)) . ' Limit 1';
        $sql = "SELECT * FROM {$table} " . $this->where($where) . ' Limit 1';
        $this->show($sql);
        try {
            $sth = $this->prepare($sql);
            foreach ($array as $key => $value) {
                $sth->bindValue("$key", $value);
            }
            $sth->execute();
        } catch (Exception $exc) {
            $this->errors[] = $exc->getMessage();
        }

        return $sth->fetch($fetchMode);
    }

    function exists($table, $where = array()) {
        $d = $this->getRow($table, $where);
        return !empty($d) || $d !== [] || count($d) > 0 ? true : false;
    }

}
