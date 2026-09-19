BIN=$1

rm -f build/sotn-us/extraction.json

node bins/sotn-us/util extract -b "$BIN" -o "build/sotn-us/extraction.json"
node bins/sotn-us/util dependencies -t "bins/sotn-us/data/change-dependencies-template.json" -o "build/sotn-us/change-dependencies.json"

node bin alter -s "build/sotn-us/extraction.json" -t "build/sotn-us/extraction-masked.json" --mask "data"
