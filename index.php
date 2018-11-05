<?php
    // load up your config file
    require_once("resources/config.php");

    require_once(TEMPLATES_PATH . "/header.php");

    //  Bootstrap template permalink: http://bit.ly/2wvdWIM

?>

	<div class="flex-row">
		<div class="col-sm-2 col-md-2 col-lg-2" id="led_buttons">
		</div>
		<div class="col-sm-10 col-md-10 col-lg-10">
			<div class="row">
				<div class="col-sm-5 col-md-5 col-lg-5" class="slidecontainer">
                    <input type="range" min="0" max="255" value="127" class="slider float-left" id="brightness">
				</div>
				<div class="col-sm-5 col-md-5 col-lg-5">
                    <button class="" type="button" id="reset" value="Reset" onclick="reset()">Reset</button>
                    <div class="form-group">
                        <label for="input-animation">State</label>
                            <select id="input-animation" class="form-control">
                                <option selected value="0">Static</option>
                                <option value="1">Cycle</option>
                            </select>
                        <label for="Rate">Rate (ms)</label>
                        <input type="number" class="form-control" value="1000" id="input-rate">
                    </div>
				</div>
			</div>
		</div>
        <div id="picker_wrapper">
            <div id="picker" class="cp-default"></div>
            <div id="picker_indicator">
        </div>
        <div id="slider_wrapper">
            <div id="slider"></div>
            <div id="slider-indicator"></div>
        </div>
        <input type="color" id="colorSel" name="colorSel">
	</div>
</div>


<script src="js/gradient-min.js"></script>
<script src="js/OO_leds.js"></script>

<?php
    require_once(TEMPLATES_PATH . "/footer.php");

?>
