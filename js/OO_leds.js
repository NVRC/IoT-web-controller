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
            return {
                left: _pairs[0],
                right: _pairs[1]
            };
        }

        this.setPairs = function( duple ){
            _pairs = duple;
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
            let temp = document.querySelectorAll( '.round_button' );
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

        this.findNeighbors = function(){
            // Start recursive search for neighbor
            //Ternary operators used as boundary conditions
            let leftPair = this.searchForNeighbor( (_id - 1 >= 0) ? _id - 1 : _id, -1);
            let rightPair = this.searchForNeighbor((_id + 1) < NUM_LEDS ? _id + 1 : _id, 1);
            console.log(leftPair);
            console.log(rightPair);
            if(leftPair instanceof ledButton){
                this.handleSide(leftPair, 'left');
            }
            if(rightPair instanceof ledButton){
                this.handleSide(rightPair, 'right');
            }
        }

        this.handleSide = function( button , type){
            let values = button.getPairs();
            let pair = button.getId();
            //TODO: Reduce duplicate code (prototype passing?)
            if(type == 'left'){
                console.log('Values.right: '+ typeof(values.right));
                if(typeof(values.right) == 'number'){
                    let duple = [_id, ledArray[values.right].getPairs().right];
                    console.log('Duple :'+duple);
                    drawLedGradient( _id, values.right, duple);
                    //TODO: Set pairs here
                    duple = [values.left,_id];
                    console.log('Duple :'+duple);
                    button.setPairs(duple);
                    drawLedGradient( _id, pair, duple);

                } else if (!values.right){
                    this.setPairs([pair, this.getPairs().right]);
                    let duple = [values.left,_id];
                    button.setPairs(duple);
                    drawLedGradient( _id, pair, duple);
                }
            } else if(type == 'right'){
                if(typeof(values.left) == 'number'){
                    console.log('Values.left: '+ values.left);
                    let duple = [_id, ledArray[values.left].getPairs().left];
                    drawLedGradient( _id, values.left, duple );
                    duple = [values.left,_id];
                    button.setPairs(duple);
                    //TODO: Set pairs in handleSide
                    drawLedGradient( _id, pair, duple);
                } else if (!values.left){
                    let duple = [_id, values.right];
                    button.setPairs(duple);
                    drawLedGradient( _id, pair, duple);
                }
            }
        }


        //Recursive branched search for neighbors
        this.searchForNeighbor = function( curr , dir ){
            let temp = ledArray[curr];
            if(ledArray[curr].isActive() && _id != curr){
                return temp;
            } else if(curr < NUM_LEDS - 1 && curr > 0){
                return this.searchForNeighbor(curr + dir, dir);
            } else {
                console.log('no neighbors');
                return false;
            }
        }



        this.findPair = function(){
            this.findNeighbors();
        }
    }
};

function drawLedGradient( anchor, target, pairs ){
    console.log('DRAW anchor: '+anchor+'\t target: '+target);
    let offset = anchor - target;
    console.log('offset: '+offset);
    let grad = new GradientArray();
    let steps = Math.abs(offset)+1;
    let swapAnchor = anchor;
    let swapTarget = target;
    var stepGradient;
    if(offset > 0){
        stepGradient = grad.generateGradient(ledArray[target].getColor()
            ,ledArray[anchor].getColor()
            ,steps);
    } else {
        stepGradient = grad.generateGradient(ledArray[anchor].getColor()
            ,ledArray[target].getColor()
            ,steps);
            swapAnchor = target;
            swapTarget = anchor;
    }
    var gradientHelper = 0;
    for(let i = swapTarget; i < swapAnchor; i++){
        ledArray[i].setColor(stepGradient[gradientHelper]);
        ledArray[i].setPairs(pairs);
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
    let formData = new FormData();
    let xml='<?xml version=1.0 encoding=UTF-8?>';
    let brightness = document.getElementById('brightness').value;
    for(let i=0;i<NUM_LEDS;i++){
        //Remove Hashtags found in HTML element style.background values .replace(/#/g,'')
        formData.append(i, ledArray[i].getColor());
    }
    formData.append("brightness",brightness);

    let URI = 'http://192.168.0.100/cgi-bin/setLEDs.py?'+formData;

    console.log(formData);

    //Instantiate an asynchronous POST request
    // TODO:  Bind XMLHttpRequest return eventListener to a bootstrap prompt
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
        //Set classes to enable CSS
        div.className = 'round_button btn';
        //Bind the LEDs button click listener
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
