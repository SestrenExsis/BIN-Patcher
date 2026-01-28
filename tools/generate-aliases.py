import json
import os
import yaml

if __name__ == '__main__':
    with (
        open(os.path.join('data', 'aliases.yaml')) as source_file,
        open(os.path.join('build', 'aliases.json'), 'w') as target_file,
    ):
        source = yaml.safe_load(source_file)
        json.dump(source, target_file, indent='    ', sort_keys=True)
