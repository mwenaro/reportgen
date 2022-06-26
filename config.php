<?php
$server = $_SERVER['SERVER_NAME'];
$port = $_SERVER['SERVER_PORT'];
$protocol = (isset($_SERVER['HTTPS'])&& $_SERVER['HTTPS']=== 'on')? 'https://':'http://';

if(!defined('SP')){

define('SP', DIRECTORY_SEPARATOR); 

//	define('SP', '/');
}

// Always provide a TRAILING SLASH (/) AFTER A PATH
if (!defined('URL')) {
    $url = $port == 443? realpath(dirname(__FILE__)).'/': $protocol.''.$server.':'.$port.SP;
  define('URL', $url);
//	define('URL', realpath(dirname(__FILE__)).SP);

}
//Resouce URI

if (!defined('URI')) {
    $uri = ($port == 443 ||  $_SERVER['HTTPS']== 'on')? $protocol.''.$server.'/' : $protocol.''.$server.':'.$port.SP;
    $url = $serevr != '127.0.0.1'? "$protocol$server/": "$protocol$server:$port/";
  define('URI', $url);
//	define('URL', realpath(dirname(__FILE__)).SP);

}

//define('URL', realpath(dirname(__DIR__).'/sms/'));
if (!defined('SITE_NAME')) {
    define('SITE_NAME', 'sms');
}

if (!defined('LIBS')) {
    define('LIBS', URL.'api'.SP.'libs'.SP);
}
//define('LIBS', URL.'libs/');
if (!defined('CTRLS')) {
    define('CTRLS', URL.'api'.SP.'controllers'.SP);
}
//define('CTRLS', URL.'controllers/');
if (!defined('PATH_VIEWS')) {
    define('PATH_VIEWS', 'api'.SP.'views'.SP);
}
if (!defined('CLS')) {
    define('CLS', URL . 'api'.SP.'cls'.SP);
}
if (!defined('INCLUDES')) {
    define('INCLUDES', URL . 'api'.SP.'views'.SP.'includes'.SP);
}
if (!defined('DB_PATH')) {
//define("DB_PATH", URL."api/resources/shule.sqlite3");
    define("DB_PATH", realpath(dirname(__FILE__).SP.'api'.SP.'resources'.SP.'shule.sqlite3'));
}
if (!defined('DB_NAME')) {
//define("DB_NAME", URL."api/resources/shule.sqlite3");
    define("DB_NAME", realpath(dirname(__FILE__)."/api/resources/shule.sqlite3"));
}
if (!defined('IS_REST')) {
//define("DB_NAME", URL."api/resources/shule.sqlite3");
    define("IS_REST", TRUE);
}



//require_once  URL.'api/report/libs/fpdf/fpdf.php';
//require_once  URL.'api/report/maths.php';
//require_once  URL.'api/report/insertexceldata.php';
//require_once  URL.'api/report/commentor.php';



//echo ''.DB_NAME;
//echo '<P>'.DB_PATH.'</P>';
//define('DB_TYPE', 'mysql');
//define('DB_HOST', 'localhost');
//define('DB_NAME', 'project');
//define('DB_USER', 'root');
//define('DB_PASS', '');
// The sitewide hashkey, do not change this because its used for passwords!
// This is for other hash keys... Not sure yet
//define('HASH_GENERAL_KEY', 'MixitUp200');
// This is for database passwords only
define('HASH_PASSWORD_KEY', 'catsFLYhigh2000miles');

//$db=new PDO('sqlite' . ':' . DB_NAME);

//
////$s="  INSERT INTO marks (`studentId`,`score`,`term`,`examId`,`year`,`dateCreated`) VALUES ('218','36','2','1','2016','2018-09-27 11-58-57'),('220','36','2','1','2016','2018-09-27 11-58-57'),('221','36','2','1','2016','2018-09-27 11-58-57'),('222','36','2','1','2016','2018-09-27 11-58-57'),('223','36','2','1','2016','2018-09-27 11-58-57'),('224','36','2','1','2016','2018-09-27 11-58-57'),('226','36','2','1','2016','2018-09-27 11-58-57'),('227','36','2','1','2016','2018-09-27 11-58-57'),('229','36','2','1','2016','2018-09-27 11-58-57'),('231','36','2','1','2016','2018-09-27 11-58-57'),('232','36','2','1','2016','2018-09-27 11-58-57'),('233','36','2','1','2016','2018-09-27 11-58-57'),('234','36','2','1','2016','2018-09-27 11-58-57'),('236','36','2','1','2016','2018-09-27 11-58-57'),('237','36','2','1','2016','2018-09-27 11-58-57'),('238','36','2','1','2016','2018-09-27 11-58-57'),('239','36','2','1','2016','2018-09-27 11-58-57'),('240','36','2','1','2016','2018-09-27 11-58-57') ";
//if($d=$db->exec("INSERT INTO marks (`studentId`, `score`, `term`, `examId`, `year`) VALUES (200,36,3,5,2015);")){
//    print_r($d);
//} else {
//    print_r($db->errorInfo());
//}
//    define('CLS', URL . 'api/cls/');
