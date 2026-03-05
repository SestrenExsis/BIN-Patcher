import json
import os
import yaml

data = {
    'familiarEvents': {
        # NOTE(sestren): Which familiars correspond are educated guesses
        'bat': 0x0392A760,
        'ghost': 0x0394BDB0,
        'faerie': 0x0396FD2C,
        'demon': 0x03990890,
        'sword': 0x039AF9E4,
        'yousei': 0x039D1D38,
        'noseDemon': 0x039F2664,
    },
    'stages': {
        'abandonedMine': 0x03CDF800,
        'alchemyLaboratory': 0x049BE800,
        'antiChapel': 0x04416000,
        'blackMarbleGallery': 0x0453D800,
        'bossOlrox': 0x0534C800,
        'bossGranfaloon': 0x053F7000,
        'bossMinotaurAndWerewolf': 0x05473800,
        'bossScylla': 0x05507000,
        'bossDoppelganger10': 0x05593000,
        'bossHippogryph': 0x05638800,
        'bossRichter': 0x056C8800,
        'bossCerberus': 0x0596D000,
        'bossTrio': 0x05775000,
        'bossBeelzebub': 0x05870000,
        'bossDeath': 0x058ED800,
        'bossMedusa': 0x059E9800,
        'bossCreature': 0x05A65000,
        'bossDoppelganger40': 0x05AE3800,
        'bossShaftAndDracula': 0x05B93800,
        'bossSuccubus': 0x04F31000,
        'bossAkmodanII': 0x05C24000,
        'bossGalamoth': 0x05C9F800,
        'castleCenter': 0x03C65000,
        'castleEntrance': 0x041A7800,
        'castleEntranceRevisited': 0x0491A800,
        'castleKeep': 0x04AEF000,
        'catacombs': 0x03BB3000,
        'cave': 0x0439B800,
        'clockTower': 0x04A67000,
        'colosseum': 0x03B00000,
        'cutsceneMeetingMariaInClockRoom': 0x057F9800,
        'deathWingsLair': 0x04680800,
        'floatingCatacombs': 0x04307000,
        'forbiddenLibrary': 0x044B0000,
        'longLibrary': 0x03E5F800,
        'marbleGallery': 0x03F8B000,
        'necromancyLaboratory': 0x04D81000,
        'olroxsQuarters': 0x040FB000,
        'outerWall': 0x04047000,
        'prologue': 0x0487C800,
        'reverseCaverns': 0x047C3800,
        'reverseCastleCenter': 0x04B87800,
        'reverseClockTower': 0x04E22000,
        'reverseColosseum': 0x04C07800,
        'reverseEntrance': 0x0471E000,
        'reverseKeep': 0x04C84000,
        'reverseOuterWall': 0x045EE000,
        'reverseWarpRooms': 0x04EBE000,
        'royalChapel': 0x03D5A800,
        'undergroundCaverns': 0x04257800,
        'warpRooms': 0x04D12800,
    },
    'baseDropRates': {
        'abandonedMine': 0x000D6C,
        'alchemyLaboratory': 0x0018C0,
        'antiChapel': 0x0010E4,
        'blackMarbleGallery': 0x0013B4,
        'bossOlrox': 0x0017C4,
        'bossGranfaloon': 0x00138C,
        'bossMinotaurAndWerewolf': 0x001010,
        'bossScylla': 0x001444,
        'bossDoppelganger10': 0x0009FC,
        'bossHippogryph': 0x0010AC,
        'bossRichter': 0x000A34,
        'bossCerberus': 0x000C34,
        'bossTrio': 0x00117C,
        'bossBeelzebub': 0x000D3C,
        'bossDeath': 0x000F7C,
        'bossMedusa': 0x000A9C,
        'bossCreature': 0x000BA8,
        'bossDoppelganger40': 0x000A88,
        'bossShaftAndDracula': 0x000C90,
        'bossSuccubus': 0x000CC8,
        'bossAkmodanII': 0x000AF4,
        'bossGalamoth': 0x001B28,
        'castleCenter': 0x0B04,
        'castleEntrance': 0x200C,
        'castleEntranceRevisited': 0x1998,
        'castleKeep': 0x1194,
        'catacombs': 0x1AE4,
        'cave': 0x0C68,
        'clockTower': 0x1664,
        'colosseum': 0x1364,
        'cutsceneMeetingMariaInClockRoom': 0x0AB0,
        'deathWingsLair': 0x1294,
        'floatingCatacombs': 0x18B0,
        'forbiddenLibrary': 0x0F80,
        'longLibrary': 0x1FC8,
        'marbleGallery': 0x1488,
        'necromancyLaboratory': 0x110C,
        'olroxsQuarters': 0x1374,
        'outerWall': 0x1DA8,
        'prologue': 0x1934,
        'reverseCaverns': 0x1AF4,
        'reverseCastleCenter': 0x0DD8,
        'reverseClockTower': 0x1698,
        'reverseColosseum': 0x0E2C,
        'reverseEntrance': 0x1498,
        'reverseKeep': 0x0C7C,
        'reverseOuterWall': 0x1158,
        'reverseWarpRooms': 0x09DC,
        'royalChapel': 0x13BC,
        'undergroundCaverns': 0x1D40,
        'warpRooms': 0x09DC,
    },
    'uniqueItemDrops': {
        'abandonedMine': (0x0009E4, 13),
        'alchemyLaboratory': (0x0013B0, 11),
        'antiChapel': (0x000D2C, 18),
        'blackMarbleGallery': (0x000F8C, 12),
        'bossScylla': (0x00108C, 37),
        'castleEntrance': (0x001C8C, 10),
        'castleEntranceRevisited': (0x001618, 10),
        'castleKeep': (0x000D10, 19),
        'catacombs': (0x00174C, 21),
        'cave': (0x0007CC, 8),
        'clockTower': (0x00111C, 12),
        'colosseum': (0x000FE8, 8),
        'deathWingsLair': (0x000D40, 12),
        'floatingCatacombs': (0x0013C8, 18),
        'forbiddenLibrary': (0x000BC8, 9),
        'longLibrary': (0x001A90, 11),
        'marbleGallery': (0x001100, 14),
        'necromancyLaboratory': (0x000CC8, 10),
        'olroxsQuarters': (0x000FEC, 13),
        'outerWall': (0x001A2C, 7),
        'reverseCaverns': (0x001620, 27),
        'reverseClockTower': (0x000EC8, 12),
        'reverseColosseum': (0x000A3C, 8),
        'reverseEntrance': (0x000F10, 10),
        'reverseKeep': (0x0007C8, 25),
        'reverseOuterWall': (0x000AE4, 8),
        'royalChapel': (0x000EC0, 16),
        'undergroundCaverns': (0x001928, 37),
    },
}


