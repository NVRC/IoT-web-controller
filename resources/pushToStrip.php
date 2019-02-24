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
        $stmt = $pdo->prepare('SELECT FROM colorStrings WHERE color_string=?');
        $stmt->execute([$colorString]);
        $dataSet = $stmt->fetchAll();

        $currDate = date('Y-m-d H:i:s');

        if(empty($dataSet)){
            // INSERT INTO DB
            $stm = $pdo->prepare('INSERT INTO colorStrings (color_string,
                occurences,
                last_usage) values (?, 1, ?)');

            $stm->execute([$colorString, $currDate]);
        } else {
            $occurences = $dataSet[0]['occurences'] + 1;
            $stm = $pdo->prepare('UPDATE colorStrings SET occurences=?,
                last_usage=?
                WHERE color_string=?');
            $stm->execute([$occurences, $currDate, $colorString ]);
        }
        $pdo->commit();
    }catch (Exception $e){
        $pdo->rollback();
        throw $e;
    }

}

?>
