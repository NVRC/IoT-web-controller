<?php
require_once("config.php");

$colorArray = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST'){
    // Handle AJAX cgi bin use case (COMMON)
    foreach($_POST as $key => $value){
        handlePair($key,$value);
    }
    $execString = 'python3 '.$config['paths']['cgi'].' '.$colorArray.' '.$brightness;
    shell_exec($execString);
} else {
    //  GET

    // Handle AJAX cgi bin use case (COMMON)
    foreach($_GET as $key => $value){
        handlePair($key,$value);
    }

    $execString = 'python3 '.$config['paths']['cgi'].' '.$colorArray.' '.$brightness;
    shell_exec($execString);
}
function handlePair($k,$v){
    if($k == 'brightness'){
        $brightness = $v;
    } else {
        $colorArray.=$v;
    }
}

?>
