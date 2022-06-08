<?php
define('app_URL', 'http://127.0.0.1:7173/');
////require_once 'api/config.php';
//require_once 'api/database.exten.php';
//require_once 'api/insert-cls-db-exten.php';
//
//if (!empty($_POST)):
//
//    $mk = $_POST['mk'];
//    //var_dump($mk);
//    $keys = ['term', 'form', 'examId', 'subjects', 'year', 'students'];
//    foreach ($keys as $key) {
//        $$key = array_key_exists($key, $mk) ? $mk[$key] : '';
//    }
//
//    $m = new Database('sqlite');
////    $m = new Multi_Insert();
//    $data = $m->process_mks($mk);
//    //var_dump($data);
//    //exit();
//
//    $r = [];
//
//    $r[] = $m->insertMany("marks", $data);
////    foreach ($data as $value) {
////      $r[]=  $m->insert('marks', $value);
////    }
//    var_dump($r);
//    //$f=!empty($r)?r[0]:'';
////    $table='marks';
////    $f = $m->insertMany($table,$mk);
//
//
//endif;
?>

<!doctype html>
<html   ng-app="myApp" ng-cloak="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>lovely site</title>
        <!--Core Js libs-->
        <script src="<?php echo app_URL; ?>public/js/angular/angular.min.js" type="text/javascript"></script>
        <script src="<?php echo app_URL; ?>public/js/angular/angular-route.min.js" type="text/javascript"></script>
        <script src="<?php echo app_URL; ?>public/js/angular/angular-ui-router 1.0.js" type="text/javascript"></script>
        <script src="<?php echo app_URL; ?>public/js/angular/ngStorage.min.js" type="text/javascript"></script>
        <script src="<?php echo app_URL; ?>public/js/jquery.js" type="text/javascript"></script>

        <!--App Js libs-->
        <script src="<?php echo app_URL; ?>app/js/app.js" type="text/javascript"></script>
        <script src="<?php echo app_URL; ?>app/js/app-routes.js" type="text/javascript"></script>
         <!--<script src="<?php // echo app_URL;  ?>app/js/app-config.js" type="text/javascript"></script>--> 
        <!--<script src="<?php // echo app_URL;  ?>app/js/app-session-service.js" type="text/javascript"></script>-->
        <script src="<?php echo app_URL; ?>app/js/app-controllers.js" type="text/javascript"></script>
        <script src="<?php echo app_URL; ?>app/js/app-trs-controller.js" type="text/javascript"></script>
        <script src="<?php echo app_URL; ?>app/js/app-services.js" type="text/javascript"></script>     
        <script src="<?php echo app_URL; ?>app/js/app-more-ctrls.js" type="text/javascript"></script>
        <script src="<?php echo app_URL; ?>app/js/app-data-services.js" type="text/javascript"></script>     
        <!--<script src="<?php echo app_URL; ?>app/js/app-login-services.js" type="text/javascript"></script>-->       
        <script src="<?php echo app_URL; ?>app/js/app-factories.js" type="text/javascript"></script>
        <!--<script src="<?php //echo app_URL;  ?>app/js/app-jq-post.js" type="text/javascript"></script>-->


        <!--App stylesheets  -->
        <link href="<?php echo app_URL; ?>public/css/font-awesome.css" rel="stylesheet" type="text/css"/>
        <link href="<?php echo app_URL; ?>public/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <link rel="stylesheet" href="<?php echo app_URL; ?>public/css/default1.css"  type="text/css"/>    
        <link rel="stylesheet" href="<?php echo app_URL; ?>public/css/w3.css"  type="text/css"/>    
        <link rel="stylesheet" href="<?php echo app_URL; ?>public/css/styles.css"  type="text/css"/>  

        <!--/***********************************           buttton *******************************************/-->
        <!--        <link href="../public/js/app/button/button.css" rel="stylesheet" type="text/css"/>
                <script src="../public/js/app/button/button.js" type="text/javascript"></script>-->


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

            #nav_inner ul,button{
                height: 26px;
                line-height: 1.5;

            }
            #nav_inner ul{
                padding: 2px;
            }

            .page_title{
                text-align: center;
                margin: 0;
                padding: 0;
            }

            #include_contaier{
                background: #e3e3e3;
            }

            form >div{
                margin: 0px;
            }

        </style>

    </head>
    <body>
        <div class="w3-container" id="wrapper " style="margin-top:10px;">

            <nav class="navbar navbar-inverse" id="main_nav" >
                <div class="container-fluid">
                    <!--*****************   not loogedIn***********************-->
                    <ul class="nav navbar-nav navbar-right">

                        <li><a ui-sref="help">Help</a></li>
                        <li><a ui-sref="user({userId:'mwero'})"><span >user</span></a></li>
                        <!--//<li><a ui-sref="login"><span class="fa fa-sign-in">login</span></a></li>-->
                    </ul>

                    <!--*****************    loogedIn***********************-->
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                        <a class="navbar-brand" ui-sref="home"><span class="fa fa-dashboard" style="margin-right:10px"> Mwero's ReportGen</a>
                    </div>
                    <ul class="nav navbar-nav">
                        <li class="active"><a  ui-sref="home"><span class="fa fa-home w3-xlarge" style="margin-right:10px"></a></li>
                        <!--<li><a ui-sref="student">Students</a></li>-->
                        <li class="w3-dropdown-hover">
                            <a ui-sref="student">Students </a>

                        </li>
                        <li><a ui-sref="teacher">Teachers</a></li>
                        <li><a ui-sref="mark">Marks</a></li>
                        <li><a ui-sref="subject">Subjects</a></li>
                        <li><a ui-sref="report">Reports</a></li>
                    </ul>

                    <ul class="nav navbar-nav navbar-right">
                        <li><a ui-sref="logout">Logout</a></li>
                        <li><a class="" ui-sref="admin">Admin</a></li>
                    </ul>
                    <!--*****************    loogedIn***********************-->

                </div>
            </nav>

            <?php // include "http://localhost/pro/qu/nav.php";     ?>
            <div class="w3-container main" id="main">

                <div ui-view></div>
            </div>
            <!--</div> End of div.content//

</div> End of div.main//-->

            <footer id="footer"class="w3-teal w3-round w3-container" >

                (C) Footer


            </footer>


        </div> <!--//End of div.containter//--->



        <!--Jquery-->

        <?php if (2 === 3): ?>
            <script src="../public/js/jquery.js" type="text/javascript"></script>
            <script src="<?php echo app_URL; ?>public/js/jquery/jquery-2.2.4.min.js"></script>
            <script src="<?php echo app_URL; ?>public/js/bootstrap/bootstrap.min.js"></script>

        <?php endif; ?>



        <script>
    $('document').ready(function () {

        $('#btnYetu').click(function () {

            if (!$('#formSelect').val() == '') {
                $('#disgo').css('display', 'block');
                // $('tblMarks').attr('id','appear');
                //$('tblMarks').css('display', 'block');
            } else
            {
                //                $('#tbl-marks').css('display', 'none');
            }
        });
    });

        </script>



    </body>

</html>