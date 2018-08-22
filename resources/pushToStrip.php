<?php

$colorArray = '';
// Handle AJAX cgi bin use case (COMMON)
for ($x = 0; $x <= 60; $x++){
    $colorArray.$_POST[strval($x)];
}

echo shell_exec('python3 setLedCmd.py '.$colorArray.' '.$_POST['brightness']);

if ($_SERVER[REQUEST_METHOD] == 'POST'){

} else {
    //  GET
    echo 'Whatcha tryna pull here? Huh?';

}

?>
