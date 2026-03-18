import argparse
import json
import os
import yaml

if __name__ == '__main__':
    '''
    Usage
    python yaml-to-json.py SOURCE TARGET
    '''
    parser = argparse.ArgumentParser()
    parser.add_argument('source', help='Input a filename for the source YAML', type=str)
    parser.add_argument('target', help='Input a filename for the target JSON', type=str)
    args = parser.parse_args()
    with (
        open(os.path.normpath(args.source)) as source_file,
        open(os.path.normpath(args.target), 'w') as target_file,
    ):
        source = yaml.safe_load(source_file)
        json.dump(source, target_file, indent='    ', sort_keys=True)
