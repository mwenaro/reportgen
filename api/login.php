<?php //

require_once 'inc_file.php';

class Login extends SqliteDataCls {

    //private $db;
    //private $db;

    function __construct() {
        parent::__construct([]);
        Session::init();
    }

//    *****************************************************************************
//    
//    ****
    /**
     * -Getting login status 
     * @param type $id
     */
    function status($id) {
        if (Session::get('loggedInId' === $id)) {
            print_r(json_encode(array('status' => 200, 'flag' => true)));
        } else {
            print_r(json_encode(array('status' => 500, 'flag' => false)));
        }
    }

//    function checkLogin() {
//        if (isset(Session::get('loggedInId')) && isset(Session::get('isLoggedIn'))) {
//            'authentified';
//        }
//    }

    function logout() {
        session_start();
        session_destroy();
        session_commit();
    }

    function login($user) {
        // $user = ['username' => 'user', 'password' => 'user'];     
        $sql = '';
        $id_name = '';
        switch ($user) {
            case trim($user['username']) === 'admin' || trim($user['username']) === 'user':
                // $sql = "SELECT userId,username,role FROM users WHERE role = :username AND password = :password LIMIT 1";
                $sql = "SELECT userId, username,role FROM users WHERE role = :username AND password = :password";
                $id_name = 'userId';
                break;
            default:
                $sql = "SELECT teacherId FROM teachers WHERE phone = :username AND password = :password LIMIT 1";
                $id_name = 'teacherId';
                break;
        }
        $d = $this->db->select($sql, $user)->getData();
        $data = !empty($d) ? $d[0] : [];
        if (count($data) > 0) {
            Session::init();
            Session::set('loggedInId', $data[$id_name]);
            Session::set('isLoggedIn', true);
//            Session::set('loggedInId', $data[$id_name]);
            print_r(json_encode(array('userId' => $data[$id_name], 'flag' => true)));
        } else {
            print_r(json_encode(array('userId' =>null, 'flag' => false)));
        }
    }

    function fetch($userId) {
        
        $data = $this->db->getRow('teachers', array('teacherId' => $userId));
        echo json_encode(['user' => $data ? $data : []]);
    }

    function create($user) {
        $user['dateCreated'] = date('');
    }

}

function post() {
    $post = file_get_contents("php://input");
    //print_r($post);
    return is_object(json_decode($post)) ? json_decode($post, true) : json_decode($post);
}

//$post = file_get_contents("php://input");
$l = new Login();
$post = post();
$req = array_key_exists('request', $post) ? $post['request'] : '';
$user = array_key_exists('user', $post) ? $post['user'] : [];
$userId = array_key_exists('userId', $post) ? $post['userId'] : '';
//var_dump($post);

switch ($req) {
    case 'logout':
        $l->logout();
        break;
    case 'login':
        $l->login($user);
        break;
    case 'fetch':
        $l->user();
        break;
    case 'check_login':
        $l->checkLogin();
        break;
   }


