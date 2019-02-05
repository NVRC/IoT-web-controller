<?php
/*** set the content type header ***/
header("Content-type: text/css");

// Test array of colors
function fetchColorPairs(){
    //  Format
    // 'id' => [ 'left' => 'hex', 'right' => 'hex' ]

    // TODO: Query SQL database and pull results dependant on sorting params
    // params passed by argument value
    return [
        '0' => [ 'left' => '#f2f2f2', 'right' => '#2f2f2f' ],
        '1' => [ 'left' => '#f2f2f2', 'right' => '#2f2f2f' ],
        '2' => [ 'left' => '#f2f2f2', 'right' => '#2f2f2f' ]
    ];

}

$colorPairArray = fetchColorPairs();
for($i = 0; $i < count($colorPairArray); $i++){
    // TODO: Add responsive sizing to the color gradient tiles
    echo '#grad'.$i.'{'.'background: linear-gradient(to right, '.$colorPairArray[$i]['left'].' 100%, '
        .$colorPairArray[$i]['right'].' 100%);'
        .'height: 100px;'
        .'width: 100px;'
        .'}';
}
?>
