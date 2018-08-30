<?php
require_once("config.php");

$colorArray = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST'){
    // Handle AJAX cgi bin use case (COMMON)
    for ($x = 0; $x < 60; $x++){
        $colorArray.$_POST[strval($x)];
    }
    exec("python3 .$config['paths']['cgi'] .$colorArray .$_POST['brightness']");

    // shell_exec('python3 '.$config['paths']['cgi'].$colorArray.' '.$_POST['brightness']);
} else {
    //  GET
    echo 'Whatcha tryna pull here? Huh?';
    // Handle AJAX cgi bin use case (COMMON)
    for ($x = 0; $x < 60; $x++){
        $colorArray.$_GET[strval($x)];
    }
    exec("python3 .$config['paths']['cgi'] .$colorArray .$_GET['brightness']");

    //shell_exec('python3 '.$config['paths']['cgi'].$colorArray.' '.$_POST['brightness']);
}

?>
