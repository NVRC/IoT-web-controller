<?php
require_once("config.php");

$colorArray = '';
$brightness;
$animation;
$rate;

if ($_SERVER['REQUEST_METHOD'] == 'POST'){
    // Handle AJAX cgi bin use case (COMMON)
    foreach($_POST as $key => $value){
        handlePair($key,$value,$colorArray,$brightness,$animation,$rate);
    }
    $execString = 'python3 '.$config['paths']['cgi'].' '.$colorArray.' '.$brightness.' '.$animation.' '.$rate;
    echo "python exec string: ".$execString;
    $str = shell_exec($execString);
    echo $str;
} else {
    //  GET

    // Handle AJAX cgi bin use case (COMMON)
    foreach($_GET as $key => $value){
        echo "key: ".$key."     value: ".$value;
        handlePair($key,$value,$colorArray,$brightness,$animation,$rate);
    }
    $execString = 'python3 '.$config['paths']['cgi'].' '.$colorArray.' '.$brightness.' '.$animation.' '.$rate;
    echo "python exec string: ".$execString;
    $str = shell_exec($execString);
    echo $str;
}
function handlePair($k,$v,&$src,&$btr,&$anim,&$rt){
    if($k == 'brightness'){
        $btr = $v;
    } else if ($k == 'animation'){
        $anim = $v;
    } else if ($k == 'rate'){
        $rt = $v;
    } else {
        $src.=$v;

    }
}

?>
