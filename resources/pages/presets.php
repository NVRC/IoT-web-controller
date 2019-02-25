<?php
    // load up your config file
    require_once("../config.php");

    require_once(TEMPLATES_PATH . "/header.php");


?>
<link rel="stylesheet" href="/css/dynamicCSS.php" media="screen">
<!-- Fetch the number of elements -->

<table class="table table-hover">
    <thead>
        Most Common
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Color String</th>
          <th scope="col">Occurences</th>
          <th scope="col">Last Usage</th>
        </tr>
    </thead>
    <tbody>

    <?php

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
        //  Bootstrap template permalink: http://bit.ly/2wvdWIM
        $stmt = $pdo->query('SELECT * FROM (
            SELECT * FROM colorStrips ORDER BY record_id DESC LIMIT 10
            )   Var1
            ORDER BY last_usage DESC');
        while ($row = $stmt->fetch())
        {
            $colorStr = $row['color_string'];
            $colorStrLow = substr($colorStr,0,6);
            $colorStrHigh = substr($colorStr,-6,0);

            echo '<tr>'
                   .'<th scope="row">'.$row['record_id'].'</th>'
                   .'<td>'.$colorStrLow.' ... '.$colorStrHigh.'</td>
                    <td>'.$row['occurences'].'</td>
                    <td>'.$row['last_usage'].'</td>
                 </tr>';
        }


    ?>
    </tbody>
</table>


<?php
    require_once(TEMPLATES_PATH . "/footer.php");

?>
