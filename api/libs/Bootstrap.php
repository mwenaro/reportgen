<?php
//class RestApiBootstrap {
class Bootstrap {

    private $_url = null;
    private $_controller = null;
    private $_controllerPath = 'api/controllers/'; // Always include trailing slash
//    private $_modelPath = 'api/models/'; // Always include trailing slash
    private $_modelPath = 'api/models/'; // Always include trailing slash
    private $_errorFile = 'error.php';
    private $_defaultFile = 'index.php';
    private $req_string = null;
    private $rest;

    /**
     * rest
     */
    private $controller_name;
    private $controler_method;

    function __construct($s = null) {
        $this->_getUrl();
    }

    /**
     * Starts the Bootstrap
     * 
     * @return boolean
     */
    public function init() {
        // Sets the protected $_url

        $this->rest = $rest = new RestApiProcessor($this->req_string);
        $this->data = !empty(_Request::post()) ? (array_key_exists('data', _Request::post()) ? _Request::post()['data'] : []) : [];
        $this->table = $rest->db_table();
        $this->method = $rest->request_method();
        $this->where = $rest->where();
        $this->limit = $rest->limit();
        $this->order = $rest->order();
        $this->by = $rest->by();
//        init
        $this->controller_name = $this->rest->str_controller();
        $this->controller_method = $this->rest->str_controller_method();
        $rapi = new RestApi();
        $db = new Database('sqlite', DB_NAME);
        $rest->rest_init($rapi);
        exit();
        if ($this->table === 'sql'):

//            $qc = new Query_Creator($db);
//            $qc->get_data_from_many(null, $this->data, [
//                'by' => $this->by,
//                'where' => $this->where,
//                'limit' => $this->limit,
//                'order' => $this->order,
//                'joining_fields' => ['courses.subjectId' => 'subjects.subjectId']
//            ]);
////            $qc->join_init()
////                    ->add_table($this->data);
////            if (1):
////                $qc->from('subjects');
//            endif;
//
//            $qc->join(['courses.subjectId' => 'subjects.subjectId'])
//                    ->where($this->where)
//                    ->orderBy($this->by)
//                    ->exec();
////            echo json_encode(['data' => $this->data]);
////            exit();
//            exit();
        endif;
//
//        switch ($this->str_request_method) {
//            case $this->controller_method === 'get' || $this->controller_method === 'fetch':
//                $rapi->get($this->table, $this->where, $this->by, $this->order, $this->limit);
//                break;
//            case $this->controller_method === 'post' || $this->controller_method === 'add' || $this->controller_method === 'create':
//                # code...
//                echo json_encode([
//                    'met' => 'add it here'
//                ]);
//                exit();
//                $rapi->create($this->table, $this->data);
//                break;
//            case $this->controller_method === 'put' || $this->controller_method === 'update':
//                echo json_encode([
//                    'met' => 'updated method'
//                ]);
//
//                # code...
//                $rapi->update($this->table, $this->where, $this->data);
//                break;
//            case $this->controller_method === 'delete' || $this->controller_method === 'del':
//                # code...
//                echo json_encode([
//                    'met' => 'delete method'
//                ]);
//                exit();
//                $rapi->get($this->table, $this->where);
//                break;
//            case $this->controller_method === 'sql':
//                $p = _Request::post();
////                echo json_encode($p);
//                # code...
////                $rapi->get($this->table, $this->where);
//                break;
//            default:
//                echo json_encode(
//                        [
////                    'url' => $this->req_string,
//                            'msg' => $rest->error_code_msg('bad_request'),
//                            'contoller' => $rest->str_controller(),
//                            'table' => $rest->db_table(),
//                            'method' => $rest->request_method(),
//                            'where' => $rest->where(),
//                            'limit' => $rest->limit(),
//                            'order' => $rest->order(),
//                            'by' => $rest->by(),
////                   
//                        ]
//                );
//
//            # code..
////                if (empty($this->rest->controller())) {
////                    $this->_loadDefaultController();
////                    return false;
////                }
//////        }
////
////                $this->_loadExistingController();
////                $this->_callControllerMethod();
////                break;
//        }
    }

