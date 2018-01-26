<?php
    $NUM_LEDS = 60;

        if(isset($_POST)){
            error_log('$_GET: '.var_dump($_POST));
            for($i=0; $i<$NUM_LEDS+1; $i++){
                $colors[$i] = $_POST[$i];
                $colorString = $colorString.$_POST[$i].' ';
            }

            error_log("colorString: ".$colorString);
            //chdir($python);
            //$command = escapeshellcmd('sudo python led_output.py '.$colorString);
            //$output = shell_exec($command);
            exec('sudo python2 /var/www/IoT-web-controller/python/support/nLevelLinearGradient.py '.$colorString);

            //chdir($currDir);

        } else {
            echo "No array of colors sent!";
        }


    //Node.js would be a good alternative to this tedious php workflow





    //error_log(implode("|",$_SERVER),0);

    //$command = escapeshellcmd('python /var/www/led-web-controller/python/led_output.py ');
    //$output = shell_exec($command);
    /*
    for($i = 0; $i < $NUM_LEDS; $i++){
        $colorArray[] = $_POST[$i];
    }
    */




?>
