<?php
header('Content-Type:application/json');
require_once 'config.php';
require_once LIBS . 'database.php';
//require_once 'http://localhost/sms/libs/Bootstrap.php';
//require_once 'http://localhost/sms/libs/Bootstrap.php';
error_reporting(1);

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

    private $con;
    private $dbname;
    private $dbhost;
    private $dbuser;
    private $pass;

    function __construct($con_arr = array()) {

//        if (!empty($con_arr)) {
//            foreach ($con_arr as $key => $value) {
//                $this->$key = $value;
//            }
//        } else {
//            $this->dbname = 'project';
//            $this->dbhost = 'localhost';
//            $this->pass = '';
//            $this->dbuser = 'root';
//            
//        }
        $this->con = new Database('sqlite', DB_PATH);
        $this->db = $this->con;
    }

    function getCon() {

        //return new mysqli($this->dbhost, $this->dbuser, $this->pass, $this->dbname);

        return new Database('sqlite', DB_PATH);
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
//                if ($q = mysqli_query($this->con, $req)):
//                    echo json_encode(array());
//                    return true;
//                endif;
            }
            $bData['q' . $n] = $this->con->select($req)->getData();
            $loop++;
        }
        if ($show) {
            echo json_encode($bData);
        }

        return $json ? json_encode($bData) : $bData;
    }

}

$db = new SqliteDataCls();
// $requests = $_POST['request'];
// $requests='SELECT subjectId,subjectName FROM subjects limit 2 $ SELECT teacherId,first_name,last_name FROM teachers limit 2 ';
// $requests='SELECT subjectId,subjectName FROM subjects limit 2 $ SELECT teacherId,first_name,last_name FROM teachers limit 2 ';
//  $requests = 'SELECT * from students LIMIT 5';
//    $requests = 'SELECT userId, role,password FROM users LIMIT 5';
//    if ($db->getData($requests, true)) {
//        // echo 'Hello there';
//        //$db->getData($requests);
//    }
$post = json_decode(file_get_contents("php://input"), true);
if (!empty($post)) {
    $keys = array_keys($post);
    //initialization
    //Getting request string
    $req = in_array('request', $keys) ? $post['request'] : '';
    //getting table string
    $table = in_array('table', $keys) ? $post['table'] : '';
    //getting table string
    $table_short = rtrim(in_array('table', $keys) ? $post['table'] : '', 's');
    //getting data to be inserted
    $data = in_array('data', $keys) ? $post['data'] : array();
    //getting row id if exits
    $id = array_key_exists("{$table_short}Id", $data) && !empty($data) ? $data[$table_short . 'Id'] : (in_array('id', $keys) ? $post['id'] : '');
//    $id = in_array('id', $keys) ? $post['id'] :'';
//    $id1 = array_key_exists("{$table_short}Id", $data)? $data[$table_short.'Id']:'';
    //getting the condition , where
    $where = '' !== $id ? array(rtrim($table, 's') . 'Id' => $id) : array();
    //    var_dump($req);

    switch ($req) {
        case 'all':
            $sql = $configs[$table]['all'];
           //echo ''.$sql;
            $flag = $db->con->select($sql)->getFlag();
            if ($flag):
                $data = $db->getData($configs[$table]['all'], false, false);
                print_r(json_encode(array('data' => $data, 'flag' => $flag)));
            else:
                // echo 'error';
                print_r(json_encode(array('sql'=>$sql,'flag' => $flag, 'msg' => $db->db->getError())));
            endif;
            break;
        case 'get_row':
            // print_r(json_encode($db->getRow($table, $where)));
            // break;
            $sql = $configs[$table]['all'] . ' AND ' . $db->db->valuePair($where);
            // echo '<br>'.$sql;
            $flag = $db->con->select($sql)->getFlag();
            if ($flag):
                $data = $db->con->select($sql)->getData()[0];
                print_r(json_encode(array('sql'=>$sql,'data' => $data, 'flag' => $flag)));
            else:
                // echo 'error';
                print_r(json_encode(array('sql'=>$sql,'flag' => $flag, 'msg' => $db->db->getError())));
            endif;
            break;
        case 'delete':
            $flag = $db->update($table, $data, $where);
            if ($flag):

                $data = $db->getData($configs[$table]['all'], false, false);
                print_r(json_encode(array('data' => $data, 'flag' => $flag, 'msg' => ucfirst($table_short) . '  Successfully Deleted! ')));
            else:
                // echo 'error';
                print_r(json_encode(array('flag' => $flag, 'msg' => $db->db->getError())));
            endif;
            break;
        case 'update':
            //db->update('students', $data, array('studentId' => $studentId)
//            print_r($post);
//            exit();
            // print_r($where);

            $flag = $db->update($table, $data, $where);
            if ($flag):
                $data = $db->getData($configs[$table]['all'], false, false);
                print_r(json_encode(array('data' => $data, 'flag' => $flag)));

            else:
            // echo 'error';
            // print_r(json_encode(array('flag' => $flag, 'msg' => $db->db->getError())));
            endif;

            break;
        case 'insert':
            $flag = $db->insert($table, $data);
            if ($flag):
                $data = $db->getData($configs[$table]['all'], false, false);
                print_r(json_encode(array('data' => $data, 'flag' => $flag)));

            else:
            // echo 'error';
            // print_r(json_encode(array('flag' => $flag, 'msg' => $db->db->getError())));
            endif;
            break;
        default :
//            echo 'Hello there';
            if ($db->getData($req, true)) {
                // echo 'Hello there';
                //$db->getData($requests);
            }
            break;
    }
}

//$d = array(
//    "studentId" => "299",
//    "first_name" =>
//    "abdalla",
//    "middle_name" =>
//    "mwero",
//    "last_name" =>
//    "mangale",
//    "dob" =>
//    "2018-12-30T21:00:00.000Z"
//    , "gen" =>
//    "m",
//    "religion" =>
//    "i",
//    "county" =>
//    "kwale",
//    "subcounty" =>
//    NULL,
//    "adm" =>
//    "1",
//    "form" =>
//    "3",
//    "upi" =>
//    NULL,
//    "clubs" =>
//    NULL,
//    "designationId" =>
//    NULL,
//    "constituency" =>
//    NULL,
//    "residence" =>
//    "kwao",
//    "isDeleted" =>
//    "0",
//    "creatorId" =>
//    NULL,
//    "doa" =>
//    "2018-08-08 18:26:05",
//    "dateCreated" =>
//    "2018-08-08 18:26:05",
//    "dateUpdated" =>
//    NULL,
//    "updatorId" =>
//    NULL,
//    "password" =>
//    NULL,
//    "securityQuiz" =>
//    NULL,
//    "securityAns" =>
//    NULL,
//    "name" =>
//    "abdalla mwero mangale",
//    "ward" =>
//    "kasemeni"
//);
//$table = 'students';
//$data = $d;
//$where = array('studentId' => 299);
//$con = new Database('sqlite', DB_PATH);
// echo '<p>eroor</p><pre>';
//$flag = $con->update($table, $data, $where)->getFlag();
//if ($flag):
//    print_r(json_encode(array('flag' => $flag, 'msg' => ucfirst($table_short) . ' Data has been Successfully Updated! ')));
//else:
//    echo 'eroor';
//    print_r(json_encode(array('flag' => $flag, 'msg' => $con->getError())));
// endif;