    /**
     * (Optional) Set a custom path to controllers
     * @param string $path
     */
    public function setControllerPath($path) {
        $this->_controllerPath = trim($path, '/') . '/';
    }

    /**
     * (Optional) Set a custom path to models
     * @param string $path
     */
    public function setModelPath($path) {
        $this->_modelPath = trim($path, '/') . '/';
    }

    /**
     * (Optional) Set a custom path to the error file
     * @param string $path Use the file name of your controller, eg: error.php
     */
    public function setErrorFile($path) {
        $this->_errorFile = trim($path, '/');
    }

    /**
     * (Optional) Set a custom path to the error file
     * @param string $path Use the file name of your controller, eg: index.php
     */
    public function setDefaultFile($path) {
        $this->_defaultFile = trim($path, '/');
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
    private function _getUrl() {
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

        $this->req_string = $url;
        $this->_url = explode('/', $url);
    }

    /**
     * This loads if there is no GET parameter passed
     */
    private function _loadDefaultController() {
        require $this->_controllerPath . $this->_defaultFile;
        $this->_controller = new Index();
        $this->_controller->index();
    }

    /**
     * Load an existing controller if there IS a GET parameter passed
     * 
     * @return boolean|string
     */
    private function _loadExistingController() {
        $file = $this->_controllerPath . $this->rest->str_controller() . '.php';
//        $file = $this->_controllerPath . $this->_url[0] . '.php';

        if (file_exists($file)) {
            require $file;
            $this->_controller = new $this->rest->str_controller();
            $this->_controller->loadModel($this->_controller, $this->_modelPath);
        } else {
            $this->_error($$this->rest->str_controller());
            //$this->_controller->loadModel($this->_url[0], $this->_modelPath);
            return false;
        }
    }

    /**
     * If a method is passed in the GET url paremter
     * 
     *  http://localhost/controller/method/(param)/(param)/(param)
     *  url[0] = Controller
     *  url[1] = Method
     *  url[2] = Param
     *  url[3] = Param
     *  url[4] = Param
     */
    private function _callControllerMethod() {
        if (!method_exists($this->_controller, $this->rest->controller_method())) {
            $this->_error($this->_controller . '/' . $this->rest->controller_method());
            // my trial
            $this->_controller->index();
        }
        $this->_controller->{$this->rest->controller_method()}($this->rest->db_table(), $this->rest->where());
//        $length = count($this->_url);
        // Make sure the method we are calling exists
//        if ($length > 1) {
//            if (!method_exists($this->_controller, $this->_url[1])) {
//                $this->_error($this->_controller . '/' . $this->_url[1]);
//                // my trial
//                // $this->_controller->index();
//            }
//        }
//
//        // Determine what to load
//        switch ($length) {
//            case 5:
//                //Controller->Method(Param1, Param2, Param3)
//                $this->_controller->{$this->_url[1]}($this->_url[2], $this->_url[3], $this->_url[4]);
//                break;
//
//            case 4:
//                //Controller->Method(Param1, Param2)
//                $this->_controller->{$this->_url[1]}($this->_url[2], $this->_url[3]);
//                break;
//
//            case 3:
//                //Controller->Method(Param1, Param2)
//                $this->_controller->{$this->_url[1]}($this->_url[2]);
//                break;
//
//            case 2:
//                //Controller->Method(Param1, Param2)
//                $this->_controller->{$this->_url[1]}();
//                break;
//
//            default:
//                $this->_controller->index();
//                break;
//        }
    }

    /**
     * Display an error page if nothing exists
     * 
     * @return boolean
     */
    private function _error($page = null) {
        require $this->_controllerPath . $this->_errorFile;
        $this->_controller = new Error();
        $this->_controller->index($page);
        exit;
    }

}
