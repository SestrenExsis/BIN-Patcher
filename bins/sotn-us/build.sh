BIN=$1

mkdir "build"
mkdir "build/sotn-us"

rm -f build/sotn-us/extraction.json

node bins/sotn-us/util extract -b "$BIN" -o "build/sotn-us/extraction.json"
node bins/sotn-us/util dependencies -o "build/sotn-us/change-dependencies.json"
