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
    pushToDB($colorArray);
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
    pushToDB($colorArray);
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

function pushToDB($colorString){
    require_once("config.php");
    $dsn =  'mysql:host='.$config['db']['strips']['host']
            .';dbname='.$config['db']['strips']['dbname']
            .';charset='.$config['db']['strips']['charset'];
    $user = $config['db']['strips']['username'];
    $pass = $config['db']['strips']['password'];
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    try {
         $pdo = new PDO($dsn, $user, $pass, $options);
    } catch (\PDOException $e) {
         throw new \PDOException($e->getMessage(), (int)$e->getCode());
    }

    try {
        $pdo->beginTransaction();
        $tempNull = null;
        $stmt = $pdo->prepare('INSERT INTO colorStrips (colorString, 0 , ...) VALUES (:colorString, :occurences, ...)');
        bindParam(':occurences', $tempNull = NULL, PDO::PARAM_INT);
        $stmt->execute([$colorString]);
        $pdo->commit();
    }catch (Exception $e){
        $pdo->rollback();
        throw $e;
    }

}

?>
