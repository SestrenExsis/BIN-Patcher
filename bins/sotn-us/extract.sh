BIN=$1

rm -f build/sotn-us/extraction.json
rm -f build/sotn-us/extraction-template.json

node bins/sotn-us/util extract -t "bins/sotn-us/data/extraction-template.json" -o "build/sotn-us/extraction-template.json"
node bin extract -b "$BIN" -t "build/sotn-us/extraction-template.json" -e "build/sotn-us/extraction.json"

node bins/sotn-us/util extract -t "bins/sotn-us/data/extraction-template.json" -o "build/sotn-us/extraction-template.json" --previous "build/sotn-us/extraction.json"
node bin extract -b "$BIN" -t "build/sotn-us/extraction-template.json" -e "build/sotn-us/extraction.json"

node bins/sotn-us/util extract -t "bins/sotn-us/data/extraction-template.json" -o "build/sotn-us/extraction-template.json" --previous "build/sotn-us/extraction.json"
node bin extract -b "$BIN" -t "build/sotn-us/extraction-template.json" -e "build/sotn-us/extraction.json"

node bins/sotn-us/util extract -t "bins/sotn-us/data/extraction-template.json" -o "build/sotn-us/extraction-template.json" --previous "build/sotn-us/extraction.json"
node bin extract -b "$BIN" -t "build/sotn-us/extraction-template.json" -e "build/sotn-us/extraction.json"
