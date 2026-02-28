import json
import os
import yaml

data = {
    'associatedStages': {
        'antiChapel': ('royalChapel', True),
        'blackMarbleGallery': ('marbleGallery', True),
        'castleEntranceRevisited': ('castleEntrance', False),
        'cave': ('abandonedMine', True),
        'deathWingsLair': ('olroxsQuarters', True),
        'floatingCatacombs': ('catacombs', True),
        'forbiddenLibrary': ('longLibrary', True),
        'necromancyLaboratory': ('alchemyLaboratory', True),
        'reverseCastleCenter': ('castleCenter', True),
        'reverseCaverns': ('undergroundCaverns', True),
        'reverseClockTower': ('clockTower', True),
        'reverseColosseum': ('colosseum', True),
        'reverseEntrance': ('castleEntrance', True),
        'reverseKeep': ('castleKeep', True),
        'reverseOuterWall': ('outerWall', True),
        'reverseWarpRooms': ('warpRooms', True),
    },
    'bossRooms': {
        'bossCerberus': {
            'cerberusRoom': ('abandonedMine', 'cerberusRoom', 0, 0),
            'triggerTeleporterA': ('abandonedMine', 'cerberusRoom', 0, -1),
            'triggerTeleporterB': ('abandonedMine', 'cerberusRoom', 0, 2),
        },
        'bossMedusa': {
            'hippogryphRoom': ('antiChapel', 'hippogryphRoom', 0, 0),
            'triggerTeleporterA': ('antiChapel', 'hippogryphRoom', 0, -1),
            'triggerTeleporterB': ('antiChapel', 'hippogryphRoom', 0, 2),
        },
        'bossRichter': {
            'throneRoom': ('castleKeep', 'keepArea', 3, 3),
        },
        'bossGranfaloon': {
            'granfaloonsLair': ('catacombs', 'granfaloonsLair', 0, 0),
            'triggerTeleporterA': ('catacombs', 'granfaloonsLair', 0, 2),
            'triggerTeleporterB': ('catacombs', 'granfaloonsLair', 1, -1),
        },
        'bossDeath': {
            'cerberusRoom': ('cave', 'cerberusRoom', 0, 0),
            'triggerTeleporterA': ('cave', 'cerberusRoom', 0, -1),
            'triggerTeleporterB': ('cave', 'cerberusRoom', 0, 2),
        },
        'bossMinotaurAndWerewolf': {
            'arena': ('colosseum', 'arena', 0, 0),
            'triggerTeleporterA': ('colosseum', 'arena', 0, -1),
            'triggerTeleporterB': ('colosseum', 'arena', 0, 2),
        },
        'bossAkmodanII': {
            'olroxsRoom': ('deathWingsLair', 'olroxsRoom', 0, 0),
            'triggerTeleporterA': ('deathWingsLair', 'olroxsRoom', 1, -1),
            'triggerTeleporterB': ('deathWingsLair', 'olroxsRoom', 1, 2),
        },
        'bossGalamoth': {
            'granfaloonsLair': ('floatingCatacombs', 'granfaloonsLair', 0, 0),
            'triggerTeleporterA': ('floatingCatacombs', 'granfaloonsLair', 0, 2),
            'triggerTeleporterB': ('floatingCatacombs', 'granfaloonsLair', 1, -1),
        },
        'bossBeelzebub': {
            'slograAndGaibonRoom': ('necromancyLaboratory', 'slograAndGaibonRoom', 0, 0),
            'triggerTeleporterA': ('necromancyLaboratory', 'slograAndGaibonRoom', 0, -1),
            'triggerTeleporterB': ('necromancyLaboratory', 'slograAndGaibonRoom', 1, -1),
            'triggerTeleporterB': ('necromancyLaboratory', 'slograAndGaibonRoom', 1, 4),
        },
        'bossOlrox': {
            'olroxsRoom': ('olroxsQuarters', 'olroxsRoom', 0, 0),
            'triggerTeleporterA': ('olroxsQuarters', 'olroxsRoom', 0, -1),
            'triggerTeleporterB': ('olroxsQuarters', 'olroxsRoom', 0, 2),
        },
        'bossDoppelganger10': {
            'doppelgangerRoom': ('outerWall', 'doppelgangerRoom', 0, 0),
            'triggerTeleporterA': ('outerWall', 'doppelgangerRoom', 0, -1),
            'triggerTeleporterB': ('outerWall', 'doppelgangerRoom', 0, 2),
        },
        'bossDoppelganger40': {
            'scyllaWyrmRoom': ('reverseCaverns', 'scyllaWyrmRoom', 0, 0),
            'triggerTeleporterA': ('reverseCaverns', 'scyllaWyrmRoom', 0, -1),
            'triggerTeleporterB': ('reverseCaverns', 'scyllaWyrmRoom', 0, 1),
        },
        'bossTrio': {
            'arena': ('reverseColosseum', 'arena', 0, 0),
            'triggerTeleporterA': ('reverseColosseum', 'arena', 0, -1),
            'triggerTeleporterB': ('reverseColosseum', 'arena', 0, 2),
        },
        'bossCreature': {
            'doppelgangerRoom': ('reverseOuterWall', 'doppelgangerRoom', 0, 0),
            'triggerTeleporterA': ('reverseOuterWall', 'doppelgangerRoom', 0, -1),
            'triggerTeleporterB': ('reverseOuterWall', 'doppelgangerRoom', 0, 2),
        },
        'bossHippogryph': {
            'hippogryphRoom': ('outerWall', 'hippogryphRoom', 0, 0),
            'triggerTeleporterA': ('outerWall', 'hippogryphRoom', 0, -1),
            'triggerTeleporterB': ('outerWall', 'hippogryphRoom', 0, 2),
        },
        'bossScylla': {
            'scyllaWyrmRoom': ('undergroundCaverns', 'scyllaWyrmRoom', 0, 0),
            'triggerTeleporterA': ('undergroundCaverns', 'scyllaWyrmRoom', 0, -1),
            'risingWaterRoom': ('undergroundCaverns', 'scyllaWyrmRoom', 0, 1),
            'scyllaRoom': ('undergroundCaverns', 'scyllaWyrmRoom', -1, 1),
            'crystalCloakRoom': ('undergroundCaverns', 'scyllaWyrmRoom', -1, 0),
        }
    },
    'bossTeleporters': {
        'cutsceneMeetingMariaInClockRoom': ('marbleGallery', 'clockRoom', 0, 0),
        'bossOlroxRight': ('olroxsQuarters', 'olroxsRoom', 0, 1),
        'bossGranfaloonRight': ('catacombs', 'granfaloonsLair', 0, 1),
        'bossMinotaurAndWerewolfLeft': ('colosseum', 'arena', 0, 0),
        'bossMinotaurAndWerewolfRight': ('colosseum', 'arena', 0, 1),
        'bossScylla': ('undergroundCaverns', 'scyllaWyrmRoom', 0, 0),
        'bossDoppelganger10Left': ('outerWall', 'doppelgangerRoom', 0, 0),
        'bossDoppelganger10Right': ('outerWall', 'doppelgangerRoom', 0, 1),
        'bossHippogryphLeft': ('royalChapel', 'hippogryphRoom', 0, 0),
        'bossHippogryphRight': ('royalChapel', 'hippogryphRoom', 0, 1),
        'bossRichter': ('castleKeep', 'keepArea', 3, 3),
        'bossCerberusLeft': ('abandonedMine', 'cerberusRoom', 0, 0),
        'bossCerberusRight': ('abandonedMine', 'cerberusRoom', 0, 1),
        'bossTrioLeft': ('reverseColosseum', 'arena', 0, 0),
        'bossTrioRight': ('reverseColosseum', 'arena', 0, 1),
        'bossBeelzebubLeft': ('necromancyLaboratory', 'slograAndGaibonRoom', 0, 0),
        'bossBeelzebubRight': ('necromancyLaboratory', 'slograAndGaibonRoom', 1, 3),
        'bossDeathLeft': ('cave', 'cerberusRoom', 0, 0),
        'bossDeathRight': ('cave', 'cerberusRoom', 0, 1),
        'bossMedusaLeft': ('antiChapel', 'hippogryphRoom', 0, 0),
        'bossMedusaRight': ('antiChapel', 'hippogryphRoom', 0, 1),
        'bossCreatureLeft': ('reverseOuterWall', 'doppelgangerRoom', 0, 0),
        'bossCreatureRight': ('reverseOuterWall', 'doppelgangerRoom', 0, 1),
        'bossDoppelganger40': ('reverseCaverns', 'scyllaWyrmRoom', 0, 0),
        'bossAkmodanII': ('deathWingsLair', 'olroxsRoom', 1, 0),
        'bossGalamoth': ('floatingCatacombs', 'granfaloonsLair', 1, 0),
    },
    'familiarEvents': {
        'abandonedMineDemonSwitchDemon': ('abandonedMine', 'demonSwitch', False),
        'abandonedMineDemonSwitchNoseDevil': ('abandonedMine', 'demonSwitch', False),
        'alchemyLaboratoryBreakableFloorFaerie': ('alchemyLaboratory', 'tallZigZagRoom', False),
        'alchemyLaboratoryBreakableFloorYousei': ('alchemyLaboratory', 'tallZigZagRoom', False),
        'alchemyLaboratoryBreakableWallFaerie': ('alchemyLaboratory', 'tallZigZagRoom', False),
        'alchemyLaboratoryBreakableWallYousei': ('alchemyLaboratory', 'tallZigZagRoom', False),
        'catacombsDarkRoomBat': ('catacombs', 'pitchBlackSpikeMaze', False),
        'catacombsDarkRoomDemon': ('catacombs', 'pitchBlackSpikeMaze', False),
        'catacombsDarkRoomFaerie1': ('catacombs', 'pitchBlackSpikeMaze', False),
        'catacombsDarkRoomFaerie2': ('catacombs', 'pitchBlackSpikeMaze', False),
        'catacombsDarkRoomGhost': ('catacombs', 'pitchBlackSpikeMaze', False),
        'catacombsDarkRoomNoseDevil': ('catacombs', 'pitchBlackSpikeMaze', False),
        'catacombsDarkRoomSword': ('catacombs', 'pitchBlackSpikeMaze', False),
        'catacombsDarkRoomYousei1': ('catacombs', 'pitchBlackSpikeMaze', False),
        'catacombsDarkRoomYousei2': ('catacombs', 'pitchBlackSpikeMaze', False),
        'caveDemonSwitchDemon': ('cave', 'demonSwitch', True),
        'caveDemonSwitchNoseDevil': ('cave', 'demonSwitch', True),
        'clockTowerLeftBreakableWallFaerie': ('clockTower', 'pendulumRoom', False),
        'clockTowerLeftBreakableWallYousei': ('clockTower', 'pendulumRoom', False),
        'clockTowerRightBreakableWallFaerie': ('clockTower', 'leftGearRoom', False),
        'clockTowerRightBreakableWallYousei': ('clockTower', 'leftGearRoom', False),
        'colosseumMistGateYousei': ('colosseum', 'topOfElevatorShaft', False),
        'colosseumMistGateFaerie': ('colosseum', 'topOfElevatorShaft', False),
        'longLibraryMistGateFaerie': ('longLibrary', 'lesserDemonArea', False),
        'longLibraryMistGateYousei': ('longLibrary', 'lesserDemonArea', False),
        'longLibrarySecretBookcaseFaerie': ('longLibrary', 'secretBookcaseRoom', False),
        'longLibrarySecretBookcaseYousei': ('longLibrary', 'secretBookcaseRoom', False),
        'longLibraryShopDemon': ('longLibrary', 'shop', False),
        'longLibraryShopFaerie': ('longLibrary', 'shop', False),
        'longLibraryShopNoseDevil': ('longLibrary', 'shop', False),
        'longLibraryShopSword': ('longLibrary', 'shop', False),
        'longLibraryShopYousei': ('longLibrary', 'shop', False),
        'olroxsQuartersBreakableWallFaerie': ('olroxsQuarters', 'grandStaircase', False),
        'olroxsQuartersBreakableWallYousei': ('olroxsQuarters', 'grandStaircase', False),
        'outerWallMistGateYousei': ('outerWall', 'lowerMedusaRoom', False),
        'outerWallMistGateFaerie': ('outerWall', 'lowerMedusaRoom', False),
        'royalChapelConfessionalBoothDemon': ('royalChapel', 'confessionalBooth', False),
        'royalChapelConfessionalBoothFaerie': ('royalChapel', 'confessionalBooth', False),
        'royalChapelConfessionalBoothNoseDevil': ('royalChapel', 'confessionalBooth', False),
        'royalChapelConfessionalBoothSword': ('royalChapel', 'confessionalBooth', False),
        'royalChapelConfessionalBoothYousei': ('royalChapel', 'confessionalBooth', False),
        'royalChapelMistGateFaerie': ('royalChapel', 'spikeHallway', False),
        'royalChapelMistGateYousei': ('royalChapel', 'spikeHallway', False),
        'undergroundCavernsBreakableFloorFaerie': ('undergroundCaverns', 'hiddenCrystalEntrance', False),
        'undergroundCavernsBreakableFloorYousei': ('undergroundCaverns', 'hiddenCrystalEntrance', False),
        'undergroundCavernsBreakableWallFaerie': ('undergroundCaverns', 'plaqueRoomWithBreakableWall', False),
        'undergroundCavernsBreakableWallYousei': ('undergroundCaverns', 'plaqueRoomWithBreakableWall', False),
    },
    'rooms': {
        'abandonedMine': {
            'bend': [
                'bend',
            ],
            'cerberusRoom': [
                'cerberusRoom',
            ],
            'demonCard': [
                'demonCard',
            ],
            'demonSwitch': [
                'demonSwitch',
            ],
            'fourWayIntersection': [
                'fourWayIntersection',
            ],
            'karmaCoinRoom': [
                'karmaCoinRoom',
            ],
            'loadingRoomToCatacombs': [
                'loadingRoomToCatacombs',
            ],
            'loadingRoomToUndergroundCaverns': [
                'loadingRoomToUndergroundCaverns',
            ],
            'loadingRoomToWarpRooms': [
                'loadingRoomToWarpRooms',
            ],
            'lowerStairwell': [
                'lowerStairwell',
            ],
            'peanutsRoom': [
                'peanutsRoom',
            ],
            'saveRoom': [
                'saveRoom',
            ],
            'snakeColumn': [
                'snakeColumn',
            ],
            'triggerTeleporterToCatacombs': [],
            'triggerTeleporterToUndergroundCaverns': [],
            'triggerTeleporterToWarpRooms': [],
            'venusWeedRoom': [
                'venusWeedRoom',
            ],
            'wellLitSkullRoom': [
                'wellLitSkullRoom',
            ],
            'wolfsHeadColumn': [
                'wolfsHeadColumn',
            ],
        },
        'alchemyLaboratory': {
            'batCardRoom': [
                'batCardRoom',
            ],
            'bloodyZombieHallway': [
                'bloodyZombieHallway',
            ],
            'blueDoorHallway': [
                'blueDoorHallway',
            ],
            'boxPuzzleRoom': [
                'boxPuzzleRoom',
            ],
            'cannonRoom': [
                'cannonRoom',
            ],
            'clothCapeRoom': [
                'clothCapeRoom',
            ],
            'corridorToElevator': [
                'corridorToElevator',
            ],
            'elevatorShaft': [
                'elevatorShaft',
            ],
            'emptyZigZagRoom': [
                'emptyZigZagRoom',
            ],
            'entryway': [
                'entryway',
            ],
            'exitToMarbleGallery': [
                'exitToMarbleGallery',
            ],
            'exitToRoyalChapel': [
                'exitToRoyalChapel',
            ],
            'glassVats': [
                'glassVats',
            ],
            'heartMaxUpRoom': [
                'heartMaxUpRoom',
            ],
            'loadingRoomToCastleEntrance': [
                'loadingRoomToCastleEntrance',
            ],
            'loadingRoomToMarbleGallery': [
                'loadingRoomToMarbleGallery',
            ],
            'loadingRoomToRoyalChapel': [
                'loadingRoomToRoyalChapel',
            ],
            'redSkeletonLiftRoom': [
                'redSkeletonLiftRoom',
            ],
            'saveRoomA': [
                'saveRoomA',
            ],
            'saveRoomB': [
                'saveRoomB',
            ],
            'saveRoomC': [
                'saveRoomC',
            ],
            'secretLifeMaxUpRoom': [
                'secretLifeMaxUpRoom',
            ],
            'shortZigZagRoom': [
                'shortZigZagRoom',
            ],
            'skillOfWolfRoom': [
                'skillOfWolfRoom',
            ],
            'slograAndGaibonRoom': [
                'slograAndGaibonRoom',
            ],
            'sunglassesRoom': [
                'sunglassesRoom',
            ],
            'tallSpittleboneRoom': [
                'tallSpittleboneRoom',
            ],
            'tallZigZagRoom': [
                'tallZigZagRoom',
            ],
            'tetrominoRoom': [
                'tetrominoRoom',
            ],
            'triggerTeleporterToCastleEntrance': [],
            'triggerTeleporterToMarbleGallery': [],
            'triggerTeleporterToRoyalChapel': [],
        },
        'antiChapel': {
            'chapelStaircase': [
                'chapelStaircase',
            ],
            'confessionalBooth': [
                'confessionalBooth',
                'confessionalBoothBackground',
            ],
            'emptyRoom': [
                'emptyRoom',
                'emptyRoomBackground',
            ],
            'gogglesRoom': [
                'gogglesRoom',
                'gogglesRoomBackground',
            ],
            'hippogryphRoom': [
                'hippogryphRoom',
                'hippogryphRoomBackground',
            ],
            'leftTower': [
                'leftTower',
            ],
            'loadingRoomToAlchemyLaboratory': [
                'loadingRoomToAlchemyLaboratory',
            ],
            'loadingRoomToCastleKeep': [
                'loadingRoomToCastleKeep',
            ],
            'loadingRoomToColosseum': [
                'loadingRoomToColosseum',
            ],
            'loadingRoomToOlroxsQuarters': [
                'loadingRoomToOlroxsQuarters',
            ],
            'middleTower': [
                'middleTower',
            ],
            'nave': [
                'nave',
            ],
            'pushingStatueShortcut': [
                'pushingStatueShortcut',
                'pushingStatueShortcutBackground',
            ],
            'rightTower': [
                'rightTower',
            ],
            'saveRoomA': [
                'saveRoomA',
            ],
            'saveRoomB': [
                'saveRoomB',
            ],
            'silverRingRoom': [
                'silverRingRoom',
                'silverRingRoomBackground',
            ],
            'spikeHallway': [
                'spikeHallway',
                'spikeHallwayBackground',
            ],
            'statueLedge': [
                'statueLedge',
                'statueLedgeBackground',
            ],
            'triggerTeleporterToAlchemyLaboratory': [],
            'triggerTeleporterToCastleKeep': [],
            'triggerTeleporterToColosseum': [],
            'triggerTeleporterToOlroxsQuarters': [],
            'walkwayBetweenTowers': [
                'walkwayBetweenTowers',
                'walkwayBetweenTowersBackground',
            ],
            'walkwayLeftOfHippogryph': [
                'walkwayLeftOfHippogryph',
                'walkwayLeftOfHippogryphBackground',
            ],
            'walkwayRightOfHippogryph': [
                'walkwayRightOfHippogryph',
                'walkwayRightOfHippogryphBackground',
            ],
        },
        'blackMarbleGallery': {
            'alucartRoom': [
                'alucartRoom',
            ],
            'beneathDropoff': [
                'beneathDropoff',
                'beneathDropoffBackground',
            ],
            'beneathLeftTrapdoor': [
                'beneathLeftTrapdoor',
                'beneathLeftTrapdoorBackground',
            ],
            'beneathRightTrapdoor': [
                'beneathRightTrapdoor',
                'beneathRightTrapdoorBackground',
            ],
            'blueDoorRoom': [
                'blueDoorRoom',
                'blueDoorRoomBackground',
            ],
            'clockRoom': [
                'clockRoom',
                'clockRoomBackground',
            ],
            'dropoff': [
                'dropoff',
                'dropoffBackground',
            ],
            'elevatorRoom': [
                'elevatorRoom',
            ],
            'emptyRoom': [
                'emptyRoom',
                'emptyRoomBackground',
            ],
            'entrance': [
                'entrance',
                'entranceBackground',
            ],
            'gravityBootsRoom': [
                'gravityBootsRoom',
            ],
            'leftOfClockRoom': [
                'leftOfClockRoom',
                'leftOfClockRoomBackground',
            ],
            'loadingRoomToAlchemyLaboratory': [
                'loadingRoomToAlchemyLaboratory',
            ],
            'loadingRoomToCastleEntrance': [
                'loadingRoomToCastleEntrance',
            ],
            'loadingRoomToOlroxsQuarters': [
                'loadingRoomToOlroxsQuarters',
            ],
            'loadingRoomToOuterWall': [
                'loadingRoomToOuterWall',
            ],
            'loadingRoomToUndergroundCaverns': [
                'loadingRoomToUndergroundCaverns',
            ],
            'longHallway': [
                'longHallway',
            ],
            'ouijaTableStairway': [
                'ouijaTableStairway',
                'ouijaTableStairwayBackground',
            ],
            'pathwayAfterLeftStatue': [
                'pathwayAfterLeftStatue',
            ],
            'pathwayAfterRightStatue': [
                'pathwayAfterRightStatue',
            ],
            'powerUpRoom': [
                'powerUpRoom',
            ],
            'rightOfClockRoom': [
                'rightOfClockRoom',
                'rightOfClockRoomBackground',
            ],
            'sShapedHallways': [
                'sShapedHallways',
                'sShapedHallwaysBackground',
            ],
            'saveRoomA': [
                'saveRoomA',
            ],
            'saveRoomB': [
                'saveRoomB',
            ],
            'slingerStaircase': [
                'slingerStaircase',
                'slingerStaircaseBackground',
            ],
            'spiritOrbRoom': [
                'spiritOrbRoom',
                'spiritOrbRoomBackground',
            ],
            'stainedGlassCorner': [
                'stainedGlassCorner',
                'stainedGlassCornerBackground',
            ],
            'stairwellToUndergroundCaverns': [
                'stairwellToUndergroundCaverns',
                'stairwellToUndergroundCavernsBackground',
            ],
            'stopwatchRoom': [
                'stopwatchRoom',
                'stopwatchRoomBackground',
            ],
            'tallStainedGlassWindows': [
                'tallStainedGlassWindows',
                'tallStainedGlassWindowsBackground',
            ],
            'threePaths': [
                'threePaths',
                'threePathsBackground',
            ],
            'triggerTeleporterToAlchemyLaboratory': [],
            'triggerTeleporterToCastleCenter': [],
            'triggerTeleporterToCastleEntrance': [],
            'triggerTeleporterToOlroxsQuarters': [],
            'triggerTeleporterToOuterWall': [],
            'triggerTeleporterToUndergroundCaverns': [],
        },
        'bossAkmodanII': {
            'olroxsRoom': [
                'olroxsRoom',
            ],
            'triggerTeleporterA': [],
            'triggerTeleporterB': [],
        },
        'bossBeelzebub': {
            'slograAndGaibonRoom': [
                'slograAndGaibonRoom',
            ],
            'triggerTeleporterA': [],
            'triggerTeleporterB': [],
            'triggerTeleporterC': [],
        },
        'bossCerberus': {
            'cerberusRoom': [
                'cerberusRoom',
            ],
            'triggerTeleporterA': [],
            'triggerTeleporterB': [],
        },
        'bossCreature': {
            'doppelgangerRoom': [
                'doppelgangerRoom',
            ],
            'triggerTeleporterA': [],
            'triggerTeleporterB': [],
        },
        'bossDeath': {
            'cerberusRoom': [
                'cerberusRoom',
            ],
            'triggerTeleporterA': [],
            'triggerTeleporterB': [],
        },
        'bossDoppelganger10': {
            'doppelgangerRoom': [
                'doppelgangerRoom',
            ],
            'triggerTeleporterA': [],
            'triggerTeleporterB': [],
        },
        'bossDoppelganger40': {
            'scyllaWyrmRoom': [
                'scyllaWyrmRoom',
                'scyllaWyrmRoomBackground',
            ],
            'triggerTeleporterA': [],
            'triggerTeleporterB': [],
        },
        'bossGalamoth': {
            'granfaloonsLair': [
                'granfaloonsLair',
                'granfaloonsLairBackground',
            ],
            'triggerTeleporterA': [],
            'triggerTeleporterB': [],
        },
        'bossGranfaloon': {
            'granfaloonsLair': [
                'granfaloonsLair',
                'granfaloonsLairBackground',
            ],
            'triggerTeleporterA': [],
            'triggerTeleporterB': [],
        },
        'bossHippogryph': {
            'hippogryphRoom': [
                'hippogryphRoom',
                'hippogryphRoomBackground',
            ],
            'triggerTeleporterA': [],
            'triggerTeleporterB': [],
        },
        'bossMedusa': {
            'hippogryphRoom': [
                'hippogryphRoom',
                'hippogryphRoomBackground',
            ],
            'triggerTeleporterA': [
            ],
            'triggerTeleporterB': [
            ],
        },
        'bossMinotaurAndWerewolf': {
            'arena': [
                'arena',
            ],
            'triggerTeleporterA': [],
            'triggerTeleporterB': [],
        },
        'bossOlrox': {
            'olroxsRoom': [
                'olroxsRoom',
            ],
            'triggerTeleporterA': [],
            'triggerTeleporterB': [],
        },
        'bossRichter': {
            'throneRoom': [
                'throneRoom',
            ],
        },
        'bossScylla': {
            'crystalCloakRoom': [
                'crystalCloakRoom',
                'crystalCloakRoomBackground',
            ],
            'risingWaterRoom': [
                'risingWaterRoom',
                'risingWaterRoomBackground',
            ],
            'scyllaRoom': [
                'scyllaRoom',
                'scyllaRoomBackground',
            ],
            'scyllaWyrmRoom': [
                'scyllaWyrmRoom',
                'scyllaWyrmRoomBackground',
            ],
            'triggerTeleporterA': [],
        },
        'bossShaftAndDracula': {
            'centerCube': [
                'centerCube',
            ],
            'elevatorShaft': [
                'elevatorShaft',
            ],
            'triggerTeleporterA': [],
            'unknownRoomId02': [
                'unknownRoomId02',
            ],
        },
        'bossSuccubus': {
            'unknownRoomId00': [
                'unknownRoomId00',
            ],
            'unknownRoomId01': [
                'unknownRoomId01',
            ],
        },
        'bossTrio': {
            'arena': [
                'arena',
            ],
            'triggerTeleporterA': [],
            'triggerTeleporterB': [],
        },
        'castleCenter': {
            'centerCube': [
                'centerCube',
            ],
            'elevatorShaft': [
                'elevatorShaft',
            ],
            'triggerTeleporterToBO6': [],
            'triggerTeleporterToMarbleGallery': [],
            'unknownRoomId02': [
                'unknownRoomId02',
            ],
        },
        'castleEntranceRevisited': {
            'afterDrawbridge': [
                'afterDrawbridge',
            ],
            'atticEntrance': [
                'atticEntrance',
                'atticEntranceBackground',
            ],
            'atticHallway': [
                'atticHallway',
                'atticHallwayBackground',
            ],
            'atticStaircase': [
                'atticStaircase',
                'atticStaircaseBackground',
            ],
            'cubeOfZoeRoom': [
                'cubeOfZoeRoom',
                'cubeOfZoeRoomBackground',
            ],
            'dropUnderPortcullis': [
                'dropUnderPortcullis',
                'dropUnderPortcullisBackground',
            ],
            'gargoyleRoom': [
                'gargoyleRoom',
            ],
            'heartMaxUpRoom': [
                'heartMaxUpRoom',
                'heartMaxUpRoomBackground',
            ],
            'holyMailRoom': [
                'holyMailRoom',
                'holyMailRoomBackground',
            ],
            'jewelSwordRoom': [
                'jewelSwordRoom',
                'jewelSwordRoomBackground',
            ],
            'lifeMaxUpRoom': [
                'lifeMaxUpRoom',
                'lifeMaxUpRoomBackground',
            ],
            'loadingRoomToAlchemyLaboratory': [
                'loadingRoomToAlchemyLaboratory',
            ],
            'loadingRoomToMarbleGallery': [
                'loadingRoomToMarbleGallery',
            ],
            'loadingRoomToUndergroundCaverns': [
                'loadingRoomToUndergroundCaverns',
            ],
            'loadingRoomToWarpRooms': [
                'loadingRoomToWarpRooms',
            ],
            'meetingRoomWithDeath': [
                'meetingRoomWithDeath',
            ],
            'mermanRoom': [
                'mermanRoom',
                'mermanRoomBackground',
            ],
            'saveRoomA': [
                'saveRoomA',
            ],
            'saveRoomB': [
                'saveRoomB',
            ],
            'saveRoomC': [
                'saveRoomC',
            ],
            'shortcutToUndergroundCaverns': [
                'shortcutToUndergroundCaverns',
                'shortcutToUndergroundCavernsBackground',
            ],
            'shortcutToWarpRooms': [
                'shortcutToWarpRooms',
                'shortcutToWarpRoomsBackground',
            ],
            'stairwellAfterDeath': [
                'stairwellAfterDeath',
                'stairwellAfterDeathBackground',
            ],
            'triggerTeleporterToAlchemyLaboratory': [],
            'triggerTeleporterToMarbleGallery': [],
            'triggerTeleporterToUndergroundCaverns': [],
            'triggerTeleporterToWarpRooms': [],
            'wargHallway': [
                'wargHallway',
            ],
            'zombieHallway': [
                'zombieHallway',
            ],
        },
        'castleEntrance': {
            'afterDrawbridge': [
                'afterDrawbridge',
            ],
            'atticEntrance': [
                'atticEntrance',
                'atticEntranceBackground',
            ],
            'atticHallway': [
                'atticHallway',
                'atticHallwayBackground',
            ],
            'atticStaircase': [
                'atticStaircase',
                'atticStaircaseBackground',
            ],
            'cubeOfZoeRoom': [
                'cubeOfZoeRoom',
                'cubeOfZoeRoomBackground',
            ],
            'dropUnderPortcullis': [
                'dropUnderPortcullis',
                'dropUnderPortcullisBackground',
            ],
            'forestCutscene': [
                'forestCutscene',
            ],
            'gargoyleRoom': [
                'gargoyleRoom',
            ],
            'heartMaxUpRoom': [
                'heartMaxUpRoom',
                'heartMaxUpRoomBackground',
            ],
            'holyMailRoom': [
                'holyMailRoom',
                'holyMailRoomBackground',
            ],
            'jewelSwordRoom': [
                'jewelSwordRoom',
                'jewelSwordRoomBackground',
            ],
            'lifeMaxUpRoom': [
                'lifeMaxUpRoom',
                'lifeMaxUpRoomBackground',
            ],
            'loadingRoomToAlchemyLaboratory': [
                'loadingRoomToAlchemyLaboratory',
            ],
            'loadingRoomToMarbleGallery': [
                'loadingRoomToMarbleGallery',
            ],
            'loadingRoomToUndergroundCaverns': [
                'loadingRoomToUndergroundCaverns',
            ],
            'loadingRoomToWarpRooms': [
                'loadingRoomToWarpRooms',
            ],
            'meetingRoomWithDeath': [
                'meetingRoomWithDeath',
            ],
            'mermanRoom': [
                'mermanRoom',
                'mermanRoomBackground',
            ],
            'saveRoomA': [
                'saveRoomA',
            ],
            'saveRoomB': [
                'saveRoomB',
            ],
            'saveRoomC': [
                'saveRoomC',
            ],
            'shortcutToUndergroundCaverns': [
                'shortcutToUndergroundCaverns',
                'shortcutToUndergroundCavernsBackground',
            ],
            'shortcutToWarpRooms': [
                'shortcutToWarpRooms',
                'shortcutToWarpRoomsBackground',
            ],
            'stairwellAfterDeath': [
                'stairwellAfterDeath',
                'stairwellAfterDeathBackground',
            ],
            'triggerTeleporterToAlchemyLaboratory': [],
            'triggerTeleporterToMarbleGallery': [],
            'triggerTeleporterToUndergroundCaverns': [],
            'triggerTeleporterToWarpRooms': [],
            'unknownRoom19': [
                'unknownRoom19',
            ],
            'unknownRoom20': [
                'unknownRoom20',
            ],
            'wargHallway': [
                'wargHallway',
            ],
            'zombieHallway': [
                'zombieHallway',
            ],
        },
        'castleKeep': {
            'bend': [
                'bend',
            ],
            'dualPlatforms': [
                'dualPlatforms',
            ],
            'falchionRoom': [
                'falchionRoom',
            ],
            'ghostCardRoom': [
                'ghostCardRoom',
            ],
            'keepArea': [
                'keepArea',
            ],
            'lionTorchPlatform': [
                'lionTorchPlatform',
            ],
            'loadingRoomToClockTower': [
                'loadingRoomToClockTower',
            ],
            'loadingRoomToRoyalChapel': [
                'loadingRoomToRoyalChapel',
            ],
            'loadingRoomToWarpRooms': [
                'loadingRoomToWarpRooms',
            ],
            'lowerAttic': [
                'lowerAttic',
            ],
            'saveRoomA': [
                'saveRoomA',
            ],
            'triggerTeleporterToClockTower': [],
            'triggerTeleporterToRoyalChapel': [],
            'triggerTeleporterToWarpRooms': [],
            'tyrfingRoom': [
                'tyrfingRoom',
            ],
            'upperAttic': [
                'upperAttic',
            ],
        },
        'catacombs': {
            'ballroomMaskRoom': [
                'ballroomMaskRoom',
                'ballroomMaskRoomBackground',
            ],
            'boneArkRoom': [
                'boneArkRoom',
                'boneArkRoomBackground',
            ],
            'catEyeCircletRoom': [
                'catEyeCircletRoom',
                'catEyeCircletRoomBackground',
            ],
            'exitToAbandonedMine': [
                'exitToAbandonedMine',
                'exitToAbandonedMineBackground',
            ],
            'granfaloonsLair': [
                'granfaloonsLair',
                'granfaloonsLairBackground',
            ],
            'hellfireBeastRoom': [
                'hellfireBeastRoom',
                'hellfireBeastRoomBackground',
            ],
            'icebrandRoom': [
                'icebrandRoom',
                'icebrandRoomBackground',
            ],
            'leftLavaPath': [
                'leftLavaPath',
            ],
            'loadingRoomToAbandonedMine': [
                'loadingRoomToAbandonedMine',
            ],
            'mormegilRoom': [
                'mormegilRoom',
                'mormegilRoomBackground',
            ],
            'pitchBlackSpikeMaze': [
                'pitchBlackSpikeMaze',
                'pitchBlackSpikeMazeBackground',
            ],
            'rightLavaPath': [
                'rightLavaPath',
                'rightLavaPathBackground',
            ],
            'roomId00': [
                'roomId00',
                'roomId00Background',
            ],
            'roomId02': [
                'roomId02',
                'roomId02Background',
            ],
            'roomId04': [
                'roomId04',
                'roomId04Background',
            ],
            'roomId05': [
                'roomId05',
                'roomId05Background',
            ],
            'roomId14': [
                'roomId14',
                'roomId14Background',
            ],
            'roomId19': [
                'roomId19',
                'roomId19Background',
            ],
            'roomId20': [
                'roomId20',
                'roomId20Background',
            ],
            'roomId21': [
                'roomId21',
                'roomId21Background',
            ],
            'roomId22': [
                'roomId22',
                'roomId22Background',
            ],
            'roomId23': [
                'roomId23',
                'roomId23Background',
            ],
            'roomId25': [
                'roomId25',
                'roomId25Background',
            ],
            'roomId26': [
                'roomId26',
                'roomId26Background',
            ],
            'saveRoomA': [
                'saveRoomA',
            ],
            'saveRoomB': [
                'saveRoomB',
            ],
            'smallGremlinRoom': [
                'smallGremlinRoom',
                'smallGremlinRoomBackground',
            ],
            'spikeBreakerRoom': [
                'spikeBreakerRoom',
                'spikeBreakerRoomBackground',
            ],
            'triggerTeleporterToAbandonedMine': [],
            'walkArmorRoom': [
                'walkArmorRoom',
                'walkArmorRoomBackground',
            ],
        },
        'cave': {
            'bend': [
                'bend',
            ],
            'cerberusRoom': [
                'cerberusRoom',
            ],
            'demonCard': [
                'demonCard',
            ],
            'demonSwitch': [
                'demonSwitch',
            ],
            'fourWayIntersection': [
                'fourWayIntersection',
            ],
            'karmaCoinRoom': [
                'karmaCoinRoom',
            ],
            'loadingRoomToCatacombs': [
                'loadingRoomToCatacombs',
            ],
            'loadingRoomToUndergroundCaverns': [
                'loadingRoomToUndergroundCaverns',
            ],
            'loadingRoomToWarpRooms': [
                'loadingRoomToWarpRooms',
            ],
            'lowerStairwell': [
                'lowerStairwell',
            ],
            'peanutsRoom': [
                'peanutsRoom',
            ],
            'saveRoom': [
                'saveRoom',
            ],
            'snakeColumn': [
                'snakeColumn',
            ],
            'triggerTeleporterToCatacombs': [],
            'triggerTeleporterToUndergroundCaverns': [],
            'triggerTeleporterToWarpRooms': [],
            'venusWeedRoom': [
                'venusWeedRoom',
            ],
            'wellLitSkullRoom': [
                'wellLitSkullRoom',
            ],
            'wolfsHeadColumn': [
                'wolfsHeadColumn',
            ],
        },
        'clockTower': {
            'belfry': [
                'belfry',
            ],
            'exitToCourtyard': [
                'exitToCourtyard',
            ],
            'fireOfBatRoom': [
                'fireOfBatRoom',
                'fireOfBatRoomBackground',
            ],
            'healingMailRoom': [
                'healingMailRoom',
                'healingMailRoomBackground',
            ],
            'hiddenArmory': [
                'hiddenArmory',
            ],
            'karasumansRoom': [
                'karasumansRoom',
                'karasumansRoomBackground',
            ],
            'leftGearRoom': [
                'leftGearRoom',
            ],
            'loadingRoomToCastleKeep': [
                'loadingRoomToCastleKeep',
            ],
            'loadingRoomToOuterWall': [
                'loadingRoomToOuterWall',
            ],
            'openCourtyard': [
                'openCourtyard',
            ],
            'pathToKarasuman': [
                'pathToKarasuman',
            ],
            'pendulumRoom': [
                'pendulumRoom',
            ],
            'rightGearRoom': [
                'rightGearRoom',
            ],
            'spire': [
                'spire',
            ],
            'stairwellToOuterWall': [
                'stairwellToOuterWall',
            ],
            'triggerTeleporterToCastleKeep': [],
            'triggerTeleporterToOuterWall': [],
        },
        'colosseum': {
            'arena': [
                'arena',
            ],
            'bladeMasterRoom': [
                'bladeMasterRoom',
            ],
            'bloodCloakRoom': [
                'bloodCloakRoom',
            ],
            'bottomOfElevatorShaft': [
                'bottomOfElevatorShaft',
            ],
            'fountainRoom': [
                'fountainRoom',
                'fountainRoomBackground',
            ],
            'holySwordRoom': [
                'holySwordRoom',
            ],
            'leftSideArmory': [
                'leftSideArmory',
            ],
            'loadingRoomToOlroxsQuarters': [
                'loadingRoomToOlroxsQuarters',
            ],
            'loadingRoomToRoyalChapel': [
                'loadingRoomToRoyalChapel',
            ],
            'passagewayBetweenArenaAndRoyalChapel': [
                'passagewayBetweenArenaAndRoyalChapel',
            ],
            'rightSideArmory': [
                'rightSideArmory',
            ],
            'saveRoomA': [
                'saveRoomA',
            ],
            'saveRoomB': [
                'saveRoomB',
            ],
            'spiralStaircases': [
                'spiralStaircases',
            ],
            'topOfElevatorShaft': [
                'topOfElevatorShaft',
            ],
            'topOfLeftSpiralStaircase': [
                'topOfLeftSpiralStaircase',
            ],
            'topOfRightSpiralStaircase': [
                'topOfRightSpiralStaircase',
            ],
            'triggerTeleporterToOlroxsQuarters': [],
            'triggerTeleporterToRoyalChapel': [],
            'valhallaKnightRoom': [
                'valhallaKnightRoom',
            ],
        },
        'cutsceneMeetingMariaInClockRoom': {
            'clockRoom': [
                'clockRoom',
                'clockRoomBackground',
            ],
            'triggerTeleporterA': [],
            'triggerTeleporterB': [],
        },
        'deathWingsLair': {
            'bottomOfStairwell': [
                'bottomOfStairwell',
                'bottomOfStairwellBackground',
            ],
            'catwalkCrypt': [
                'catwalkCrypt',
                'catwalkCryptBackground',
            ],
            'echoOfBatRoom': [
                'echoOfBatRoom',
                'echoOfBatRoomBackground',
            ],
            'emptyCells': [
                'emptyCells',
                'emptyCellsBackground',
            ],
            'emptyRoom': [
                'emptyRoom',
                'emptyRoomBackground',
            ],
            'garnetRoom': [
                'garnetRoom',
                'garnetRoomBackground',
            ],
            'grandStaircase': [
                'grandStaircase',
                'grandStaircaseBackground',
            ],
            'hammerAndBladeRoom': [
                'hammerAndBladeRoom',
                'hammerAndBladeRoomBackground',
            ],
            'loadingRoomToColosseum': [
                'loadingRoomToColosseum',
            ],
            'loadingRoomToMarbleGallery': [
                'loadingRoomToMarbleGallery',
            ],
            'loadingRoomToRoyalChapel': [
                'loadingRoomToRoyalChapel',
            ],
            'loadingRoomToWarpRooms': [
                'loadingRoomToWarpRooms',
            ],
            'narrowHallwayToOlrox': [
                'narrowHallwayToOlrox',
            ],
            'olroxsRoom': [
                'olroxsRoom',
            ],
            'openCourtyard': [
                'openCourtyard',
            ],
            'prison': [
                'prison',
                'prisonBackground',
            ],
            'saveRoomA': [
                'saveRoomA',
            ],
            'secretOnyxRoom': [
                'secretOnyxRoom',
                'secretOnyxRoomBackground',
            ],
            'skelerangRoom': [
                'skelerangRoom',
                'skelerangRoomBackground',
            ],
            'swordCardRoom': [
                'swordCardRoom',
            ],
            'tallShaft': [
                'tallShaft',
                'tallShaftBackground',
            ],
            'triggerTeleporterToColosseum': [],
            'triggerTeleporterToMarbleGallery': [],
            'triggerTeleporterToRoyalChapel': [],
            'triggerTeleporterToWarpRooms': [],
        },
        'floatingCatacombs': {
            'ballroomMaskRoom': [
                'ballroomMaskRoom',
                'ballroomMaskRoomBackground',
            ],
            'boneArkRoom': [
                'boneArkRoom',
                'boneArkRoomBackground',
            ],
            'catEyeCircletRoom': [
                'catEyeCircletRoom',
                'catEyeCircletRoomBackground',
            ],
            'exitToAbandonedMine': [
                'exitToAbandonedMine',
                'exitToAbandonedMineBackground',
            ],
            'granfaloonsLair': [
                'granfaloonsLair',
                'granfaloonsLairBackground',
            ],
            'hellfireBeastRoom': [
                'hellfireBeastRoom',
                'hellfireBeastRoomBackground',
            ],
            'icebrandRoom': [
                'icebrandRoom',
                'icebrandRoomBackground',
            ],
            'leftLavaPath': [
                'leftLavaPath',
            ],
            'loadingRoomToAbandonedMine': [
                'loadingRoomToAbandonedMine',
            ],
            'mormegilRoom': [
                'mormegilRoom',
                'mormegilRoomBackground',
            ],
            'pitchBlackSpikeMaze': [
                'pitchBlackSpikeMaze',
                'pitchBlackSpikeMazeBackground',
            ],
            'rightLavaPath': [
                'rightLavaPath',
                'rightLavaPathBackground',
            ],
            'roomId00': [
                'roomId00',
                'roomId00Background',
            ],
            'roomId02': [
                'roomId02',
                'roomId02Background',
            ],
            'roomId04': [
                'roomId04',
                'roomId04Background',
            ],
            'roomId05': [
                'roomId05',
                'roomId05Background',
            ],
            'roomId14': [
                'roomId14',
                'roomId14Background',
            ],
            'roomId19': [
                'roomId19',
                'roomId19Background',
            ],
            'roomId20': [
                'roomId20',
                'roomId20Background',
            ],
            'roomId21': [
                'roomId21',
                'roomId21Background',
            ],
            'roomId22': [
                'roomId22',
                'roomId22Background',
            ],
            'roomId23': [
                'roomId23',
                'roomId23Background',
            ],
            'roomId25': [
                'roomId25',
                'roomId25Background',
            ],
            'roomId26': [
                'roomId26',
                'roomId26Background',
            ],
            'saveRoomA': [
                'saveRoomA',
            ],
            'saveRoomB': [
                'saveRoomB',
            ],
            'smallGremlinRoom': [
                'smallGremlinRoom',
                'smallGremlinRoomBackground',
            ],
            'spikeBreakerRoom': [
                'spikeBreakerRoom',
                'spikeBreakerRoomBackground',
            ],
            'triggerTeleporterToAbandonedMine': [],
            'walkArmorRoom': [
                'walkArmorRoom',
                'walkArmorRoomBackground',
            ],
        },
        'forbiddenLibrary': {
            'dhuronAndFleaArmorRoom': [
                'dhuronAndFleaArmorRoom',
            ],
            'dhuronAndFleaManRoom': [
                'dhuronAndFleaManRoom',
            ],
            'exitToOuterWall': [
                'exitToOuterWall',
            ],
            'faerieCardRoom': [
                'faerieCardRoom',
            ],
            'fleaManRoom': [
                'fleaManRoom',
            ],
            'footOfStaircase': [
                'footOfStaircase',
            ],
            'holyRodRoom': [
                'holyRodRoom',
            ],
            'lesserDemonArea': [
                'lesserDemonArea',
            ],
            'loadingRoomToOuterWall': [
                'loadingRoomToOuterWall',
            ],
            'outsideShop': [
                'outsideShop',
            ],
            'saveRoomA': [
                'saveRoomA',
            ],
            'secretBookcaseRoom': [
                'secretBookcaseRoom',
            ],
            'shop': [
                'shop',
            ],
            'spellbookArea': [
                'spellbookArea',
            ],
            'threeLayerRoom': [
                'threeLayerRoom',
            ],
            'triggerTeleporterToOuterWall': [],
        },
        'longLibrary': {
            'dhuronAndFleaArmorRoom': [
                'dhuronAndFleaArmorRoom',
            ],
            'dhuronAndFleaManRoom': [
                'dhuronAndFleaManRoom',
            ],
            'exitToOuterWall': [
                'exitToOuterWall',
            ],
            'faerieCardRoom': [
                'faerieCardRoom',
            ],
            'fleaManRoom': [
                'fleaManRoom',
            ],
            'footOfStaircase': [
                'footOfStaircase',
            ],
            'holyRodRoom': [
                'holyRodRoom',
            ],
            'lesserDemonArea': [
                'lesserDemonArea',
            ],
            'loadingRoomToOuterWall': [
                'loadingRoomToOuterWall',
            ],
            'outsideShop': [
                'outsideShop',
            ],
            'saveRoomA': [
                'saveRoomA',
            ],
            'secretBookcaseRoom': [
                'secretBookcaseRoom',
            ],
            'shop': [
                'shop',
            ],
            'spellbookArea': [
                'spellbookArea',
            ],
            'threeLayerRoom': [
                'threeLayerRoom',
            ],
            'triggerTeleporterToOuterWall': [],
        },
        'marbleGallery': {
            'alucartRoom': [
                'alucartRoom',
            ],
            'beneathDropoff': [
                'beneathDropoff',
                'beneathDropoffBackground',
            ],
            'beneathLeftTrapdoor': [
                'beneathLeftTrapdoor',
                'beneathLeftTrapdoorBackground',
            ],
            'beneathRightTrapdoor': [
                'beneathRightTrapdoor',
                'beneathRightTrapdoorBackground',
            ],
            'blueDoorRoom': [
                'blueDoorRoom',
                'blueDoorRoomBackground',
            ],
            'clockRoom': [
                'clockRoom',
                'clockRoomBackground',
            ],
            'dropoff': [
                'dropoff',
                'dropoffBackground',
            ],
            'elevatorRoom': [
                'elevatorRoom',
            ],
            'emptyRoom': [
                'emptyRoom',
                'emptyRoomBackground',
            ],
            'entrance': [
                'entrance',
                'entranceBackground',
            ],
            'gravityBootsRoom': [
                'gravityBootsRoom',
            ],
            'leftOfClockRoom': [
                'leftOfClockRoom',
                'leftOfClockRoomBackground',
            ],
            'loadingRoomToAlchemyLaboratory': [
                'loadingRoomToAlchemyLaboratory',
            ],
            'loadingRoomToCastleEntrance': [
                'loadingRoomToCastleEntrance',
            ],
            'loadingRoomToOlroxsQuarters': [
                'loadingRoomToOlroxsQuarters',
            ],
            'loadingRoomToOuterWall': [
                'loadingRoomToOuterWall',
            ],
            'loadingRoomToUndergroundCaverns': [
                'loadingRoomToUndergroundCaverns',
            ],
            'longHallway': [
                'longHallway',
            ],
            'ouijaTableStairway': [
                'ouijaTableStairway',
                'ouijaTableStairwayBackground',
            ],
            'pathwayAfterLeftStatue': [
                'pathwayAfterLeftStatue',
            ],
            'pathwayAfterRightStatue': [
                'pathwayAfterRightStatue',
            ],
            'powerUpRoom': [
                'powerUpRoom',
            ],
            'rightOfClockRoom': [
                'rightOfClockRoom',
                'rightOfClockRoomBackground',
            ],
            'sShapedHallways': [
                'sShapedHallways',
                'sShapedHallwaysBackground',
            ],
            'saveRoomA': [
                'saveRoomA',
            ],
            'saveRoomB': [
                'saveRoomB',
            ],
            'slingerStaircase': [
                'slingerStaircase',
                'slingerStaircaseBackground',
            ],
            'spiritOrbRoom': [
                'spiritOrbRoom',
                'spiritOrbRoomBackground',
            ],
            'stainedGlassCorner': [
                'stainedGlassCorner',
                'stainedGlassCornerBackground',
            ],
            'stairwellToUndergroundCaverns': [
                'stairwellToUndergroundCaverns',
                'stairwellToUndergroundCavernsBackground',
            ],
            'stopwatchRoom': [
                'stopwatchRoom',
                'stopwatchRoomBackground',
            ],
            'tallStainedGlassWindows': [
                'tallStainedGlassWindows',
                'tallStainedGlassWindowsBackground',
            ],
            'threePaths': [
                'threePaths',
                'threePathsBackground',
            ],
            'triggerTeleporterToAlchemyLaboratory': [],
            'triggerTeleporterToCastleCenter': [],
            'triggerTeleporterToCastleEntrance': [],
            'triggerTeleporterToOlroxsQuarters': [],
            'triggerTeleporterToOuterWall': [],
            'triggerTeleporterToUndergroundCaverns': [],
        },
        'necromancyLaboratory': {
            'batCardRoom': [
                'batCardRoom',
            ],
            'bloodyZombieHallway': [
                'bloodyZombieHallway',
            ],
            'blueDoorHallway': [
                'blueDoorHallway',
            ],
            'boxPuzzleRoom': [
                'boxPuzzleRoom',
            ],
            'cannonRoom': [
                'cannonRoom',
            ],
            'clothCapeRoom': [
                'clothCapeRoom',
            ],
            'corridorToElevator': [
                'corridorToElevator',
            ],
            'elevatorShaft': [
                'elevatorShaft',
            ],
            'emptyZigZagRoom': [
                'emptyZigZagRoom',
            ],
            'entryway': [
                'entryway',
            ],
            'exitToMarbleGallery': [
                'exitToMarbleGallery',
            ],
            'exitToRoyalChapel': [
                'exitToRoyalChapel',
            ],
            'glassVats': [
                'glassVats',
            ],
            'heartMaxUpRoom': [
                'heartMaxUpRoom',
            ],
            'loadingRoomToCastleEntrance': [
                'loadingRoomToCastleEntrance',
            ],
            'loadingRoomToMarbleGallery': [
                'loadingRoomToMarbleGallery',
            ],
            'loadingRoomToRoyalChapel': [
                'loadingRoomToRoyalChapel',
            ],
            'redSkeletonLiftRoom': [
                'redSkeletonLiftRoom',
            ],
            'saveRoomA': [
                'saveRoomA',
            ],
            'saveRoomB': [
                'saveRoomB',
            ],
            'saveRoomC': [
                'saveRoomC',
            ],
            'secretLifeMaxUpRoom': [
                'secretLifeMaxUpRoom',
            ],
            'shortZigZagRoom': [
                'shortZigZagRoom',
            ],
            'skillOfWolfRoom': [
                'skillOfWolfRoom',
            ],
            'slograAndGaibonRoom': [
                'slograAndGaibonRoom',
            ],
            'sunglassesRoom': [
                'sunglassesRoom',
            ],
            'tallSpittleboneRoom': [
                'tallSpittleboneRoom',
            ],
            'tallZigZagRoom': [
                'tallZigZagRoom',
            ],
            'tetrominoRoom': [
                'tetrominoRoom',
            ],
            'triggerTeleporterToCastleEntrance': [],
            'triggerTeleporterToMarbleGallery': [],
            'triggerTeleporterToRoyalChapel': [],
        },
        'olroxsQuarters': {
            'bottomOfStairwell': [
                'bottomOfStairwell',
                'bottomOfStairwellBackground',
            ],
            'catwalkCrypt': [
                'catwalkCrypt',
                'catwalkCryptBackground',
            ],
            'echoOfBatRoom': [
                'echoOfBatRoom',
                'echoOfBatRoomBackground',
            ],
            'emptyCells': [
                'emptyCells',
                'emptyCellsBackground',
            ],
            'emptyRoom': [
                'emptyRoom',
                'emptyRoomBackground',
            ],
            'garnetRoom': [
                'garnetRoom',
                'garnetRoomBackground',
            ],
            'grandStaircase': [
                'grandStaircase',
                'grandStaircaseBackground',
            ],
            'hammerAndBladeRoom': [
                'hammerAndBladeRoom',
                'hammerAndBladeRoomBackground',
            ],
            'loadingRoomToColosseum': [
                'loadingRoomToColosseum',
            ],
            'loadingRoomToMarbleGallery': [
                'loadingRoomToMarbleGallery',
            ],
            'loadingRoomToRoyalChapel': [
                'loadingRoomToRoyalChapel',
            ],
            'loadingRoomToWarpRooms': [
                'loadingRoomToWarpRooms',
            ],
            'narrowHallwayToOlrox': [
                'narrowHallwayToOlrox',
            ],
            'olroxsRoom': [
                'olroxsRoom',
            ],
            'openCourtyard': [
                'openCourtyard',
            ],
            'prison': [
                'prison',
                'prisonBackground',
            ],
            'saveRoomA': [
                'saveRoomA',
            ],
            'secretOnyxRoom': [
                'secretOnyxRoom',
                'secretOnyxRoomBackground',
            ],
            'skelerangRoom': [
                'skelerangRoom',
                'skelerangRoomBackground',
            ],
            'swordCardRoom': [
                'swordCardRoom',
            ],
            'tallShaft': [
                'tallShaft',
                'tallShaftBackground',
            ],
            'triggerTeleporterToColosseum': [],
            'triggerTeleporterToMarbleGallery': [],
            'triggerTeleporterToRoyalChapel': [],
            'triggerTeleporterToWarpRooms': [],
        },
        'outerWall': {
            'blueAxeKnightRoom': [
                'blueAxeKnightRoom',
            ],
            'doppelgangerRoom': [
                'doppelgangerRoom',
            ],
            'elevatorShaftRoom': [
                'elevatorShaftRoom',
            ],
            'exitToClockTower': [
                'exitToClockTower',
            ],
            'exitToMarbleGallery': [
                'exitToMarbleGallery',
            ],
            'garlicRoom': [
                'garlicRoom',
            ],
            'garnetVaseRoom': [
                'garnetVaseRoom',
            ],
            'gladiusRoom': [
                'gladiusRoom',
            ],
            'jewelKnucklesRoom': [
                'jewelKnucklesRoom',
            ],
            'loadingRoomToClockTower': [
                'loadingRoomToClockTower',
            ],
            'loadingRoomToLongLibrary': [
                'loadingRoomToLongLibrary',
            ],
            'loadingRoomToMarbleGallery': [
                'loadingRoomToMarbleGallery',
            ],
            'loadingRoomToWarpRooms': [
                'loadingRoomToWarpRooms',
            ],
            'lowerMedusaRoom': [
                'lowerMedusaRoom',
            ],
            'saveRoomA': [
                'saveRoomA',
            ],
            'saveRoomB': [
                'saveRoomB',
            ],
            'secretPlatformRoom': [
                'secretPlatformRoom',
            ],
            'telescopeRoom': [
                'telescopeRoom',
            ],
            'topOfOuterWall': [
                'topOfOuterWall',
            ],
            'triggerTeleporterToClockTower': [],
            'triggerTeleporterToLongLibrary': [],
            'triggerTeleporterToMarbleGallery': [],
            'triggerTeleporterToWarpRooms': [],
        },
        'prologue': {
            'lowerAttic': [
                'lowerAttic',
            ],
            'throneRoomArea': [
                'throneRoomArea',
                'throneRoomAreaBackground',
            ],
            'unknownRoomId02': [
                'unknownRoomId02',
            ],
            'upperAttic': [
                'upperAttic',
            ],
        },
        'reverseCastleCenter': {
            'centerCube': [
                'centerCube',
            ],
            'elevatorShaft': [
                'elevatorShaft',
            ],
            'triggerTeleporterToBO6': [],
            'triggerTeleporterToMarbleGallery': [],
            'unknownRoomId02': [
                'unknownRoomId02',
            ],
        },
        'reverseCaverns': {
            'bandannaRoom': [
                'bandannaRoom',
            ],
            'claymoreStairwell': [
                'claymoreStairwell',
                'claymoreStairwellBackground',
            ],
            'crystalBend': [
                'crystalBend',
                'crystalBendBackground',
            ],
            'crystalCloakRoom': [
                'crystalCloakRoom',
                'crystalCloakRoomBackground',
            ],
            'dKBridge': [
                'dKBridge',
                'dKBridgeBackground',
            ],
            'dKButton': [
                'dKButton',
                'dKButtonBackground',
            ],
            'exitToAbandonedMine': [
                'exitToAbandonedMine',
                'exitToAbandonedMineBackground',
            ],
            'exitToCastleEntrance': [
                'exitToCastleEntrance',
                'exitToCastleEntranceBackground',
            ],
            'falseSaveRoom': [
                'falseSaveRoom',
            ],
            'hiddenCrystalEntrance': [
                'hiddenCrystalEntrance',
                'hiddenCrystalEntranceBackground',
            ],
            'holySymbolRoom': [
                'holySymbolRoom',
                'holySymbolRoomBackground',
            ],
            'iceFloeRoom': [
                'iceFloeRoom',
                'iceFloeRoomBackground',
            ],
            'leftFerrymanRoute': [
                'leftFerrymanRoute',
                'leftFerrymanRouteBackground',
            ],
            'loadingRoomToAbandonedMine': [
                'loadingRoomToAbandonedMine',
            ],
            'loadingRoomToCastleEntrance': [
                'loadingRoomToCastleEntrance',
            ],
            'loadingRoomToMarbleGallery': [
                'loadingRoomToMarbleGallery',
            ],
            'longDrop': [
                'longDrop',
            ],
            'mealTicketsAndMoonstoneRoom': [
                'mealTicketsAndMoonstoneRoom',
                'mealTicketsAndMoonstoneRoomBackground',
            ],
            'mermanStatueRoom': [
                'mermanStatueRoom',
                'mermanStatueRoomBackground',
            ],
            'pentagramRoom': [
                'pentagramRoom',
                'pentagramRoomBackground',
            ],
            'plaqueRoomWithBreakableWall': [
                'plaqueRoomWithBreakableWall',
            ],
            'plaqueRoomWithLifeMaxUp': [
                'plaqueRoomWithLifeMaxUp',
            ],
            'rightFerrymanRoute': [
                'rightFerrymanRoute',
                'rightFerrymanRouteBackground',
            ],
            'risingWaterRoom': [
                'risingWaterRoom',
                'risingWaterRoomBackground',
            ],
            'roomId09': [
                'roomId09',
            ],
            'roomId10': [
                'roomId10',
                'roomId10Background',
            ],
            'roomId11': [
                'roomId11',
            ],
            'roomId12': [
                'roomId12',
                'roomId12Background',
            ],
            'roomId18': [
                'roomId18',
                'roomId18Background',
            ],
            'roomId19': [
                'roomId19',
                'roomId19Background',
            ],
            'saveRoomA': [
                'saveRoomA',
            ],
            'saveRoomB': [
                'saveRoomB',
            ],
            'saveRoomC': [
                'saveRoomC',
            ],
            'scyllaRoom': [
                'scyllaRoom',
                'scyllaRoomBackground',
            ],
            'scyllaWyrmRoom': [
                'scyllaWyrmRoom',
                'scyllaWyrmRoomBackground',
            ],
            'smallStairwell': [
                'smallStairwell',
                'smallStairwellBackground',
            ],
            'tallStairwell': [
                'tallStairwell',
            ],
            'triggerTeleporterToAbandonedMine': [],
            'triggerTeleporterToBossSuccubus': [],
            'triggerTeleporterToCastleEntrance': [],
            'triggerTeleporterToMarbleGallery': [],
            'waterfall': [
                'waterfall',
                'waterfallBackground',
            ],
        },
        'reverseClockTower': {
            'belfry': [
                'belfry',
            ],
            'exitToCourtyard': [
                'exitToCourtyard',
            ],
            'fireOfBatRoom': [
                'fireOfBatRoom',
                'fireOfBatRoomBackground',
            ],
            'healingMailRoom': [
                'healingMailRoom',
                'healingMailRoomBackground',
            ],
            'hiddenArmory': [
                'hiddenArmory',
            ],
            'karasumansRoom': [
                'karasumansRoom',
                'karasumansRoomBackground',
            ],
            'leftGearRoom': [
                'leftGearRoom',
            ],
            'loadingRoomToCastleKeep': [
                'loadingRoomToCastleKeep',
            ],
            'loadingRoomToOuterWall': [
                'loadingRoomToOuterWall',
            ],
            'openCourtyard': [
                'openCourtyard',
            ],
            'pathToKarasuman': [
                'pathToKarasuman',
            ],
            'pendulumRoom': [
                'pendulumRoom',
            ],
            'rightGearRoom': [
                'rightGearRoom',
            ],
            'spire': [
                'spire',
            ],
            'stairwellToOuterWall': [
                'stairwellToOuterWall',
            ],
            'triggerTeleporterToCastleKeep': [],
            'triggerTeleporterToOuterWall': [],
        },
        'reverseColosseum': {
            'arena': [
                'arena',
            ],
            'bladeMasterRoom': [
                'bladeMasterRoom',
            ],
            'bloodCloakRoom': [
                'bloodCloakRoom',
            ],
            'bottomOfElevatorShaft': [
                'bottomOfElevatorShaft',
            ],
            'fountainRoom': [
                'fountainRoom',
                'fountainRoomBackground',
            ],
            'holySwordRoom': [
                'holySwordRoom',
            ],
            'leftSideArmory': [
                'leftSideArmory',
            ],
            'loadingRoomToOlroxsQuarters': [
                'loadingRoomToOlroxsQuarters',
            ],
            'loadingRoomToRoyalChapel': [
                'loadingRoomToRoyalChapel',
            ],
            'passagewayBetweenArenaAndRoyalChapel': [
                'passagewayBetweenArenaAndRoyalChapel',
            ],
            'rightSideArmory': [
                'rightSideArmory',
            ],
            'saveRoomA': [
                'saveRoomA',
            ],
            'saveRoomB': [
                'saveRoomB',
            ],
            'spiralStaircases': [
                'spiralStaircases',
            ],
            'topOfElevatorShaft': [
                'topOfElevatorShaft',
            ],
            'topOfLeftSpiralStaircase': [
                'topOfLeftSpiralStaircase',
            ],
            'topOfRightSpiralStaircase': [
                'topOfRightSpiralStaircase',
            ],
            'triggerTeleporterToOlroxsQuarters': [],
            'triggerTeleporterToRoyalChapel': [],
            'valhallaKnightRoom': [
                'valhallaKnightRoom',
            ],
        },
        'reverseEntrance': {
            'afterDrawbridge': [
                'afterDrawbridge',
            ],
            'atticEntrance': [
                'atticEntrance',
                'atticEntranceBackground',
            ],
            'atticHallway': [
                'atticHallway',
                'atticHallwayBackground',
            ],
            'atticStaircase': [
                'atticStaircase',
                'atticStaircaseBackground',
            ],
            'cubeOfZoeRoom': [
                'cubeOfZoeRoom',
                'cubeOfZoeRoomBackground',
            ],
            'dropUnderPortcullis': [
                'dropUnderPortcullis',
                'dropUnderPortcullisBackground',
            ],
            'forestCutscene': [
                'forestCutscene',
            ],
            'gargoyleRoom': [
                'gargoyleRoom',
            ],
            'heartMaxUpRoom': [
                'heartMaxUpRoom',
                'heartMaxUpRoomBackground',
            ],
            'holyMailRoom': [
                'holyMailRoom',
                'holyMailRoomBackground',
            ],
            'jewelSwordRoom': [
                'jewelSwordRoom',
                'jewelSwordRoomBackground',
            ],
            'lifeMaxUpRoom': [
                'lifeMaxUpRoom',
                'lifeMaxUpRoomBackground',
            ],
            'loadingRoomToAlchemyLaboratory': [
                'loadingRoomToAlchemyLaboratory',
            ],
            'loadingRoomToMarbleGallery': [
                'loadingRoomToMarbleGallery',
            ],
            'loadingRoomToUndergroundCaverns': [
                'loadingRoomToUndergroundCaverns',
            ],
            'loadingRoomToWarpRooms': [
                'loadingRoomToWarpRooms',
            ],
            'meetingRoomWithDeath': [
                'meetingRoomWithDeath',
            ],
            'mermanRoom': [
                'mermanRoom',
                'mermanRoomBackground',
            ],
            'saveRoomA': [
                'saveRoomA',
            ],
            'saveRoomB': [
                'saveRoomB',
            ],
            'saveRoomC': [
                'saveRoomC',
            ],
            'shortcutToUndergroundCaverns': [
                'shortcutToUndergroundCaverns',
                'shortcutToUndergroundCavernsBackground',
            ],
            'shortcutToWarpRooms': [
                'shortcutToWarpRooms',
                'shortcutToWarpRoomsBackground',
            ],
            'stairwellAfterDeath': [
                'stairwellAfterDeath',
                'stairwellAfterDeathBackground',
            ],
            'triggerTeleporterToAlchemyLaboratory': [],
            'triggerTeleporterToMarbleGallery': [],
            'triggerTeleporterToUndergroundCaverns': [],
            'triggerTeleporterToWarpRooms': [],
            'unknownRoom19': [
                'unknownRoom19',
            ],
            'unknownRoom20': [
                'unknownRoom20',
            ],
            'wargHallway': [
                'wargHallway',
            ],
            'zombieHallway': [
                'zombieHallway',
            ],
        },
        'reverseKeep': {
            'bend': [
                'bend',
            ],
            'dualPlatforms': [
                'dualPlatforms',
            ],
            'falchionRoom': [
                'falchionRoom',
            ],
            'ghostCardRoom': [
                'ghostCardRoom',
            ],
            'keepArea': [
                'keepArea',
            ],
            'lionTorchPlatform': [
                'lionTorchPlatform',
            ],
            'loadingRoomToClockTower': [
                'loadingRoomToClockTower',
            ],
            'loadingRoomToRoyalChapel': [
                'loadingRoomToRoyalChapel',
            ],
            'loadingRoomToWarpRooms': [
                'loadingRoomToWarpRooms',
            ],
            'lowerAttic': [
                'lowerAttic',
            ],
            'saveRoomA': [
                'saveRoomA',
            ],
            'triggerTeleporterToClockTower': [],
            'triggerTeleporterToRoyalChapel': [],
            'triggerTeleporterToWarpRooms': [],
            'tyrfingRoom': [
                'tyrfingRoom',
            ],
            'upperAttic': [
                'upperAttic',
            ],
        },
        'reverseOuterWall': {
            'blueAxeKnightRoom': [
                'blueAxeKnightRoom',
            ],
            'doppelgangerRoom': [
                'doppelgangerRoom',
            ],
            'elevatorShaftRoom': [
                'elevatorShaftRoom',
            ],
            'exitToClockTower': [
                'exitToClockTower',
            ],
            'exitToMarbleGallery': [
                'exitToMarbleGallery',
            ],
            'garlicRoom': [
                'garlicRoom',
            ],
            'garnetVaseRoom': [
                'garnetVaseRoom',
            ],
            'gladiusRoom': [
                'gladiusRoom',
            ],
            'jewelKnucklesRoom': [
                'jewelKnucklesRoom',
            ],
            'loadingRoomToClockTower': [
                'loadingRoomToClockTower',
            ],
            'loadingRoomToLongLibrary': [
                'loadingRoomToLongLibrary',
            ],
            'loadingRoomToMarbleGallery': [
                'loadingRoomToMarbleGallery',
            ],
            'loadingRoomToWarpRooms': [
                'loadingRoomToWarpRooms',
            ],
            'lowerMedusaRoom': [
                'lowerMedusaRoom',
            ],
            'saveRoomA': [
                'saveRoomA',
            ],
            'saveRoomB': [
                'saveRoomB',
            ],
            'secretPlatformRoom': [
                'secretPlatformRoom',
            ],
            'telescopeRoom': [
                'telescopeRoom',
            ],
            'topOfOuterWall': [
                'topOfOuterWall',
            ],
            'triggerTeleporterToClockTower': [],
            'triggerTeleporterToLongLibrary': [],
            'triggerTeleporterToMarbleGallery': [],
            'triggerTeleporterToWarpRooms': [],
        },
        'reverseWarpRooms': {
            'loadingRoomToAbandonedMine': [
                'loadingRoomToAbandonedMine',
            ],
            'loadingRoomToCastleEntrance': [
                'loadingRoomToCastleEntrance',
            ],
            'loadingRoomToCastleKeep': [
                'loadingRoomToCastleKeep',
            ],
            'loadingRoomToOlroxsQuarters': [
                'loadingRoomToOlroxsQuarters',
            ],
            'loadingRoomToOuterWall': [
                'loadingRoomToOuterWall',
            ],
            'triggerTeleporterToAbandonedMine': [],
            'triggerTeleporterToCastleEntrance': [],
            'triggerTeleporterToCastleKeep': [],
            'triggerTeleporterToOlroxsQuarters': [],
            'triggerTeleporterToOuterWall': [],
            'warpRoomToAbandonedMine': [
                'warpRoomToAbandonedMine',
            ],
            'warpRoomToCastleEntrance': [
                'warpRoomToCastleEntrance',
            ],
            'warpRoomToCastleKeep': [
                'warpRoomToCastleKeep',
            ],
            'warpRoomToOlroxsQuarters': [
                'warpRoomToOlroxsQuarters',
            ],
            'warpRoomToOuterWall': [
                'warpRoomToOuterWall',
            ],
        },
        'royalChapel': {
            'chapelStaircase': [
                'chapelStaircase',
            ],
            'confessionalBooth': [
                'confessionalBooth',
                'confessionalBoothBackground',
            ],
            'emptyRoom': [
                'emptyRoom',
                'emptyRoomBackground',
            ],
            'gogglesRoom': [
                'gogglesRoom',
                'gogglesRoomBackground',
            ],
            'hippogryphRoom': [
                'hippogryphRoom',
                'hippogryphRoomBackground',
            ],
            'leftTower': [
                'leftTower',
            ],
            'loadingRoomToAlchemyLaboratory': [
                'loadingRoomToAlchemyLaboratory',
            ],
            'loadingRoomToCastleKeep': [
                'loadingRoomToCastleKeep',
            ],
            'loadingRoomToColosseum': [
                'loadingRoomToColosseum',
            ],
            'loadingRoomToOlroxsQuarters': [
                'loadingRoomToOlroxsQuarters',
            ],
            'middleTower': [
                'middleTower',
            ],
            'nave': [
                'nave',
            ],
            'pushingStatueShortcut': [
                'pushingStatueShortcut',
                'pushingStatueShortcutBackground',
            ],
            'rightTower': [
                'rightTower',
            ],
            'saveRoomA': [
                'saveRoomA',
            ],
            'saveRoomB': [
                'saveRoomB',
            ],
            'silverRingRoom': [
                'silverRingRoom',
                'silverRingRoomBackground',
            ],
            'spikeHallway': [
                'spikeHallway',
                'spikeHallwayBackground',
            ],
            'statueLedge': [
                'statueLedge',
                'statueLedgeBackground',
            ],
            'triggerTeleporterToAlchemyLaboratory': [],
            'triggerTeleporterToCastleKeep': [],
            'triggerTeleporterToColosseum': [],
            'triggerTeleporterToOlroxsQuarters': [],
            'walkwayBetweenTowers': [
                'walkwayBetweenTowers',
                'walkwayBetweenTowersBackground',
            ],
            'walkwayLeftOfHippogryph': [
                'walkwayLeftOfHippogryph',
                'walkwayLeftOfHippogryphBackground',
            ],
            'walkwayRightOfHippogryph': [
                'walkwayRightOfHippogryph',
                'walkwayRightOfHippogryphBackground',
            ],
        },
        'undergroundCaverns': {
            'bandannaRoom': [
                'bandannaRoom',
            ],
            'claymoreStairwell': [
                'claymoreStairwell',
                'claymoreStairwellBackground',
            ],
            'crystalBend': [
                'crystalBend',
                'crystalBendBackground',
            ],
            'crystalCloakRoom': [
                'crystalCloakRoom',
                'crystalCloakRoomBackground',
            ],
            'dKBridge': [
                'dKBridge',
                'dKBridgeBackground',
            ],
            'dKButton': [
                'dKButton',
                'dKButtonBackground',
            ],
            'exitToAbandonedMine': [
                'exitToAbandonedMine',
                'exitToAbandonedMineBackground',
            ],
            'exitToCastleEntrance': [
                'exitToCastleEntrance',
                'exitToCastleEntranceBackground',
            ],
            'falseSaveRoom': [
                'falseSaveRoom',
            ],
            'hiddenCrystalEntrance': [
                'hiddenCrystalEntrance',
                'hiddenCrystalEntranceBackground',
            ],
            'holySymbolRoom': [
                'holySymbolRoom',
                'holySymbolRoomBackground',
            ],
            'iceFloeRoom': [
                'iceFloeRoom',
                'iceFloeRoomBackground',
            ],
            'leftFerrymanRoute': [
                'leftFerrymanRoute',
                'leftFerrymanRouteBackground',
            ],
            'loadingRoomToAbandonedMine': [
                'loadingRoomToAbandonedMine',
            ],
            'loadingRoomToCastleEntrance': [
                'loadingRoomToCastleEntrance',
            ],
            'loadingRoomToMarbleGallery': [
                'loadingRoomToMarbleGallery',
            ],
            'longDrop': [
                'longDrop',
            ],
            'mealTicketsAndMoonstoneRoom': [
                'mealTicketsAndMoonstoneRoom',
                'mealTicketsAndMoonstoneRoomBackground',
            ],
            'mermanStatueRoom': [
                'mermanStatueRoom',
                'mermanStatueRoomBackground',
            ],
            'pentagramRoom': [
                'pentagramRoom',
                'pentagramRoomBackground',
            ],
            'plaqueRoomWithBreakableWall': [
                'plaqueRoomWithBreakableWall',
            ],
            'plaqueRoomWithLifeMaxUp': [
                'plaqueRoomWithLifeMaxUp',
            ],
            'rightFerrymanRoute': [
                'rightFerrymanRoute',
                'rightFerrymanRouteBackground',
            ],
            'risingWaterRoom': [
                'risingWaterRoom',
                'risingWaterRoomBackground',
            ],
            'roomId09': [
                'roomId09',
            ],
            'roomId10': [
                'roomId10',
                'roomId10Background',
            ],
            'roomId11': [
                'roomId11',
            ],
            'roomId12': [
                'roomId12',
                'roomId12Background',
            ],
            'roomId18': [
                'roomId18',
                'roomId18Background',
            ],
            'roomId19': [
                'roomId19',
                'roomId19Background',
            ],
            'saveRoomA': [
                'saveRoomA',
            ],
            'saveRoomB': [
                'saveRoomB',
            ],
            'saveRoomC': [
                'saveRoomC',
            ],
            'scyllaRoom': [
                'scyllaRoom',
                'scyllaRoomBackground',
            ],
            'scyllaWyrmRoom': [
                'scyllaWyrmRoom',
                'scyllaWyrmRoomBackground',
            ],
            'smallStairwell': [
                'smallStairwell',
                'smallStairwellBackground',
            ],
            'tallStairwell': [
                'tallStairwell',
            ],
            'triggerTeleporterToAbandonedMine': [],
            'triggerTeleporterToBossSuccubus': [],
            'triggerTeleporterToCastleEntrance': [],
            'triggerTeleporterToMarbleGallery': [],
            'waterfall': [
                'waterfall',
                'waterfallBackground',
            ],
        },
        'warpRooms': {
            'loadingRoomToAbandonedMine': [
                'loadingRoomToAbandonedMine',
            ],
            'loadingRoomToCastleEntrance': [
                'loadingRoomToCastleEntrance',
            ],
            'loadingRoomToCastleKeep': [
                'loadingRoomToCastleKeep',
            ],
            'loadingRoomToOlroxsQuarters': [
                'loadingRoomToOlroxsQuarters',
            ],
            'loadingRoomToOuterWall': [
                'loadingRoomToOuterWall',
            ],
            'triggerTeleporterToAbandonedMine': [],
            'triggerTeleporterToCastleEntrance': [],
            'triggerTeleporterToCastleKeep': [],
            'triggerTeleporterToOlroxsQuarters': [],
            'triggerTeleporterToOuterWall': [],
            'warpRoomToAbandonedMine': [
                'warpRoomToAbandonedMine',
            ],
            'warpRoomToCastleEntrance': [
                'warpRoomToCastleEntrance',
            ],
            'warpRoomToCastleKeep': [
                'warpRoomToCastleKeep',
            ],
            'warpRoomToOlroxsQuarters': [
                'warpRoomToOlroxsQuarters',
            ],
            'warpRoomToOuterWall': [
                'warpRoomToOuterWall',
            ],
        },
    },
    'secretMapTileReveals': {
        'anteroomStaircase': ('castleKeep', 'keepArea', 3, 5),
        'demonSwitch': ('abandonedMine', 'demonSwitch', 0, 0),
        'snakeColumn': ('abandonedMine', 'snakeColumn', 1, 0),
        'alchemyLaboratoryBreakableFloor': ('alchemyLaboratory', 'tallZigZagRoom', 2, 0),
        'alchemyLaboratoryBreakableWall': ('alchemyLaboratory', 'tallZigZagRoom', 2, 0),
        'jewelSwordPassage': ('castleEntrance', 'mermanRoom', 1, 0),
        'clockTowerSecretWall': ('clockTower', 'leftGearRoom', 0, 0),
        'clockTowerBreakableWall': ('clockTower', 'pendulumRoom', 1, 0),
        'colosseumBreakableCeiling': ('colosseum', 'bladeMasterRoom', 0, 2),
        'colosseumUnknown': ('colosseum', 'topOfElevatorShaft', 0, 0),
        'marbleGallerySecretFloor': ('marbleGallery', 'clockRoom', 0, 0),
        'olroxsQuartersBreakableCeiling': ('olroxsQuarters', 'catwalkCrypt', 0, 1),
        'olroxsQuartersBreakableWall': ('olroxsQuarters', 'grandStaircase', 1, 2),
        'undergroundCavernsBreakableFloor': ('undergroundCaverns', 'hiddenCrystalEntrance', 1, 2),
        'undergroundCavernsBreakableWall': ('undergroundCaverns', 'plaqueRoomWithBreakableWall', 0, 0),
    },
}

