<?php

class RestApiProcessor {

    private $_controller = null;
    private $_controllerPath = 'api/controllers/'; // Always include trailing slash
    private $_modelPath = 'api/models/'; // Always include trailing slash
    private $_errorFile = 'error.php';
    private $_defaultFile = 'index.php';
    private $is_restapi = false;
    public $get_endpoints = false;
    public $req_data = [];
    public $parameters = [];
    private $req_ops = null;
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
    private $rapi = null;
    private $db_table = null;
    private $q_builder = null;
//    private $db_table = "users";
    public $controller_name = null;
    private $controller_method = null;
    private $where = array();
    private $order = null;
    private $by = null;
    private $limit = null;
    private $db = null;
//    private $req_data;
    private $error_codes_ar = [
        /*         * +
         * The following codes and message are avaiable:
         * `200` OK
         * `201` Created
         * `204` No Content
         * `400` Bad Request
         * `403` Forbidden
         * `404` Not Found
         * `409` Conflict
         * `503` Service Unavailable
         */
        'success' => [
            'OK' => '200',
            'created' => '201'],
        'error' => [
            'no_content' => '204',
            'bad_request' => '400',
            'forbidden' => '403',
            'not_found' => '404',
            'conflict' => '409',
            'server_unvailable' => '503',
        ]
    ];

    function __construct($request_string = null) {
        Session::init();

        $this->db = new Database('sqlite', DB_NAME);
        $req_string = is_null($request_string) ? $this->_getReqString() : $request_string;
//        var_dump($req_string);
//        exit();
        $this->init($req_string);
//        $this->rest_init();
//        $this->req_data = array_key_exists('data', _Request::post()) ? _Request::post()['data'] : [];
        $this->req_data = !empty(_Request::post()) ? (
                array_key_exists('data', _Request::post()) ? _Request::post()['data'] : _Request::post()
                ) : [];
        $this->q_builder = new Query_Creator($this->db);
    }

    private function _getUrlFromRequest() {
        $path = (isset($_SERVER["PATH_INFO"]) ? trim($_SERVER["PATH_INFO"]) : null);
        $q_string = (isset($_SERVER["QUERY_STRING"]) ? trim($_SERVER["QUERY_STRING"]) : null);
        $q_uri = (isset($_SERVER["QUERY_URI"]) ? trim($_SERVER["QUERY_URI"]) : null);
        $path .= is_null($q_string) ? null : "/?" . $q_string;

        return !is_null($q_uri) ? $q_uri : (!is_null($path) ? $path : null);
    }

    /**
     * Fetches the $_GET from 'url'
     */
    private function _getReqString() {
//        echo '<pre>';
////        
//        print_r(($_SERVER));
//        print_r($_SERVER["QUERY_STRING"]);
////       exit();
        $p = $this->_getUrlFromRequest();

        $q_string = isset($_SERVER["QUERY_STRING"]) ? "/?" . $_SERVER["QUERY_STRING"] : NULL;
        $raw_url = isset($_GET['url']) ? $_GET['url'] : null;
        $raw_url = trim($raw_url, "/") . $q_string;
        $url = isset($_GET['url']) ? $raw_url : (!is_null($p) ? $p : null);

        $url = trim($url, '/');


        $url = filter_var($url, FILTER_SANITIZE_URL);

        return $url;
//        $this->req_string = $url;
//        $this->_url = explode('/', $url);
    }

    function is_req_method($method) {
        return in_array(strtolower($method), $this->req_methods);
    }

    function get_req_data() {
        return $this->req_data;
    }

    private function isMethod($method) {
        $str = strtolower(substr($method, 0, 3));
        $key_str = implode(',', $this->req_methods) . ' , ' . implode(',', array_keys($this->req_methods));
        return !empty($method) ? (strpos($key_str, $str) !== false ? true : false) : false;
    }

    private function is_controller_method($method) {
        $str = strtolower(substr($method, 0, 3));
        $key_str = implode(',', $this->req_methods) . ' , ' . implode(',', array_keys($this->req_methods));
        return !empty($method) ? (strpos($key_str, $method) == false && strpos($key_str, $str) !== false ? true : false) : false;
    }

    function is_req_method_key($method) {
        return array_key_exists(strtolower($method), $this->req_methods);
    }

