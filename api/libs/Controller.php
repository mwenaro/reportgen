<?php
header("Access-Control-Allow-Origin:*");
class Controller {

    function __construct() {
        header("Access-Control-Allow-Origin:*");
        //echo 'Main controller<br />';
        $this->view = new View();
        $this->mult_model = new Mult_Model();
       
//        var_dump(realpath(dirname(__FILE__).'/../resources/'));
//        echo DB_NAME.' mwero';
        $this->db = new Database('sqlite',DB_NAME);
         $this->tracker = new _Date_Tracker($this->db );

        //Session::init();
    }

    /**
     * 
     * @param Object $obj of the current Controller
     * @param string $page - the target page
     * @param array $data - data to be taken to the target page
     * @param array $exclude optional variable , if specified, the included item will be excluded
     */
    public function _goTO($obj, $page, $data, $exclude = []) {

        $obj->view->data = $data;
        $obj->view->render('header');
        $obj->view->render($page);
        $obj->view->render('footer');
    }

    /**
     * 
     * @param string $name Name of the model
     * @param string $path Location of the models
     */
    public function loadModel($name, $modelPath = 'models/') {

        $path = $modelPath . $name . '_model.php';

        if (file_exists($path)) {
            require $modelPath . $name . '_model.php';

            $modelName = $name . '_Model';
            $this->model = new $modelName();
        }
    }

    function emptyArray($array) {
        $error = [];
        foreach ($array as $value) {
            if ($value === '' || $value === null) {
                $error[] = 'Empty Fields';
            }
        }
        return empty($array) ? false : !empty($error) ? false : true;
    }

}
