rm -f build/extraction-template.json
rm -f build/extraction.json
python tools/generate-extraction-template.py
node sotn extract -b "build/Castlevania - Symphony of the Night (Track 1).bin" -j "build/extraction-template.json" -o "build"
python tools/generate-extraction-template.py
node sotn extract -b "build/Castlevania - Symphony of the Night (Track 1).bin" -j "build/extraction-template.json" -o "build"
python tools/generate-extraction-template.py
node sotn extract -b "build/Castlevania - Symphony of the Night (Track 1).bin" -j "build/extraction-template.json" -o "build"
python tools/generate-extraction-template.py
node sotn extract -b "build/Castlevania - Symphony of the Night (Track 1).bin" -j "build/extraction-template.json" -o "build"

python tools/generate-transformation-template.py