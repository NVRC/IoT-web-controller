<?php
    // load up your config file
    require_once("resources/config.php");

    require_once(TEMPLATES_PATH . "/header.php");

    //  Bootstrap template permalink: http://bit.ly/2wvdWIM

?>

<div class="container-fluid">
	<div class="row">
		<div class="col-md-12">
			<div class="page-header">
				<h1>
					IoT <small>web controller</small>
				</h1>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-6" id="led_buttons" class="btn-group-vertical">
		</div>
		<div class="col-md-6">
			<div class="row">
				<div class="col-md-6" class="slidecontainer">
                    <input type="range" min="0" max="255" value="127" class="slider float-left" id="brightness">
				</div>
				<div class="col-md-6">
					<div class="row">
						<div class="col-md-6">
                            <button class="btn-default btn-lg float-left" type="button" id="reset" value="Reset" onclick="reset()">Reset</button>
						</div>
						<div class="col-md-6">
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
