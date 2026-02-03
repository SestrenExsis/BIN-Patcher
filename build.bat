node sotn alter -s "build/extraction.json" -t "build/extraction-meta-only.json" -d "data" -p "metadata"
node sotn alter -s "build/extraction.json" -t "build/extraction-data-only.json" -d "metadata" -p "data"
@REM node sotn patch -p "build/current-patch.json"
@REM python tools/generate-change-dependencies-template.py
