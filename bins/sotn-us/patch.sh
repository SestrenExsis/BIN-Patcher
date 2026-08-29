
node bin alter -s "build/sotn-us/extraction-masked-aliased.json" -t "build/sotn-us/current-patch.json"

node bin patch -p "build/sotn-us/current-patch.json" -c "bins/sotn-us/patches/assign-power-of-wolf-relic-a-unique-id.json"
node bin patch -p "build/sotn-us/current-patch.json" -c "bins/sotn-us/patches/clock-hands-display-minutes-and-seconds.json"
node bin patch -p "build/sotn-us/current-patch.json" -c "bins/sotn-us/patches/customize-map-colors.json"
node bin patch -p "build/sotn-us/current-patch.json" -c "bins/sotn-us/patches/enable-debug-mode.json"
node bin patch -p "build/sotn-us/current-patch.json" -c "bins/sotn-us/patches/fix-boss-scylla.json"
node bin patch -p "build/sotn-us/current-patch.json" -c "bins/sotn-us/patches/normalize-abandoned-mine.json"
node bin patch -p "build/sotn-us/current-patch.json" -c "bins/sotn-us/patches/normalize-alchemy-laboratory.json"
node bin patch -p "build/sotn-us/current-patch.json" -c "bins/sotn-us/patches/normalize-castle-entrance.json"
node bin patch -p "build/sotn-us/current-patch.json" -c "bins/sotn-us/patches/normalize-clock-tower.json"
node bin patch -p "build/sotn-us/current-patch.json" -c "bins/sotn-us/patches/normalize-long-library.json"
node bin patch -p "build/sotn-us/current-patch.json" -c "bins/sotn-us/patches/normalize-marble-gallery.json"
node bin patch -p "build/sotn-us/current-patch.json" -c "bins/sotn-us/patches/normalize-olroxs-quarters.json"
node bin patch -p "build/sotn-us/current-patch.json" -c "bins/sotn-us/patches/normalize-underground-caverns.json"
node bin patch -p "build/sotn-us/current-patch.json" -c "bins/sotn-us/patches/simplify-gear-puzzle.json"
node bin patch -p "build/sotn-us/current-patch.json" -c "bins/sotn-us/patches/DenseBeret0699.json"

node bin patch -p "build/sotn-us/current-patch.json" -c "build/sotn-us/change-dependencies.json"

node bin ppf -p "build/sotn-us/current-patch.json" -t "build/sotn-us/current-patch.ppf"