if __name__ == '__main__':
    prev_extraction = {}
    if os.path.isfile(os.path.join('build', 'extraction.json')):
        with (
            open(os.path.join('build', 'extraction.json'), 'r') as prev_extraction_file,
        ):
            prev_extraction = json.load(prev_extraction_file)
    with (
        open(os.path.join('data', 'extraction-template.yaml')) as source_file,
        open(os.path.join('build', 'extraction-template.json'), 'w') as target_file,
    ):
        source = yaml.safe_load(source_file)
        source['familiarEvents'] = {}
        for familiar_name in data['familiarEvents']:
            source['familiarEvents'][familiar_name] = {
                'metadata': {
                    'address': {
                        'method': 'absolute',
                        'value': data['familiarEvents'][familiar_name],
                    },
                    'element': {
                        'structure': 'object-array',
                        'size': 48,
                        'constraint': {
                            'method': 'elementCount',
                            'elementCount': 49,
                        },
                        'properties': {
                            '0x00': {
                                'offset': '0x00',
                                'type': 'u32',
                            },
                            '0x04': {
                                'offset': '0x04',
                                'type': 'u32',
                            },
                            'servantId': {
                                'offset': '0x08',
                                'type': 's32',
                            },
                            'roomX': {
                                'offset': '0x0C',
                                'type': 's32',
                            },
                            'roomY': {
                                'offset': '0x10',
                                'type': 's32',
                            },
                            'cameraX': {
                                'offset': '0x14',
                                'type': 's32',
                            },
                            'cameraY': {
                                'offset': '0x18',
                                'type': 's32',
                            },
                            'condition': {
                                'offset': '0x1C',
                                'type': 's32',
                            },
                            'delay': {
                                'offset': '0x20',
                                'type': 's32',
                            },
                            'entityId': {
                                'offset': '0x24',
                                'type': 's32',
                            },
                            'params': {
                                'offset': '0x28',
                                'type': 's32',
                            },
                            '0x2C': {
                                'offset': '0x2C',
                                'type': 'u32',
                            },
                        },
                    },
                },
            }
        for stage_name in data['stages']:
            # stage
            if stage_name not in source['stages']:
                source['stages'][stage_name] = {}
            # stage.metadata
            if 'metadata' not in source['stages'][stage_name]:
                source['stages'][stage_name]['metadata'] = {
                    'address': {
                        'value': data['stages'][stage_name],
                        'method': 'absolute',
                    },
                }
            # stage.constants
            if 'constants' not in source['stages'][stage_name]:
                source['stages'][stage_name]['constants'] = {}
            # stage.constants.baseDropRates
            if stage_name in data['baseDropRates']:
                source['stages'][stage_name]['constants']['baseDropRates'] = {
                    'metadata': {
                        'address': {
                            'value': data['baseDropRates'][stage_name],
                            'method': 'relative',
                        },
                        'element': {
                            'structure': 'value-array',
                            'constraint': {
                                'method': 'elementCount',
                                'elementCount': 4,
                            },
                            'type': 'u8',
                        }
                    },
                }
            # stage.constants.uniqueItemDrops
            if stage_name in data['uniqueItemDrops']:
                source['stages'][stage_name]['constants']['uniqueItemDrops'] = {
                    'metadata': {
                        'address': {
                            'value': data['uniqueItemDrops'][stage_name][0],
                            'method': 'relative',
                        },
                        'element': {
                            'structure': 'value-array',
                            'constraint': {
                                'method': 'elementCount',
                                'elementCount': data['uniqueItemDrops'][stage_name][1],
                            },
                            'type': 'item-drop-id',
                        }
                    },
                }
            # stage.rooms
            if 'rooms' not in source['stages'][stage_name]:
                source['stages'][stage_name]['rooms'] = {
                    'metadata': {
                        'address': {
                            'method': 'indirect',
                            'value': '0x000010',
                            'type': 'u32',
                            'base': '0x80180000',
                        },
                        'element': {
                            'structure': 'object-array',
                            'size': 8,
                            'constraint': {
                                'method': 'sentinelValues',
                                'sentinelValues': [
                                    {
                                        'value': '0x40',
                                        'type': 'u8',
                                    },
                                ],
                            },
                            'postProcessing': [
                                {
                                    'process': 'calculateDerivedValue',
                                    'propertyName': '_rows',
                                    'actions': [
                                        {
                                            'action': 'get',
                                            'type': 'property',
                                            'property': 'bottom',
                                        },
                                        {
                                            'action': 'add',
                                            'type': 'constant',
                                            'constant': 1,
                                        },
                                        {
                                            'action': 'subtract',
                                            'type': 'property',
                                            'property': 'top',
                                        }
                                    ],
                                },
                                {
                                    'process': 'calculateDerivedValue',
                                    'propertyName': '_columns',
                                    'actions': [
                                        {
                                            'action': 'get',
                                            'type': 'property',
                                            'property': 'right',
                                        },
                                        {
                                            'action': 'add',
                                            'type': 'constant',
                                            'constant': 1,
                                        },
                                        {
                                            'action': 'subtract',
                                            'type': 'property',
                                            'property': 'left',
                                        }
                                    ],
                                },
                            ],
                            'properties': {
                                'left': {
                                    'offset': '0x00',
                                    'type': 'u8',
                                },
                                'top': {
                                    'offset': '0x01',
                                    'type': 'u8',
                                },
                                'right': {
                                    'offset': '0x02',
                                    'type': 'u8',
                                },
                                'bottom': {
                                    'offset': '0x03',
                                    'type': 'u8',
                                },
                                'tileLayoutId': {
                                    'offset': '0x04',
                                    'type': 'u8',
                                },
                                'tilesetId': {
                                    'offset': '0x05',
                                    'type': 's8',
                                },
                                'objectGraphicsId': {
                                    'offset': '0x06',
                                    'type': 'u8',
                                },
                                'objectLayoutId': {
                                    'offset': '0x07',
                                    'type': 'u8',
                                },
                            },
                        },
                    },
                }
            # stage.layers
            if 'layers' not in source['stages'][stage_name]:
                source['stages'][stage_name]['layers'] = {}
            # stage.layers.roomDefinitions
            rooms = prev_extraction.get('stages', {}).get(stage_name, {}).get('rooms', None)
            if rooms is not None:
                room_def_count = 0
                for room in rooms.get('data', []):
                    if room['tilesetId'] == -1:
                        continue
                    room_def_count += 1
                source['stages'][stage_name]['layers']['roomDefinitions'] = {
                    'metadata': {
                        'address': {
                            'method': 'indirect',
                            'value': '0x000020',
                            'type': 'u32',
                            'base': '0x80180000',
                        },
                        'element': {
                            'structure': 'object-array',
                            'size': 8,
                            'constraint': {
                                'method': 'elementCount',
                                'elementCount': room_def_count,
                            },
                            'properties': {
                                'foreground': {
                                    'offset': '0x00',
                                    'type': 'zone-offset'
                                },
                                'background': {
                                    'offset': '0x04',
                                    'type': 'zone-offset'
                                }
                            },
                        },
                    },
                }
            # stage.layers.layerDefinitions
            room_defs = prev_extraction.get('stages', {}).get(stage_name, {}).get('layers', {}).get('roomDefinitions', None)
            if room_defs is not None:
                min_layer_def = float('inf')
                max_layer_def = float('-inf')
                for room_def in room_defs.get('data', []):
                    bg = int(room_def['background'], 16)
                    fg = int(room_def['foreground'], 16)
                    min_layer_def = min(min_layer_def, bg, fg)
                    max_layer_def = max(max_layer_def, bg, fg)
                if min_layer_def < float('inf') and max_layer_def > float('-inf'):
                    source['stages'][stage_name]['layers']['layerDefinitions'] = {
                        'metadata': {
                            'address': {
                                'method': 'relative',
                                'value': min_layer_def,
                            },
                            'element': {
                                'structure': 'object-array',
                                'constraint': {
                                    'method': 'elementCount',
                                    'elementCount': 1 + ((max_layer_def - min_layer_def) // 16),
                                },
                                'size': 16,
                                'properties': {
                                    'tilesOffset': {
                                        'offset': '0x00',
                                        'type': 'zone-offset',
                                    },
                                    'defsOffset': {
                                        'offset': '0x04',
                                        'type': 'zone-offset',
                                    },
                                    'layoutRect': {
                                        'offset': '0x08',
                                        'type': 'layout-rect',
                                    },
                                    'zPriority': {
                                        'offset': '0x0C',
                                        'type': 'u16',
                                    },
                                    'flags': {
                                        'offset': '0x0E',
                                        'type': 'u16',
                                    },
                                },
                            },
                        },
                    }
            # stage.tilemaps
            layer_defs = prev_extraction.get('stages', {}).get(stage_name, {}).get('layers', {}).get('layerDefinitions', {}).get('data', None)
            if layer_defs is not None:
                tilemaps = {}
                for layer_def in layer_defs:
                    if layer_def['tilesOffset'] in (None, 'NULL'):
                        continue
                    tilemap_id = layer_def['tilesOffset']
                    layout_rect = layer_def['layoutRect']
                    tilemap = {
                        'metadata': {
                            'address': {
                                'method': 'relative',
                                'value': tilemap_id,
                            },
                            'element': {
                                'structure': 'tilemap',
                                'heightInScreens': 1 + (layout_rect['bottom'] - layout_rect['top']),
                                'widthInScreens': 1 + (layout_rect['right'] - layout_rect['left']),
                            },
                        },
                    }
                    tilemaps[tilemap_id] = tilemap
                source['stages'][stage_name]['tilemaps'] = tilemaps
            # stage.entities
            if 'entities' not in source['stages'][stage_name]:
                source['stages'][stage_name]['entities'] = {}
            # stage.entities.layoutOffsets
            if 'layoutOffsets' not in source['stages'][stage_name]['entities']:
                source['stages'][stage_name]['entities']['layoutOffsets'] = {
                    'metadata': {
                        'address': {
                            'method': 'indirect',
                            'value': '0x00000C',
                            'type': 'u32',
                            'base': '0x80180000',
                        },
                        'element': {
                            'structure': 'object',
                            'size': '0x2A',
                            'properties': {
                                'horizontalEntities': {
                                    'offset': '0x1C',
                                    'type': 'u16',
                                },
                                'verticalEntities': {
                                    'offset': '0x28',
                                    'type': 'u16',
                                },
                            },
                        },
                    },
                }
            # stage.entities.horizontalRows
            layout_offsets = prev_extraction.get('stages', {}).get(stage_name, {}).get('entities', {}).get('layoutOffsets', {})
            horizontal_offset = layout_offsets.get('data', {}).get('horizontalEntities', None)
            vertical_offset = layout_offsets.get('data', {}).get('verticalEntities', None)
            if horizontal_offset is not None and vertical_offset is not None:
                entity_row_count = (vertical_offset - horizontal_offset) // 4
                source['stages'][stage_name]['entities']['horizontalRows'] = {
                    'metadata': {
                        'address': {
                            'method': 'relative',
                            'value': horizontal_offset,
                            'type': 'u32',
                        },
                        'element': {
                            'structure': 'value-array',
                            'constraint': {
                                'method': 'elementCount',
                                'elementCount': entity_row_count,
                            },
                            'type': 'u32',
                        }
                    }
                }
                source['stages'][stage_name]['entities']['verticalRows'] = {
                    'metadata': {
                        'address': {
                            'method': 'relative',
                            'value': vertical_offset,
                            'type': 'u32',
                        },
                        'element': {
                            'structure': 'value-array',
                            'constraint': {
                                'method': 'elementCount',
                                'elementCount': entity_row_count,
                            },
                            'type': 'u32',
                        }
                    }
                }
                horizontal_rows = prev_extraction.get('stages', {}).get(stage_name, {}).get('entities', {}).get('horizontalRows', {}).get('data', None)
                vertical_rows = prev_extraction.get('stages', {}).get(stage_name, {}).get('entities', {}).get('verticalRows', {}).get('data', None)
                if horizontal_rows is not None and vertical_rows is not None:
                    horizontal_start = min(horizontal_rows)
                    vertical_start = min(vertical_rows)
                    entity_count = (vertical_start - horizontal_start) // 10
                    source['stages'][stage_name]['entities']['horizontal'] = {
                        'metadata': {
                            'address': {
                                'method': 'relative',
                                'value': horizontal_start - 0x80180000,
                                'type': 'u32',
                            },
                            'element': {
                                'structure': 'object-array',
                                'size': 10,
                                'constraint': {
                                    'method': 'elementCount',
                                    'elementCount': entity_count,
                                },
                                'properties': {
                                    'x': {
                                        'offset': '0x00',
                                        'type': 's16',
                                    },
                                    'y': {
                                        'offset': '0x02',
                                        'type': 's16',
                                    },
                                    'entityTypeId': {
                                        'offset': '0x04',
                                        'type': 'u16',
                                    },
                                    'entityRoomIndex': {
                                        'offset': '0x06',
                                        'type': 'u16',
                                    },
                                    'params': {
                                        'offset': '0x08',
                                        'type': 'u16',
                                    },
                                },
                            },
                        },
                    }
                    source['stages'][stage_name]['entities']['vertical'] = {
                        'metadata': {
                            'address': {
                                'method': 'relative',
                                'value': vertical_start - 0x80180000,
                                'type': 'u32',
                            },
                            'element': {
                                'structure': 'object-array',
                                'size': 10,
                                'constraint': {
                                    'method': 'elementCount',
                                    'elementCount': entity_count,
                                },
                                'properties': {
                                    'x': {
                                        'offset': '0x00',
                                        'type': 's16',
                                    },
                                    'y': {
                                        'offset': '0x02',
                                        'type': 's16',
                                    },
                                    'entityTypeId': {
                                        'offset': '0x04',
                                        'type': 'u16',
                                    },
                                    'entityRoomIndex': {
                                        'offset': '0x06',
                                        'type': 'u16',
                                    },
                                    'params': {
                                        'offset': '0x08',
                                        'type': 'u16',
                                    },
                                },
                            },
                        },
                    }
                    # After processing 70 elements in Marble Gallery's entity layout table, add 12 bytes of padding
                    # - Marble Gallery has 12 bytes of what appear to be garbage data in the middle of the entity layout table
                    # - In order to process the entity layout table as one contiguous piece of data, these bytes need to be ignored
                    # [350:356] = (2B42, 8018, 2B7E, 8018, 2BB0, 8018)
                    if stage_name == 'marbleGallery':
                        source['stages'][stage_name]['entities']['vertical']['metadata']['element']['postProcessing'] = [
                            {
                                'process': 'paddingAfterElement',
                                'whenArrayLength': 70,
                                'paddingAmount': 12,
                            },
                        ]
                        source['stages'][stage_name]['entities']['horizontal']['metadata']['element']['postProcessing'] = [
                            {
                                'process': 'paddingAfterElement',
                                'whenArrayLength': 70,
                                'paddingAmount': 12,
                            },
                        ]
        json.dump(source, target_file, indent='    ', sort_keys=True)
