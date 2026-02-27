import json
import os
import yaml

data = {
    'associatedStages': {
        'abandonedMine': ('cave', True),
        'alchemyLaboratory': ('necromancyLaboratory', True),
        'castleCenter': ('reverseCastleCenter', True),
        'castleEntrance': ('reverseEntrance', True),
        'castleEntrance': ('castleEntranceRevisited', False),
        'castleKeep': ('reverseKeep', True),
        'catacombs': ('floatingCatacombs', True),
        'clockTower': ('reverseClockTower', True),
        'colosseum': ('reverseColosseum', True),
        'longLibrary': ('forbiddenLibrary', True),
        'marbleGallery': ('blackMarbleGallery', True),
        'olroxsQuarters': ('deathWingsLair', True),
        'outerWall': ('reverseOuterWall', True),
        'royalChapel': ('antiChapel', True),
        'undergroundCaverns': ('reverseCaverns', True),
        'warpRooms': ('reverseWarpRooms', True),
    },
    'bossRooms': {
        # bossCerberus
        ('stages.bossCerberus.rooms.cerberusRoom', 'stages.abandonedMine.rooms.cerberusRoom', 0, 0),
        ('stages.bossCerberus.rooms.triggerTeleporterA', 'stages.abandonedMine.rooms.cerberusRoom', 0, -1),
        ('stages.bossCerberus.rooms.triggerTeleporterB', 'stages.abandonedMine.rooms.cerberusRoom', 0, 2),
        # bossMedusa
        ('stages.bossMedusa.rooms.hippogryphRoom', 'stages.antiChapel.rooms.hippogryphRoom', 0, 0),
        ('stages.bossMedusa.rooms.triggerTeleporterA', 'stages.antiChapel.rooms.hippogryphRoom', 0, -1),
        ('stages.bossMedusa.rooms.triggerTeleporterB', 'stages.antiChapel.rooms.hippogryphRoom', 0, 2),
        # bossRichter
        ('stages.bossRichter.rooms.throneRoom', 'stages.castleKeep.rooms.keepArea', 3, 3),
        # bossGranfaloon
        ('stages.bossGranfaloon.rooms.granfaloonsLair', 'stages.catacombs.rooms.granfaloonsLair', 0, 0),
        ('stages.bossGranfaloon.rooms.triggerTeleporterA', 'stages.catacombs.rooms.granfaloonsLair', 0, 2),
        ('stages.bossGranfaloon.rooms.triggerTeleporterB', 'stages.catacombs.rooms.granfaloonsLair', 1, -1),
        # bossDeath
        ('stages.bossDeath.rooms.cerberusRoom', 'stages.cave.rooms.cerberusRoom', 0, 0),
        ('stages.bossDeath.rooms.triggerTeleporterA', 'stages.cave.rooms.cerberusRoom', 0, -1),
        ('stages.bossDeath.rooms.triggerTeleporterB', 'stages.cave.rooms.cerberusRoom', 0, 2),
        # bossMedusa
        ('stages.bossMinotaurAndWerewolf.rooms.arena', 'stages.colosseum.rooms.arena', 0, 0),
        ('stages.bossMinotaurAndWerewolf.rooms.triggerTeleporterA', 'stages.colosseum.rooms.arena', 0, -1),
        ('stages.bossMinotaurAndWerewolf.rooms.triggerTeleporterB', 'stages.colosseum.rooms.arena', 0, 2),
        # bossAkmodanII
        ('stages.bossAkmodanII.rooms.olroxsRoom', 'stages.deathWingsLair.rooms.olroxsRoom', 0, 0),
        ('stages.bossAkmodanII.rooms.triggerTeleporterA', 'stages.deathWingsLair.rooms.olroxsRoom', 1, -1),
        ('stages.bossAkmodanII.rooms.triggerTeleporterB', 'stages.deathWingsLair.rooms.olroxsRoom', 1, 2),
        # bossGalamoth
        ('stages.bossGalamoth.rooms.granfaloonsLair', 'stages.floatingCatacombs.rooms.granfaloonsLair', 0, 0),
        ('stages.bossGalamoth.rooms.triggerTeleporterA', 'stages.floatingCatacombs.rooms.granfaloonsLair', 0, 2),
        ('stages.bossGalamoth.rooms.triggerTeleporterB', 'stages.floatingCatacombs.rooms.granfaloonsLair', 1, -1),
        # bossBeelzebub
        ('stages.bossBeelzebub.rooms.slograAndGaibonRoom', 'stages.necromancyLaboratory.rooms.slograAndGaibonRoom', 0, 0),
        ('stages.bossBeelzebub.rooms.triggerTeleporterA', 'stages.necromancyLaboratory.rooms.slograAndGaibonRoom', 0, -1),
        ('stages.bossBeelzebub.rooms.triggerTeleporterB', 'stages.necromancyLaboratory.rooms.slograAndGaibonRoom', 1, -1),
        ('stages.bossBeelzebub.rooms.triggerTeleporterB', 'stages.necromancyLaboratory.rooms.slograAndGaibonRoom', 1, 4),
        # bossOlrox
        ('stages.bossOlrox.rooms.olroxsRoom', 'stages.olroxsQuarters.rooms.olroxsRoom', 0, 0),
        ('stages.bossOlrox.rooms.triggerTeleporterA', 'stages.olroxsQuarters.rooms.olroxsRoom', 0, -1),
        ('stages.bossOlrox.rooms.triggerTeleporterB', 'stages.olroxsQuarters.rooms.olroxsRoom', 0, 2),
        # bossDoppelganger10
        ('stages.bossDoppelganger10.rooms.doppelgangerRoom', 'stages.outerWall.rooms.doppelgangerRoom', 0, 0),
        ('stages.bossDoppelganger10.rooms.triggerTeleporterA', 'stages.outerWall.rooms.doppelgangerRoom', 0, -1),
        ('stages.bossDoppelganger10.rooms.triggerTeleporterB', 'stages.outerWall.rooms.doppelgangerRoom', 0, 2),
        # bossDoppelganger40
        ('stages.bossDoppelganger40.rooms.scyllaWyrmRoom', 'stages.reverseCaverns.rooms.scyllaWyrmRoom', 0, 0),
        ('stages.bossDoppelganger40.rooms.triggerTeleporterA', 'stages.reverseCaverns.rooms.scyllaWyrmRoom', 0, -1),
        ('stages.bossDoppelganger40.rooms.triggerTeleporterB', 'stages.reverseCaverns.rooms.scyllaWyrmRoom', 0, 1),
        # bossTrio
        ('stages.bossTrio.rooms.arena', 'stages.reverseColosseum.rooms.arena', 0, 0),
        ('stages.bossTrio.rooms.triggerTeleporterA', 'stages.reverseColosseum.rooms.arena', 0, -1),
        ('stages.bossTrio.rooms.triggerTeleporterB', 'stages.reverseColosseum.rooms.arena', 0, 2),
        # bossCreature
        ('stages.bossCreature.rooms.doppelgangerRoom', 'stages.reverseOuterWall.rooms.doppelgangerRoom', 0, 0),
        ('stages.bossCreature.rooms.triggerTeleporterA', 'stages.reverseOuterWall.rooms.doppelgangerRoom', 0, -1),
        ('stages.bossCreature.rooms.triggerTeleporterB', 'stages.reverseOuterWall.rooms.doppelgangerRoom', 0, 2),
        # bossHippogryph
        ('stages.bossHippogryph.rooms.hippogryphRoom', 'stages.outerWall.rooms.hippogryphRoom', 0, 0),
        ('stages.bossHippogryph.rooms.triggerTeleporterA', 'stages.outerWall.rooms.hippogryphRoom', 0, -1),
        ('stages.bossHippogryph.rooms.triggerTeleporterB', 'stages.outerWall.rooms.hippogryphRoom', 0, 2),
        # bossScylla
        ('stages.bossScylla.rooms.scyllaWyrmRoom', 'stages.outerWaundergroundCavernsll.rooms.scyllaWyrmRoom', 0, 0),
        ('stages.bossScylla.rooms.triggerTeleporterA', 'stages.undergroundCaverns.rooms.scyllaWyrmRoom', 0, -1),
        ('stages.bossScylla.rooms.risingWaterRoom', 'stages.undergroundCaverns.rooms.scyllaWyrmRoom', 0, 1),
        ('stages.bossScylla.rooms.scyllaRoom', 'stages.undergroundCaverns.rooms.scyllaWyrmRoom', -1, 1),
        ('stages.bossScylla.rooms.crystalCloakRoom', 'stages.undergroundCaverns.rooms.scyllaWyrmRoom', -1, 0),
    },
    'bossTeleporters': {
        'cutsceneMeetingMariaInClockRoom': ('stages.marbleGallery.rooms.clockRoom', 0, 0),
        'bossOlroxRight': ('stages.olroxsQuarters.rooms.olroxsRoom', 0, 1),
        'bossGranfaloonRight': ('stages.catacombs.rooms.granfaloonsLair', 0, 1),
        'bossMinotaurAndWerewolfLeft': ('stages.colosseum.rooms.arena', 0, 0),
        'bossMinotaurAndWerewolfRight': ('stages.colosseum.rooms.arena', 0, 1),
        'bossScylla': ('stages.undergroundCaverns.rooms.scyllaWyrmRoom', 0, 0),
        'bossDoppelganger10Left': ('stages.outerWall.rooms.doppelgangerRoom', 0, 0),
        'bossDoppelganger10Right': ('stages.outerWall.rooms.doppelgangerRoom', 0, 1),
        'bossHippogryphLeft': ('stages.royalChapel.rooms.hippogryphRoom', 0, 0),
        'bossHippogryphRight': ('stages.royalChapel.rooms.hippogryphRoom', 0, 1),
        'bossRichter': ('stages.castleKeep.rooms.keepArea', 3, 3),
        'bossCerberusLeft': ('stages.abandonedMine.rooms.cerberusRoom', 0, 0),
        'bossCerberusRight': ('stages.abandonedMine.rooms.cerberusRoom', 0, 1),
        'bossTrioLeft': ('stages.reverseColosseum.rooms.arena', 0, 0),
        'bossTrioRight': ('stages.reverseColosseum.rooms.arena', 0, 1),
        'bossBeelzebubLeft': ('stages.necromancyLaboratory.rooms.slograAndGaibonRoom', 0, 0),
        'bossBeelzebubRight': ('stages.necromancyLaboratory.rooms.slograAndGaibonRoom', 1, 3),
        'bossDeathLeft': ('stages.cave.rooms.cerberusRoom', 0, 0),
        'bossDeathRight': ('stages.cave.rooms.cerberusRoom', 0, 1),
        'bossMedusaLeft': ('stages.antiChapel.rooms.hippogryphRoom', 0, 0),
        'bossMedusaRight': ('stages.antiChapel.rooms.hippogryphRoom', 0, 1),
        'bossCreatureLeft': ('stages.reverseOuterWall.rooms.doppelgangerRoom', 0, 0),
        'bossCreatureRight': ('stages.reverseOuterWall.rooms.doppelgangerRoom', 0, 1),
        'bossDoppelganger40': ('stages.reverseCaverns.rooms.scyllaWyrmRoom', 0, 0),
        'bossAkmodanII': ('stages.deathWingsLair.rooms.olroxsRoom', 1, 0),
        'bossGalamoth': ('stages.floatingCatacombs.rooms.granfaloonsLair', 1, 0),
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
        'colosseumMistGateYousei': ('stages.colosseum.rooms.topOfElevatorShaft', False),
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
        'outerWallMistGateYousei': ('stages.outerWall.rooms.lowerMedusaRoom', False),
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
    'rooms': {
        'abandonedMine': [
            'bend',
            'cerberusRoom',
            'demonCard',
            'demonSwitch',
            'fourWayIntersection',
            'karmaCoinRoom',
            'loadingRoomToCatacombs',
            'loadingRoomToUndergroundCaverns',
            'loadingRoomToWarpRooms',
            'lowerStairwell',
            'peanutsRoom',
            'saveRoom',
            'snakeColumn',
            'triggerTeleporterToCatacombs',
            'triggerTeleporterToUndergroundCaverns',
            'triggerTeleporterToWarpRooms',
            'venusWeedRoom',
            'wellLitSkullRoom',
            'wolfsHeadColumn',
        ],
        'antiChapel': [
            'chapelStaircase',
            'confessionalBooth',
            'emptyRoom',
            'triggerTeleporterToAlchemyLaboratory',
            'triggerTeleporterToCastleKeep',
            'triggerTeleporterToColosseum',
            'triggerTeleporterToOlroxsQuarters',
            'gogglesRoom',
            'hippogryphRoom',
            'leftTower',
            'loadingRoomToAlchemyLaboratory',
            'loadingRoomToCastleKeep',
            'loadingRoomToColosseum',
            'loadingRoomToOlroxsQuarters',
            'middleTower',
            'nave',
            'pushingStatueShortcut',
            'rightTower',
            'saveRoomA',
            'saveRoomB',
            'silverRingRoom',
            'spikeHallway',
            'statueLedge',
            'walkwayBetweenTowers',
            'walkwayLeftOfHippogryph',
            'walkwayRightOfHippogryph',
        ],
        'alchemyLaboratory': [
            'batCardRoom',
            'bloodyZombieHallway',
            'blueDoorHallway',
            'boxPuzzleRoom',
            'cannonRoom',
            'clothCapeRoom',
            'corridorToElevator',
            'elevatorShaft',
            'emptyZigZagRoom',
            'entryway',
            'exitToMarbleGallery',
            'exitToRoyalChapel',
            'triggerTeleporterToCastleEntrance',
            'triggerTeleporterToMarbleGallery',
            'triggerTeleporterToRoyalChapel',
            'glassVats',
            'heartMaxUpRoom',
            'loadingRoomToCastleEntrance',
            'loadingRoomToMarbleGallery',
            'loadingRoomToRoyalChapel',
            'redSkeletonLiftRoom',
            'saveRoomA',
            'saveRoomB',
            'saveRoomC',
            'secretLifeMaxUpRoom',
            'shortZigZagRoom',
            'skillOfWolfRoom',
            'slograAndGaibonRoom',
            'sunglassesRoom',
            'tallSpittleboneRoom',
            'tallZigZagRoom',
            'tetrominoRoom',
        ],
        'bossCerberus': [
            'cerberusRoom',
            'triggerTeleporterA',
            'triggerTeleporterB',
        ],
        'bossMedusa': [
            'hippogryphRoom',
            'triggerTeleporterA',
            'triggerTeleporterB',
        ],
        'bossRichter': [
            'throneRoom',
        ],
        'castleEntrance': [
            'afterDrawbridge',
            'atticEntrance',
            'atticHallway',
            'atticStaircase',
            'cubeOfZoeRoom',
            'dropUnderPortcullis',
            'triggerTeleporterToAlchemyLaboratory',
            'triggerTeleporterToMarbleGallery',
            'triggerTeleporterToUndergroundCaverns',
            'triggerTeleporterToWarpRooms',
            'forestCutscene',
            'gargoyleRoom',
            'heartMaxUpRoom',
            'holyMailRoom',
            'jewelSwordRoom',
            'lifeMaxUpRoom',
            'loadingRoomToAlchemyLaboratory',
            'loadingRoomToMarbleGallery',
            'loadingRoomToUndergroundCaverns',
            'loadingRoomToWarpRooms',
            'meetingRoomWithDeath',
            'mermanRoom',
            'saveRoomA',
            'saveRoomB',
            'saveRoomC',
            'shortcutToUndergroundCaverns',
            'shortcutToWarpRooms',
            'stairwellAfterDeath',
            'unknownRoom19',
            'unknownRoom20',
            'wargHallway',
            'zombieHallway',
        ],
        'castleEntranceRevisited': [
            'afterDrawbridge',
            'atticEntrance',
            'atticHallway',
            'atticStaircase',
            'cubeOfZoeRoom',
            'dropUnderPortcullis',
            'triggerTeleporterToAlchemyLaboratory',
            'triggerTeleporterToMarbleGallery',
            'triggerTeleporterToUndergroundCaverns',
            'triggerTeleporterToWarpRooms',
            'gargoyleRoom',
            'heartMaxUpRoom',
            'holyMailRoom',
            'jewelSwordRoom',
            'lifeMaxUpRoom',
            'loadingRoomToAlchemyLaboratory',
            'loadingRoomToMarbleGallery',
            'loadingRoomToUndergroundCaverns',
            'loadingRoomToWarpRooms',
            'meetingRoomWithDeath',
            'mermanRoom',
            'saveRoomA',
            'saveRoomB',
            'saveRoomC',
            'shortcutToUndergroundCaverns',
            'shortcutToWarpRooms',
            'stairwellAfterDeath',
            'wargHallway',
            'zombieHallway',
        ],
        'marbleGallery': [
            'alucartRoom',
            'beneathDropoff',
            'beneathLeftTrapdoor',
            'beneathRightTrapdoor',
            'blueDoorRoom',
            'clockRoom',
            'dropoff',
            'elevatorRoom',
            'emptyRoom',
            'entrance',
            'triggerTeleporterToAlchemyLaboratory',
            'triggerTeleporterToCastleCenter',
            'triggerTeleporterToCastleEntrance',
            'triggerTeleporterToOlroxsQuarters',
            'triggerTeleporterToOuterWall',
            'triggerTeleporterToUndergroundCaverns',
            'gravityBootsRoom',
            'leftOfClockRoom',
            'loadingRoomToAlchemyLaboratory',
            'loadingRoomToCastleEntrance',
            'loadingRoomToOlroxsQuarters',
            'loadingRoomToOuterWall',
            'loadingRoomToUndergroundCaverns',
            'longHallway',
            'ouijaTableStairway',
            'pathwayAfterLeftStatue',
            'pathwayAfterRightStatue',
            'powerUpRoom',
            'rightOfClockRoom',
            'sShapedHallways',
            'saveRoomA',
            'saveRoomB',
            'slingerStaircase',
            'spiritOrbRoom',
            'stainedGlassCorner',
            'stairwellToUndergroundCaverns',
            'stopwatchRoom',
            'tallStainedGlassWindows',
            'threePaths',
        ],
        'royalChapel': [
            'chapelStaircase',
            'confessionalBooth',
            'emptyRoom',
            'triggerTeleporterToAlchemyLaboratory',
            'triggerTeleporterToCastleKeep',
            'triggerTeleporterToColosseum',
            'triggerTeleporterToOlroxsQuarters',
            'gogglesRoom',
            'hippogryphRoom',
            'leftTower',
            'loadingRoomToAlchemyLaboratory',
            'loadingRoomToCastleKeep',
            'loadingRoomToColosseum',
            'loadingRoomToOlroxsQuarters',
            'middleTower',
            'nave',
            'pushingStatueShortcut',
            'rightTower',
            'saveRoomA',
            'saveRoomB',
            'silverRingRoom',
            'spikeHallway',
            'statueLedge',
            'walkwayBetweenTowers',
            'walkwayLeftOfHippogryph',
            'walkwayRightOfHippogryph',
        ],
        'warpRooms': [
            'triggerTeleporterToAbandonedMine',
            'triggerTeleporterToCastleEntrance',
            'triggerTeleporterToCastleKeep',
            'triggerTeleporterToOlroxsQuarters',
            'triggerTeleporterToOuterWall',
            'loadingRoomToAbandonedMine',
            'loadingRoomToCastleEntrance',
            'loadingRoomToCastleKeep',
            'loadingRoomToOlroxsQuarters',
            'loadingRoomToOuterWall',
            'warpRoomToAbandonedMine',
            'warpRoomToCastleEntrance',
            'warpRoomToCastleKeep',
            'warpRoomToOlroxsQuarters',
            'warpRoomToOuterWall',
        ],
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
}

# Change dependencies are processed according to the following order, organized by dependency level
# Level 0: rooms (First Castle, excluding Castle Entrance Revisited)
# Level 1: rooms (Castle Entrance Revisited and Inverted Castle)
# Level 1: secretMapTileReveals
# Level 2: bossTeleporters
# Level 2: familiarEvents
# Level 2: bossRooms

if __name__ == '__main__':
    with (
        open(os.path.join('data', 'change-dependencies-template.yaml')) as source_file,
        open(os.path.join('build', 'change-dependencies.json'), 'w') as target_file,
    ):
        target = yaml.safe_load(source_file)
        evaluate = target['changes'][0]['evaluate']
        # Rooms
        for stage_name in sorted(data['rooms'], key=lambda stage_name: (stage_name not in data['associatedStages'], stage_name)):
            print('', stage_name)
            for room_name in data['rooms'][stage_name]:
                # Calculate right and bottom
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
                # Copy boundaries to layerDefinitions
                for property_name in (
                    'left',
                    'top',
                    'right',
                    'bottom',
                ):
                    source_property_key = '.'.join(('stages', stage_name, 'rooms', room_name, property_name))
                    target_property_key = '.'.join(('stages', stage_name, 'layers', 'layerDefinitions', room_name, 'layoutRect', property_name))
                    print('   -', target_property_key)
                    transformation = [
                        {
                            'action': 'get',
                            'type': 'property',
                            'property': source_property_key,
                        },
                        {
                            'action': 'set',
                            'type': 'property',
                            'property': target_property_key,
                        },
                    ]
                    evaluate['evaluations'][target_property_key] = transformation
                    evaluate['evaluationOrder'].append(target_property_key)
                # Copy stored flags
                source_property_key = '.'.join(('stages', stage_name, 'layers', 'layerDefinitions', room_name, '_layoutRectFlags'))
                target_property_key = '.'.join(('stages', stage_name, 'layers', 'layerDefinitions', room_name, 'layoutRect', 'flags'))
                print('   -', target_property_key)
                transformation = [
                    {
                        'action': 'get',
                        'type': 'property',
                        'property': source_property_key,
                    },
                    {
                        'action': 'set',
                        'type': 'property',
                        'property': target_property_key,
                    },
                ]
                evaluate['evaluations'][target_property_key] = transformation
                evaluate['evaluationOrder'].append(target_property_key)
        # Associated Stages
        for (stage_name, (associated_stage_name, reverse_ind)) in data['associatedStages'].items():
            if stage_name not in data['rooms']:
                continue
            for room_name in data['rooms'][stage_name]:
                if associated_stage_name not in data['rooms'] or room_name not in data['rooms'][associated_stage_name]:
                    continue
                for (primary_property_name, secondary_property_name) in (
                    ('left', '_columns'),
                    ('top', '_rows'),
                    ('right', '_columns'),
                    ('bottom', '_rows'),
                ):
                    primary_property_key = '.'.join(('stages', stage_name, 'rooms', room_name, primary_property_name))
                    secondary_property_key = '.'.join(('stages', stage_name, 'rooms', room_name, secondary_property_name))
                    target_property_key = '.'.join(('stages', associated_stage_name, 'rooms', room_name, primary_property_name))
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
                            'property': primary_property_key,
                        })
                        transformation.append({
                            'action': 'subtract',
                            'type': 'property',
                            'property': secondary_property_key,
                        })
                    else:
                        transformation.append({
                            'action': 'get',
                            'type': 'property',
                            'property': primary_property_key,
                        })
                    transformation.append({
                        'action': 'set',
                        'type': 'property',
                        'property': target_property_key,
                    })
                    evaluate['evaluations'][target_property_key] = transformation
                    evaluate['evaluationOrder'].append(target_property_key)
                for (property_name) in (
                    'left',
                    'top',
                ):
                    source_property_key = '.'.join(('stages', associated_stage_name, 'rooms', room_name, property_name))
                    target_property_key = '.'.join(('stages', associated_stage_name, 'layers', 'layerDefinitions', room_name, 'layoutRect', property_name))
                    transformation = []
                    transformation.append({
                        'action': 'get',
                        'type': 'property',
                        'property': source_property_key,
                    })
                    transformation.append({
                        'action': 'set',
                        'type': 'property',
                        'property': target_property_key,
                    })
                    evaluate['evaluations'][target_property_key] = transformation
                    evaluate['evaluationOrder'].append(target_property_key)
        # Boss Teleporters and Secret Map Tile Reveals
        for transformation_group_key in (
            'secretMapTileReveals',
            'bossTeleporters',
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
        # Boss Rooms
        for (target_room_key, source_room_key, offset_top, offset_left) in data['bossRooms']:
            print('', target_room_key)
            for (property_name, offset_value) in (
                ('top', offset_top),
                ('left', offset_left),
            ):
                source_property_key = '.'.join((source_room_key, property_name))
                target_property_key = '.'.join((target_room_key, property_name))
                transformation = []
                transformation.append({
                    'action': 'get',
                    'type': 'property',
                    'property': source_property_key,
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
                    'property': target_property_key,
                })
                evaluate['evaluations'][target_property_key] = transformation
                evaluate['evaluationOrder'].append(target_property_key)
        # Put template evaluations last
        evaluate['evaluationOrder'].append('castleTeleporters')
        evaluate['evaluationOrder'].append('castleEntranceDrawbridgeCutscene')
        evaluate['evaluationOrder'].append('specialSaveRooms')
        evaluate['evaluationOrder'].append('warpRoomCoordinates')
        json.dump(target, target_file, indent='    ', sort_keys=True)
