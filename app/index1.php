<?php /* require 'config.php'; */ define('app_URL', 'http://127.0.0.1:7173/') ?>
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
        <script src="<?php echo app_URL; ?>public/js/jquery.js" type="text/javascript"></script>

        <!--App Js libs-->
        <script src="<?php echo app_URL; ?>app/js/app.js" type="text/javascript"></script>
        <script src="<?php echo app_URL; ?>app/js/app-routes.js" type="text/javascript"></script>
        <script src="<?php echo app_URL; ?>app/js/app-controllers.js" type="text/javascript"></script>
        <script src="<?php echo app_URL; ?>app/js/app-trs-controller.js" type="text/javascript"></script>
        <script src="<?php echo app_URL; ?>app/js/app-services.js" type="text/javascript"></script>     
        <script src="<?php echo app_URL; ?>app/js/app-data-services.js" type="text/javascript"></script>     
        <script src="<?php echo app_URL; ?>app/js/app-factories.js" type="text/javascript"></script>
        

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
            <header ui-view="header">
            
            </header>
            
            <?php // include "http://localhost/pro/qu/nav.php"; ?>
            
            <div class="w3-container main" id="main" ui-view="main">

<!--                <div ui-view></div>-->
                </div>
                    <!--</div> End of div.content//
        
        </div> End of div.main//-->

                    <footer id="footer"class="w3-teal w3-round w3-container" ui-view="footer">
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