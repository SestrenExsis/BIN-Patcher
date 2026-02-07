node sotn alter -s "build/extraction.json" -t "build/extraction-aliased.json" --aliases "build/aliases.json"
node sotn alter -s "build/extraction.json" -t "build/extraction-meta-only.json" --drop "data" --promote "metadata"
node sotn alter -s "build/extraction.json" -t "build/extraction-data-only.json" --drop "metadata" --promote "data"
node sotn alter -s "build/extraction.json" -t "build/extraction-masked-data.json" --mask "data"
node sotn alter -s "build/extraction-masked-data.json" -t "build/current-patch.json" --drop "metadata" --promote "data"
@REM node sotn patch -p "build/current-patch.json"
@REM python tools/generate-change-dependencies-template.py
