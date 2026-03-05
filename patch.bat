
node sotn alter -s "build/extraction-masked-aliased.json" -t "build/current-patch.json"
node sotn patch -p "build/current-patch.json" -c "patches/assign-power-of-wolf-relic-a-unique-id.json"
node sotn patch -p "build/current-patch.json" -c "patches/clock-hands-display-minutes-and-seconds.json"
node sotn patch -p "build/current-patch.json" -c "patches/customize-map-colors.json"
node sotn patch -p "build/current-patch.json" -c "patches/enable-debug-mode.json"
node sotn patch -p "build/current-patch.json" -c "patches/normalize-alchemy-laboratory-passages.json"

@REM node sotn patch -p "build/current-patch.json" -c "build/change-dependencies.json"

node sotn ppf   -p "build/current-patch.json" -t "build/current-patch.ppf"