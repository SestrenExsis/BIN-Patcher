BIN=$1

mkdir "build"
mkdir "build/sotn-us"

rm -f build/sotn-us/extraction.json

node bins/sotn-us/util extract -b "$BIN" -o "build/sotn-us/extraction.json"
node bins/sotn-us/util dependencies -t "bins/sotn-us/data/change-dependencies-template.json" -o "build/sotn-us/change-dependencies.json"
