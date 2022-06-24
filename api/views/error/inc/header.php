<!doctype html>
<html>
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
            #wrapper{
                background: #eeeeee;
            }
        </style>
    </head>
    <body>

        <div id="wrapper">
            

