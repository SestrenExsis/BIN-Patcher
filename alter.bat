python tools/generate-aliases.py
python tools/generate-change-dependencies-template.py

node sotn alter -s "build/extraction.json" -t "build/extraction-aliased.json" --aliases "build/aliases.json"
node sotn alter -s "build/extraction-aliased.json" -t "build/extraction-masked-aliased.json" --mask "data"

@REM node sotn alter -s "build/extraction.json" -t "build/extraction-meta-only.json" --drop "data" --promote "metadata"
@REM node sotn alter -s "build/extraction.json" -t "build/extraction-data-only.json" --drop "metadata" --promote "data"
@REM node sotn alter -s "build/extraction.json" -t "build/extraction-masked-data.json" --mask "data"
@REM node sotn alter -s "build/extraction-masked-data.json" -t "build/current-patch.json" --drop "metadata" --promote "data"
@REM node sotn patch -p "build/current-patch.json"
@REM python tools/generate-change-dependencies-template.py
