
node sotn alter -s "build/extraction-masked-aliased.json" -t "build/current-patch.json"
node sotn patch -p "build/current-patch.json" -c "build/assign-power-of-wolf-relic-a-unique-id.json"
node sotn patch -p "build/current-patch.json" -c "build/clock-hands-display-minutes-and-seconds.json"
node sotn patch -p "build/current-patch.json" -c "build/enable-debug-mode.json"
@REM node sotn patch -p "build/current-patch.json" -c "build/change-dependencies.json"
node sotn ppf   -p "build/current-patch.json" -t "build/current-patch.ppf"