<?php
require_once 'config.php';
require_once  'libs/database.php';

class DataCls {

    private $con;
    private $dbname;
    private $dbhost;
    private $dbuser;
    private $pass;

    function __construct($con_arr = array()) {

        if (!empty($this->con_arr)) {
            foreach ($this->con_arr as $key => $value) {
                $this->$key = $value;
            }
        } else {
            $this->dbname = 'project';
            $this->dbhost = 'localhost';
            $this->pass = '';
            $this->dbuser = 'root';
        }
        $this->con = $this->getCon();
    }

    function getCon() {

        return new mysqli($this->dbhost, $this->dbuser, $this->pass, $this->dbname);
    }

    function detete($request) {
        
    }

    function getData($request, $show = false, $json = false) {
        $requests = explode('$', $request);
        $bData = [];
        $n = $loop = 1;
        foreach ($requests as $key => $req) {
            $n = $loop;
            $b2data = [];
            if (strpos($req, 'DELETE')) {
                if ($q = mysqli_query($this->con, $req)):
                    echo json_encode(array());
                    return true;
                endif;
            }
            $q = mysqli_query($this->con, $req);
            while ($row = mysqli_fetch_assoc($q)) {
                $b2data[] = $row;
            }
            $bData['q' . $n] = $b2data;
            $loop++;
        }
        if ($show) {
            echo json_encode($bData);
        }
        mysqli_close($this->con);
        return $json ? json_encode($bData) : $b2data;
    }

}

class SqliteDataCls {

    public $con;
    private $dbname;
    private $dbhost;
    private $dbuser;
    private $pass;
    public $db;

    function __construct($con_arr = array()) {
//        $this->con = new Database('sqlite', DB_PATH);
        $this->con = new Database('sqlite',realpath(dirname(__FILE__)."/resources/shule.sqlite3"));
        $this->db = $this->con;
    }
    function setDeburg() {
        
        
    }
    function getCon() {

//return new mysqli($this->dbhost, $this->dbuser, $this->pass, $this->dbname);

        return new Database('sqlite', realpath(dirname(__FILE__)."/resources/shule.sqlite3"));
    }

    function update($table, $data, $where) {
        return $flag = $this->con->update($table, $data, $where)->getFlag();
    }

    function detete($request) {
        
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
        return $str_where;
    }

    function insert($table, $data, $where = array()) {
        return $this->con->insert($table, $data, $where)->getFlag();
    }

    function getRow1($table, $id) {
        return $this->con->getRow($table, $id);
    }

    function getRow($table, $where) {
        return $this->con->getRow($table, $where);
    }

    /**
     * 
     * @param type $request
     * @param type $show
     * @param type $json
     * @return type
     */
    function getData($request, $show = false, $json = false) {
        $requests = explode('$', $request);
        //var_dump($requests);
        $bData =$data= [];
       // $n = $loop = 1;
        $n=$loop=1;
        $keys=[];
        foreach ($requests as $key => $req) {
          
            $n = $loop;
            // $keys[]='q'.($n+1); 
           // $b2data = [];
            
           $bData['q' . $n] = $this->con->select($req)->getData();
            //$data[] = $this->con->select($req)->getData();
           $loop++;
          //  $n++;
            
        }
       // var_dump($data);
       // $bData= array_combine($keys, $data);
//        for ($p=1;$p<=count($data);$p++):
////            $bData['q' . $n]=$data[$n-1];
//            $s=$p;
//            $bData['q' . $s]=$data[$p-1];
//          //  echo '<br> '.$p;
//        endfor;
////        var_dump($keys);
//       echo '<pre>'.json_encode($bData).'</pre>';
       // print_r($bData);
        if ($show) {
            echo json_encode($bData);
        }
        return $json ? json_encode($bData) : $bData;
    }

}
