import json
import os
import yaml

data = {
    'bossTeleporters': {
        'cutsceneMeetingMariaInClockRoom': ('stages.marbleGallery.rooms.clockRoom', 0, 0),
        'bossOlroxRight': ('stages.olroxsQuarters.rooms.olroxsRoom', 0, 1),
        'bossGranfaloonRight': ('stages.catacombs.rooms.granfaloonsLair', 0, 1),
        'bossMinotaurAndWerewolfLeft': ('stages.colosseum.rooms.arena', 0, 0),
        'bossMinotaurAndWerewolfRight': ('stages.colosseum.rooms.arena', 0, 1),
    #
        # 'XXX': ('stages.YYY.rooms.ZZZ', 0, 0),
        # 'XXX': ('stages.YYY.rooms.ZZZ', 0, 0),
        # '7': ('Underground Caverns', 'Underground Caverns, Scylla Wyrm Room', 0, 0), # Boss - Scylla
        # '8': ('Outer Wall', 'Outer Wall, Doppelganger Room', 0, 0), # Boss - Doppelganger 10
        # '9': ('Outer Wall', 'Outer Wall, Doppelganger Room', 0, 1), # Boss - Doppelganger 10
        # '10': ('Royal Chapel', 'Royal Chapel, Hippogryph Room', 0, 0), # Boss - Hippogryph
        # '11': ('Royal Chapel', 'Royal Chapel, Hippogryph Room', 0, 1), # Boss - Hippogryph
    #
        'bossRichter': ('stages.castleKeep.rooms.keepArea', 3, 3),
    #
        # '13': ('Abandoned Mine', 'Abandoned Mine, Cerberus Room', 0, 0), # Boss - Cerberus
        # '14': ('Abandoned Mine', 'Abandoned Mine, Cerberus Room', 0, 1), # Boss - Cerberus
        # '15': ('Reverse Colosseum', 'Reverse Colosseum, Arena', 0, 0), # Boss - Trio
        # '16': ('Reverse Colosseum', 'Reverse Colosseum, Arena', 0, 1), # Boss - Trio
        # '17': ('Necromancy Laboratory', 'Necromancy Laboratory, Slogra and Gaibon Room', 0, 0), # Boss - Beelzebub
        # '18': ('Necromancy Laboratory', 'Necromancy Laboratory, Slogra and Gaibon Room', 1, 3), # Boss - Beelzebub
        # '19': ('Cave', 'Cave, Cerberus Room', 0, 1), # Boss - Death
        # '20': ('Cave', 'Cave, Cerberus Room', 0, 0), # Boss - Death
        # '21': ('Anti-Chapel', 'Anti-Chapel, Hippogryph Room', 0, 1), # Boss - Medusa
        # '22': ('Anti-Chapel', 'Anti-Chapel, Hippogryph Room', 0, 0), # Boss - Medusa
        # '23': ('Reverse Outer Wall', 'Reverse Outer Wall, Doppelganger Room', 0, 1), # Boss - Creature
        # '24': ('Reverse Outer Wall', 'Reverse Outer Wall, Doppelganger Room', 0, 0), # Boss - Creature
        # '25': ('Reverse Caverns', 'Reverse Caverns, Scylla Wyrm Room', 0, 0), # Boss - Doppelganger 40
        # '26': ('Death Wing\'s Lair', 'Death Wing\'s Lair, Olrox\'s Room', 1, 0), # Boss - Akmodan II
        # '27': ('Floating Catacombs', 'Floating Catacombs, Granfaloon\'s Lair', 1, 0), # Boss - Galamoth
    },
    'familiarEvents': {
        'abandonedMineDemonSwitchDemon': ('stages.abandonedMine.rooms.demonSwitch', False),
        'abandonedMineDemonSwitchNoseDevil': ('stages.abandonedMine.rooms.demonSwitch', False),
        'alchemyLaboratoryBreakableFloorFaerie': ('stages.alchemyLaboratory.rooms.tallZigZagRoom', False),
        'alchemyLaboratoryBreakableFloorYousei': ('stages.alchemyLaboratory.rooms.tallZigZagRoom', False),
        'alchemyLaboratoryBreakableWallFaerie': ('stages.alchemyLaboratory.rooms.tallZigZagRoom', False),
        'alchemyLaboratoryBreakableWallYousei': ('stages.alchemyLaboratory.rooms.tallZigZagRoom', False),
        'catacombsDarkRoomBat': ('stages.catacombs.rooms.pitchBlackSpikeMaze', False),
        'catacombsDarkRoomDemon': ('stages.catacombs.rooms.pitchBlackSpikeMaze', False),
        'catacombsDarkRoomFaerie1': ('stages.catacombs.rooms.pitchBlackSpikeMaze', False),
        'catacombsDarkRoomFaerie2': ('stages.catacombs.rooms.pitchBlackSpikeMaze', False),
        'catacombsDarkRoomGhost': ('stages.catacombs.rooms.pitchBlackSpikeMaze', False),
        'catacombsDarkRoomNoseDevil': ('stages.catacombs.rooms.pitchBlackSpikeMaze', False),
        'catacombsDarkRoomSword': ('stages.catacombs.rooms.pitchBlackSpikeMaze', False),
        'catacombsDarkRoomYousei1': ('stages.catacombs.rooms.pitchBlackSpikeMaze', False),
        'catacombsDarkRoomYousei2': ('stages.catacombs.rooms.pitchBlackSpikeMaze', False),
        'caveDemonSwitchDemon': ('stages.cave.rooms.demonSwitch', True),
        'caveDemonSwitchNoseDevil': ('stages.cave.rooms.demonSwitch', True),
        'clockTowerLeftBreakableWallFaerie': ('stages.clockTower.rooms.pendulumRoom', False),
        'clockTowerLeftBreakableWallYousei': ('stages.clockTower.rooms.pendulumRoom', False),
        'clockTowerRightBreakableWallFaerie': ('stages.clockTower.rooms.leftGearRoom', False),
        'clockTowerRightBreakableWallYousei': ('stages.clockTower.rooms.leftGearRoom', False),
        'colosseum.MistGateYousei': ('stages.colosseum.rooms.topOfElevatorShaft', False),
        'colosseumMistGateFaerie': ('stages.colosseum.rooms.topOfElevatorShaft', False),
        'longLibraryMistGateFaerie': ('stages.longLibrary.rooms.lesserDemonArea', False),
        'longLibraryMistGateYousei': ('stages.longLibrary.rooms.lesserDemonArea', False),
        'longLibrarySecretBookcaseFaerie': ('stages.longLibrary.rooms.secretBookcaseRoom', False),
        'longLibrarySecretBookcaseYousei': ('stages.longLibrary.rooms.secretBookcaseRoom', False),
        'longLibraryShopDemon': ('stages.longLibrary.rooms.shop', False),
        'longLibraryShopFaerie': ('stages.longLibrary.rooms.shop', False),
        'longLibraryShopNoseDevil': ('stages.longLibrary.rooms.shop', False),
        'longLibraryShopSword': ('stages.longLibrary.rooms.shop', False),
        'longLibraryShopYousei': ('stages.longLibrary.rooms.shop', False),
        'olroxsQuartersBreakableWallFaerie': ('stages.olroxsQuarters.rooms.grandStaircase', False),
        'olroxsQuartersBreakableWallYousei': ('stages.olroxsQuarters.rooms.grandStaircase', False),
        'outerWall.MistGateYousei': ('stages.outerWall.rooms.lowerMedusaRoom', False),
        'outerWallMistGateFaerie': ('stages.outerWall.rooms.lowerMedusaRoom', False),
        'royalChapelConfessionalBoothDemon': ('stages.royalChapel.rooms.confessionalBooth', False),
        'royalChapelConfessionalBoothFaerie': ('stages.royalChapel.rooms.confessionalBooth', False),
        'royalChapelConfessionalBoothNoseDevil': ('stages.royalChapel.rooms.confessionalBooth', False),
        'royalChapelConfessionalBoothSword': ('stages.royalChapel.rooms.confessionalBooth', False),
        'royalChapelConfessionalBoothYousei': ('stages.royalChapel.rooms.confessionalBooth', False),
        'royalChapelMistGateFaerie': ('stages.royalChapel.rooms.spikeHallway', False),
        'royalChapelMistGateYousei': ('stages.royalChapel.rooms.spikeHallway', False),
        'undergroundCavernsBreakableFloorFaerie': ('stages.undergroundCaverns.rooms.hiddenCrystalEntrance', False),
        'undergroundCavernsBreakableFloorYousei': ('stages.undergroundCaverns.rooms.hiddenCrystalEntrance', False),
        'undergroundCavernsBreakableWallFaerie': ('stages.undergroundCaverns.rooms.plaqueRoomWithBreakableWall', False),
        'undergroundCavernsBreakableWallYousei': ('stages.undergroundCaverns.rooms.plaqueRoomWithBreakableWall', False),
    },
    'reversedStages': {
        'abandonedMine': 'cave',
        'alchemyLaboratory': 'necromancyLaboratory',
        'castleCenter': 'reverseCastleCenter',
        'castleEntrance': 'reverseEntrance',
        'castleKeep': 'reverseKeep',
        'catacombs': 'floatingCatacombs',
        'clockTower': 'reverseClockTower',
        'colosseum': 'reverseColosseum',
        'longLibrary': 'forbiddenLibrary',
        'marbleGallery': 'blackMarbleGallery',
        'olroxsQuarters': 'deathWingsLair',
        'outerWall': 'reverseOuterWall',
        'royalChapel': 'antiChapel',
        'undergroundCaverns': 'reverseCaverns',
        'warpRooms': 'reverseWarpRooms',
    },
    'rooms': {
        'abandonedMine': [
            'cerberusRoom',
        ],
    },
    'bossRooms': {
        'bossCerberusCerberusRoom': ('stages.bossCerberus.rooms.cerberusRoom', 'stages.abandonedMine.rooms.cerberusRoom', 0, 0),
        'bossCerberusFakeRoomA': ('stages.bossCerberus.rooms.fakeRoomA', 'stages.abandonedMine.rooms.cerberusRoom', 0, -1),
        'bossCerberusFakeRoomB': ('stages.bossCerberus.rooms.fakeRoomB', 'stages.abandonedMine.rooms.cerberusRoom', 0, 2),
    },
    'secretMapTileReveals': {
        'anteroomStaircase': ('stages.castleKeep.rooms.keepArea', 3, 5),
        'demonSwitch': ('stages.abandonedMine.rooms.demonSwitch', 0, 0),
        'snakeColumn': ('stages.abandonedMine.rooms.snakeColumn', 1, 0),
        'alchemyLaboratoryBreakableFloor': ('stages.alchemyLaboratory.rooms.tallZigZagRoom', 2, 0),
        'alchemyLaboratoryBreakableWall': ('stages.alchemyLaboratory.rooms.tallZigZagRoom', 2, 0),
        'jewelSwordPassage': ('stages.castleEntrance.rooms.mermanRoom', 1, 0),
        'clockTowerSecretWall': ('stages.clockTower.rooms.leftGearRoom', 0, 0),
        'clockTowerBreakableWall': ('stages.clockTower.rooms.pendulumRoom', 1, 0),
        'colosseumBreakableCeiling': ('stages.colosseum.rooms.bladeMasterRoom', 0, 2),
        'colosseumUnknown': ('stages.colosseum.rooms.topOfElevatorShaft', 0, 0),
        'marbleGallerySecretFloor': ('stages.marbleGallery.rooms.clockRoom', 0, 0),
        'olroxsQuartersBreakableCeiling': ('stages.olroxsQuarters.rooms.catwalkCrypt', 0, 1),
        'olroxsQuartersBreakableWall': ('stages.olroxsQuarters.rooms.grandStaircase', 1, 2),
        'undergroundCavernsBreakableFloor': ('stages.undergroundCaverns.rooms.hiddenCrystalEntrance', 1, 2),
        'undergroundCavernsBreakableWall': ('stages.undergroundCaverns.rooms.plaqueRoomWithBreakableWall', 0, 0),
    },
    'stages': {
        'castleKeep': {
            'reversedStage': '',
            'rooms': {
                'keepArea': True,
            },
        },
    },
}

