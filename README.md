# IoT-Web-Controller
A simple html controller that delegates POST requests to an Arduino controller via a PHP based web server.

## Web Server
RPi 3B running _Debian Apache2_.

## Current Request sequence diagram

[ASCII Sequence Diagram Generator](https://textart.io/sequence)
(The example text is strange yet the _simple_ features are straightforward)

The below diagram demonstrates the general request processing flow and establishes a pattern to follow when debugging inter-component messages.


                                 +---------+                                     +-----------+                                 +---------+
                                 | Browser |                                    | WebServer  |                                 | Arduino |
                                 +---------+                                     +-----------+                                 +---------+
                                      |                                               |                                            | -------------------\
                                      |                                               |                                            |-| DTR pin disabled |
                                      |                                               |                                            | |------------------|
                                      |                                               |                                            |
                                      | POST Request (key-value LEDid-hexcolor)       |                                            |
                                      |---------------------------------------------->|                                            |
    --------------------------------\ |                                               |                                            |
    | Engage debouncing             |-|                                               |                                            |
    | or throttle(function setLEDs) | |                                               |                                            |
    |-------------------------------| |                                               | -----------------------\                   |
                                      |                                               |-| Debian Apache2 : PHP |                   |
                                      |                                               | |----------------------|                   |
                                      |                                               |                                            |
                                      |                                               | string buildOrderedCmd(set key-value)      |
                                      |                                               |--------------------------------------      |
                                      |                                               |                                     |      |
                                      |                                               |<-------------------------------------      |
                                      |                                               |                                            |
                                      |                                               | string shellExec(string cmd)               |
                                      |                                               |-----------------------------               |
                                      |                                               |                            |               |
                                      |                                               |<----------------------------               |
                                      |            ---------------------------------\ |                                            |
                                      |            | Python                         |-|                                            |
                                      |            | Apache2 added to dialout group | |                                            |
                                      |            |--------------------------------| |                                            |
                                      |                                               | openSerialConnection('tty/USB0')           |
                                      |                                               |---------------------------------           |
                                      |                                               |                                |           |
                                      |                                               |<--------------------------------           |
                                      |                                               |                                            |
                                      |                                               | setCmd(int)                                |
                                      |                                               |------------------------------------------->|
                                      |                                               |                                            |
                                      |                                               | setBrightness(int)                         |
                                      |                                               |------------------------------------------->|
                                      |                                               |                                            |
                                      |                                               | setColorArray(string)                      |
                                      |                                               |------------------------------------------->|
                                      |                                               |                                            |

[code](###sequence-diagram-code)


# Appendix
### Sequence diagram code
```
object Browser WebServer Arduino
note right of Arduino: DTR pin disabled
Browser->WebServer: POST Request (key-value LEDid-hexcolor)
note left of Browser: Engage debouncing \nor throttle(function setLEDs)
note right of WebServer: Debian Apache2 : PHP
WebServer->WebServer: string buildOrderedCmd(set key-value)
WebServer->WebServer: string shellExec(string cmd)
note left of WebServer: Python \nApache2 added to dialout group
WebServer->WebServer: openSerialConnection('tty/USB0')
WebServer->Arduino: setCmd(int)
WebServer->Arduino: setBrightness(int)
WebServer->Arduino: setColorArray(string)

```
