<?php
require_once 'config.php';
require_once 'inc_file.php';
require_once  CTRLS . 'login' .".php";
$login=new Login();
$login->isLoggedIn();
