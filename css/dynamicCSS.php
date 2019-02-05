<?php
/*** set the content type header ***/
header("Content-type: text/css");

function randColor() {
    return '#' . str_pad(dechex(mt_rand(0, 0xFFFFFF)), 6, '0', STR_PAD_LEFT);
}
// Test array of colors
function fetchColorPairs(){
    //  Format
    // 'id' => [ 'left' => 'hex', 'right' => 'hex' ]

    // TODO: Query SQL database and pull results dependant on sorting params
    // params passed by argument value
    return [
        '0' => [ 'left' => randColor(), 'right' => randColor() ],
        '1' => [ 'left' => randColor(), 'right' => randColor() ],
        '2' => [ 'left' => randColor(), 'right' => randColor() ]
    ];

}

$colorPairArray = fetchColorPairs();
for($i = 0; $i < count($colorPairArray); $i++){
    // TODO: Add responsive sizing to the color gradient tiles
    echo '#grad'.$i.'{'.'background: linear-gradient(to right, '.$colorPairArray[$i]['left'].' 0%, '
        .$colorPairArray[$i]['right'].' 100%);'
        .'height: 100px;'
        .'width: 100px;'
        .'}';
}
?>