    function rest_init(RestApi $rapi) {
//        exit();
        if ($this->is_restapi) {
//            echo json_encode(['inside API BRACKET']);
//            exit();
            # code..
            switch ($this->request_method) {
//                case!is_null($this->db_table) && $this->request_method === 'get' || $this->request_method === 'fetch':
                case $this->request_method === 'get' || $this->request_method === 'fetch':
                    $rapi->get($this->db_table, $this->where, $this->by, $this->order, $this->limit);
                    break;
                case $this->request_method === 'post' || $this->request_method === 'add' || $this->request_method === 'create':
                    _Request::setCorsHearders();
                    # code...
//                    $rapi->create($this->db_table, $this->data);
//                    echo json_encode([
//                        'met' => 'post method',
//                        'data' => $this->req_data
//                    ]);
                    $rapi->create($this->db_table, $this->req_data);
                    break;
                case $this->request_method === 'put' || $this->request_method === 'update':
                    _Request::setCorsHearders();
                    print_r(json_encode(['put_data' => $this->req_data]));
                    // $rapi->update($this->db_table, $this->where, $this->req_data);


                    break;
                case $this->request_method === 'delete' || $this->request_method === 'del':
                    # code...
                    _Request::setCorsHearders();
                    echo json_encode([
                        'met' => 'delete method',
                        $this->db_table,
                        $this->where
                    ]);
                    exit();
//                    $rapi->get($this->db_table, $this->where);
                    break;
                case $this->request_method === 'sql':

                    break;

                default:
                    $this->_load_controller();
                    $this->_load_controller_method();
            }
        } elseif (strtolower($this->controller_name) === 'join') {
            $table = $this->req_data['table'];
            $coloumns = $this->req_data['columns'];
            $join = $this->req_data['join'];
//            $where = $this->where();
//            $this->req_ops['where'] = $where;
//            $this->req_ops['join'] = $join;
            $this->parameters['join'] = $join;

            echo json_encode([
                'data' => $this->q_builder->get_data_from_many($table, $coloumns, $this->parameters),
//                'data' => $this->q_builder->get_data_from_many($table, $coloumns, $this->req_ops),
                'para' => $this->parameters,
                'ops' => $this->req_ops,
//                'req_data'=>$this->req_data
            ]);
        } elseif (strtolower($this->controller_name) === 'sql') {
            $sql = $this->req_data['sql'];
            $handle = $this->db->select($sql);
            echo '' . json_encode([
                'res' => $handle->getData(),
                'flag' => $handle->getFlag(),
                'errors' => $handle->getError(),
                'sql' => $sql
            ]);
//            return $handle->getData();
        } else {

//            $this->_load();
           
            $this->_load_controller();
            $this->_load_controller_method();
          

        }
    }

    function _load() {
        $file = $this->_controllerPath . $this->controller_name . '.php';
        $file1 = $this->_controllerPath . $this->controller_method . '.php';

        if (file_exists($file)) {
            require_once $file;
            $this->_controller = new $this->controller_name;
            if (method_exists($this->_controller, $this->controller_method)):
                $this->_controller->{$this->controller_method}();
            elseif (method_exists($this->_controller, 'index')):
                $this->_controller->index();
            else:
//            $this->_controller->index();
                echo json_encode($this->error_code_msg('bad_request'));
            endif;
        }elseif (file_exists($file1)) {
            require_once $file1;
            $this->_controller = new $this->controller_method;

            if (method_exists($this->_controller, $this->controller_name)):
                $this->_controller->{$this->controller_name}();
            elseif (method_exists($this->_controller, 'index')):
                $this->_controller->index();
            else:
//            $this->_controller->index();
                echo json_encode($this->error_code_msg('bad_request'));
            endif;
        } else {
            $file = $this->_controllerPath . $this->_defaultFile;
            require_once $file;
            $this->_controller = new Index();
//            echo json_encode($this->error_code_msg('bad_request'));
        }

//        _Request::response($handle, new Report(), $processorFun);
    }

    function _load_controller() {
        $file = $this->_controllerPath . $this->controller_name . '.php';
        $file1 = $this->_controllerPath . $this->controller_method . '.php';

        if (file_exists($file)):
            require_once $file;
            $this->_controller = new $this->controller_name;
//        elseif (file_exists($file1)):
//            require_once $file1;
//            $this->_controller = new $this->controller_method;
        else:
            $file = $this->_controllerPath . $this->_defaultFile;
            require_once $file;
            $this->_controller = new Index();
            $this->controller_name = 'Index';
//            echo json_encode($this->error_code_msg('bad_request'));
        endif;

//        _Request::response($handle, new Report(), $processorFun);
    }

    function _load_controller_method() {
//        if (is_null(!$this->_controller)){        exit();}
        if (method_exists($this->_controller, $this->controller_method)):
            $this->_controller->{$this->controller_method}();
        elseif (method_exists($this->_controller, $this->controller_name)):
            $this->_controller->{$this->controller_name}();
        elseif (method_exists($this->_controller, 'index') && $this->controller_name === 'Index'):
            $this->_controller->index();
        else:
//            $this->_controller->index();
            echo json_encode($this->error_code_msg('bad_request'));
//            echo json_encode(['con'=> $this->_controller]);
        endif;
    }

    function _con_has_method($ob, $method) {
        return method_exists($ob, $method);
    }

