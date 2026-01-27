node sotn template -e "build/extraction.json" -p "build/current-patch.json"
node sotn patch -p "build/current-patch.json"
python tools/generate-change-dependencies-template.py

@REM node sotn ppf -e "build/extraction.json" -p "build/current-patch.json" -o "build"