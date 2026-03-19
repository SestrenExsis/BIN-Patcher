python tools/yaml-to-json.py "data/aliases.yaml" "build/aliases.json"
python tools/post-process-extraction.py "build/extraction.json" "build/aliases.json" "build/extraction-processed.json"
python tools/generate-change-dependencies-template.py "data/change-dependencies-template.yaml" "build/change-dependencies.json"

node sotn alter -s "build/extraction-processed.json" -t "build/extraction-aliased.json" --aliases "build/aliases.json"
node sotn alter -s "build/extraction-aliased.json" -t "build/extraction-masked-aliased.json" --mask "data"
@REM node sotn alter -s "build/extraction-aliased.json" -t "build/extraction-metadata.json" --drops "data"
@REM node sotn alter -s "build/extraction-aliased.json" -t "build/extraction-data-masked.json" --drops "metadata" "aliases" --mask "data" --promote "data"