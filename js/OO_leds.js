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
var postedLedFlag = true;

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
            let _color = DEFAULT_COLOR;

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
            ledArray[_id].findNeighbors();
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
            if(leftPair instanceof ledButton){
                this.handleSide(leftPair);
            }
            if(rightPair instanceof ledButton){
                this.handleSide(rightPair);
            }
        }

        //Recursive branched search for neighbors
        this.searchForNeighbor = function( curr , dir ){
            let temp = ledArray[curr];
            if(temp.isActive() && _id != curr ){

                return temp;
            } else if(curr < NUM_LEDS - 1 && curr > 0){
                return this.searchForNeighbor(curr + dir, dir);
            } else {
                console.log('no neighbors');
                return false;
            }
        }


        this.handleSide = function( button ){
            let values = button.getPairs();
            let buttonId = button.getId();
            let grad = new GradientArray();

            let anchorButton = ledArray[_id];
            let stepGradient;

            // TODO: Reduce code duplication with prototype passing
            if(_id > buttonId){
                if ((typeof(values.left) == 'number') && (typeof(values.right) == 'number')){
                    button = ledArray[values.left];
                    values = button.getPairs();
                    buttonId = button.getId();
                }
                console.log('Left pair found. ID: '+buttonId);
                stepGradient = grad.generateGradient(ledArray[buttonId].getColor(),
                    ledArray[_id].getColor(),
                    _id - buttonId + 1);
                button.setPairs([values.left,_id]);
                anchorButton.setPairs([buttonId,anchorButton.getPairs().right]);
                let gradientCount = 1
                for (let k = buttonId + 1; k < _id; k++){
                    ledArray[k].setColor(stepGradient[gradientCount]);
                    ledArray[k].setPairs([buttonId,_id]);
                    gradientCount++;
                }

            } else {
                if (typeof(values.right) == 'number' && (typeof(values.left) == 'number')){
                    button = ledArray[values.right];
                    values = button.getPairs();
                    buttonId = button.getId();
                }
                console.log('Right pair found. ID: '+buttonId);
                stepGradient = grad.generateGradient(ledArray[_id].getColor(),
                    ledArray[buttonId].getColor(),
                    buttonId - _id + 1);
                button.setPairs([_id,button.getPairs().right]);
                anchorButton.setPairs([anchorButton.getPairs().left,buttonId]);
                let gradientCount = 1
                for (let k = _id + 1; k < buttonId; k++){
                    ledArray[k].setColor(stepGradient[gradientCount]);
                    ledArray[k].setPairs([_id,buttonId]);
                    gradientCount++;
                }
            }
            if(ledsSet() && postedLedFlag){
                postedLedFlag = false;
                postToServer();

            }
        }

    }
};


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
    let formData = new FormData();
    let xml='<?xml version=1.0 encoding=UTF-8?>';
    let brightness = document.getElementById('brightness').value;
    for(let i=0;i<NUM_LEDS;i++){
        //Remove Hashtags found in HTML element style.background values .replace(/#/g,'')
        formData.append(i, ledArray[i].getColor().toString().replace(/#/g,''));
    }
    formData.append("brightness",brightness);

    let URI = 'http://192.168.0.100/resources/pushToStrip.php?'+formData;

    //Instantiate an asynchronous POST request
    // TODO:  Bind XMLHttpRequest return eventListener to a bootstrap prompt
    var request = new XMLHttpRequest();
    request.onreadystatechange = postReturn;
    request.open("POST",URI,true);

    request.send(formData);

    console.log('LED Form submitted');
}

function postReturn(){
    console.log('POST returned');
    postedLedFlag = true;
}

function buildLeds(){
    let brightness = document.getElementById('brightness');
    brightness.addEventListener('change', brightnessListener);

    var container = document.getElementById('led_buttons');
    for(let i=0;i<NUM_LEDS;i++){
        var div = document.createElement('div');
        ledArray[i] = new ledButton( i );
        //Set classes to enable CSS
        div.className = 'round_button';
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

function brightnessListener(){
    postToServer();
}

function printPairs(){
    for (let i=0;i<NUM_LEDS;i++){
        values = ledArray[i].getPairs();
        console.log(i+': ['+values.left+','+values.right+']' );
    }
}

function printColorArray(){
    for(let i = 0; i < NUM_LEDS; i++){
        console.log(ledArray[i].getColor());
    }
}

window.onload = function() {
    buildLeds();
}

// ES6 compliant debounced handler
function debounced(delay, fn) {
  let timerId;
  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  }
}
