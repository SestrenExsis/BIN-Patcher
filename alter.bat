python tools/generate-aliases.py
python tools/generate-change-dependencies-template.py

node sotn alter -s "build/extraction.json" -t "build/extraction-aliased.json" --aliases "build/aliases.json"
node sotn alter -s "build/extraction-aliased.json" -t "build/extraction-masked-aliased.json" --mask "data"
@REM node sotn alter -s "build/extraction-aliased.json" -t "build/extraction-metadata.json" --drops "data"
@REM node sotn alter -s "build/extraction-aliased.json" -t "build/extraction-data-masked.json" --drops "metadata" "aliases" --mask "data" --promote "data"