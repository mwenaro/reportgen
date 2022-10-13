<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Access-Control-Allow-Origin:*");
header("Access-Control-Allow-Methods:FETCH,POST, GET , OPTIONS, DELETE, PUT ");
header("Access-Control-Allow-Max-Age:3000");


require 'config.php';
//require 'api/packages/restapi.php';
require 'api/util/Auth.php';
if (!defined('LIBS')) {
    define('LIBS', 'libs/');
}

// Also spl_autoload_register (Take a look at it if you like)
//function __autoload($class) {
//    require LIBS . $class .".php";
//}
spl_autoload_register(function ($class) {
    $sources = [
        'api/packages/' . $class . ".php",
        'api/libs/' . $class . ".php"
    ];

    foreach ($sources as $file) {

        if (is_file($file)) {
//echo '<br> '.$file . 'is found <br>';
            require_once $file;
        }else {
//echo '<h2 style= "color:red;">'.$file. '</h2>';
}
    }
});

require_once 'API.php';
$api = new RestApiProcessor();
//$api= new API();
$payload = [
    'req_met' => $api->request_method(),
    'ends' => $api->get_endpoints,
    'tabl' => $api->db_table(),
    'tabl' => $api->db_table(),
    'where' => $api->where()];
//echo json_encode($payload);
//exit();
$file = 'api/endpoints/' . $api->controller_name . '.php';
//var_dump($file);
//exit();
if (file_exists($file)) {
//if ($api->get_endpoints && file_exists($file)) {
    require_once $file;
} else {

    boot_init();
}

function boot_init() {
    $bootstrap = new Bootstrap();
    $bootstrap->init();
}

//
//$api=new RestApiProcessor();
//$api->init();
