import json
import os
import yaml

if __name__ == '__main__':
    extraction = {}
    with (
        open(os.path.join('build', 'extraction.json'), 'r') as extraction_file,
        open(os.path.join('build', 'aliases.json'), 'r') as aliases_file,
        open(os.path.join('build', 'extraction-processed.json'), 'w') as processed_extraction_file,
    ):
        aliases = json.load(aliases_file)
        extraction = json.load(extraction_file)
        extraction['_aliases'] = {
            'roomId': {},
            'roomOffset': {},
        }
        for (stage_name, stage_info) in aliases['stages'].items():
            extraction['_aliases']['roomId'][stage_name] = {}
            extraction['_aliases']['roomOffset'][stage_name] = {}
            for (room_name, room_id) in stage_info['rooms'].items():
                extraction['_aliases']['roomId'][stage_name][room_name] = room_id
                extraction['_aliases']['roomOffset'][stage_name][room_name] = 8 * room_id
        teleporters = extraction['teleporters']
        teleporters['metadata']['element']['properties']['roomOffset']['type'] = 'room-offset'
        for i in range(len(teleporters['data'])):
            teleporter = teleporters['data'][i]
            stage_name = teleporter['targetStageId']
            print(stage_name)
            for (room_name, room_offset) in extraction['_aliases']['roomOffset'].get(stage_name, {}).items():
                if room_offset == teleporter['roomOffset']:
                    teleporter['roomOffset'] = f'{stage_name}.{room_name}'
        json.dump(extraction, processed_extraction_file, indent='    ', sort_keys=True)