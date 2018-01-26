/*
        Nathaniel V.R. Charlebois
        01/22/2018
        OO_leds
        Controls the interactions of the smart home LED lighting system.
        A component of the larger IoT DIY system.
*/

const NUM_LEDS = 60;
var ledArray = new Array(NUM_LEDS);
var colorSel = document.getElementById('colorSel');
const INIT = -1;
var previous = INIT;
const DEFAULT_COLOR = "#000000";

class ledButton {
    // The constructor encompasses function declarations
    // as they are bound to the instance.
    // This structure provides private object properties
    // where private data is captured in closures and thereby
    // inaccessible in other scopes.
    constructor( id ){
            let _id = id;
            let _active = false;
            let _pairs = [false,false];
            let _color = false;

        this.isActive = function(){
            return _active;
        }

        this.getColor = function(){
            return _color;
        }

        this.setActive = function(){
            _active = true;
        }

        this.getPairs = function(){
            return _pairs;
        }

        this.setPairs = function( set ){
            _pairs = set;
        }

        this.reset = function(){
            // Set the DOM button color
            var temp = document.querySelectorAll( '.round_button' );
            temp[_id].style.background = DEFAULT_COLOR;

            _active = false;
            _color = false;
            _pairs[0] = false;
            _pairs[1] = false;

        }

        this.setColor = function( value ){
            // Set private color
            _color = value;
            // Set the DOM button color
            var temp = document.querySelectorAll( '.round_button' );
            temp[_id].style.background = _color;

            _active = true;
        }

        this.getId = function(){
            return _id;
        }

        this.changeColor = function(){
            // Set the global previous led touched by the color selector
            previous = _id;
            ledArray[_id].setColor(this.value);
            ledArray[_id].findPair();
        }

        this.isClicked = function(){
            // Unbind the previous led touched by the color selector
            if(previous > INIT){
                colorSel.removeEventListener('change',ledArray[previous].changeColor);
            }

            // Initiate the color selector popup and color selection sequence
            colorSel.click();
            colorSel.addEventListener('change',ledArray[_id].changeColor);
        }


        this.findPair = function(){
            for(let i = 0; i < NUM_LEDS; i++){
                    if(i != _id){
                    var temp = ledArray[i];
                    if(temp.isActive()){
                        var check = temp.getPairs();
                        console.log('check: '+check[0]);
                        if(!check[0]){
                            console.log(i + ' should pair with '+ _id);

                            temp.setPairs([_id,false]);
                            this.setPairs([i,false]);
                            // Draw a gradient across the leds that exist
                            // between the pair
                            drawLedGradient( _id, i );
                            break;
                        } else {
                            // Paired use case
                            // Determine if
                            //      pair --- sel --- pair
                            //  or
                            //      sel --- pair --- pair
                            let pair = temp.getPairs();

                            console.log('anchor: '+_id+'\t target: '+pair[0]);
                            console.log('anchor: '+_id+'\t target: '+i);

                            drawLedGradient( _id, pair[0] );
                            drawLedGradient( _id, i );
                            break;
                        }
                    } else {
                        // Do nothing if the led is still in default state
                    }
                }
            }
        }
    }
};

function drawLedGradient( anchor, target ){
    console.log('DRAW anchor: '+anchor+'\t target: '+target);
    let offset = anchor - target;
    console.log('offset: '+offset);
    let grad = new GradientArray();
    let steps = Math.abs(offset)+1;
    var stepGradient;
    if(offset > 0){
        stepGradient = grad.generateGradient(ledArray[target].getColor()
            ,ledArray[anchor].getColor()
            ,steps);
    } else {
        stepGradient = grad.generateGradient(ledArray[anchor].getColor()
            ,ledArray[target].getColor()
            ,steps);
    }
    var gradientHelper = 0;
    var swapAnchor = anchor;
    var swapTarget = target;
    if(offset < 0){
        swapAnchor = target;
        swapTarget = anchor;
    }
    for(let i = swapTarget; i < swapAnchor;i++){
        ledArray[i].setColor(stepGradient[gradientHelper]);
        ledArray[i].setPairs([true,true]);
        gradientHelper++;
    }
    if(ledsSet()){
        postToServer();
    }

}

//Check if every LED is active
function ledsSet(){
    for(let i = 0; i<NUM_LEDS; i++){
        if(!ledArray[i].isActive()){
            return false;
        }
    }
    return true;
}

function postToServer(){
    console.log('Output to LEDS');
    let formData = "";
    let xml='<?xml version=1.0 encoding=UTF-8?>';
    let brightness = document.getElementById('brightness').value;
    for(let i=0;i<NUM_LEDS;i++){
        formData += i+"="+ledArray[i].getColor()+"&";
    }
    formData += "brightness="+brightness;
    formData = formData.replace(/#/g,'');
    let URI = 'http://192.168.0.100/php/leds.php?'+formData;

    console.log(formData);

    var request = new XMLHttpRequest();
    request.open("POST",URI,true);
    request.send(formData);

    console.log('LED Form submitted');
}

function buildLeds(){
    var container = document.getElementById('led_buttons');
    for(let i=0;i<NUM_LEDS;i++){

        var div = document.createElement('div');
        ledArray[i] = new ledButton( i );
        div.className = 'round_button';

        div.addEventListener("click",ledArray[i].isClicked);
        container.appendChild(div);
    }
}

function reset(){
    for(let i=0;i<NUM_LEDS;i++){
        ledArray[i].reset();
    }
}

window.onload = function() {
    buildLeds();
}
