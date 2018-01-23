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

class ledButton {
    // The constructor encompasses function declarations
    // as they are bound to the instance.
    // This structure provides private object properties
    // where private data is captured in closures and thereby
    // inaccessible in other scopes.
    constructor( id, self ){
            let _id = id;
            let _active = false;
            let _pair = false;
            let _color = false;
            let _self = self;

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

        this.setColor = function( value ){
            // Set private color
            _color = value;
            // Set the DOM button color
            var temp = document.querySelectorAll( '.round_button' );
            temp[_id].style.background = _color;

            _active = true;
        }


        this.findPair = function(){
            for(i = 0; i < NUM_LEDS; i++){
                    if(i != _id){
                    var temp = ledArray[i];
                    if(temp.isActive()){
                        if(temp.getPair() > INIT){
                            console.log(i + ' should pair with '+ _id);

                            temp.setPair(_id);
                            this.setPair(i);
                            // Draw a gradient across the leds that exist
                            // between the pair
                            drawLedGradient( _id, i );
                        } else {
                            console.log(i+' is not paired.');
                        }
                    }
                }
            }
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
    }
};

function drawLedGradient( anchor, found ){
    let offset = anchor - found;
    let grad = new GradientArray();
    let steps = Math.abs(offset)+1;
    var stepGradient;
    if(offset > 0){
        stepGradient = grad.generateGradient(ledArray[found].getColor()
            ,ledArray[anchor].getColor()
            ,steps);
    } else {
        stepGradient = grad.generateGradient(ledArray[anchor].getColor()
            ,ledArray[found].getColor()
            ,steps);
    }
    var gradientHelper = 0;
    for(i = found+1; i < anchor;i++){
        ledArray[i].setColor(stepGradient[gradientHelper]);
        gradientHelper++;
    }
}

function buildLeds(){
    var container = document.getElementById('led_buttons');
    for(i=0;i<NUM_LEDS;i++){

        var div = document.createElement('div');
        ledArray[i] = new ledButton( i, div );
        div.className = 'round_button';

        div.addEventListener("click",ledArray[i].isClicked);
        container.appendChild(div);
    }
}

window.onload = function() {
    buildLeds();
}
