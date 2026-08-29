BIN=$1

rm -f build/sotn-us/extraction-template.json
rm -f build/sotn-us/extraction.json

python3 tools/yaml-to-json.py "bins/sotn-us/data/aliases.yaml" "build/sotn-us/aliases.json"

python3 bins/sotn-us/generate-extraction-template.py "bins/sotn-us/data/extraction-template.yaml" "build/sotn-us/extraction-template.json"
node bin extract -b "$BIN" -t "build/sotn-us/extraction-template.json" -e "build/sotn-us/extraction.json"

python3 bins/sotn-us/generate-extraction-template.py "bins/sotn-us/data/extraction-template.yaml" "build/sotn-us/extraction-template.json" --previous "build/sotn-us/extraction.json"
node bin extract -b "$BIN" -t "build/sotn-us/extraction-template.json" -e "build/sotn-us/extraction.json"

python3 bins/sotn-us/generate-extraction-template.py "bins/sotn-us/data/extraction-template.yaml" "build/sotn-us/extraction-template.json" --previous "build/sotn-us/extraction.json"
node bin extract -b "$BIN" -t "build/sotn-us/extraction-template.json" -e "build/sotn-us/extraction.json"

python3 bins/sotn-us/generate-extraction-template.py "bins/sotn-us/data/extraction-template.yaml" "build/sotn-us/extraction-template.json" --previous "build/sotn-us/extraction.json"
node bin extract -b "$BIN" -t "build/sotn-us/extraction-template.json" -e "build/sotn-us/extraction.json"