ordered_dependency_names = [
    'primaryRooms.rightsAndBottoms',
    'secondaryRooms.leftsAndTops',
    'bossRooms.leftsAndTops',
    'secondaryRooms.rightsAndBottoms',
    'rooms.layerDefinitions',
    'secretMapTileReveals',
    'bossTeleporters',
    'familiarEvents',
    'miscellaneous',
]

if __name__ == '__main__':
    with (
        open(os.path.join('data', 'change-dependencies-template.yaml')) as source_file,
        open(os.path.join('build', 'change-dependencies.json'), 'w') as target_file,
    ):
        dependencies = {}
        template = yaml.safe_load(source_file)
        for (dependency_name, changes) in template.items():
            dependencies[dependency_name] = changes
        for dependency_name in ordered_dependency_names:
            if dependency_name not in dependencies:
                dependencies[dependency_name] = {}
        secondary_stages = set(data['associatedStages'].keys()) | set(data['bossRooms'].keys())
        # primaryRooms.rightsAndBottoms
        for (stage_name, rooms) in data['rooms'].items():
            for (room_name, _) in rooms.items():
                for (target_property_name, source_property_name, dimension_name) in (
                    ('right', 'left', '_columns'),
                    ('bottom', 'top', '_rows'),
                ):
                    transformation = [
                        {
                            'action': 'get',
                            'type': 'property',
                            'property': f'stages.{stage_name}.rooms.{room_name}.{source_property_name}',
                        },
                        {
                            'action': 'add',
                            'type': 'property',
                            'property': f'stages.{stage_name}.rooms.{room_name}.{dimension_name}',
                        },
                        {
                            'action': 'subtract',
                            'type': 'constant',
                            'constant': 1,
                        },
                        {
                            'action': 'set',
                            'type': 'property',
                            'property': f'stages.{stage_name}.rooms.{room_name}.{target_property_name}',
                        },
                    ]
                    transformation_name = transformation[-1]['property']
                    print(transformation_name)
                    dependency_name = 'secondaryRooms.rightsAndBottoms' if stage_name in secondary_stages else 'primaryRooms.rightsAndBottoms'
                    dependencies[dependency_name][transformation_name] = transformation
        # rooms.layerDefinitions
        for (stage_name, rooms) in data['rooms'].items():
            for (room_name, layer_names) in rooms.items():
                for layer_name in layer_names:
                    for (source_property_name, target_property_name) in (
                        ('left', 'left'),
                        ('top', 'top'),
                        ('right', 'right'),
                        ('bottom', 'bottom'),
                    ):
                        transformation = [
                            {
                                'action': 'get',
                                'type': 'property',
                                'property': f'stages.{stage_name}.rooms.{room_name}.{source_property_name}',
                            },
                            {
                                'action': 'set',
                                'type': 'property',
                                'property': f'stages.{stage_name}.layers.layerDefinitions.{layer_name}.layoutRect.{target_property_name}',
                            },
                        ]
                        transformation_name = transformation[-1]['property']
                        print(transformation_name)
                        dependencies['rooms.layerDefinitions'][transformation_name] = transformation
                    for (source_property_name, target_property_name) in (
                        ('_layoutRectFlags', 'flags'),
                    ):
                        transformation = [
                            {
                                'action': 'get',
                                'type': 'property',
                                'property': f'stages.{stage_name}.layers.layerDefinitions.{room_name}.{source_property_name}',
                            },
                            {
                                'action': 'set',
                                'type': 'property',
                                'property': f'stages.{stage_name}.layers.layerDefinitions.{layer_name}.layoutRect.{target_property_name}',
                            },
                        ]
                        transformation_name = transformation[-1]['property']
                        print(transformation_name)
                        dependencies['rooms.layerDefinitions'][transformation_name] = transformation
        # secondaryRooms.leftsAndTops
        for (stage_name, (associated_stage_name, reverse_ind)) in data['associatedStages'].items():
            if stage_name not in data['rooms'] or associated_stage_name not in data['rooms']:
                continue
            for room_name in data['rooms'][stage_name]:
                if room_name not in data['rooms'][associated_stage_name]:
                    continue
                for (source_property_name, dimension_name) in (
                    ('left', '_columns'),
                    ('top', '_rows'),
                ):
                    transformation = []
                    if reverse_ind:
                        transformation.append({
                            'action': 'get',
                            'type': 'constant',
                            'constant': 64,
                        })
                        transformation.append({
                            'action': 'subtract',
                            'type': 'property',
                            'property': f'stages.{associated_stage_name}.rooms.{room_name}.{source_property_name}',
                        })
                        transformation.append({
                            'action': 'subtract',
                            'type': 'property',
                            'property': f'stages.{associated_stage_name}.rooms.{room_name}.{dimension_name}',
                        })
                    else:
                        transformation.append({
                            'action': 'get',
                            'type': 'property',
                            'property': f'stages.{associated_stage_name}.rooms.{room_name}.{source_property_name}',
                        })
                    transformation.append({
                        'action': 'set',
                        'type': 'property',
                        'property': f'stages.{stage_name}.rooms.{room_name}.{source_property_name}',
                    })
                    transformation_name = transformation[-1]['property']
                    print(transformation_name)
                    dependencies['secondaryRooms.leftsAndTops'][transformation_name] = transformation
        # secretMapTileReveals, bossTeleporters
        for dependency_name in (
            'secretMapTileReveals',
            'bossTeleporters',
        ):
            for (target_key, (stage_name, room_name, top, left)) in data[dependency_name].items():
                for (source_property_name, source_value, target_property_name) in (
                    ('top', top, 'roomY'),
                    ('left', left, 'roomX'),
                ):
                    transformation = []
                    transformation.append({
                        'action': 'get',
                        'type': 'property',
                        'property': f'stages.{stage_name}.rooms.{room_name}.{source_property_name}',
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
                        'property': f'{dependency_name}.{target_key}.{target_property_name}',
                    })
                    transformation_name = transformation[-1]['property']
                    print(transformation_name)
                    dependencies[dependency_name][transformation_name] = transformation
        # familiarEvents
        for familiar_key in (
            'bat',
            'demon',
            'faerie',
            'ghost',
            'noseDemon',
            'sword',
            'yousei',
        ):
            for (transformation_key, (stage_name, room_name, inverted_ind)) in data['familiarEvents'].items():
                for (source_property_name, source_value, target_property_name) in (
                    ('top', top, 'roomY'),
                    ('left', left, 'roomX'),
                ):
                    transformation = []
                    transformation.append({
                        'action': 'get',
                        'type': 'property',
                        'property': f'stages.{stage_name}.rooms.{room_name}.{source_property_name}',
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
                        'property': f'familiarEvents.{familiar_key}.{transformation_key}.{target_property_name}',
                    })
                    transformation_name = transformation[-1]['property']
                    print(transformation_name)
                    dependencies['familiarEvents'][transformation_name] = transformation
        # bossRooms
        for (target_stage_name, boss_room_info) in data['bossRooms'].items():
            for (target_room_name, (source_stage_name, source_room_name, offset_top, offset_left)) in boss_room_info.items():
                for (property_name, offset_value) in (
                    ('top', offset_top),
                    ('left', offset_left),
                ):
                    transformation = []
                    transformation.append({
                        'action': 'get',
                        'type': 'property',
                        'property': f'stages.{source_stage_name}.rooms.{source_room_name}.{property_name}',
                    })
                    if offset_value != 0:
                        transformation.append({
                            'action': 'add',
                            'type': 'constant',
                            'constant': offset_value,
                        })
                    transformation.append({
                        'action': 'set',
                        'type': 'property',
                        'property': f'stages.{target_stage_name}.rooms.{target_room_name}.{property_name}',
                    })
                    transformation_name = transformation[-1]['property']
                    print(transformation_name)
                    dependencies['bossRooms.leftsAndTops'][transformation_name] = transformation
        # Generate output file
        target = {
            'authors': [
                'Sestren',
            ],
            'description': [
                'Updates secondary values to be consistent with the primary values they are dependent on',
            ],
            'changes': [],
        }
        for dependency_name in ordered_dependency_names:
            target['changes'].append({
                'changeType': 'evaluate',
                'description': dependency_name,
                'evaluate': dependencies[dependency_name],
            })
        json.dump(target, target_file, indent='    ', sort_keys=True)
