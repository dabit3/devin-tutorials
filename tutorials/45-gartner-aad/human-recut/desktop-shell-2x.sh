#!/bin/sh
export DISPLAY=:0
export XDG_RUNTIME_DIR=/tmp/runtime-ubuntu
export QT_SCALE_FACTOR=1
export QT_AUTO_SCREEN_SCALE_FACTOR=0
kwin_x11 --replace &
plasmashell &
wait
