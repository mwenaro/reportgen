<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$db_init_vars = [
    'dateCreated' => date("Y-m-d H:i:s"),
    'creatorId' => Session::get('isLoggedIn') ? Session::get('userId') : 1,
    
];
