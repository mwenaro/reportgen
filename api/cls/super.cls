<?php
require_once '../config.php';
require_once '../inc_file.php';
class DbLink {
    function __construct() {
        $this->db = new Database('sqlite', DB_PATH);
        echo 'supper here';
    }
}

new DbLink();