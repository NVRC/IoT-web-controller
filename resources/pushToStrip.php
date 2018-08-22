<?php

$colorArray = '';

if ($_SERVER[REQUEST_METHOD] == 'POST'){
    // Handle AJAX cgi bin use case (COMMON)
    for ($x = 0; $x <= 60; $x++){
        $colorArray.$_POST[strval($x)];
    }

    shell_exec('python3 setLedCmd.py '.$colorArray.' '.$_POST['brightness']);
} else {
    //  GET
    echo 'Whatcha tryna pull here? Huh?';

}

?>
