python tools/generate-aliases.py
python tools/generate-change-dependencies-template.py

node sotn alter -s "build/extraction.json" -t "build/extraction-aliased.json" --aliases "build/aliases.json"
node sotn alter -s "build/extraction-aliased.json" -t "build/extraction-masked-aliased.json" --mask "data"
node sotn alter -s "build/extraction.json" -t "build/extraction-data-only.json" --drop "metadata" --promote "data"
