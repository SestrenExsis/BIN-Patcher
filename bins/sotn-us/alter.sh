node bins/sotn-us/util dependencies -t "bins/sotn-us/data/change-dependencies-template.json" -o "build/sotn-us/change-dependencies.json"

node bins/sotn-us/util teleporters -e "build/sotn-us/extraction.json" -o "build/sotn-us/extraction-processed.json"
node bin alter -s "build/sotn-us/extraction-processed.json" -t "build/sotn-us/extraction-aliased.json" --aliases "bins/sotn-us/data/aliases.json"
node bin alter -s "build/sotn-us/extraction-aliased.json" -t "build/sotn-us/extraction-masked-aliased.json" --mask "data"

# NOTE(sestren): The following scripts are no longer needed, but are provided as an example of building metadata-only and masked-data only files
# node bin alter -s "build/sotn-us/extraction-aliased.json" -t "build/sotn-us/extraction-metadata.json" --drops "data"
# node bin alter -s "build/sotn-us/extraction-aliased.json" -t "build/sotn-us/extraction-data-masked.json" --drops "metadata" "aliases" --mask "data" --promote "data"