if __name__ == '__main__':
    with (
        open(os.path.join('data', 'change-dependencies-template.yaml')) as source_file,
        open(os.path.join('build', 'change-dependencies.json'), 'w') as target_file,
    ):
        target = yaml.safe_load(source_file)
        evaluate = target['changes'][0]['evaluate']
        # Rooms
        for (stage_name, room_names) in data['rooms'].items():
            print('', stage_name)
            for room_name in room_names:
                print(' -', room_name)
                for (target_property_name, source_property_a, source_property_b) in (
                    ('right', 'left', '_columns'),
                    ('bottom', 'top', '_rows'),
                ):
                    property_key = '.'.join(('stages', stage_name, 'rooms', room_name))
                    transformation_name = '.'.join((property_key, target_property_name))
                    print('   -', transformation_name)
                    transformation = [
                        {
                            'action': 'get',
                            'type': 'property',
                            'property': '.'.join((property_key, source_property_a)),
                        },
                        {
                            'action': 'add',
                            'type': 'property',
                            'property': '.'.join((property_key, source_property_b)),
                        },
                        {
                            'action': 'subtract',
                            'type': 'constant',
                            'constant': 1,
                        },
                        {
                            'action': 'set',
                            'type': 'property',
                            'property': transformation_name,
                        },
                    ]
                    evaluate['evaluations'][transformation_name] = transformation
                    evaluate['evaluationOrder'].append(transformation_name)
                # Calculate bottom
        # TODO(sestren): Boss Rooms
        # 'bossCerberusCerberusRoom': 'stages.bossCerberus.rooms.cerberusRoom.left' = 'stages.abandonedMine.rooms.cerberusRoom.left',
        # for (transformation_key, (target_property_key, source_property_key, offset_top, offset_left)) in data[transformation_group_key].items():
        #     # LEFT
        #     # get source.left
        #     # add #offset_left
        #     # set target.left
        #     # RIGHT
        #     # get source.right
        #     # subtract source.left
        #     # add 1
        #     # ???
        #     # set target.right
        #     # ...
        #     # subtract source.left
        #     # add 1
        #     # add source.left
        #     # set target.left
        #     # target.left = source.left + offset_left
        #     # target.right = target.left + targ
        #     # target.top = source.top + offset_top
        #     for (source, source_value, target_key) in (
        #             ('top', top, 'roomY'),
        #             ('left', left, 'roomX'),
        #         ):
        #             transformation_name = '.'.join((transformation_key, source_key))
        #             transformation = []
        #             transformation.append({
        #                 'action': 'get',
        #                 'type': 'property',
        #                 'property': '.'.join((target_property_key, property_name)),
        #             })
        #             if source_value != 0:
        #                 transformation.append({
        #                     'action': 'add',
        #                     'type': 'constant',
        #                     'constant': source_value,
        #                 })
        #             transformation.append({
        #                 'action': 'set',
        #                 'type': 'property',
        #                 'property': transformation_name,
        #             })
        #             evaluate['evaluations'][transformation_name] = transformation
        #             evaluate['evaluationOrder'].append(transformation_name)
        # TODO(sestren): Reverse Stages
        # Secret Map Tile Reveals and Boss Teleporters
        for transformation_group_key in (
            'bossTeleporters',
            'secretMapTileReveals',
        ):
            for (transformation_key, (room_key, top, left)) in data[transformation_group_key].items():
                for (source_key, source_value, target_key) in (
                    ('top', top, 'roomY'),
                    ('left', left, 'roomX'),
                ):
                    transformation_name = '.'.join((transformation_group_key, transformation_key, target_key))
                    transformation = []
                    transformation.append({
                        'action': 'get',
                        'type': 'property',
                        'property': '.'.join((room_key, source_key)),
                    })
                    if source_value != 0:
                        transformation.append({
                            'action': 'add',
                            'type': 'constant',
                            'constant': source_value,
                        })
                    transformation.append({
                        'action': 'set',
                        'type': 'property',
                        'property': transformation_name,
                    })
                    evaluate['evaluations'][transformation_name] = transformation
                    evaluate['evaluationOrder'].append(transformation_name)
        # Familiar Events
        for familiar_key in (
            'bat',
            'demon',
            'faerie',
            'ghost',
            'noseDemon',
            'sword',
            'yousei',
        ):
            for (transformation_key, (room_key, inverted_ind)) in data['familiarEvents'].items():
                for (source_key, source_value, target_key) in (
                    ('top', top, 'roomY'),
                    ('left', left, 'roomX'),
                ):
                    transformation_name = '.'.join(('familiarEvents', familiar_key, transformation_key, target_key))
                    transformation = []
                    transformation.append({
                        'action': 'get',
                        'type': 'property',
                        'property': '.'.join((room_key, source_key)),
                    })
                    if inverted_ind:
                        transformation.append({
                            'action': 'multiply',
                            'type': 'constant',
                            'constant': -1,
                        })
                    transformation.append({
                        'action': 'set',
                        'type': 'property',
                        'property': transformation_name,
                    })
                    evaluate['evaluations'][transformation_name] = transformation
                    evaluate['evaluationOrder'].append(transformation_name)
        json.dump(target, target_file, indent='    ', sort_keys=True)
