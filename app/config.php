<?php

// Always provide a TRAILING SLASH (/) AFTER A PATH
if (!defined('URL')) {
    define('URL', 'http://127.0.0.1:7173/');
}
//define('URL', realpath(dirname(__DIR__).'/sms/'));
if (!defined('SITE_NAME')) {
    define('SITE_NAME', 'sms');
}

if (!defined('LIBS')) {
    define('LIBS', 'libs/');
}
//define('LIBS', URL.'libs/');
if (!defined('CTRLS')) {
    define('CTRLS', 'controllers/');
}
//define('CTRLS', URL.'controllers/');
if (!defined('PATH_VIEWS')) {
    define('PATH_VIEWS', URL . 'views/');
}
if (!defined('CLS')) {
    define('CLS', URL . 'cls/');
}
if (!defined('INCLUDES')) {
    define('INCLUDES', URL . 'views/includes/');
}
if (!defined('DB_PATH')) {
    define("DB_PATH", realpath("resources/shule.sqlite3"));
}
if (!defined('DB_NAME')) {
    define("DB_NAME", realpath("resources/shule.sqlite3"));
}


