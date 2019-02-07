<?php
    // load up your config file
    require_once("../config.php");

    require_once(TEMPLATES_PATH . "/header.php");


?>
<link rel="stylesheet" href="/css/dynamicCSS.php" media="screen">
<!-- Fetch the number of elements -->

<table class="table table-hover">
    <thead>
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
        $user = $config['db']['strips']['host'];
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
            SELECT * FROM yourTableName ORDER BY id DESC LIMIT 10
            )   Var1
            ORDER BY id ASC');
        while ($row = $stmt->fetch())
        {
            generateTableRow($row['id'], $row['color_string'], 0, 0);
        }

        function generateTableRow($id, $colorString, $occurences, $lastUsage){
            echo '<tr>';
            echo '<th scope="row">'.$id.'</th>';
            echo '<td>'.$colorString.'</td>
                    <td>NULL</td>
                    <td>NULL</td>
                    </tr>';
        }
    ?>
    </tbody>
</table>


<?php
    require_once(TEMPLATES_PATH . "/footer.php");

?>
