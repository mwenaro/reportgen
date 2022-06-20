<?php

header("Access-Control-Allow-Origin:*");
header("Access-Control-Allow-Methods:FETCH,POST, GET , OPTIONS, DELETE, PUT ");
header("Access-Control-Allow-Max-Age:3000");

function pulldb() {
    $sql = 'SELECT s.studentId,s.adm,s.first_name,s.middle_name,s.last_name,s.gen,s.dob,o.kcpe,s.active,s.isDeleted,c.hasGraduated,c.admYear
 FROM students s JOIN classes c on s.classId=c.classId
                JOIN forms f ON f.formId=c.formId
				JOIN oppener o ON o.adm=s.adm';
}

function mong() {
    require 'api/libs/mongodbcls.php';
    $items = [
            ['num' => 0, 'total' => 0, 'name' => 'beans', 'price' => ['amt' => 120, 'qty' => 1, 'units' => 'kg']],
            ['num' => 0, 'total' => 0, 'name' => 'ngano', 'price' => ['amt' => 65, 'qty' => 1, 'units' => 'kg']],
            ['num' => 0, 'total' => 0, 'name' => 'sima', 'price' => ['amt' => 65, 'qty' => 1, 'units' => 'kg']],
            ['num' => 0, 'total' => 0, 'name' => 'uto', 'price' => ['amt' => 150, 'qty' => 1, 'units' => 'ltr']],
            ['num' => 0, 'total' => 0, 'name' => 'bar soap', 'price' => ['amt' => 150, 'qty' => 1, 'units' => 'bar']],
            ['num' => 0, 'total' => 0, 'name' => 'charcoal', 'price' => ['amt' => 700, 'qty' => 1, 'units' => 'suck']],
            ['num' => 0, 'total' => 0, 'name' => 'match box', 'price' => ['amt' => 5, 'qty' => 1, 'units' => 'kg']],
            ['num' => 0, 'total' => 0, 'name' => 'majani', 'price' => ['amt' => 10, 'qty' => 1, 'units' => 'pkt']],
            ['num' => 0, 'total' => 0, 'name' => 'sugar', 'price' => ['amt' => 120, 'qty' => 1, 'units' => 'kg']]
    ];

//    echo '<pre>';
    $db = new MongoDBCls('badget');
//    $itemsDb->
    $d1 = $db->selectCollection('badget', 'items');
//    $d1=$d1->insertMany($items);
//    $d = $db->select('items',[],['projection'=>['name'=>1,'_id'=>0]]);
    $d = $db->select('items', []);
//    $names= array_unique(array_column($d->getData(),'name'));
//    foreach ($names as $name) {
//        $d1->deleteOne(['name'=>$name]);
//    }
//    $d1 = $db->selectCollection('badget', 'items');
//$res=$d1->deleteOne(['name'=>'beans']/);
//var_dump($res);
//    
//    
//    var_dump($d1);
//    var_dump($d->getData());
    print_r(json_encode($d->getData()));
//$mc = new MongoDBCls("watu");
//$d = $mc->select("hishi", [],['projection'=>['_id'=>0],"sort"=>["name"=>1]])->getData();
//$mc = new MongoDBCls("foods");
//$d = $mc->select("categories", [],['projection'=>['_id'=>0],"sort"=>["name"=>1]])->dumpData();
//$d = $mc->select("categories", [],['projection'=>['_id'=>0],"sort"=>["name"=>1]])->getData();
//$mc = new MongoDBCls("school");
//$d = $mc->select("schools", [],[])->dumpData();
//$d = $mc->select("categories", [],['projection'=>['_id'=>0],"sort"=>["name"=>1]])->getData();
}

//mong();
//exit();

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
            require_once $file;
        }
    }
});

//require_once 'API.php';
$api = new RestApiProcessor();
//$api= new API();
//$payload = [
//    'req_met' => $api->request_method(),
//    'ends' => $api->get_endpoints,
//    'tabl' => $api->db_table(),
//    'tabl' => $api->db_table(),
//    'where' => $api->where()];
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
