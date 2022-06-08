<?php

require 'config.php';
require 'util/Auth.php';


// Also spl_autoload_register (Take a look at it if you like)
//function __autoload($class) {
//    require LIBS . $class .".php";
//}
spl_autoload_register(function ($class) {
    require LIBS . $class .".php";
});

// Load the Bootstrap!
$bootstrap = new Bootstrap();

// Optional Path Settings
//$bootstrap->setControllerPath();
//$bootstrap->setModelPath();
//$bootstrap->setDefaultFile();
//$bootstrap->setErrorFile();

$bootstrap->init();
//header('location:'.URL.'login');