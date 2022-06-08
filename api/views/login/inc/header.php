<!doctype html>
<html   ng-app="myApp" ng-cloak="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title><?= (isset($this->title)) ? $this->title : 'TSMS'; ?></title>

        <script src="<?php echo URL; ?>public/js/angular.min.js" type="text/javascript"></script>
        <script src="<?php echo URL; ?>public/js/jquery.js" type="text/javascript"></script>
        <script src="<?php echo URL; ?>public/js/app_data.js" type="text/javascript"></script>

        <link href="<?php echo URL; ?>public/css/font-awesome.css" rel="stylesheet" type="text/css"/>
        <link href="<?php echo URL; ?>public/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <link rel="stylesheet" href="<?php echo URL; ?>public/css/default1.css"  type="text/css"/>    
        <link rel="stylesheet" href="<?php echo URL; ?>public/css/w3.css"  type="text/css"/>    
        <link rel="stylesheet" href="<?php echo URL; ?>public/css/styles.css"  type="text/css"/>  



        <?php
        if (isset($this->js)) {
            foreach ($this->js as $js) {
                echo '<script type="text/javascript" src="' . URL . 'views/' . $js . '"></script>';
            }
        }
        ?>
        <style>
           body{
                background: #ccc;
            }
            
         .nav   a:hover,a:active{
                background: red !important;
            }
            
        </style>

    </head>
    <body >
        <div class="w3-container" id="wrapper " style="margin-top:20px;">
            <?php Session::init(); ?>
            
            <!-- <top Nav>-->
            <nav class="navbar navbar-inverse" style="display:none">
                <div class="container-fluid">
                    <?php if (Session::get('loggedIn') == false): ?>
                        <ul class="nav navbar-nav navbar-right">

                            <li><a href="<?php echo URL; ?>help">Help</a></li>
                            <li><a href="<?php echo URL; ?>login"><span class="fa fa-sign-in">Login</span></a></li>
                        </ul>

                    <?php else: ?>  
                        <div class="navbar-header">
                            <!--<span class="w3-opennav w3-xlarge w3-black" onclick="w3_open()" style="margin-right: 20px;">â˜°</span>-->
                            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                            </button>
                            <a class="navbar-brand" href="<?php echo URL; ?>dashboard/dashboard1"><span class="fa fa-dashboard" style="margin-right:10px"><?php // echo' ' . $this->title; ?> Mwero's ReportGen</a>
                        </div>
                        <ul class="nav navbar-nav">
                            <li class="active"><a  href="<?php echo URL; ?>dashboard/dashboard"><span class="fa fa-home w3-xlarge" style="margin-right:10px"></a></li>
                            <li><a href="<?php echo URL; ?>student/index">Students</a></li>
                            <li><a href="<?php echo URL; ?>teacher/index">Teachers</a></li>
                            <li><a href="<?php echo URL; ?>mark/index">Marks</a></li>
                            <li><a href="<?php echo URL; ?>subject/index">Subjects</a></li>
                            <li><a href="<?php echo URL; ?>report/index">Reports</a></li>
                        </ul>

                        <ul class="nav navbar-nav navbar-right">
                            <li><a href="<?php echo URL; ?>dashboard/logout">Logout</a></li>
                            <li><a class="" href="<?php echo URL; ?>admin/index">Admin</a></li>
                        </ul>
                    <?php endif; ?>

                </div>
            </nav>
              <!-- </top Nav>-->

            <!--            <header id="header" >-->

            
            <!--            </header>-->
            <!--// Left Nav Bar-->

            <div class="main" style="">   
                <div id="content">

