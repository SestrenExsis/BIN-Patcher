BIN=$1

rm -f build/extraction-template.json
rm -f build/extraction.json

python3 tools/yaml-to-json.py "data/aliases.yaml" "build/aliases.json"

python3 tools/generate-extraction-template.py "data/extraction-template.yaml" "build/extraction-template.json"
node sotn extract -b "$BIN" -t "build/extraction-template.json" -e "build/extraction.json"

python3 tools/generate-extraction-template.py "data/extraction-template.yaml" "build/extraction-template.json" --previous "build/extraction.json"
node sotn extract -b "$BIN" -t "build/extraction-template.json" -e "build/extraction.json"

python3 tools/generate-extraction-template.py "data/extraction-template.yaml" "build/extraction-template.json" --previous "build/extraction.json"
node sotn extract -b "$BIN" -t "build/extraction-template.json" -e "build/extraction.json"

python3 tools/generate-extraction-template.py "data/extraction-template.yaml" "build/extraction-template.json" --previous "build/extraction.json"
node sotn extract -b "$BIN" -t "build/extraction-template.json" -e "build/extraction.json"
