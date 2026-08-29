python3 tools/yaml-to-json.py "bins/sotn-us/data/aliases.yaml" "build/sotn-us/aliases.json"
python3 bins/sotn-us/post-process-extraction.py "build/sotn-us/extraction.json" "build/sotn-us/aliases.json" "build/sotn-us/extraction-processed.json"
python3 bins/sotn-us/generate-change-dependencies-template.py "bins/sotn-us/data/change-dependencies-template.yaml" "build/sotn-us/change-dependencies.json"

node bin alter -s "build/sotn-us/extraction-processed.json" -t "build/sotn-us/extraction-aliased.json" --aliases "build/sotn-us/aliases.json"
node bin alter -s "build/sotn-us/extraction-aliased.json" -t "build/sotn-us/extraction-masked-aliased.json" --mask "data"

# NOTE(sestren): The following scripts are no longer needed, but are provided as an example of building metadata-only and masked-data only files
# node bin alter -s "build/sotn-us/extraction-aliased.json" -t "build/sotn-us/extraction-metadata.json" --drops "data"
# node bin alter -s "build/sotn-us/extraction-aliased.json" -t "build/sotn-us/extraction-data-masked.json" --drops "metadata" "aliases" --mask "data" --promote "data"