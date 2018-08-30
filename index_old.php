<?php
    // load up your config file
    require_once("resources/config.php");

    require_once(TEMPLATES_PATH . "/header.php");
?>

    <div class="container-fluid">
      <div class="row">
        <nav class="col-sm-3 col-md-2 d-none d-sm-block bg-light sidebar">
          <ul class="nav nav-pills flex-column">
            <li class="nav-item">
              <a class="nav-link active" href="#">Manual<span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Profiles</a>
            </li>
          </ul>

        </nav>

        <main role="main" class="col-sm-9 ml-sm-auto col-md-10 pt-3">
          <h1>Led Controller</h1>

          <div class="row">
                  <div id="led_buttons" class="btn-group-vertical">

                  </div>

                  <div class="slidecontainer">
                       <input type="range" min="0" max="255" value="127" class="slider float-left" id="brightness">
                  </div>
                  <div class="col-sm-5">
                      <button class="btn-default btn-lg float-left" type="button" id="reset" value="Reset" onclick="reset()">Reset</button>
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


        </main>
      </div>
    </div>

    <!-- Bootstrap core JavaScript
    ================================================== -->


    </script><script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>

    <script src="js/gradient-min.js"></script>
    <script src="js/OO_leds.js"></script>
<?php
    require_once(TEMPLATES_PATH . "/footer.php");
?>
