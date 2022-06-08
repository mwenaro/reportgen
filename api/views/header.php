<!doctype html>
<html   ng-app="myApp" ng-cloak="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>lovely site</title>
        <!--Core Js libs-->
        <script src="<?php echo URL; ?>public/js/angular/angular.min.js" type="text/javascript"></script>
        <script src="<?php echo URL; ?>public/js/angular/angular-route.min.js" type="text/javascript"></script>
        <script src="<?php echo URL; ?>public/js/angular/angular-ui-router 1.0.js" type="text/javascript"></script>
        <script src="<?php echo URL; ?>public/js/jquery.js" type="text/javascript"></script>

        <!--App Js libs-->
        <script src="<?php echo URL; ?>public/js/app/js/app.js" type="text/javascript"></script>
        <script src="<?php echo URL; ?>public/js/app/js/app.controllers.js" type="text/javascript"></script>
        <script src="<?php echo URL; ?>public/js/app/js/app.trs.controller.js" type="text/javascript"></script>
        <script src="<?php echo URL; ?>public/js/app/js/app.services.js" type="text/javascript"></script>     
        <script src="<?php echo URL; ?>public/js/app/js/app.factories.js" type="text/javascript"></script>
        <script src="<?php echo URL; ?>public/js/app/js/app.routes.js" type="text/javascript"></script>

        <!--App stylesheets  -->
        <link href="<?php echo URL; ?>public/css/font-awesome.css" rel="stylesheet" type="text/css"/>
        <link href="<?php echo URL; ?>public/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <link rel="stylesheet" href="<?php echo URL; ?>public/css/default1.css"  type="text/css"/>    
        <link rel="stylesheet" href="<?php echo URL; ?>public/css/w3.css"  type="text/css"/>    
        <link rel="stylesheet" href="<?php echo URL; ?>public/css/styles.css"  type="text/css"/>  

        <!--/***********************************           buttton *******************************************/-->
<!--        <link href="../public/js/app/button/button.css" rel="stylesheet" type="text/css"/>
        <script src="../public/js/app/button/button.js" type="text/javascript"></script>-->

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
                position: fixed;
            }

           ul>button:hover, .nav  a:hover{
                background: red !important;
            }
            #main_nav{
                margin-bottom: 0px;
            }
            .main,.content,#big-Con{
                margin-top: 0px;
                padding: 0;
            }
/**********************************************************
   student page
/**********************************************************/
            #big-Con>*{
                font-size: 12px;
                
            }
/*            .inner_nav>button {
                line-height: 100%;
                padding: 4px;
                height:50px;
                padding: 0;
                margin-top: 3px !important;
                background-color: red;
                : #e3e3e3;
                

            }*/
            
/******************************************************/

        </style>

    </head>
    <body>
        <div class="w3-container" id="wrapper " style="margin-top:10px;">
            <?php Session::init(); ?>


           <?php                    //include "http://localhost/pro/qu/nav.php" ;?>
            <p>
                <a ui-sref="home">Home</a>|<a ui-sref="teacher">Home</a>|<a ui-sref="student">student</a>
            </p>
           <!--// <div ui-view></div>-->
            