rm -f build/extraction-template.json
rm -f build/extraction.json

python tools/generate-extraction-template.py
node sotn extract -b "build/Castlevania - Symphony of the Night (Track 1).bin" -t "build/extraction-template.json" -e "build/extraction.json"
python tools/generate-extraction-template.py
node sotn extract -b "build/Castlevania - Symphony of the Night (Track 1).bin" -t "build/extraction-template.json" -e "build/extraction.json"
python tools/generate-extraction-template.py
node sotn extract -b "build/Castlevania - Symphony of the Night (Track 1).bin" -t "build/extraction-template.json" -e "build/extraction.json"
python tools/generate-extraction-template.py
node sotn extract -b "build/Castlevania - Symphony of the Night (Track 1).bin" -t "build/extraction-template.json" -e "build/extraction.json"

python tools/generate-aliases.py