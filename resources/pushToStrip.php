<?php
require_once("config.php");

$colorArray = '';
$brightness;

if ($_SERVER['REQUEST_METHOD'] == 'POST'){
    // Handle AJAX cgi bin use case (COMMON)
    foreach($_POST as $key => $value){
        handlePair($key,$value,$colorArray,$brightness);
    }
    $execString = 'python3 '.$config['paths']['cgi'].' '.$colorArray.' '.$brightness;
    echo "python exec string: ".$execString;
    $str = shell_exec($execString);
    echo $str;
} else {
    //  GET

    // Handle AJAX cgi bin use case (COMMON)
    foreach($_GET as $key => $value){
        echo "key: ".$key."     value: ".$value;
        handlePair($key,$value,$colorArray,$brightness);
    }
    echo "colorArray: ".$colorArray."\n";
    $execString = 'python3 '.$config['paths']['cgi'].' '.$colorArray.' '.$brightness;
    echo "python exec string: ".$execString."\n";
    $str = shell_exec($execString);
    echo $str;
}
function handlePair($k,$v,&$src,&$btr){
    if($k == 'brightness'){
        $btr = $v;
    } else {
        $src.=$v;

    }
}

?>
