<?php
    // load up your config file
    require_once("resources/config.php");

    require_once(TEMPLATES_PATH . "/header.php");

    //  Bootstrap template permalink: http://bit.ly/2wvdWIM

?>

	<div class="row">
		<div class="col-sm-12 col-md-12 col-lg-12" id="led_buttons">
		</div>
		<div class="col-sm-6 col-md-6 col-lg-6">
			<div class="row">
				<div class="col-sm-6 col-md-6 col-lg-6" class="slidecontainer">
                    <input type="range" min="0" max="255" value="127" class="slider float-left" id="brightness">
				</div>
				<div class="col-sm-6 col-md-6 col-lg-6">
					<div class="row">
						<div class="col-sm-6 col-md-6 col-lg-6">
                            <button class="" type="button" id="reset" value="Reset" onclick="reset()">Reset</button>
						</div>
						<div class="col-sm-6 col-md-6 col-lg-6">
                            Blank Button
						</div>
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


<script src="https://stackpath.bootstrapcdn.com/bootswatch/4.1.2/lux/bootstrap.min.css"></script>
<script src="js/gradient-min.js"></script>
<script src="js/OO_leds.js"></script>

<?php
    require_once(TEMPLATES_PATH . "/footer.php");

?>
