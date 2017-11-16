#!/usr/bin/python
from support import linearGradientWrapper
import sys

lgw = linearGradientWrapper.linearGradientWrapper()

if __name__ == '__main__':
    colors = sys.argv[1:]
    lgw.addHEX(colors[0:7])
    lgw.addHEX(colors[52:59])


    lgw.display()
