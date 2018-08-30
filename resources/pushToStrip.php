<?php
require_once("config.php");

$colorArray = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST'){
    // Handle AJAX cgi bin use case (COMMON)
    for ($x = 0; $x < 60; $x++){
        $colorArray.$_POST[strval($x)];
    }
    //exec("python3 .$config['paths']['cgi'] .$colorArray .$_POST['brightness']");

    echo shell_exec('python3 '.$config['paths']['cgi'].' '.$colorArray.' '.$_POST['brightness']);
} else {
    //  GET
    $colorArray ='';
    // Handle AJAX cgi bin use case (COMMON)
    for ($x = 0; $x < 60; $x++){
        $colorArray.$_GET[strval($x)];
    }
    //exec("python3 .$config['paths']['cgi'] .$colorArray .$_GET['brightness']");
    echo $colorArray;
    echo $_GET['brightness'];
    echo shell_exec('python3 '.$config['paths']['cgi'].' '.$colorArray.' '.$_GET['brightness']);
}

?>