    function error_code_msg($error, $error_type = null) {

        $e_type = is_null($error_type) ? "error" : "success";
        $msg = str_replace('_', ' ', strtolower($error));
        $e_code = $this->error_codes_ar[$e_type][strtolower($error)];
        $return = [
            "$e_type" => [
                "code" => $e_code,
                "status" => ucwords($msg)
            ]
        ];

        return $return;
    }

    function init($req_str = '') {
        $req_string = empty($req_str) ? '/index/' : $req_str;
        // echo urldecode($req_string);
        // var_dump();
        // exit();
//        $req_string = "users/2/";
//        $req_string1 = "users/name/mwero/age/30/";
//        $req_string2 = "users/name/mwero/age/30/?by=date&by=desc&limit=50&dm=getusers";
//        var_dump($req_string);
        /**
         * Cutting the request string $req_string into url & options
         */
        $req_string_array = explode("/?", trim($req_string, '/'));
        $url = array_shift($req_string_array);

        $url_array = explode("/", trim($url, "/"));
//        $url_options = !empty($req_string_array) ? array_shift($req_string_array) : null;
        $met = !empty($url_array) ? $url_array[0] : null;
        $con_method = null;
        if ($this->isMethod($met)):
            switch ($met) {
                case $this->is_req_method_key($met) === true:
                    $con_method = $this->req_methods[strtolower($met)];

                    break;
                case $this->is_req_method($met) !== true && $this->is_controller_method($met) === true:
                    $con_method = $met;

                    break;

                default:
                    $con_method = $met;
                    break;
            }
            array_shift($url_array);
        endif;


        $this->controller_method = !in_array(strtolower($met), ['put', 'del', 'delete']) ? strtolower($con_method) : null;
        $this->request_method = in_array(strtolower($met), ['put', 'del', 'delete']) ? $con_method : strtolower($_SERVER["REQUEST_METHOD"]);

        $url = implode('/', $url_array);

        /**
         * check if is rest api
         */
        $this->is_restapi = strpos(strtolower($url), 'api') !== false ? true : false;
        $url = $this->is_restapi ? substr($url, 3) : $url;

        /**
         * get endpoints
         */
        $this->get_endpoints = strpos(strtolower($url), 'ends') !== false ? true : false;
        $url = $this->get_endpoints ? trim(substr($url, 5), '/') : $url;


        $url_array = explode("/", trim($url, "/"));
//        $pi = in_array('api', $url_array) ? array_shift($url_array) : '';
        /*
         * Check if there is a request method in the url and thre is, obtain it
         */


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
//        $this->controller_method = $method ? $method : $this->request_method;
//        echo '' . json_encode(
//                [
//                    'cntrl' => $this->controller_name,
//                    'str_met' => $this->controller_method,
//                    'req_met' => $this->request_method
//                ]
//        );

        /**
         * Set by,by,limit
         */
        $this->set_by($this->_extract_modifiers($req_string, 'by'));
        $this->set_order($this->_extract_modifiers($req_string, 'order'));
        $this->set_limit($this->_extract_modifiers($req_string, 'limit'));
    }

    function set_order($order) {
        if ($order):
            $this->order = $order;
        endif;
    }

    function set_limit($limit) {
        if ($limit):
            $this->limit = $limit;
        endif;
    }

    function set_by($by) {
        if ($by):
            $this->by = $by;
        endif;
    }

    function set_db_table($db_table) {
        if (!$db_table):
            $db_table = $this->db_table;
        endif;
        $this->db_table = $db_table;
        $this->controller_name = rtrim($db_table, "s");
    }

    private function _where_extractor($raw_where) {
        $len = count($raw_where);
//        var_dump($raw_where);
        $return = [];
        if ($len === 1) {
            $id = array_shift($raw_where);
            $return = ctype_digit($id) ? ['id' => $id] : [];
        } elseif ($len > 1 && $len % 2 === 0) {
            if ($len === 2 && $this->controller_name === 'login') :
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
//        $this->req_ops = $return;
        return $return;
    }

    function set_where($where) {
        $this->where = $this->_where_extractor($where);
        $this->parameters['where'] = $this->where;
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
                $this->parameters[$box[0]] = $box[1];
            }
            /**
             * get the requested modifier
             */
            $this->req_ops = $modifier_value_pair_arr;


            $return = is_null($modifier_key) ? $modifier_value_pair_arr : (array_key_exists($modifier_key, $modifier_value_pair_arr) ? $modifier_value_pair_arr[$modifier_key] : false);
        endif;
        $this->modifiers = $return;
//        echo json_encode($return);
//   array_push($this->parameters,$modifier_value_pair_arr);
//        $this->parameters['modifiers'] = $return;

        return $return;
    }

    function request_method() {
        return $this->request_method;
    }

    function str_controller() {
        return $this->controller_name;
    }

    function str_controller_method() {
        return $this->controller_method;
    }

}
