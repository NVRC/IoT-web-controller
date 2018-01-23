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
const DEFAULT_COLOR = "#ffffff";

class ledButton {
    // The constructor encompasses function declarations
    // as they are bound to the instance.
    // This structure provides private object properties
    // where private data is captured in closures and thereby
    // inaccessible in other scopes.
    constructor( id ){
            let _id = id;
            let _active = false;
            let _pair = false;
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

        this.getPair = function(){
            
            return _pair;
        }

        this.setPair = function( id ){
            _pair = id;
        }

        this.reset = function(){
            // Set the DOM button color
            var temp = document.querySelectorAll( '.round_button' );
            temp[_id].style.background = DEFAULT_COLOR;

            _active = false;
            _color = false;
            _pair = false;

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
                        console.log(temp.getPair());
                        if(!temp.getPair()){
                            console.log(i + ' should pair with '+ _id);

                            temp.setPair(_id);
                            this.setPair(i);
                            // Draw a gradient across the leds that exist
                            // between the pair
                            drawLedGradient( _id, i );
                        } else {
                            // Paired use case
                            // Determine if
                            //      pair --- sel --- pair
                            //  or
                            //      sel --- pair --- pair
                            let pair = temp.getPair();
                            console.log('anchor: '+_id+'\t target: '+pair);
                            console.log('anchor: '+_id+'\t target: '+i);
                            drawLedGradient( _id, pair );
                            drawLedGradient( _id, i );
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
    for(let i = swapTarget+1; i < swapAnchor;i++){
        ledArray[i].setColor(stepGradient[gradientHelper]);
        ledArray[i].setPair(true);
        gradientHelper++;


    }
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
