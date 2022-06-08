<!doctype html>
<html   ng-app="myApp" ng-cloak="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title><?= (isset($this->title)) ? $this->title : 'TSMS'; ?></title>
       
        <link rel="stylesheet" href="<?php echo URL; ?>public/css/w31.css" type="text/css"/>
        <link rel="stylesheet" href="<?php echo URL; ?>public/css/w31.css" type="text/css"/>
        <link rel="stylesheet" href="<?php echo URL; ?>public/css/default1.css"  type="text/css"/>    
        <link rel="stylesheet" href="<?php echo URL; ?>public/css/styles.css"  type="text/css"/>   
        <link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.17/themes/sunny/jquery-ui.css" />
        
        <link href="<?php echo URL; ?>public/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <link href="<?php echo URL; ?>public/css/font-awesome.css" rel="stylesheet" type="text/css"/>

        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js"></script>
        
        <script type="text/javascript" src="http://localhost/pro/js/angular.js"></script>
        <script type="text/javascript" src="http://localhost/sms/public/js/jquery.js"></script>
        <script src="<?php echo URL; ?>public/js/main_a1pp.js"></script>
        <script src="<?php echo URL; ?>public/js/app_data.js"></script>
        <?php
        if (isset($this->js)) {
            foreach ($this->js as $js) {
                echo '<script type="text/javascript" src="' . URL . 'views/' . $js . '"></script>';
            }
        }
        ?>
        <style>
            #wrapper{
                background: #eeeeee;
            }
        </style>

    </head>
    <body >
        <div class="" id="wrapper">
            <?php Session::init(); ?>

            <!--            <header id="header" >-->

            <nav class="navbar navbar-inverse">
                <div class="container-fluid">
                    <div class="navbar-header">
                        <!--<span class="w3-opennav w3-xlarge w3-black" onclick="w3_open()" style="margin-right: 20px;">☰</span>-->
                        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                  <!--                        <a class="navbar-brand" href="#"><?php //echo $this->title;   ?></a>-->
                    </div>
                    <ul class="nav navbar-nav">
                        <?php // if (Session::get('loggedIn') == false):  ?>
                        <li><a class="active" href="<?php echo URL; ?>index">Index</a></li>
                        <li><a href="<?php echo URL; ?>help">Help</a></li>
                        <li><a href="<?php echo URL; ?>login"><span class="fa fa-user">Login</span></a></li>
                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                        <li><a href="#"><span class="glyphicon glyphicon-user"></span> Sign Up</a></li>
                        <li><a href="#"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>

                        <?php // else: ?>    

                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                        <li><a href="<?php echo URL; ?>dashboard/logout">Logout</a></li>
                        <?php //endif; ?>
                    </ul>
                </div>
            </nav>
            <!--            </header>-->
<?php require_once INCLUDES.'leftbar.php';?>
           <nav class="nav side-nav " style="width:10%;display:none;">
                <div class="container-fluid">
                    <div class="nav-header">
                        <a href="javascript:void(0)" onclick="w3_close()" class="w3-closenav w3-large" style="margin-left:10%">Close ×</a>
                    </div>
                    <ul class="side-bar">
                        <?php //if (Session::get('loggedIn') == true): ?>
                        <li href='#' onhover="myFunction()" class="w3-dropdown-hover"> Student
                            <div class="w3-dropdown-hover">
                                <!--                        <button  class="w3-btn">Click Me</button>-->
                                <div id="Demo" class="w3-dropdown-content w3-card"
                                     <a href="<?php echo URL; ?>exam">Exams</a>
                                    <a href="<?php echo URL; ?>Results">Results</a>
                                    <a href="<?php echo URL; ?>user">Users</a>
                                    <a href="<?php echo URL; ?>student/studentsDashboard">StudentsDashboard</a>
                                </div>
                            </div>
                        </li> 
                        <li><a href="<?php echo URL; ?>dashboard">Dashboard</a></li>
                        <li><a href="<?php echo URL; ?>note">Notes</a></li>
                        <li><a href="<?php echo URL; ?>student/studentsDashboard">StudentsDashboard</a></li>
                        <li><a href="<?php echo URL; ?>teacher">Teachers</a></li>
                        <li><a href="<?php echo URL; ?>exam">Exams</a></li>
                        <li><a href="<?php echo URL; ?>Results">Results</a></li>
                        <li><a href="<?php echo URL; ?>user">Users</a></li>


                        <?php //if (Session::get('role') == 'developer'): ?>
                        <li><a href="<?php echo URL; ?>user">Users</a></li>
                        <?php //endif; ?>


                        <?php // endif; ?>
                    </ul>
                </div>
            </nav>
            <div class="main" style="">   
                <div id="content">

