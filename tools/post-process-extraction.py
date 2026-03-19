import argparse
import json
import os
import yaml

if __name__ == '__main__':
    '''
    Usage
    python post-process-extraction.py EXTRACTION ALIASES PROCESSED
    '''
    parser = argparse.ArgumentParser()
    parser.add_argument('extraction', help='Input a filepath for the source extraction JSON', type=str)
    parser.add_argument('aliases', help='Input a filepath for the source aliases JSON', type=str)
    parser.add_argument('processed', help='Input a filepath for the target processed extraction JSON', type=str)
    args = parser.parse_args()
    
    extraction = {}
    with (
        open(os.path.normpath(args.extraction), 'r') as extraction_file,
        open(os.path.normpath(args.aliases), 'r') as aliases_file,
        open(os.path.normpath(args.processed), 'w') as processed_extraction_file,
    ):
        aliases = json.load(aliases_file)
        extraction = json.load(extraction_file)
        roomIds = {}
        roomOffsets = {}
        for (stage_name, stage_info) in aliases['stages'].items():
            roomIds[stage_name] = {}
            roomOffsets[stage_name] = {}
            for (room_name, room_id) in stage_info['rooms'].items():
                roomIds[stage_name][room_name] = room_id
                roomOffsets[stage_name][room_name] = 8 * room_id
        # extraction['_aliases'] = {
        #     'roomId': roomIds,
        #     'roomOffset': roomOffsets,
        # }
        teleporters = extraction['teleporters']
        teleporters['metadata']['element']['properties']['roomOffset']['type'] = 'room-offset'
        for i in range(len(teleporters['data'])):
            teleporter = teleporters['data'][i]
            stage_name = teleporter['targetStageId']
            print(stage_name)
            for (room_name, room_offset) in roomOffsets.get(stage_name, {}).items():
                if room_offset == teleporter['roomOffset']:
                    teleporter['roomOffset'] = f'{stage_name}.{room_name}'
        json.dump(extraction, processed_extraction_file, indent='    ', sort_keys=True)