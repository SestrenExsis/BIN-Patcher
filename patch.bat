
node sotn alter -s "build/extraction-masked-aliased.json" -t "build/current-patch.json"
node sotn patch -p "build/current-patch.json" -c "patches/assign-power-of-wolf-relic-a-unique-id.json"
node sotn patch -p "build/current-patch.json" -c "patches/clock-hands-display-minutes-and-seconds.json"
node sotn patch -p "build/current-patch.json" -c "patches/customize-map-colors.json"
node sotn patch -p "build/current-patch.json" -c "patches/customize-music.json"
node sotn patch -p "build/current-patch.json" -c "patches/enable-debug-mode.json"
node sotn patch -p "build/current-patch.json" -c "patches/fix-boss-scylla.json"
node sotn patch -p "build/current-patch.json" -c "patches/normalize-abandoned-mine.json"
node sotn patch -p "build/current-patch.json" -c "patches/normalize-alchemy-laboratory.json"
node sotn patch -p "build/current-patch.json" -c "patches/normalize-castle-entrance.json"
node sotn patch -p "build/current-patch.json" -c "patches/normalize-long-library.json"
node sotn patch -p "build/current-patch.json" -c "patches/normalize-olroxs-quarters.json"
node sotn patch -p "build/current-patch.json" -c "patches/normalize-underground-caverns.json"
node sotn patch -p "build/current-patch.json" -c "patches/simplify-gear-puzzle.json"

node sotn patch -p "build/current-patch.json" -c "patches/DenseBeret0699.json"
@REM node sotn patch -p "build/current-patch.json" -c "patches/debug.json"

node sotn patch -p "build/current-patch.json" -c "build/change-dependencies.json"

node sotn ppf   -p "build/current-patch.json" -t "build/current-patch.ppf"