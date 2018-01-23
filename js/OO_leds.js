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
var previous = -1;

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

            // Set the global previous led touched by the color selector
            previous = _id;
            //ledArray[_id].findPair();
        }

        this.findPair = function(){
            for(i = 0; i < NUM_LEDS; i++){
                var temp = ledArray[i];
                console.log(temp.isActive());
                if(temp.isActive()){
                    console.log('temp '+temp.getPair());
                    temp.setPair(12);
                    console.log('temp '+ temp.getPair());
                    temp.setPair(false);

                    if(!temp.getPair()){
                        console.log(_id+' is not paired.');
                    }
                }
            }
        }



        this.getId = function(){
            return _id;
        }

        this.changeColor = function(){
            console.log('changeColor() this.getId()'+this);
            console.log('changeColor() id: '+_id);
            ledArray[_id].setColor(this.value);
        }

        this.isClicked = function(){
            // Unbind the previous led touched by the color selector
            if(previous > -1){
                colorSel.removeEventListener('change',ledArray[previous].changeColor);
            }

            // Initiate the color selector popup and color selection sequence
            colorSel.click();
            console.log('isClicked() id: '+_id);
            colorSel.addEventListener('change',ledArray[_id].changeColor);
        }
    }
};

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
