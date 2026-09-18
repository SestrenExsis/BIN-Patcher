
import fs from 'fs'

const ASSOCIATED_STAGES = {
    antiChapel: {
        associatedStageName: 'royalChapel',
        reversed: true,
    },
    blackMarbleGallery: {
        associatedStageName: 'marbleGallery',
        reversed: true,
    },
    castleEntranceRevisited: {
        associatedStageName: 'castleEntrance',
        reversed: false,
    },
    cave: {
        associatedStageName: 'abandonedMine',
        reversed: true,
    },
    deathWingsLair: {
        associatedStageName: 'olroxsQuarters',
        reversed: true,
    },
    floatingCatacombs: {
        associatedStageName: 'catacombs',
        reversed: true,
    },
    forbiddenLibrary: {
        associatedStageName: 'longLibrary',
        reversed: true,
    },
    necromancyLaboratory: {
        associatedStageName: 'alchemyLaboratory',
        reversed: true,
    },
    reverseCastleCenter: {
        associatedStageName: 'castleCenter',
        reversed: true,
    },
    reverseCaverns: {
        associatedStageName: 'undergroundCaverns',
        reversed: true,
    },
    reverseClockTower: {
        associatedStageName: 'clockTower',
        reversed: true,
    },
    reverseColosseum: {
        associatedStageName: 'colosseum',
        reversed: true,
    },
    reverseEntrance: {
        associatedStageName: 'castleEntrance',
        reversed: true,
    },
    reverseKeep: {
        associatedStageName: 'castleKeep',
        reversed: true,
    },
    reverseOuterWall: {
        associatedStageName: 'outerWall',
        reversed: true,
    },
    reverseWarpRooms: {
        associatedStageName: 'warpRooms',
        reversed: true,
    },
}

export const BASE_DROP_RATES = {
    abandonedMine: 0x000D6C,
    alchemyLaboratory: 0x0018C0,
    antiChapel: 0x0010E4,
    blackMarbleGallery: 0x0013B4,
    bossOlrox: 0x0017C4,
    bossGranfaloon: 0x00138C,
    bossMinotaurAndWerewolf: 0x001010,
    bossScylla: 0x001444,
    bossDoppelganger10: 0x0009FC,
    bossHippogryph: 0x0010AC,
    bossRichter: 0x000A34,
    bossCerberus: 0x000C34,
    bossTrio: 0x00117C,
    bossBeelzebub: 0x000D3C,
    bossDeath: 0x000F7C,
    bossMedusa: 0x000A9C,
    bossCreature: 0x000BA8,
    bossDoppelganger40: 0x000A88,
    bossShaftAndDracula: 0x000C90,
    bossSuccubus: 0x000CC8,
    bossAkmodanII: 0x000AF4,
    bossGalamoth: 0x001B28,
    castleCenter: 0x0B04,
    castleEntrance: 0x200C,
    castleEntranceRevisited: 0x1998,
    castleKeep: 0x1194,
    catacombs: 0x1AE4,
    cave: 0x0C68,
    clockTower: 0x1664,
    colosseum: 0x1364,
    cutsceneMeetingMariaInClockRoom: 0x0AB0,
    deathWingsLair: 0x1294,
    floatingCatacombs: 0x18B0,
    forbiddenLibrary: 0x0F80,
    longLibrary: 0x1FC8,
    marbleGallery: 0x1488,
    necromancyLaboratory: 0x110C,
    olroxsQuarters: 0x1374,
    outerWall: 0x1DA8,
    prologue: 0x1934,
    reverseCaverns: 0x1AF4,
    reverseCastleCenter: 0x0DD8,
    reverseClockTower: 0x1698,
    reverseColosseum: 0x0E2C,
    reverseEntrance: 0x1498,
    reverseKeep: 0x0C7C,
    reverseOuterWall: 0x1158,
    reverseWarpRooms: 0x09DC,
    royalChapel: 0x13BC,
    undergroundCaverns: 0x1D40,
    warpRooms: 0x09DC,
}

const BOSS_ROOMS = {
    bossCerberus: {
        cerberusRoom: {
            sourceStageName: 'abandonedMine',
            sourceRoomName: 'cerberusRoom',
            offsetTop: 0,
            offsetLeft: 0,
        },
        triggerTeleporterA: {
            sourceStageName: 'abandonedMine',
            sourceRoomName: 'cerberusRoom',
            offsetTop: 0,
            offsetLeft: -1,
        },
        triggerTeleporterB: {
            sourceStageName: 'abandonedMine',
            sourceRoomName: 'cerberusRoom',
            offsetTop: 0,
            offsetLeft: 2,
        },
    },
    bossMedusa: {
        hippogryphRoom: {
            sourceStageName: 'antiChapel',
            sourceRoomName: 'hippogryphRoom',
            offsetTop: 0,
            offsetLeft: 0,
        },
        triggerTeleporterA: {
            sourceStageName: 'antiChapel',
            sourceRoomName: 'hippogryphRoom',
            offsetTop: 0,
            offsetLeft: -1,
        },
        triggerTeleporterB: {
            sourceStageName: 'antiChapel',
            sourceRoomName: 'hippogryphRoom',
            offsetTop: 0,
            offsetLeft: 2,
        },
    },
    bossRichter: {
        throneRoom: {
            sourceStageName: 'castleKeep',
            sourceRoomName: 'keepArea',
            offsetTop: 3,
            offsetLeft: 3,
        },
    },
    bossGranfaloon: {
        granfaloonsLair: {
            sourceStageName: 'catacombs',
            sourceRoomName: 'granfaloonsLair',
            offsetTop: 0,
            offsetLeft: 0,
        },
        triggerTeleporterA: {
            sourceStageName: 'catacombs',
            sourceRoomName: 'granfaloonsLair',
            offsetTop: 0,
            offsetLeft: 2,
        },
        triggerTeleporterB: {
            sourceStageName: 'catacombs',
            sourceRoomName: 'granfaloonsLair',
            offsetTop: 1,
            offsetLeft: -1,
        },
    },
    bossDeath: {
        cerberusRoom: {
            sourceStageName: 'cave',
            sourceRoomName: 'cerberusRoom',
            offsetTop: 0,
            offsetLeft: 0,
        },
        triggerTeleporterA: {
            sourceStageName: 'cave',
            sourceRoomName: 'cerberusRoom',
            offsetTop: 0,
            offsetLeft: -1,
        },
        triggerTeleporterB: {
            sourceStageName: 'cave',
            sourceRoomName: 'cerberusRoom',
            offsetTop: 0,
            offsetLeft: 2,
        },
    },
    bossMinotaurAndWerewolf: {
        arena: {
            sourceStageName: 'colosseum',
            sourceRoomName: 'arena',
            offsetTop: 0,
            offsetLeft: 0,
        },
        triggerTeleporterA: {
            sourceStageName: 'colosseum',
            sourceRoomName: 'arena',
            offsetTop: 0,
            offsetLeft: -1,
        },
        triggerTeleporterB: {
            sourceStageName: 'colosseum',
            sourceRoomName: 'arena',
            offsetTop: 0,
            offsetLeft: 2,
        },
    },
    bossAkmodanII: {
        olroxsRoom: {
            sourceStageName: 'deathWingsLair',
            sourceRoomName: 'olroxsRoom',
            offsetTop: 0,
            offsetLeft: 0,
        },
        triggerTeleporterA: {
            sourceStageName: 'deathWingsLair',
            sourceRoomName: 'olroxsRoom',
            offsetTop: 1,
            offsetLeft: -1,
        },
        triggerTeleporterB: {
            sourceStageName: 'deathWingsLair',
            sourceRoomName: 'olroxsRoom',
            offsetTop: 1,
            offsetLeft: 2,
        },
    },
    bossGalamoth: {
        granfaloonsLair: {
            sourceStageName: 'floatingCatacombs',
            sourceRoomName: 'granfaloonsLair',
            offsetTop: 0,
            offsetLeft: 0,
        },
        triggerTeleporterA: {
            sourceStageName: 'floatingCatacombs',
            sourceRoomName: 'granfaloonsLair',
            offsetTop: 0,
            offsetLeft: 2,
        },
        triggerTeleporterB: {
            sourceStageName: 'floatingCatacombs',
            sourceRoomName: 'granfaloonsLair',
            offsetTop: 1,
            offsetLeft: -1,
        },
    },
    bossBeelzebub: {
        slograAndGaibonRoom: {
            sourceStageName: 'necromancyLaboratory',
            sourceRoomName: 'slograAndGaibonRoom',
            offsetTop: 0,
            offsetLeft: 0,
        },
        triggerTeleporterA: {
            sourceStageName: 'necromancyLaboratory',
            sourceRoomName: 'slograAndGaibonRoom',
            offsetTop: 0,
            offsetLeft: -1,
        },
        triggerTeleporterB: {
            sourceStageName: 'necromancyLaboratory',
            sourceRoomName: 'slograAndGaibonRoom',
            offsetTop: 1,
            offsetLeft: -1,
        },
        triggerTeleporterC: {
            sourceStageName: 'necromancyLaboratory',
            sourceRoomName: 'slograAndGaibonRoom',
            offsetTop: 1,
            offsetLeft: 4,
        },
    },
    bossOlrox: {
        olroxsRoom: {
            sourceStageName: 'olroxsQuarters',
            sourceRoomName: 'olroxsRoom',
            offsetTop: 0,
            offsetLeft: 0,
        },
        triggerTeleporterA: {
            sourceStageName: 'olroxsQuarters',
            sourceRoomName: 'olroxsRoom',
            offsetTop: 0,
            offsetLeft: -1,
        },
        triggerTeleporterB: {
            sourceStageName: 'olroxsQuarters',
            sourceRoomName: 'olroxsRoom',
            offsetTop: 0,
            offsetLeft: 2,
        },
    },
    bossDoppelganger10: {
        doppelgangerRoom: {
            sourceStageName: 'outerWall',
            sourceRoomName: 'doppelgangerRoom',
            offsetTop: 0,
            offsetLeft: 0,
        },
        triggerTeleporterA: {
            sourceStageName: 'outerWall',
            sourceRoomName: 'doppelgangerRoom',
            offsetTop: 0,
            offsetLeft: -1,
        },
        triggerTeleporterB: {
            sourceStageName: 'outerWall',
            sourceRoomName: 'doppelgangerRoom',
            offsetTop: 0,
            offsetLeft: 2,
        },
    },
    bossDoppelganger40: {
        scyllaWyrmRoom: {
            sourceStageName: 'reverseCaverns',
            sourceRoomName: 'scyllaWyrmRoom',
            offsetTop: 0,
            offsetLeft: 0,
        },
        triggerTeleporterA: {
            sourceStageName: 'reverseCaverns',
            sourceRoomName: 'scyllaWyrmRoom',
            offsetTop: 0,
            offsetLeft: -1,
        },
        triggerTeleporterB: {
            sourceStageName: 'reverseCaverns',
            sourceRoomName: 'scyllaWyrmRoom',
            offsetTop: 0,
            offsetLeft: 1,
        },
    },
    bossTrio: {
        arena: {
            sourceStageName: 'reverseColosseum',
            sourceRoomName: 'arena',
            offsetTop: 0,
            offsetLeft: 0,
        },
        triggerTeleporterA: {
            sourceStageName: 'reverseColosseum',
            sourceRoomName: 'arena',
            offsetTop: 0,
            offsetLeft: -1,
        },
        triggerTeleporterB: {
            sourceStageName: 'reverseColosseum',
            sourceRoomName: 'arena',
            offsetTop: 0,
            offsetLeft: 2,
        },
    },
    bossCreature: {
        doppelgangerRoom: {
            sourceStageName: 'reverseOuterWall',
            sourceRoomName: 'doppelgangerRoom',
            offsetTop: 0,
            offsetLeft: 0,
        },
        triggerTeleporterA: {
            sourceStageName: 'reverseOuterWall',
            sourceRoomName: 'doppelgangerRoom',
            offsetTop: 0,
            offsetLeft: -1,
        },
        triggerTeleporterB: {
            sourceStageName: 'reverseOuterWall',
            sourceRoomName: 'doppelgangerRoom',
            offsetTop: 0,
            offsetLeft: 2,
        },
    },
    bossHippogryph: {
        hippogryphRoom: {
            sourceStageName: 'royalChapel',
            sourceRoomName: 'hippogryphRoom',
            offsetTop: 0,
            offsetLeft: 0,
        },
        triggerTeleporterA: {
            sourceStageName: 'royalChapel',
            sourceRoomName: 'hippogryphRoom',
            offsetTop: 0,
            offsetLeft: -1,
        },
        triggerTeleporterB: {
            sourceStageName: 'royalChapel',
            sourceRoomName: 'hippogryphRoom',
            offsetTop: 0,
            offsetLeft: 2,
        },
    },
    bossScylla: {
        scyllaWyrmRoom: {
            sourceStageName: 'undergroundCaverns',
            sourceRoomName: 'scyllaWyrmRoom',
            offsetTop: 0,
            offsetLeft: 0,
        },
        triggerTeleporterA: {
            sourceStageName: 'undergroundCaverns',
            sourceRoomName: 'scyllaWyrmRoom',
            offsetTop: 0,
            offsetLeft: -1,
        },
        risingWaterRoom: {
            sourceStageName: 'undergroundCaverns',
            sourceRoomName: 'scyllaWyrmRoom',
            offsetTop: 0,
            offsetLeft: 1,
        },
        scyllaRoom: {
            sourceStageName: 'undergroundCaverns',
            sourceRoomName: 'scyllaWyrmRoom',
            offsetTop: -1,
            offsetLeft: 1,
        },
        crystalCloakRoom: {
            sourceStageName: 'undergroundCaverns',
            sourceRoomName: 'scyllaWyrmRoom',
            offsetTop: -1,
            offsetLeft: 0,
        },
    },
    cutsceneMeetingMariaInClockRoom: {
        clockRoom: {
            sourceStageName: 'marbleGallery',
            sourceRoomName: 'clockRoom',
            offsetTop: 0,
            offsetLeft: 0,
        },
        triggerTeleporterA: {
            sourceStageName: 'marbleGallery',
            sourceRoomName: 'clockRoom',
            offsetTop: 0,
            offsetLeft: -1,
        },
        triggerTeleporterB: {
            sourceStageName: 'marbleGallery',
            sourceRoomName: 'clockRoom',
            offsetTop: 0,
            offsetLeft: 1,
        },
    },
}

const BOSS_TELEPORTERS = {
    cutsceneMeetingMariaInClockRoom: {
        stageName: 'marbleGallery',
        roomName: 'clockRoom',
        top: 0,
        left: 0,
    },
    bossOlroxRight: {
        stageName: 'olroxsQuarters',
        roomName: 'olroxsRoom',
        top: 0,
        left: 1,
    },
    bossGranfaloonRight: {
        stageName: 'catacombs',
        roomName: 'granfaloonsLair',
        top: 0,
        left: 1,
    },
    bossMinotaurAndWerewolfLeft: {
        stageName: 'colosseum',
        roomName: 'arena',
        top: 0,
        left: 0,
    },
    bossMinotaurAndWerewolfRight: {
        stageName: 'colosseum',
        roomName: 'arena',
        top: 0,
        left: 1,
    },
    bossScylla: {
        stageName: 'undergroundCaverns',
        roomName: 'scyllaWyrmRoom',
        top: 0,
        left: 0,
    },
    bossDoppelganger10Left: {
        stageName: 'outerWall',
        roomName: 'doppelgangerRoom',
        top: 0,
        left: 0,
    },
    bossDoppelganger10Right: {
        stageName: 'outerWall',
        roomName: 'doppelgangerRoom',
        top: 0,
        left: 1,
    },
    bossHippogryphLeft: {
        stageName: 'royalChapel',
        roomName: 'hippogryphRoom',
        top: 0,
        left: 0,
    },
    bossHippogryphRight: {
        stageName: 'royalChapel',
        roomName: 'hippogryphRoom',
        top: 0,
        left: 1,
    },
    bossRichter: {
        stageName: 'castleKeep',
        roomName: 'keepArea',
        top: 3,
        left: 3,
    },
    bossCerberusLeft: {
        stageName: 'abandonedMine',
        roomName: 'cerberusRoom',
        top: 0,
        left: 0,
    },
    bossCerberusRight: {
        stageName: 'abandonedMine',
        roomName: 'cerberusRoom',
        top: 0,
        left: 1,
    },
    bossTrioLeft: {
        stageName: 'reverseColosseum',
        roomName: 'arena',
        top: 0,
        left: 0,
    },
    bossTrioRight: {
        stageName: 'reverseColosseum',
        roomName: 'arena',
        top: 0,
        left: 1,
    },
    bossBeelzebubLeft: {
        stageName: 'necromancyLaboratory',
        roomName: 'slograAndGaibonRoom',
        top: 0,
        left: 0,
    },
    bossBeelzebubRight: {
        stageName: 'necromancyLaboratory',
        roomName: 'slograAndGaibonRoom',
        top: 1,
        left: 3,
    },
    bossDeathLeft: {
        stageName: 'cave',
        roomName: 'cerberusRoom',
        top: 0,
        left: 0,
    },
    bossDeathRight: {
        stageName: 'cave',
        roomName: 'cerberusRoom',
        top: 0,
        left: 1,
    },
    bossMedusaLeft: {
        stageName: 'antiChapel',
        roomName: 'hippogryphRoom',
        top: 0,
        left: 0,
    },
    bossMedusaRight: {
        stageName: 'antiChapel',
        roomName: 'hippogryphRoom',
        top: 0,
        left: 1,
    },
    bossCreatureLeft: {
        stageName: 'reverseOuterWall',
        roomName: 'doppelgangerRoom',
        top: 0,
        left: 0,
    },
    bossCreatureRight: {
        stageName: 'reverseOuterWall',
        roomName: 'doppelgangerRoom',
        top: 0,
        left: 1,
    },
    bossDoppelganger40: {
        stageName: 'reverseCaverns',
        roomName: 'scyllaWyrmRoom',
        top: 0,
        left: 0,
    },
    bossAkmodanIILeft: {
        stageName: 'deathWingsLair',
        roomName: 'olroxsRoom',
        top: 1,
        left: 0,
    },
    bossGalamothLeft: {
        stageName: 'floatingCatacombs',
        roomName: 'granfaloonsLair',
        top: 1,
        left: 0,
    },
}

const FAMILIAR_EVENTS = {
    abandonedMineDemonSwitchDemon: {
        stageName: 'abandonedMine',
        roomName: 'demonSwitch',
        inverted: false,
    },
    abandonedMineDemonSwitchNoseDevil: {
        stageName: 'abandonedMine',
        roomName: 'demonSwitch',
        inverted: false,
    },
    alchemyLaboratoryBreakableFloorFaerie: {
        stageName: 'alchemyLaboratory',
        roomName: 'tallZigZagRoom',
        inverted: false,
    },
    alchemyLaboratoryBreakableFloorYousei: {
        stageName: 'alchemyLaboratory',
        roomName: 'tallZigZagRoom',
        inverted: false,
    },
    alchemyLaboratoryBreakableWallFaerie: {
        stageName: 'alchemyLaboratory',
        roomName: 'tallZigZagRoom',
        inverted: false,
    },
    alchemyLaboratoryBreakableWallYousei: {
        stageName: 'alchemyLaboratory',
        roomName: 'tallZigZagRoom',
        inverted: false,
    },
    catacombsDarkRoomBat: {
        stageName: 'catacombs',
        roomName: 'pitchBlackSpikeMaze',
        inverted: false,
    },
    catacombsDarkRoomDemon: {
        stageName: 'catacombs',
        roomName: 'pitchBlackSpikeMaze',
        inverted: false,
    },
    catacombsDarkRoomFaerie1: {
        stageName: 'catacombs',
        roomName: 'pitchBlackSpikeMaze',
        inverted: false,
    },
    catacombsDarkRoomFaerie2: {
        stageName: 'catacombs',
        roomName: 'pitchBlackSpikeMaze',
        inverted: false,
    },
    catacombsDarkRoomGhost: {
        stageName: 'catacombs',
        roomName: 'pitchBlackSpikeMaze',
        inverted: false,
    },
    catacombsDarkRoomNoseDevil: {
        stageName: 'catacombs',
        roomName: 'pitchBlackSpikeMaze',
        inverted: false,
    },
    catacombsDarkRoomSword: {
        stageName: 'catacombs',
        roomName: 'pitchBlackSpikeMaze',
        inverted: false,
    },
    catacombsDarkRoomYousei1: {
        stageName: 'catacombs',
        roomName: 'pitchBlackSpikeMaze',
        inverted: false,
    },
    catacombsDarkRoomYousei2: {
        stageName: 'catacombs',
        roomName: 'pitchBlackSpikeMaze',
        inverted: false,
    },
    caveDemonSwitchDemon: {
        stageName: 'cave',
        roomName: 'demonSwitch',
        inverted: true,
    },
    caveDemonSwitchNoseDevil: {
        stageName: 'cave',
        roomName: 'demonSwitch',
        inverted: true,
    },
    clockTowerLeftBreakableWallFaerie: {
        stageName: 'clockTower',
        roomName: 'pendulumRoom',
        inverted: false,
    },
    clockTowerLeftBreakableWallYousei: {
        stageName: 'clockTower',
        roomName: 'pendulumRoom',
        inverted: false,
    },
    clockTowerRightBreakableWallFaerie: {
        stageName: 'clockTower',
        roomName: 'leftGearRoom',
        inverted: false,
    },
    clockTowerRightBreakableWallYousei: {
        stageName: 'clockTower',
        roomName: 'leftGearRoom',
        inverted: false,
    },
    colosseumMistGateYousei: {
        stageName: 'colosseum',
        roomName: 'topOfElevatorShaft',
        inverted: false,
    },
    colosseumMistGateFaerie: {
        stageName: 'colosseum',
        roomName: 'topOfElevatorShaft',
        inverted: false,
    },
    longLibraryMistGateFaerie: {
        stageName: 'longLibrary',
        roomName: 'lesserDemonArea',
        inverted: false,
    },
    longLibraryMistGateYousei: {
        stageName: 'longLibrary',
        roomName: 'lesserDemonArea',
        inverted: false,
    },
    longLibrarySecretBookcaseFaerie: {
        stageName: 'longLibrary',
        roomName: 'secretBookcaseRoom',
        inverted: false,
    },
    longLibrarySecretBookcaseYousei: {
        stageName: 'longLibrary',
        roomName: 'secretBookcaseRoom',
        inverted: false,
    },
    longLibraryShopDemon: {
        stageName: 'longLibrary',
        roomName: 'shop',
        inverted: false,
    },
    longLibraryShopFaerie: {
        stageName: 'longLibrary',
        roomName: 'shop',
        inverted: false,
    },
    longLibraryShopNoseDevil: {
        stageName: 'longLibrary',
        roomName: 'shop',
        inverted: false,
    },
    longLibraryShopSword: {
        stageName: 'longLibrary',
        roomName: 'shop',
        inverted: false,
    },
    longLibraryShopYousei: {
        stageName: 'longLibrary',
        roomName: 'shop',
        inverted: false,
    },
    olroxsQuartersBreakableWallFaerie: {
        stageName: 'olroxsQuarters',
        roomName: 'grandStaircase',
        inverted: false,
    },
    olroxsQuartersBreakableWallYousei: {
        stageName: 'olroxsQuarters',
        roomName: 'grandStaircase',
        inverted: false,
    },
    outerWallMistGateYousei: {
        stageName: 'outerWall',
        roomName: 'lowerMedusaRoom',
        inverted: false,
    },
    outerWallMistGateFaerie: {
        stageName: 'outerWall',
        roomName: 'lowerMedusaRoom',
        inverted: false,
    },
    royalChapelConfessionalBoothDemon: {
        stageName: 'royalChapel',
        roomName: 'confessionalBooth',
        inverted: false,
    },
    royalChapelConfessionalBoothFaerie: {
        stageName: 'royalChapel',
        roomName: 'confessionalBooth',
        inverted: false,
    },
    royalChapelConfessionalBoothNoseDevil: {
        stageName: 'royalChapel',
        roomName: 'confessionalBooth',
        inverted: false,
    },
    royalChapelConfessionalBoothSword: {
        stageName: 'royalChapel',
        roomName: 'confessionalBooth',
        inverted: false,
    },
    royalChapelConfessionalBoothYousei: {
        stageName: 'royalChapel',
        roomName: 'confessionalBooth',
        inverted: false,
    },
    royalChapelMistGateFaerie: {
        stageName: 'royalChapel',
        roomName: 'spikeHallway',
        inverted: false,
    },
    royalChapelMistGateYousei: {
        stageName: 'royalChapel',
        roomName: 'spikeHallway',
        inverted: false,
    },
    undergroundCavernsBreakableFloorFaerie: {
        stageName: 'undergroundCaverns',
        roomName: 'hiddenCrystalEntrance',
        inverted: false,
    },
    undergroundCavernsBreakableFloorYousei: {
        stageName: 'undergroundCaverns',
        roomName: 'hiddenCrystalEntrance',
        inverted: false,
    },
    undergroundCavernsBreakableWallFaerie: {
        stageName: 'undergroundCaverns',
        roomName: 'plaqueRoomWithBreakableWall',
        inverted: false,
    },
    undergroundCavernsBreakableWallYousei: {
        stageName: 'undergroundCaverns',
        roomName: 'plaqueRoomWithBreakableWall',
        inverted: false,
    },
}

export const FAMILIAR_OVERLAYS = {
    // NOTE(sestren): Which familiars correspond to which overlays have not been fully verified and are educated guesses
    bat: 0x0392A760,
    ghost: 0x0394BDB0,
    faerie: 0x0396FD2C,
    demon: 0x03990890,
    sword: 0x039AF9E4,
    yousei: 0x039D1D38,
    noseDevil: 0x039F2664,
}

const LIVE_MAP_REPAINTS = [
    {
        specialId: 'a',
        addressA: 0x000E7248 + 0x00,
        addressB: 0x000E7248 + 0x50,
        offset: 5,
        roomName: 'leftFerrymanRoute',
        edge: 'left',
    },
    {
        specialId: 'a',
        addressA: 0x000E7248 + 0x08,
        addressB: 0x000E7248 + 0x54,
        offset: 1,
        roomName: 'leftFerrymanRoute',
        edge: 'top',
    },
    {
        specialId: 'b',
        addressA: 0x000E7248 + 0x0C,
        addressB: 0x000E7248 + 0x60,
        offset: 7,
        roomName: 'leftFerrymanRoute',
        edge: 'left',
    },
    {
        specialId: 'b',
        addressA: 0x000E7248 + 0x14,
        addressB: 0x000E7248 + 0x64,
        offset: 1,
        roomName: 'leftFerrymanRoute',
        edge: 'top',
    },
    {
        specialId: 'c',
        addressA: 0x000E7248 + 0x18,
        addressB: 0x000E7248 + 0x70,
        offset: 3,
        roomName: 'rightFerrymanRoute',
        edge: 'left',
    },
    {
        specialId: 'c',
        addressA: 0x000E7248 + 0x20,
        addressB: 0x000E7248 + 0x74,
        offset: 1,
        roomName: 'rightFerrymanRoute',
        edge: 'top',
    },
    {
        specialId: 'd',
        addressA: 0x000E7248 + 0x24,
        addressB: 0x000E7248 + 0x80,
        offset: 4,
        roomName: 'rightFerrymanRoute',
        edge: 'left',
    },
    {
        specialId: 'd',
        addressA: 0x000E7248 + 0x2C,
        addressB: 0x000E7248 + 0x84,
        offset: 1,
        roomName: 'rightFerrymanRoute',
        edge: 'top',
    },
    {
        specialId: 'e',
        addressA: 0x000E7248 + 0x30,
        addressB: 0x000E7248 + 0x90,
        offset: 5,
        roomName: 'rightFerrymanRoute',
        edge: 'left',
    },
    {
        specialId: 'e',
        addressA: 0x000E7248 + 0x38,
        addressB: 0x000E7248 + 0x94,
        offset: 1,
        roomName: 'rightFerrymanRoute',
        edge: 'top',
    },
    {
        specialId: 'f',
        addressA: 0x000E7248 + 0x3C,
        addressB: 0x000E7248 + 0xA0,
        offset: 8,
        roomName: 'rightFerrymanRoute',
        edge: 'left',
    },
    {
        specialId: 'f',
        addressA: 0x000E7248 + 0x44,
        addressB: 0x000E7248 + 0xA4,
        offset: 1,
        roomName: 'rightFerrymanRoute',
        edge: 'top',
    },
]

export const MUSIC = {
    alchemyLaboratory: {
        boss: 0x034280,
        afterSlograAndGaibon: 0x034350,
        'afterSlograAndGaibon2': 0x0343CC,
    },
    bossAkmodanII: {
        boss: 0x013F30,
        stage: 0x013F90,
        stage2: 0x01402C,
    },
    bossBeelzebub: {
        boss: 0x014E20,
        boss2: 0x014E40,
        stage: 0x014E98,
        stage2: 0x014F28,
    },
    bossCerberus: {
        boss: 0x016008,
        stage: 0x016160,
    },
    bossCreature: {
        boss: 0x018894,
        stage: 0x0188F4,
        stage2: 0x018990,
    },
    bossDeath: {
        boss: 0x01F5FC,
        stage: 0x01F748,
    },
    bossDoppelganger10: {
        boss: 0x036560,
        stage: 0x034EF8,
    },
    bossDoppelganger40: {
        boss: 0x0352A8,
    },
    bossGalamoth: {
        boss: 0x019648,
        stage: 0x0196A8,
        stage2: 0x019744,
    },
    bossGranfaloon: {
        boss: 0x021AB8,
        boss2: 0x021AEC,
        stage: 0x0224E4,
    },
    bossHippogryph: {
        boss: 0x024500,
    },
    bossMedusa: {
        boss: 0x012BE0,
        stage: 0x012C40,
        stage2: 0x012CDC,
    },
    bossMinotaurAndWerewolf: {
        boss: 0x026EA8,
        stage: 0x024588,
    },
    bossOlrox: {
        boss: 0x02D47C,
        boss2: 0x02D4D8,
        boss3: 0x02D4F8,
        boss4: 0x02D56C,
        stage: 0x038714,
    },
    bossScylla: {
        boss: 0x0265FC,
        stage: 0x0264B0,
        stage2: 0x0264F4,
        stage3: 0x026690,
    },
    bossSuccubus: {
        boss: 0x0125BC,
    },
    bossTrio: {
        boss: 0x0144F0,
        stage: 0x0145CC,
        stage2: 0x014674,
    },
    castleEntrance: {
        afterCastleAwakes: 0x0381C8,
        afterMeetingDeath: 0x04027C,
    },
    clockTower: {
        boss: 0x02A658,
        stage: 0x02A718,
        stage2: 0x02A790,
    },
    longLibrary: {
        boss: 0x03B700,
        stage: 0x03B7BC,
        stage2: 0x03B828,
    },
    reverseCastleCenter: {
        boss: 0x01AD4C,
    },
    reverseClockTower: {
        boss: 0x02CA08,
        stage: 0x02CAAC,
        stage2: 0x02CB24,
    },
}

const ORDERED_DEPENDENCY_NAMES = [
    'primaryRooms.rightsAndBottoms',
    'secondaryRooms.leftsAndTops',
    'bossRooms.leftsAndTops',
    'secondaryRooms.rightsAndBottoms',
    'rooms.layerDefinitions',
    'secretMapTileReveals',
    'bossTeleporters',
    'familiarEvents',
    'liveMapRepaints',
    'miscellaneous',
]

const ROOMS = {
    abandonedMine: {
        bend: [
            'bend',
        ],
        cerberusRoom: [
            'cerberusRoom',
        ],
        demonCard: [
            'demonCard',
        ],
        demonSwitch: [
            'demonSwitch',
        ],
        fourWayIntersection: [
            'fourWayIntersection',
        ],
        karmaCoinRoom: [
            'karmaCoinRoom',
        ],
        loadingRoomToCatacombs: [
            'loadingRoomToCatacombs',
        ],
        loadingRoomToUndergroundCaverns: [
            'loadingRoomToUndergroundCaverns',
        ],
        loadingRoomToWarpRooms: [
            'loadingRoomToWarpRooms',
        ],
        lowerStairwell: [
            'lowerStairwell',
        ],
        peanutsRoom: [
            'peanutsRoom',
        ],
        saveRoom: [
            'saveRoom',
        ],
        snakeColumn: [
            'snakeColumn',
        ],
        triggerTeleporterToCatacombs: [],
        triggerTeleporterToUndergroundCaverns: [],
        triggerTeleporterToWarpRooms: [],
        venusWeedRoom: [
            'venusWeedRoom',
        ],
        wellLitSkullRoom: [
            'wellLitSkullRoom',
        ],
        wolfsHeadColumn: [
            'wolfsHeadColumn',
        ],
    },
    alchemyLaboratory: {
        batCardRoom: [
            'batCardRoom',
        ],
        bloodyZombieHallway: [
            'bloodyZombieHallway',
        ],
        blueDoorHallway: [
            'blueDoorHallway',
        ],
        boxPuzzleRoom: [
            'boxPuzzleRoom',
        ],
        cannonRoom: [
            'cannonRoom',
        ],
        clothCapeRoom: [
            'clothCapeRoom',
        ],
        corridorToElevator: [
            'corridorToElevator',
        ],
        elevatorShaft: [
            'elevatorShaft',
        ],
        emptyZigZagRoom: [
            'emptyZigZagRoom',
        ],
        entryway: [
            'entryway',
        ],
        exitToMarbleGallery: [
            'exitToMarbleGallery',
        ],
        exitToRoyalChapel: [
            'exitToRoyalChapel',
        ],
        glassVats: [
            'glassVats',
        ],
        heartMaxUpRoom: [
            'heartMaxUpRoom',
        ],
        loadingRoomToCastleEntrance: [
            'loadingRoomToCastleEntrance',
        ],
        loadingRoomToMarbleGallery: [
            'loadingRoomToMarbleGallery',
        ],
        loadingRoomToRoyalChapel: [
            'loadingRoomToRoyalChapel',
        ],
        redSkeletonLiftRoom: [
            'redSkeletonLiftRoom',
        ],
        saveRoomA: [
            'saveRoomA',
        ],
        saveRoomB: [
            'saveRoomB',
        ],
        saveRoomC: [
            'saveRoomC',
        ],
        secretLifeMaxUpRoom: [
            'secretLifeMaxUpRoom',
        ],
        shortZigZagRoom: [
            'shortZigZagRoom',
        ],
        skillOfWolfRoom: [
            'skillOfWolfRoom',
        ],
        slograAndGaibonRoom: [
            'slograAndGaibonRoom',
        ],
        sunglassesRoom: [
            'sunglassesRoom',
        ],
        tallSpittleboneRoom: [
            'tallSpittleboneRoom',
        ],
        tallZigZagRoom: [
            'tallZigZagRoom',
        ],
        tetrominoRoom: [
            'tetrominoRoom',
        ],
        triggerTeleporterToCastleEntrance: [],
        triggerTeleporterToMarbleGallery: [],
        triggerTeleporterToRoyalChapel: [],
    },
    antiChapel: {
        chapelStaircase: [
            'chapelStaircase',
        ],
        confessionalBooth: [
            'confessionalBooth',
            'confessionalBoothBackground',
        ],
        emptyRoom: [
            'emptyRoom',
            'emptyRoomBackground',
        ],
        gogglesRoom: [
            'gogglesRoom',
            'gogglesRoomBackground',
        ],
        hippogryphRoom: [
            'hippogryphRoom',
            'hippogryphRoomBackground',
        ],
        leftTower: [
            'leftTower',
        ],
        loadingRoomToAlchemyLaboratory: [
            'loadingRoomToAlchemyLaboratory',
        ],
        loadingRoomToCastleKeep: [
            'loadingRoomToCastleKeep',
        ],
        loadingRoomToColosseum: [
            'loadingRoomToColosseum',
        ],
        loadingRoomToOlroxsQuarters: [
            'loadingRoomToOlroxsQuarters',
        ],
        middleTower: [
            'middleTower',
        ],
        nave: [
            'nave',
        ],
        pushingStatueShortcut: [
            'pushingStatueShortcut',
            'pushingStatueShortcutBackground',
        ],
        rightTower: [
            'rightTower',
        ],
        saveRoomA: [
            'saveRoomA',
        ],
        saveRoomB: [
            'saveRoomB',
        ],
        silverRingRoom: [
            'silverRingRoom',
            'silverRingRoomBackground',
        ],
        spikeHallway: [
            'spikeHallway',
            'spikeHallwayBackground',
        ],
        statueLedge: [
            'statueLedge',
            'statueLedgeBackground',
        ],
        triggerTeleporterToAlchemyLaboratory: [],
        triggerTeleporterToCastleKeep: [],
        triggerTeleporterToColosseum: [],
        triggerTeleporterToOlroxsQuarters: [],
        walkwayBetweenTowers: [
            'walkwayBetweenTowers',
            'walkwayBetweenTowersBackground',
        ],
        walkwayLeftOfHippogryph: [
            'walkwayLeftOfHippogryph',
            'walkwayLeftOfHippogryphBackground',
        ],
        walkwayRightOfHippogryph: [
            'walkwayRightOfHippogryph',
            'walkwayRightOfHippogryphBackground',
        ],
    },
    blackMarbleGallery: {
        alucartRoom: [
            'alucartRoom',
        ],
        beneathDropoff: [
            'beneathDropoff',
            'beneathDropoffBackground',
        ],
        beneathLeftTrapdoor: [
            'beneathLeftTrapdoor',
            'beneathLeftTrapdoorBackground',
        ],
        beneathRightTrapdoor: [
            'beneathRightTrapdoor',
            'beneathRightTrapdoorBackground',
        ],
        blueDoorRoom: [
            'blueDoorRoom',
            'blueDoorRoomBackground',
        ],
        clockRoom: [
            'clockRoom',
            'clockRoomBackground',
        ],
        dropoff: [
            'dropoff',
            'dropoffBackground',
        ],
        elevatorRoom: [
            'elevatorRoom',
        ],
        emptyRoom: [
            'emptyRoom',
            'emptyRoomBackground',
        ],
        entrance: [
            'entrance',
            'entranceBackground',
        ],
        gravityBootsRoom: [
            'gravityBootsRoom',
        ],
        leftOfClockRoom: [
            'leftOfClockRoom',
            'leftOfClockRoomBackground',
        ],
        loadingRoomToAlchemyLaboratory: [
            'loadingRoomToAlchemyLaboratory',
        ],
        loadingRoomToCastleEntrance: [
            'loadingRoomToCastleEntrance',
        ],
        loadingRoomToOlroxsQuarters: [
            'loadingRoomToOlroxsQuarters',
        ],
        loadingRoomToOuterWall: [
            'loadingRoomToOuterWall',
        ],
        loadingRoomToUndergroundCaverns: [
            'loadingRoomToUndergroundCaverns',
        ],
        longHallway: [
            'longHallway',
        ],
        ouijaTableStairway: [
            'ouijaTableStairway',
            'ouijaTableStairwayBackground',
        ],
        pathwayAfterLeftStatue: [
            'pathwayAfterLeftStatue',
        ],
        pathwayAfterRightStatue: [
            'pathwayAfterRightStatue',
        ],
        powerUpRoom: [
            'powerUpRoom',
        ],
        rightOfClockRoom: [
            'rightOfClockRoom',
            'rightOfClockRoomBackground',
        ],
        sShapedHallways: [
            'sShapedHallways',
            'sShapedHallwaysBackground',
        ],
        saveRoomA: [
            'saveRoomA',
        ],
        saveRoomB: [
            'saveRoomB',
        ],
        slingerStaircase: [
            'slingerStaircase',
            'slingerStaircaseBackground',
        ],
        spiritOrbRoom: [
            'spiritOrbRoom',
            'spiritOrbRoomBackground',
        ],
        stainedGlassCorner: [
            'stainedGlassCorner',
            'stainedGlassCornerBackground',
        ],
        stairwellToUndergroundCaverns: [
            'stairwellToUndergroundCaverns',
            'stairwellToUndergroundCavernsBackground',
        ],
        stopwatchRoom: [
            'stopwatchRoom',
            'stopwatchRoomBackground',
        ],
        tallStainedGlassWindows: [
            'tallStainedGlassWindows',
            'tallStainedGlassWindowsBackground',
        ],
        threePaths: [
            'threePaths',
            'threePathsBackground',
        ],
        triggerTeleporterToAlchemyLaboratory: [],
        triggerTeleporterToCastleCenter: [],
        triggerTeleporterToCastleEntrance: [],
        triggerTeleporterToOlroxsQuarters: [],
        triggerTeleporterToOuterWall: [],
        triggerTeleporterToUndergroundCaverns: [],
    },
    bossAkmodanII: {
        olroxsRoom: [
            'olroxsRoom',
        ],
        triggerTeleporterA: [],
        triggerTeleporterB: [],
    },
    bossBeelzebub: {
        slograAndGaibonRoom: [
            'slograAndGaibonRoom',
        ],
        triggerTeleporterA: [],
        triggerTeleporterB: [],
        triggerTeleporterC: [],
    },
    bossCerberus: {
        cerberusRoom: [
            'cerberusRoom',
        ],
        triggerTeleporterA: [],
        triggerTeleporterB: [],
    },
    bossCreature: {
        doppelgangerRoom: [
            'doppelgangerRoom',
        ],
        triggerTeleporterA: [],
        triggerTeleporterB: [],
    },
    bossDeath: {
        cerberusRoom: [
            'cerberusRoom',
        ],
        triggerTeleporterA: [],
        triggerTeleporterB: [],
    },
    'bossDoppelganger10': {
        doppelgangerRoom: [
            'doppelgangerRoom',
        ],
        triggerTeleporterA: [],
        triggerTeleporterB: [],
    },
    'bossDoppelganger40': {
        scyllaWyrmRoom: [
            'scyllaWyrmRoom',
            'scyllaWyrmRoomBackground',
        ],
        triggerTeleporterA: [],
        triggerTeleporterB: [],
    },
    bossGalamoth: {
        granfaloonsLair: [
            'granfaloonsLair',
            'granfaloonsLairBackground',
        ],
        triggerTeleporterA: [],
        triggerTeleporterB: [],
    },
    bossGranfaloon: {
        granfaloonsLair: [
            'granfaloonsLair',
            'granfaloonsLairBackground',
        ],
        triggerTeleporterA: [],
        triggerTeleporterB: [],
    },
    bossHippogryph: {
        hippogryphRoom: [
            'hippogryphRoom',
            'hippogryphRoomBackground',
        ],
        triggerTeleporterA: [],
        triggerTeleporterB: [],
    },
    bossMedusa: {
        hippogryphRoom: [
            'hippogryphRoom',
            'hippogryphRoomBackground',
        ],
        triggerTeleporterA: [
        ],
        triggerTeleporterB: [
        ],
    },
    bossMinotaurAndWerewolf: {
        arena: [
            'arena',
        ],
        triggerTeleporterA: [],
        triggerTeleporterB: [],
    },
    bossOlrox: {
        olroxsRoom: [
            'olroxsRoom',
        ],
        triggerTeleporterA: [],
        triggerTeleporterB: [],
    },
    bossRichter: {
        throneRoom: [
            'throneRoom',
        ],
    },
    bossScylla: {
        crystalCloakRoom: [
            'crystalCloakRoom',
            'crystalCloakRoomBackground',
        ],
        risingWaterRoom: [
            'risingWaterRoom',
            'risingWaterRoomBackground',
        ],
        scyllaRoom: [
            'scyllaRoom',
            'scyllaRoomBackground',
        ],
        scyllaWyrmRoom: [
            'scyllaWyrmRoom',
            'scyllaWyrmRoomBackground',
        ],
        triggerTeleporterA: [],
    },
    bossShaftAndDracula: {
        centerCube: [
            'centerCube',
        ],
        elevatorShaft: [
            'elevatorShaft',
        ],
        triggerTeleporterA: [],
        'unknownRoomId02': [
            'unknownRoomId02',
        ],
    },
    bossSuccubus: {
        'unknownRoomId00': [
            'unknownRoomId00',
        ],
        'unknownRoomId01': [
            'unknownRoomId01',
        ],
    },
    bossTrio: {
        arena: [
            'arena',
        ],
        triggerTeleporterA: [],
        triggerTeleporterB: [],
    },
    castleCenter: {
        centerCube: [
            'centerCube',
        ],
        elevatorShaft: [
            'elevatorShaft',
        ],
        'triggerTeleporterToBO6': [],
        triggerTeleporterToMarbleGallery: [],
        'unknownRoomId02': [
            'unknownRoomId02',
        ],
    },
    castleEntranceRevisited: {
        afterDrawbridge: [
            'afterDrawbridge',
        ],
        atticEntrance: [
            'atticEntrance',
            'atticEntranceBackground',
        ],
        atticHallway: [
            'atticHallway',
            'atticHallwayBackground',
        ],
        atticStaircase: [
            'atticStaircase',
            'atticStaircaseBackground',
        ],
        cubeOfZoeRoom: [
            'cubeOfZoeRoom',
            'cubeOfZoeRoomBackground',
        ],
        dropUnderPortcullis: [
            'dropUnderPortcullis',
            'dropUnderPortcullisBackground',
        ],
        gargoyleRoom: [
            'gargoyleRoom',
        ],
        heartMaxUpRoom: [
            'heartMaxUpRoom',
            'heartMaxUpRoomBackground',
        ],
        holyMailRoom: [
            'holyMailRoom',
            'holyMailRoomBackground',
        ],
        jewelSwordRoom: [
            'jewelSwordRoom',
            'jewelSwordRoomBackground',
        ],
        lifeMaxUpRoom: [
            'lifeMaxUpRoom',
            'lifeMaxUpRoomBackground',
        ],
        loadingRoomToAlchemyLaboratory: [
            'loadingRoomToAlchemyLaboratory',
        ],
        loadingRoomToMarbleGallery: [
            'loadingRoomToMarbleGallery',
        ],
        loadingRoomToUndergroundCaverns: [
            'loadingRoomToUndergroundCaverns',
        ],
        loadingRoomToWarpRooms: [
            'loadingRoomToWarpRooms',
        ],
        meetingRoomWithDeath: [
            'meetingRoomWithDeath',
        ],
        mermanRoom: [
            'mermanRoom',
            'mermanRoomBackground',
        ],
        saveRoomA: [
            'saveRoomA',
        ],
        saveRoomB: [
            'saveRoomB',
        ],
        saveRoomC: [
            'saveRoomC',
        ],
        shortcutToUndergroundCaverns: [
            'shortcutToUndergroundCaverns',
            'shortcutToUndergroundCavernsBackground',
        ],
        shortcutToWarpRooms: [
            'shortcutToWarpRooms',
            'shortcutToWarpRoomsBackground',
        ],
        stairwellAfterDeath: [
            'stairwellAfterDeath',
            'stairwellAfterDeathBackground',
        ],
        triggerTeleporterToAlchemyLaboratory: [],
        triggerTeleporterToMarbleGallery: [],
        triggerTeleporterToUndergroundCaverns: [],
        triggerTeleporterToWarpRooms: [],
        wargHallway: [
            'wargHallway',
        ],
        zombieHallway: [
            'zombieHallway',
        ],
    },
    castleEntrance: {
        afterDrawbridge: [
            'afterDrawbridge',
        ],
        atticEntrance: [
            'atticEntrance',
            'atticEntranceBackground',
        ],
        atticHallway: [
            'atticHallway',
            'atticHallwayBackground',
        ],
        atticStaircase: [
            'atticStaircase',
            'atticStaircaseBackground',
        ],
        cubeOfZoeRoom: [
            'cubeOfZoeRoom',
            'cubeOfZoeRoomBackground',
        ],
        dropUnderPortcullis: [
            'dropUnderPortcullis',
            'dropUnderPortcullisBackground',
        ],
        forestCutscene: [
            'forestCutscene',
        ],
        gargoyleRoom: [
            'gargoyleRoom',
        ],
        heartMaxUpRoom: [
            'heartMaxUpRoom',
            'heartMaxUpRoomBackground',
        ],
        holyMailRoom: [
            'holyMailRoom',
            'holyMailRoomBackground',
        ],
        jewelSwordRoom: [
            'jewelSwordRoom',
            'jewelSwordRoomBackground',
        ],
        lifeMaxUpRoom: [
            'lifeMaxUpRoom',
            'lifeMaxUpRoomBackground',
        ],
        loadingRoomToAlchemyLaboratory: [
            'loadingRoomToAlchemyLaboratory',
        ],
        loadingRoomToMarbleGallery: [
            'loadingRoomToMarbleGallery',
        ],
        loadingRoomToUndergroundCaverns: [
            'loadingRoomToUndergroundCaverns',
        ],
        loadingRoomToWarpRooms: [
            'loadingRoomToWarpRooms',
        ],
        meetingRoomWithDeath: [
            'meetingRoomWithDeath',
        ],
        mermanRoom: [
            'mermanRoom',
            'mermanRoomBackground',
        ],
        saveRoomA: [
            'saveRoomA',
        ],
        saveRoomB: [
            'saveRoomB',
        ],
        saveRoomC: [
            'saveRoomC',
        ],
        shortcutToUndergroundCaverns: [
            'shortcutToUndergroundCaverns',
            'shortcutToUndergroundCavernsBackground',
        ],
        shortcutToWarpRooms: [
            'shortcutToWarpRooms',
            'shortcutToWarpRoomsBackground',
        ],
        stairwellAfterDeath: [
            'stairwellAfterDeath',
            'stairwellAfterDeathBackground',
        ],
        triggerTeleporterToAlchemyLaboratory: [],
        triggerTeleporterToMarbleGallery: [],
        triggerTeleporterToUndergroundCaverns: [],
        triggerTeleporterToWarpRooms: [],
        'unknownRoom19': [
            'unknownRoom19',
        ],
        'unknownRoom20': [
            'unknownRoom20',
        ],
        wargHallway: [
            'wargHallway',
        ],
        zombieHallway: [
            'zombieHallway',
        ],
    },
    castleKeep: {
        bend: [
            'bend',
        ],
        dualPlatforms: [
            'dualPlatforms',
        ],
        falchionRoom: [
            'falchionRoom',
        ],
        ghostCardRoom: [
            'ghostCardRoom',
        ],
        keepArea: [
            'keepArea',
        ],
        lionTorchPlatform: [
            'lionTorchPlatform',
        ],
        loadingRoomToClockTower: [
            'loadingRoomToClockTower',
        ],
        loadingRoomToRoyalChapel: [
            'loadingRoomToRoyalChapel',
        ],
        loadingRoomToWarpRooms: [
            'loadingRoomToWarpRooms',
        ],
        lowerAttic: [
            'lowerAttic',
        ],
        saveRoomA: [
            'saveRoomA',
        ],
        triggerTeleporterToClockTower: [],
        triggerTeleporterToRoyalChapel: [],
        triggerTeleporterToWarpRooms: [],
        tyrfingRoom: [
            'tyrfingRoom',
        ],
        upperAttic: [
            'upperAttic',
        ],
    },
    catacombs: {
        ballroomMaskRoom: [
            'ballroomMaskRoom',
            'ballroomMaskRoomBackground',
        ],
        boneArkRoom: [
            'boneArkRoom',
            'boneArkRoomBackground',
        ],
        catEyeCircletRoom: [
            'catEyeCircletRoom',
            'catEyeCircletRoomBackground',
        ],
        exitToAbandonedMine: [
            'exitToAbandonedMine',
            'exitToAbandonedMineBackground',
        ],
        granfaloonsLair: [
            'granfaloonsLair',
            'granfaloonsLairBackground',
        ],
        hellfireBeastRoom: [
            'hellfireBeastRoom',
            'hellfireBeastRoomBackground',
        ],
        icebrandRoom: [
            'icebrandRoom',
            'icebrandRoomBackground',
        ],
        leftLavaPath: [
            'leftLavaPath',
        ],
        loadingRoomToAbandonedMine: [
            'loadingRoomToAbandonedMine',
        ],
        mormegilRoom: [
            'mormegilRoom',
            'mormegilRoomBackground',
        ],
        pitchBlackSpikeMaze: [
            'pitchBlackSpikeMaze',
            'pitchBlackSpikeMazeBackground',
        ],
        rightLavaPath: [
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
        saveRoomA: [
            'saveRoomA',
        ],
        saveRoomB: [
            'saveRoomB',
        ],
        smallGremlinRoom: [
            'smallGremlinRoom',
            'smallGremlinRoomBackground',
        ],
        spikeBreakerRoom: [
            'spikeBreakerRoom',
            'spikeBreakerRoomBackground',
        ],
        triggerTeleporterToAbandonedMine: [],
        walkArmorRoom: [
            'walkArmorRoom',
            'walkArmorRoomBackground',
        ],
    },
    cave: {
        bend: [
            'bend',
        ],
        cerberusRoom: [
            'cerberusRoom',
        ],
        demonCard: [
            'demonCard',
        ],
        demonSwitch: [
            'demonSwitch',
        ],
        fourWayIntersection: [
            'fourWayIntersection',
        ],
        karmaCoinRoom: [
            'karmaCoinRoom',
        ],
        loadingRoomToCatacombs: [
            'loadingRoomToCatacombs',
        ],
        loadingRoomToUndergroundCaverns: [
            'loadingRoomToUndergroundCaverns',
        ],
        loadingRoomToWarpRooms: [
            'loadingRoomToWarpRooms',
        ],
        lowerStairwell: [
            'lowerStairwell',
        ],
        peanutsRoom: [
            'peanutsRoom',
        ],
        saveRoom: [
            'saveRoom',
        ],
        snakeColumn: [
            'snakeColumn',
        ],
        triggerTeleporterToCatacombs: [],
        triggerTeleporterToUndergroundCaverns: [],
        triggerTeleporterToWarpRooms: [],
        venusWeedRoom: [
            'venusWeedRoom',
        ],
        wellLitSkullRoom: [
            'wellLitSkullRoom',
        ],
        wolfsHeadColumn: [
            'wolfsHeadColumn',
        ],
    },
    clockTower: {
        belfry: [
            'belfry',
        ],
        exitToCourtyard: [
            'exitToCourtyard',
        ],
        fireOfBatRoom: [
            'fireOfBatRoom',
            'fireOfBatRoomBackground',
        ],
        healingMailRoom: [
            'healingMailRoom',
            'healingMailRoomBackground',
        ],
        hiddenArmory: [
            'hiddenArmory',
        ],
        karasumansRoom: [
            'karasumansRoom',
            'karasumansRoomBackground',
        ],
        leftGearRoom: [
            'leftGearRoom',
        ],
        loadingRoomToCastleKeep: [
            'loadingRoomToCastleKeep',
        ],
        loadingRoomToOuterWall: [
            'loadingRoomToOuterWall',
        ],
        openCourtyard: [
            'openCourtyard',
        ],
        pathToKarasuman: [
            'pathToKarasuman',
        ],
        pendulumRoom: [
            'pendulumRoom',
        ],
        rightGearRoom: [
            'rightGearRoom',
        ],
        spire: [
            'spire',
        ],
        stairwellToOuterWall: [
            'stairwellToOuterWall',
        ],
        triggerTeleporterToCastleKeep: [],
        triggerTeleporterToOuterWall: [],
    },
    colosseum: {
        arena: [
            'arena',
        ],
        bladeMasterRoom: [
            'bladeMasterRoom',
        ],
        bloodCloakRoom: [
            'bloodCloakRoom',
        ],
        bottomOfElevatorShaft: [
            'bottomOfElevatorShaft',
        ],
        fountainRoom: [
            'fountainRoom',
            'fountainRoomBackground',
        ],
        holySwordRoom: [
            'holySwordRoom',
        ],
        leftSideArmory: [
            'leftSideArmory',
        ],
        loadingRoomToOlroxsQuarters: [
            'loadingRoomToOlroxsQuarters',
        ],
        loadingRoomToRoyalChapel: [
            'loadingRoomToRoyalChapel',
        ],
        passagewayBetweenArenaAndRoyalChapel: [
            'passagewayBetweenArenaAndRoyalChapel',
        ],
        rightSideArmory: [
            'rightSideArmory',
        ],
        saveRoomA: [
            'saveRoomA',
        ],
        saveRoomB: [
            'saveRoomB',
        ],
        spiralStaircases: [
            'spiralStaircases',
        ],
        topOfElevatorShaft: [
            'topOfElevatorShaft',
        ],
        topOfLeftSpiralStaircase: [
            'topOfLeftSpiralStaircase',
        ],
        topOfRightSpiralStaircase: [
            'topOfRightSpiralStaircase',
        ],
        triggerTeleporterToOlroxsQuarters: [],
        triggerTeleporterToRoyalChapel: [],
        valhallaKnightRoom: [
            'valhallaKnightRoom',
        ],
    },
    cutsceneMeetingMariaInClockRoom: {
        clockRoom: [
            'clockRoom',
            'clockRoomBackground',
        ],
        triggerTeleporterA: [],
        triggerTeleporterB: [],
    },
    deathWingsLair: {
        bottomOfStairwell: [
            'bottomOfStairwell',
            'bottomOfStairwellBackground',
        ],
        catwalkCrypt: [
            'catwalkCrypt',
            'catwalkCryptBackground',
        ],
        echoOfBatRoom: [
            'echoOfBatRoom',
            'echoOfBatRoomBackground',
        ],
        emptyCells: [
            'emptyCells',
            'emptyCellsBackground',
        ],
        emptyRoom: [
            'emptyRoom',
            'emptyRoomBackground',
        ],
        garnetRoom: [
            'garnetRoom',
            'garnetRoomBackground',
        ],
        grandStaircase: [
            'grandStaircase',
            'grandStaircaseBackground',
        ],
        hammerAndBladeRoom: [
            'hammerAndBladeRoom',
            'hammerAndBladeRoomBackground',
        ],
        loadingRoomToColosseum: [
            'loadingRoomToColosseum',
        ],
        loadingRoomToMarbleGallery: [
            'loadingRoomToMarbleGallery',
        ],
        loadingRoomToRoyalChapel: [
            'loadingRoomToRoyalChapel',
        ],
        loadingRoomToWarpRooms: [
            'loadingRoomToWarpRooms',
        ],
        narrowHallwayToOlrox: [
            'narrowHallwayToOlrox',
        ],
        olroxsRoom: [
            'olroxsRoom',
        ],
        openCourtyard: [
            'openCourtyard',
        ],
        prison: [
            'prison',
            'prisonBackground',
        ],
        saveRoomA: [
            'saveRoomA',
        ],
        secretOnyxRoom: [
            'secretOnyxRoom',
            'secretOnyxRoomBackground',
        ],
        skelerangRoom: [
            'skelerangRoom',
            'skelerangRoomBackground',
        ],
        swordCardRoom: [
            'swordCardRoom',
        ],
        tallShaft: [
            'tallShaft',
            'tallShaftBackground',
        ],
        triggerTeleporterToColosseum: [],
        triggerTeleporterToMarbleGallery: [],
        triggerTeleporterToRoyalChapel: [],
        triggerTeleporterToWarpRooms: [],
    },
    floatingCatacombs: {
        ballroomMaskRoom: [
            'ballroomMaskRoom',
            'ballroomMaskRoomBackground',
        ],
        boneArkRoom: [
            'boneArkRoom',
            'boneArkRoomBackground',
        ],
        catEyeCircletRoom: [
            'catEyeCircletRoom',
            'catEyeCircletRoomBackground',
        ],
        exitToAbandonedMine: [
            'exitToAbandonedMine',
            'exitToAbandonedMineBackground',
        ],
        granfaloonsLair: [
            'granfaloonsLair',
            'granfaloonsLairBackground',
        ],
        hellfireBeastRoom: [
            'hellfireBeastRoom',
            'hellfireBeastRoomBackground',
        ],
        icebrandRoom: [
            'icebrandRoom',
            'icebrandRoomBackground',
        ],
        leftLavaPath: [
            'leftLavaPath',
        ],
        loadingRoomToAbandonedMine: [
            'loadingRoomToAbandonedMine',
        ],
        mormegilRoom: [
            'mormegilRoom',
            'mormegilRoomBackground',
        ],
        pitchBlackSpikeMaze: [
            'pitchBlackSpikeMaze',
            'pitchBlackSpikeMazeBackground',
        ],
        rightLavaPath: [
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
        saveRoomA: [
            'saveRoomA',
        ],
        saveRoomB: [
            'saveRoomB',
        ],
        smallGremlinRoom: [
            'smallGremlinRoom',
            'smallGremlinRoomBackground',
        ],
        spikeBreakerRoom: [
            'spikeBreakerRoom',
            'spikeBreakerRoomBackground',
        ],
        triggerTeleporterToAbandonedMine: [],
        walkArmorRoom: [
            'walkArmorRoom',
            'walkArmorRoomBackground',
        ],
    },
    forbiddenLibrary: {
        dhuronAndFleaArmorRoom: [
            'dhuronAndFleaArmorRoom',
        ],
        dhuronAndFleaManRoom: [
            'dhuronAndFleaManRoom',
        ],
        exitToOuterWall: [
            'exitToOuterWall',
        ],
        faerieCardRoom: [
            'faerieCardRoom',
        ],
        fleaManRoom: [
            'fleaManRoom',
        ],
        footOfStaircase: [
            'footOfStaircase',
        ],
        holyRodRoom: [
            'holyRodRoom',
        ],
        lesserDemonArea: [
            'lesserDemonArea',
        ],
        loadingRoomToOuterWall: [
            'loadingRoomToOuterWall',
        ],
        outsideShop: [
            'outsideShop',
        ],
        saveRoomA: [
            'saveRoomA',
        ],
        secretBookcaseRoom: [
            'secretBookcaseRoom',
        ],
        shop: [
            'shop',
        ],
        spellbookArea: [
            'spellbookArea',
        ],
        threeLayerRoom: [
            'threeLayerRoom',
        ],
        triggerTeleporterToOuterWall: [],
    },
    longLibrary: {
        dhuronAndFleaArmorRoom: [
            'dhuronAndFleaArmorRoom',
        ],
        dhuronAndFleaManRoom: [
            'dhuronAndFleaManRoom',
        ],
        exitToOuterWall: [
            'exitToOuterWall',
        ],
        faerieCardRoom: [
            'faerieCardRoom',
        ],
        fleaManRoom: [
            'fleaManRoom',
        ],
        footOfStaircase: [
            'footOfStaircase',
        ],
        holyRodRoom: [
            'holyRodRoom',
        ],
        lesserDemonArea: [
            'lesserDemonArea',
        ],
        loadingRoomToOuterWall: [
            'loadingRoomToOuterWall',
        ],
        outsideShop: [
            'outsideShop',
        ],
        saveRoomA: [
            'saveRoomA',
        ],
        secretBookcaseRoom: [
            'secretBookcaseRoom',
        ],
        shop: [
            'shop',
        ],
        spellbookArea: [
            'spellbookArea',
        ],
        threeLayerRoom: [
            'threeLayerRoom',
        ],
        triggerTeleporterToOuterWall: [],
    },
    marbleGallery: {
        alucartRoom: [
            'alucartRoom',
        ],
        beneathDropoff: [
            'beneathDropoff',
            'beneathDropoffBackground',
        ],
        beneathLeftTrapdoor: [
            'beneathLeftTrapdoor',
            'beneathLeftTrapdoorBackground',
        ],
        beneathRightTrapdoor: [
            'beneathRightTrapdoor',
            'beneathRightTrapdoorBackground',
        ],
        blueDoorRoom: [
            'blueDoorRoom',
            'blueDoorRoomBackground',
        ],
        clockRoom: [
            'clockRoom',
            'clockRoomBackground',
        ],
        dropoff: [
            'dropoff',
            'dropoffBackground',
        ],
        elevatorRoom: [
            'elevatorRoom',
        ],
        emptyRoom: [
            'emptyRoom',
            'emptyRoomBackground',
        ],
        entrance: [
            'entrance',
            'entranceBackground',
        ],
        gravityBootsRoom: [
            'gravityBootsRoom',
        ],
        leftOfClockRoom: [
            'leftOfClockRoom',
            'leftOfClockRoomBackground',
        ],
        loadingRoomToAlchemyLaboratory: [
            'loadingRoomToAlchemyLaboratory',
        ],
        loadingRoomToCastleEntrance: [
            'loadingRoomToCastleEntrance',
        ],
        loadingRoomToOlroxsQuarters: [
            'loadingRoomToOlroxsQuarters',
        ],
        loadingRoomToOuterWall: [
            'loadingRoomToOuterWall',
        ],
        loadingRoomToUndergroundCaverns: [
            'loadingRoomToUndergroundCaverns',
        ],
        longHallway: [
            'longHallway',
        ],
        ouijaTableStairway: [
            'ouijaTableStairway',
            'ouijaTableStairwayBackground',
        ],
        pathwayAfterLeftStatue: [
            'pathwayAfterLeftStatue',
        ],
        pathwayAfterRightStatue: [
            'pathwayAfterRightStatue',
        ],
        powerUpRoom: [
            'powerUpRoom',
        ],
        rightOfClockRoom: [
            'rightOfClockRoom',
            'rightOfClockRoomBackground',
        ],
        sShapedHallways: [
            'sShapedHallways',
            'sShapedHallwaysBackground',
        ],
        saveRoomA: [
            'saveRoomA',
        ],
        saveRoomB: [
            'saveRoomB',
        ],
        slingerStaircase: [
            'slingerStaircase',
            'slingerStaircaseBackground',
        ],
        spiritOrbRoom: [
            'spiritOrbRoom',
            'spiritOrbRoomBackground',
        ],
        stainedGlassCorner: [
            'stainedGlassCorner',
            'stainedGlassCornerBackground',
        ],
        stairwellToUndergroundCaverns: [
            'stairwellToUndergroundCaverns',
            'stairwellToUndergroundCavernsBackground',
        ],
        stopwatchRoom: [
            'stopwatchRoom',
            'stopwatchRoomBackground',
        ],
        tallStainedGlassWindows: [
            'tallStainedGlassWindows',
            'tallStainedGlassWindowsBackground',
        ],
        threePaths: [
            'threePaths',
            'threePathsBackground',
        ],
        triggerTeleporterToAlchemyLaboratory: [],
        triggerTeleporterToCastleCenter: [],
        triggerTeleporterToCastleEntrance: [],
        triggerTeleporterToOlroxsQuarters: [],
        triggerTeleporterToOuterWall: [],
        triggerTeleporterToUndergroundCaverns: [],
    },
    necromancyLaboratory: {
        batCardRoom: [
            'batCardRoom',
        ],
        bloodyZombieHallway: [
            'bloodyZombieHallway',
        ],
        blueDoorHallway: [
            'blueDoorHallway',
        ],
        boxPuzzleRoom: [
            'boxPuzzleRoom',
        ],
        cannonRoom: [
            'cannonRoom',
        ],
        clothCapeRoom: [
            'clothCapeRoom',
        ],
        corridorToElevator: [
            'corridorToElevator',
        ],
        elevatorShaft: [
            'elevatorShaft',
        ],
        emptyZigZagRoom: [
            'emptyZigZagRoom',
        ],
        entryway: [
            'entryway',
        ],
        exitToMarbleGallery: [
            'exitToMarbleGallery',
        ],
        exitToRoyalChapel: [
            'exitToRoyalChapel',
        ],
        glassVats: [
            'glassVats',
        ],
        heartMaxUpRoom: [
            'heartMaxUpRoom',
        ],
        loadingRoomToCastleEntrance: [
            'loadingRoomToCastleEntrance',
        ],
        loadingRoomToMarbleGallery: [
            'loadingRoomToMarbleGallery',
        ],
        loadingRoomToRoyalChapel: [
            'loadingRoomToRoyalChapel',
        ],
        redSkeletonLiftRoom: [
            'redSkeletonLiftRoom',
        ],
        saveRoomA: [
            'saveRoomA',
        ],
        saveRoomB: [
            'saveRoomB',
        ],
        saveRoomC: [
            'saveRoomC',
        ],
        secretLifeMaxUpRoom: [
            'secretLifeMaxUpRoom',
        ],
        shortZigZagRoom: [
            'shortZigZagRoom',
        ],
        skillOfWolfRoom: [
            'skillOfWolfRoom',
        ],
        slograAndGaibonRoom: [
            'slograAndGaibonRoom',
        ],
        sunglassesRoom: [
            'sunglassesRoom',
        ],
        tallSpittleboneRoom: [
            'tallSpittleboneRoom',
        ],
        tallZigZagRoom: [
            'tallZigZagRoom',
        ],
        tetrominoRoom: [
            'tetrominoRoom',
        ],
        triggerTeleporterToCastleEntrance: [],
        triggerTeleporterToMarbleGallery: [],
        triggerTeleporterToRoyalChapel: [],
    },
    olroxsQuarters: {
        bottomOfStairwell: [
            'bottomOfStairwell',
            'bottomOfStairwellBackground',
        ],
        catwalkCrypt: [
            'catwalkCrypt',
            'catwalkCryptBackground',
        ],
        echoOfBatRoom: [
            'echoOfBatRoom',
            'echoOfBatRoomBackground',
        ],
        emptyCells: [
            'emptyCells',
            'emptyCellsBackground',
        ],
        emptyRoom: [
            'emptyRoom',
            'emptyRoomBackground',
        ],
        garnetRoom: [
            'garnetRoom',
            'garnetRoomBackground',
        ],
        grandStaircase: [
            'grandStaircase',
            'grandStaircaseBackground',
        ],
        hammerAndBladeRoom: [
            'hammerAndBladeRoom',
            'hammerAndBladeRoomBackground',
        ],
        loadingRoomToColosseum: [
            'loadingRoomToColosseum',
        ],
        loadingRoomToMarbleGallery: [
            'loadingRoomToMarbleGallery',
        ],
        loadingRoomToRoyalChapel: [
            'loadingRoomToRoyalChapel',
        ],
        loadingRoomToWarpRooms: [
            'loadingRoomToWarpRooms',
        ],
        narrowHallwayToOlrox: [
            'narrowHallwayToOlrox',
        ],
        olroxsRoom: [
            'olroxsRoom',
        ],
        openCourtyard: [
            'openCourtyard',
        ],
        prison: [
            'prison',
            'prisonBackground',
        ],
        saveRoomA: [
            'saveRoomA',
        ],
        secretOnyxRoom: [
            'secretOnyxRoom',
            'secretOnyxRoomBackground',
        ],
        skelerangRoom: [
            'skelerangRoom',
            'skelerangRoomBackground',
        ],
        swordCardRoom: [
            'swordCardRoom',
        ],
        tallShaft: [
            'tallShaft',
            'tallShaftBackground',
        ],
        triggerTeleporterToColosseum: [],
        triggerTeleporterToMarbleGallery: [],
        triggerTeleporterToRoyalChapel: [],
        triggerTeleporterToWarpRooms: [],
    },
    outerWall: {
        blueAxeKnightRoom: [
            'blueAxeKnightRoom',
        ],
        doppelgangerRoom: [
            'doppelgangerRoom',
        ],
        elevatorShaftRoom: [
            'elevatorShaftRoom',
        ],
        exitToClockTower: [
            'exitToClockTower',
        ],
        exitToMarbleGallery: [
            'exitToMarbleGallery',
        ],
        garlicRoom: [
            'garlicRoom',
        ],
        garnetVaseRoom: [
            'garnetVaseRoom',
        ],
        gladiusRoom: [
            'gladiusRoom',
        ],
        jewelKnucklesRoom: [
            'jewelKnucklesRoom',
        ],
        loadingRoomToClockTower: [
            'loadingRoomToClockTower',
        ],
        loadingRoomToLongLibrary: [
            'loadingRoomToLongLibrary',
        ],
        loadingRoomToMarbleGallery: [
            'loadingRoomToMarbleGallery',
        ],
        loadingRoomToWarpRooms: [
            'loadingRoomToWarpRooms',
        ],
        lowerMedusaRoom: [
            'lowerMedusaRoom',
        ],
        saveRoomA: [
            'saveRoomA',
        ],
        saveRoomB: [
            'saveRoomB',
        ],
        secretPlatformRoom: [
            'secretPlatformRoom',
        ],
        telescopeRoom: [
            'telescopeRoom',
        ],
        topOfOuterWall: [
            'topOfOuterWall',
        ],
        triggerTeleporterToClockTower: [],
        triggerTeleporterToLongLibrary: [],
        triggerTeleporterToMarbleGallery: [],
        triggerTeleporterToWarpRooms: [],
    },
    prologue: {
        lowerAttic: [
            'lowerAttic',
        ],
        throneRoomArea: [
            'throneRoomArea',
            'throneRoomAreaBackground',
        ],
        'unknownRoomId02': [
            'unknownRoomId02',
        ],
        upperAttic: [
            'upperAttic',
        ],
    },
    reverseCastleCenter: {
        centerCube: [
            'centerCube',
        ],
        elevatorShaft: [
            'elevatorShaft',
        ],
        'triggerTeleporterToBO6': [],
        triggerTeleporterToMarbleGallery: [],
        'unknownRoomId02': [
            'unknownRoomId02',
        ],
    },
    reverseCaverns: {
        bandannaRoom: [
            'bandannaRoom',
        ],
        claymoreStairwell: [
            'claymoreStairwell',
            'claymoreStairwellBackground',
        ],
        crystalBend: [
            'crystalBend',
            'crystalBendBackground',
        ],
        crystalCloakRoom: [
            'crystalCloakRoom',
            'crystalCloakRoomBackground',
        ],
        dKBridge: [
            'dKBridge',
            'dKBridgeBackground',
        ],
        dKButton: [
            'dKButton',
            'dKButtonBackground',
        ],
        exitToAbandonedMine: [
            'exitToAbandonedMine',
            'exitToAbandonedMineBackground',
        ],
        exitToCastleEntrance: [
            'exitToCastleEntrance',
            'exitToCastleEntranceBackground',
        ],
        falseSaveRoom: [
            'falseSaveRoom',
        ],
        hiddenCrystalEntrance: [
            'hiddenCrystalEntrance',
            'hiddenCrystalEntranceBackground',
        ],
        holySymbolRoom: [
            'holySymbolRoom',
            'holySymbolRoomBackground',
        ],
        iceFloeRoom: [
            'iceFloeRoom',
            'iceFloeRoomBackground',
        ],
        leftFerrymanRoute: [
            'leftFerrymanRoute',
            'leftFerrymanRouteBackground',
        ],
        loadingRoomToAbandonedMine: [
            'loadingRoomToAbandonedMine',
        ],
        loadingRoomToCastleEntrance: [
            'loadingRoomToCastleEntrance',
        ],
        loadingRoomToMarbleGallery: [
            'loadingRoomToMarbleGallery',
        ],
        longDrop: [
            'longDrop',
        ],
        mealTicketsAndMoonstoneRoom: [
            'mealTicketsAndMoonstoneRoom',
            'mealTicketsAndMoonstoneRoomBackground',
        ],
        mermanStatueRoom: [
            'mermanStatueRoom',
            'mermanStatueRoomBackground',
        ],
        pentagramRoom: [
            'pentagramRoom',
            'pentagramRoomBackground',
        ],
        plaqueRoomWithBreakableWall: [
            'plaqueRoomWithBreakableWall',
        ],
        plaqueRoomWithLifeMaxUp: [
            'plaqueRoomWithLifeMaxUp',
        ],
        rightFerrymanRoute: [
            'rightFerrymanRoute',
            'rightFerrymanRouteBackground',
        ],
        risingWaterRoom: [
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
        saveRoomA: [
            'saveRoomA',
        ],
        saveRoomB: [
            'saveRoomB',
        ],
        saveRoomC: [
            'saveRoomC',
        ],
        scyllaRoom: [
            'scyllaRoom',
            'scyllaRoomBackground',
        ],
        scyllaWyrmRoom: [
            'scyllaWyrmRoom',
            'scyllaWyrmRoomBackground',
        ],
        smallStairwell: [
            'smallStairwell',
            'smallStairwellBackground',
        ],
        tallStairwell: [
            'tallStairwell',
        ],
        triggerTeleporterToAbandonedMine: [],
        triggerTeleporterToBossSuccubus: [],
        triggerTeleporterToCastleEntrance: [],
        triggerTeleporterToMarbleGallery: [],
        waterfall: [
            'waterfall',
            'waterfallBackground',
        ],
    },
    reverseClockTower: {
        belfry: [
            'belfry',
        ],
        exitToCourtyard: [
            'exitToCourtyard',
        ],
        fireOfBatRoom: [
            'fireOfBatRoom',
            'fireOfBatRoomBackground',
        ],
        healingMailRoom: [
            'healingMailRoom',
            'healingMailRoomBackground',
        ],
        hiddenArmory: [
            'hiddenArmory',
        ],
        karasumansRoom: [
            'karasumansRoom',
            'karasumansRoomBackground',
        ],
        leftGearRoom: [
            'leftGearRoom',
        ],
        loadingRoomToCastleKeep: [
            'loadingRoomToCastleKeep',
        ],
        loadingRoomToOuterWall: [
            'loadingRoomToOuterWall',
        ],
        openCourtyard: [
            'openCourtyard',
        ],
        pathToKarasuman: [
            'pathToKarasuman',
        ],
        pendulumRoom: [
            'pendulumRoom',
        ],
        rightGearRoom: [
            'rightGearRoom',
        ],
        spire: [
            'spire',
        ],
        stairwellToOuterWall: [
            'stairwellToOuterWall',
        ],
        triggerTeleporterToCastleKeep: [],
        triggerTeleporterToOuterWall: [],
    },
    reverseColosseum: {
        arena: [
            'arena',
        ],
        bladeMasterRoom: [
            'bladeMasterRoom',
        ],
        bloodCloakRoom: [
            'bloodCloakRoom',
        ],
        bottomOfElevatorShaft: [
            'bottomOfElevatorShaft',
        ],
        fountainRoom: [
            'fountainRoom',
            'fountainRoomBackground',
        ],
        holySwordRoom: [
            'holySwordRoom',
        ],
        leftSideArmory: [
            'leftSideArmory',
        ],
        loadingRoomToOlroxsQuarters: [
            'loadingRoomToOlroxsQuarters',
        ],
        loadingRoomToRoyalChapel: [
            'loadingRoomToRoyalChapel',
        ],
        passagewayBetweenArenaAndRoyalChapel: [
            'passagewayBetweenArenaAndRoyalChapel',
        ],
        rightSideArmory: [
            'rightSideArmory',
        ],
        saveRoomA: [
            'saveRoomA',
        ],
        saveRoomB: [
            'saveRoomB',
        ],
        spiralStaircases: [
            'spiralStaircases',
        ],
        topOfElevatorShaft: [
            'topOfElevatorShaft',
        ],
        topOfLeftSpiralStaircase: [
            'topOfLeftSpiralStaircase',
        ],
        topOfRightSpiralStaircase: [
            'topOfRightSpiralStaircase',
        ],
        triggerTeleporterToOlroxsQuarters: [],
        triggerTeleporterToRoyalChapel: [],
        valhallaKnightRoom: [
            'valhallaKnightRoom',
        ],
    },
    reverseEntrance: {
        afterDrawbridge: [
            'afterDrawbridge',
        ],
        atticEntrance: [
            'atticEntrance',
            'atticEntranceBackground',
        ],
        atticHallway: [
            'atticHallway',
            'atticHallwayBackground',
        ],
        atticStaircase: [
            'atticStaircase',
            'atticStaircaseBackground',
        ],
        cubeOfZoeRoom: [
            'cubeOfZoeRoom',
            'cubeOfZoeRoomBackground',
        ],
        dropUnderPortcullis: [
            'dropUnderPortcullis',
            'dropUnderPortcullisBackground',
        ],
        forestCutscene: [
            'forestCutscene',
        ],
        gargoyleRoom: [
            'gargoyleRoom',
        ],
        heartMaxUpRoom: [
            'heartMaxUpRoom',
            'heartMaxUpRoomBackground',
        ],
        holyMailRoom: [
            'holyMailRoom',
            'holyMailRoomBackground',
        ],
        jewelSwordRoom: [
            'jewelSwordRoom',
            'jewelSwordRoomBackground',
        ],
        lifeMaxUpRoom: [
            'lifeMaxUpRoom',
            'lifeMaxUpRoomBackground',
        ],
        loadingRoomToAlchemyLaboratory: [
            'loadingRoomToAlchemyLaboratory',
        ],
        loadingRoomToMarbleGallery: [
            'loadingRoomToMarbleGallery',
        ],
        loadingRoomToUndergroundCaverns: [
            'loadingRoomToUndergroundCaverns',
        ],
        loadingRoomToWarpRooms: [
            'loadingRoomToWarpRooms',
        ],
        meetingRoomWithDeath: [
            'meetingRoomWithDeath',
        ],
        mermanRoom: [
            'mermanRoom',
            'mermanRoomBackground',
        ],
        saveRoomA: [
            'saveRoomA',
        ],
        saveRoomB: [
            'saveRoomB',
        ],
        saveRoomC: [
            'saveRoomC',
        ],
        shortcutToUndergroundCaverns: [
            'shortcutToUndergroundCaverns',
            'shortcutToUndergroundCavernsBackground',
        ],
        shortcutToWarpRooms: [
            'shortcutToWarpRooms',
            'shortcutToWarpRoomsBackground',
        ],
        stairwellAfterDeath: [
            'stairwellAfterDeath',
            'stairwellAfterDeathBackground',
        ],
        triggerTeleporterToAlchemyLaboratory: [],
        triggerTeleporterToMarbleGallery: [],
        triggerTeleporterToUndergroundCaverns: [],
        triggerTeleporterToWarpRooms: [],
        'unknownRoom19': [
            'unknownRoom19',
        ],
        'unknownRoom20': [
            'unknownRoom20',
        ],
        wargHallway: [
            'wargHallway',
        ],
        zombieHallway: [
            'zombieHallway',
        ],
    },
    reverseKeep: {
        bend: [
            'bend',
        ],
        dualPlatforms: [
            'dualPlatforms',
        ],
        falchionRoom: [
            'falchionRoom',
        ],
        ghostCardRoom: [
            'ghostCardRoom',
        ],
        keepArea: [
            'keepArea',
        ],
        lionTorchPlatform: [
            'lionTorchPlatform',
        ],
        loadingRoomToClockTower: [
            'loadingRoomToClockTower',
        ],
        loadingRoomToRoyalChapel: [
            'loadingRoomToRoyalChapel',
        ],
        loadingRoomToWarpRooms: [
            'loadingRoomToWarpRooms',
        ],
        lowerAttic: [
            'lowerAttic',
        ],
        saveRoomA: [
            'saveRoomA',
        ],
        triggerTeleporterToClockTower: [],
        triggerTeleporterToRoyalChapel: [],
        triggerTeleporterToWarpRooms: [],
        tyrfingRoom: [
            'tyrfingRoom',
        ],
        upperAttic: [
            'upperAttic',
        ],
    },
    reverseOuterWall: {
        blueAxeKnightRoom: [
            'blueAxeKnightRoom',
        ],
        doppelgangerRoom: [
            'doppelgangerRoom',
        ],
        elevatorShaftRoom: [
            'elevatorShaftRoom',
        ],
        exitToClockTower: [
            'exitToClockTower',
        ],
        exitToMarbleGallery: [
            'exitToMarbleGallery',
        ],
        garlicRoom: [
            'garlicRoom',
        ],
        garnetVaseRoom: [
            'garnetVaseRoom',
        ],
        gladiusRoom: [
            'gladiusRoom',
        ],
        jewelKnucklesRoom: [
            'jewelKnucklesRoom',
        ],
        loadingRoomToClockTower: [
            'loadingRoomToClockTower',
        ],
        loadingRoomToLongLibrary: [
            'loadingRoomToLongLibrary',
        ],
        loadingRoomToMarbleGallery: [
            'loadingRoomToMarbleGallery',
        ],
        loadingRoomToWarpRooms: [
            'loadingRoomToWarpRooms',
        ],
        lowerMedusaRoom: [
            'lowerMedusaRoom',
        ],
        saveRoomA: [
            'saveRoomA',
        ],
        saveRoomB: [
            'saveRoomB',
        ],
        secretPlatformRoom: [
            'secretPlatformRoom',
        ],
        telescopeRoom: [
            'telescopeRoom',
        ],
        topOfOuterWall: [
            'topOfOuterWall',
        ],
        triggerTeleporterToClockTower: [],
        triggerTeleporterToLongLibrary: [],
        triggerTeleporterToMarbleGallery: [],
        triggerTeleporterToWarpRooms: [],
    },
    reverseWarpRooms: {
        loadingRoomToAbandonedMine: [
            'loadingRoomToAbandonedMine',
        ],
        loadingRoomToCastleEntrance: [
            'loadingRoomToCastleEntrance',
        ],
        loadingRoomToCastleKeep: [
            'loadingRoomToCastleKeep',
        ],
        loadingRoomToOlroxsQuarters: [
            'loadingRoomToOlroxsQuarters',
        ],
        loadingRoomToOuterWall: [
            'loadingRoomToOuterWall',
        ],
        triggerTeleporterToAbandonedMine: [],
        triggerTeleporterToCastleEntrance: [],
        triggerTeleporterToCastleKeep: [],
        triggerTeleporterToOlroxsQuarters: [],
        triggerTeleporterToOuterWall: [],
        warpRoomToAbandonedMine: [
            'warpRoomToAbandonedMine',
        ],
        warpRoomToCastleEntrance: [
            'warpRoomToCastleEntrance',
        ],
        warpRoomToCastleKeep: [
            'warpRoomToCastleKeep',
        ],
        warpRoomToOlroxsQuarters: [
            'warpRoomToOlroxsQuarters',
        ],
        warpRoomToOuterWall: [
            'warpRoomToOuterWall',
        ],
    },
    royalChapel: {
        chapelStaircase: [
            'chapelStaircase',
        ],
        confessionalBooth: [
            'confessionalBooth',
            'confessionalBoothBackground',
        ],
        emptyRoom: [
            'emptyRoom',
            'emptyRoomBackground',
        ],
        gogglesRoom: [
            'gogglesRoom',
            'gogglesRoomBackground',
        ],
        hippogryphRoom: [
            'hippogryphRoom',
            'hippogryphRoomBackground',
        ],
        leftTower: [
            'leftTower',
        ],
        loadingRoomToAlchemyLaboratory: [
            'loadingRoomToAlchemyLaboratory',
        ],
        loadingRoomToCastleKeep: [
            'loadingRoomToCastleKeep',
        ],
        loadingRoomToColosseum: [
            'loadingRoomToColosseum',
        ],
        loadingRoomToOlroxsQuarters: [
            'loadingRoomToOlroxsQuarters',
        ],
        middleTower: [
            'middleTower',
        ],
        nave: [
            'nave',
        ],
        pushingStatueShortcut: [
            'pushingStatueShortcut',
            'pushingStatueShortcutBackground',
        ],
        rightTower: [
            'rightTower',
        ],
        saveRoomA: [
            'saveRoomA',
        ],
        saveRoomB: [
            'saveRoomB',
        ],
        silverRingRoom: [
            'silverRingRoom',
            'silverRingRoomBackground',
        ],
        spikeHallway: [
            'spikeHallway',
            'spikeHallwayBackground',
        ],
        statueLedge: [
            'statueLedge',
            'statueLedgeBackground',
        ],
        triggerTeleporterToAlchemyLaboratory: [],
        triggerTeleporterToCastleKeep: [],
        triggerTeleporterToColosseum: [],
        triggerTeleporterToOlroxsQuarters: [],
        walkwayBetweenTowers: [
            'walkwayBetweenTowers',
            'walkwayBetweenTowersBackground',
        ],
        walkwayLeftOfHippogryph: [
            'walkwayLeftOfHippogryph',
            'walkwayLeftOfHippogryphBackground',
        ],
        walkwayRightOfHippogryph: [
            'walkwayRightOfHippogryph',
            'walkwayRightOfHippogryphBackground',
        ],
    },
    undergroundCaverns: {
        bandannaRoom: [
            'bandannaRoom',
        ],
        claymoreStairwell: [
            'claymoreStairwell',
            'claymoreStairwellBackground',
        ],
        crystalBend: [
            'crystalBend',
            'crystalBendBackground',
        ],
        crystalCloakRoom: [
            'crystalCloakRoom',
            'crystalCloakRoomBackground',
        ],
        dKBridge: [
            'dKBridge',
            'dKBridgeBackground',
        ],
        dKButton: [
            'dKButton',
            'dKButtonBackground',
        ],
        exitToAbandonedMine: [
            'exitToAbandonedMine',
            'exitToAbandonedMineBackground',
        ],
        exitToCastleEntrance: [
            'exitToCastleEntrance',
            'exitToCastleEntranceBackground',
        ],
        falseSaveRoom: [
            'falseSaveRoom',
        ],
        hiddenCrystalEntrance: [
            'hiddenCrystalEntrance',
            'hiddenCrystalEntranceBackground',
        ],
        holySymbolRoom: [
            'holySymbolRoom',
            'holySymbolRoomBackground',
        ],
        iceFloeRoom: [
            'iceFloeRoom',
            'iceFloeRoomBackground',
        ],
        leftFerrymanRoute: [
            'leftFerrymanRoute',
            'leftFerrymanRouteBackground',
        ],
        loadingRoomToAbandonedMine: [
            'loadingRoomToAbandonedMine',
        ],
        loadingRoomToCastleEntrance: [
            'loadingRoomToCastleEntrance',
        ],
        loadingRoomToMarbleGallery: [
            'loadingRoomToMarbleGallery',
        ],
        longDrop: [
            'longDrop',
        ],
        mealTicketsAndMoonstoneRoom: [
            'mealTicketsAndMoonstoneRoom',
            'mealTicketsAndMoonstoneRoomBackground',
        ],
        mermanStatueRoom: [
            'mermanStatueRoom',
            'mermanStatueRoomBackground',
        ],
        pentagramRoom: [
            'pentagramRoom',
            'pentagramRoomBackground',
        ],
        plaqueRoomWithBreakableWall: [
            'plaqueRoomWithBreakableWall',
        ],
        plaqueRoomWithLifeMaxUp: [
            'plaqueRoomWithLifeMaxUp',
        ],
        rightFerrymanRoute: [
            'rightFerrymanRoute',
            'rightFerrymanRouteBackground',
        ],
        risingWaterRoom: [
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
        saveRoomA: [
            'saveRoomA',
        ],
        saveRoomB: [
            'saveRoomB',
        ],
        saveRoomC: [
            'saveRoomC',
        ],
        scyllaRoom: [
            'scyllaRoom',
            'scyllaRoomBackground',
        ],
        scyllaWyrmRoom: [
            'scyllaWyrmRoom',
            'scyllaWyrmRoomBackground',
        ],
        smallStairwell: [
            'smallStairwell',
            'smallStairwellBackground',
        ],
        tallStairwell: [
            'tallStairwell',
        ],
        triggerTeleporterToAbandonedMine: [],
        triggerTeleporterToBossSuccubus: [],
        triggerTeleporterToCastleEntrance: [],
        triggerTeleporterToMarbleGallery: [],
        waterfall: [
            'waterfall',
            'waterfallBackground',
        ],
    },
    warpRooms: {
        loadingRoomToAbandonedMine: [
            'loadingRoomToAbandonedMine',
        ],
        loadingRoomToCastleEntrance: [
            'loadingRoomToCastleEntrance',
        ],
        loadingRoomToCastleKeep: [
            'loadingRoomToCastleKeep',
        ],
        loadingRoomToOlroxsQuarters: [
            'loadingRoomToOlroxsQuarters',
        ],
        loadingRoomToOuterWall: [
            'loadingRoomToOuterWall',
        ],
        triggerTeleporterToAbandonedMine: [],
        triggerTeleporterToCastleEntrance: [],
        triggerTeleporterToCastleKeep: [],
        triggerTeleporterToOlroxsQuarters: [],
        triggerTeleporterToOuterWall: [],
        warpRoomToAbandonedMine: [
            'warpRoomToAbandonedMine',
        ],
        warpRoomToCastleEntrance: [
            'warpRoomToCastleEntrance',
        ],
        warpRoomToCastleKeep: [
            'warpRoomToCastleKeep',
        ],
        warpRoomToOlroxsQuarters: [
            'warpRoomToOlroxsQuarters',
        ],
        warpRoomToOuterWall: [
            'warpRoomToOuterWall',
        ],
    },
}

const SECRET_MAP_TILE_REVEALS = {
    anteroomStaircase: {
        stageName: 'castleKeep',
        roomName: 'keepArea',
        top: 3,
        left: 5,
    },
    demonSwitch: {
        stageName: 'abandonedMine',
        roomName: 'demonSwitch',
        top: 0,
        left: 0,
    },
    snakeColumn: {
        stageName: 'abandonedMine',
        roomName: 'snakeColumn',
        top: 1,
        left: 0,
    },
    alchemyLaboratoryBreakableFloor: {
        stageName: 'alchemyLaboratory',
        roomName: 'tallZigZagRoom',
        top: 2,
        left: 0,
    },
    alchemyLaboratoryBreakableWall: {
        stageName: 'alchemyLaboratory',
        roomName: 'tallZigZagRoom',
        top: 2,
        left: 0,
    },
    jewelSwordPassage: {
        stageName: 'castleEntrance',
        roomName: 'mermanRoom',
        top: 1,
        left: 0,
    },
    clockTowerSecretWall: {
        stageName: 'clockTower',
        roomName: 'leftGearRoom',
        top: 0,
        left: 0,
    },
    clockTowerBreakableWall: {
        stageName: 'clockTower',
        roomName: 'pendulumRoom',
        top: 1,
        left: 0,
    },
    colosseumBreakableCeiling: {
        stageName: 'colosseum',
        roomName: 'bladeMasterRoom',
        top: 0,
        left: 2,
    },
    colosseumUnknown: {
        stageName: 'colosseum',
        roomName: 'topOfElevatorShaft',
        top: 0,
        left: 0,
    },
    marbleGallerySecretFloor: {
        stageName: 'marbleGallery',
        roomName: 'clockRoom',
        top: 0,
        left: 0,
    },
    olroxsQuartersBreakableCeiling: {
        stageName: 'olroxsQuarters',
        roomName: 'catwalkCrypt',
        top: 0,
        left: 1,
    },
    olroxsQuartersBreakableWall: {
        stageName: 'olroxsQuarters',
        roomName: 'grandStaircase',
        top: 1,
        left: 2,
    },
    undergroundCavernsBreakableFloor: {
        stageName: 'undergroundCaverns',
        roomName: 'hiddenCrystalEntrance',
        top: 1,
        left: 2,
    },
    undergroundCavernsBreakableWall: {
        stageName: 'undergroundCaverns',
        roomName: 'plaqueRoomWithBreakableWall',
        top: 0,
        left: 0,
    },
}

export const STAGES = {
    abandonedMine: 0x03CDF800,
    alchemyLaboratory: 0x049BE800,
    antiChapel: 0x04416000,
    blackMarbleGallery: 0x0453D800,
    bossOlrox: 0x0534C800,
    bossGranfaloon: 0x053F7000,
    bossMinotaurAndWerewolf: 0x05473800,
    bossScylla: 0x05507000,
    bossDoppelganger10: 0x05593000,
    bossHippogryph: 0x05638800,
    bossRichter: 0x056C8800,
    bossCerberus: 0x0596D000,
    bossTrio: 0x05775000,
    bossBeelzebub: 0x05870000,
    bossDeath: 0x058ED800,
    bossMedusa: 0x059E9800,
    bossCreature: 0x05A65000,
    bossDoppelganger40: 0x05AE3800,
    bossShaftAndDracula: 0x05B93800,
    bossSuccubus: 0x04F31000,
    bossAkmodanII: 0x05C24000,
    bossGalamoth: 0x05C9F800,
    castleCenter: 0x03C65000,
    castleEntrance: 0x041A7800,
    castleEntranceRevisited: 0x0491A800,
    castleKeep: 0x04AEF000,
    catacombs: 0x03BB3000,
    cave: 0x0439B800,
    clockTower: 0x04A67000,
    colosseum: 0x03B00000,
    cutsceneMeetingMariaInClockRoom: 0x057F9800,
    deathWingsLair: 0x04680800,
    floatingCatacombs: 0x04307000,
    forbiddenLibrary: 0x044B0000,
    longLibrary: 0x03E5F800,
    marbleGallery: 0x03F8B000,
    necromancyLaboratory: 0x04D81000,
    olroxsQuarters: 0x040FB000,
    outerWall: 0x04047000,
    prologue: 0x0487C800,
    reverseCaverns: 0x047C3800,
    reverseCastleCenter: 0x04B87800,
    reverseClockTower: 0x04E22000,
    reverseColosseum: 0x04C07800,
    reverseEntrance: 0x0471E000,
    reverseKeep: 0x04C84000,
    reverseOuterWall: 0x045EE000,
    reverseWarpRooms: 0x04EBE000,
    royalChapel: 0x03D5A800,
    undergroundCaverns: 0x04257800,
    warpRooms: 0x04D12800,
}

export const UNIQUE_ITEM_DROPS = {
    abandonedMine: {
        offset: 0x0009E4,
        elementCount: 13,
    },
    alchemyLaboratory: {
        offset: 0x0013B0,
        elementCount: 11,
    },
    antiChapel: {
        offset: 0x000D2C,
        elementCount: 18,
    },
    blackMarbleGallery: {
        offset: 0x000F8C,
        elementCount: 12,
    },
    bossScylla: {
        offset: 0x00108C,
        elementCount: 37,
    },
    castleEntrance: {
        offset: 0x001C8C,
        elementCount: 10,
    },
    castleEntranceRevisited: {
        offset: 0x001618,
        elementCount: 10,
    },
    castleKeep: {
        offset: 0x000D10,
        elementCount: 20,
    },
    catacombs: {
        offset: 0x00174C,
        elementCount: 21,
    },
    cave: {
        offset: 0x0007CC,
        elementCount: 8,
    },
    clockTower: {
        offset: 0x00111C,
        elementCount: 12,
    },
    colosseum: {
        offset: 0x000FE8,
        elementCount: 8,
    },
    deathWingsLair: {
        offset: 0x000D40,
        elementCount: 12,
    },
    floatingCatacombs: {
        offset: 0x0013C8,
        elementCount: 18,
    },
    forbiddenLibrary: {
        offset: 0x000BC8,
        elementCount: 9,
    },
    longLibrary: {
        offset: 0x001A90,
        elementCount: 12,
    },
    marbleGallery: {
        offset: 0x001100,
        elementCount: 14,
    },
    necromancyLaboratory: {
        offset: 0x000CC8,
        elementCount: 10,
    },
    olroxsQuarters: {
        offset: 0x000FEC,
        elementCount: 13,
    },
    outerWall: {
        offset: 0x001A2C,
        elementCount: 8,
    },
    reverseCaverns: {
        offset: 0x001620,
        elementCount: 27,
    },
    reverseClockTower: {
        offset: 0x000EC8,
        elementCount: 12,
    },
    reverseColosseum: {
        offset: 0x000A3C,
        elementCount: 8,
    },
    reverseEntrance: {
        offset: 0x000F10,
        elementCount: 10,
    },
    reverseKeep: {
        offset: 0x0007C8,
        elementCount: 25,
    },
    reverseOuterWall: {
        offset: 0x000AE4,
        elementCount: 8,
    },
    royalChapel: {
        offset: 0x000EC0,
        elementCount: 16,
    },
    undergroundCaverns: {
        offset: 0x001928,
        elementCount: 37,
    },
}

const SECONDARY_STAGES = Object.keys(ASSOCIATED_STAGES).concat(Object.keys(BOSS_ROOMS))

export function getChangeDependencies(source) {
    const target = structuredClone(source)
    ORDERED_DEPENDENCY_NAMES
    .filter((dependencyName) => {
        return !(dependencyName in target)
    })
    .forEach((dependencyName) => {
        target[dependencyName] = {}
    })
    // primaryRooms.rightsAndBottoms
    Object.entries(ROOMS)
    .forEach(([stageName, stageInfo]) => {
        Object.entries(stageInfo)
        .forEach(([roomName, layerNames]) => {
            const properties = [
                {
                    targetPropertyName: 'right',
                    sourcePropertyName: 'left',
                    dimensionName: '_columns',
                },
                {
                    targetPropertyName: 'bottom',
                    sourcePropertyName: 'top',
                    dimensionName: '_rows',
                },
            ]
            properties
            .forEach((propertyInfo) => {
                const transformation = [
                    {
                        action: 'get',
                        type: 'property',
                        property: `stages.${stageName}.rooms.${roomName}.${propertyInfo.sourcePropertyName}`,
                    },
                    {
                        action: 'add',
                        type: 'property',
                        property: `stages.${stageName}.rooms.${roomName}.${propertyInfo.dimensionName}`,
                    },
                    {
                        action: 'subtract',
                        type: 'constant',
                        constant: 1,
                    },
                    {
                        action: 'set',
                        type: 'property',
                        property: `stages.${stageName}.rooms.${roomName}.${propertyInfo.targetPropertyName}`,
                    },
                ]
                const transformationName = transformation.at(-1).property
                // console.log(transformationName)
                const dependencyName = (SECONDARY_STAGES.includes(stageName)) ? 'secondaryRooms.rightsAndBottoms' : 'primaryRooms.rightsAndBottoms'
                target[dependencyName][transformationName] = transformation
            })
        })
    })
    // rooms.layerDefinitions
    Object.entries(ROOMS)
    .forEach(([stageName, stageInfo]) => {
        Object.entries(stageInfo)
        .forEach(([roomName, layerNames]) => {
            layerNames
            .forEach((layerName) => {
                const properties = [
                    {
                        targetPropertyName: 'left',
                        sourcePropertyName: 'left',
                    },
                    {
                        targetPropertyName: 'top',
                        sourcePropertyName: 'top',
                    },
                    {
                        targetPropertyName: 'right',
                        sourcePropertyName: 'right',
                    },
                    {
                        targetPropertyName: 'bottom',
                        sourcePropertyName: 'bottom',
                    },
                ]
                properties
                .forEach((propertyInfo) => {
                    const transformation = [
                        {
                            'action': 'get',
                            'type': 'property',
                            'property': `stages.${stageName}.rooms.${roomName}.${propertyInfo.sourcePropertyName}`,
                        },
                        {
                            'action': 'set',
                            'type': 'property',
                            'property': `stages.${stageName}.layers.layerDefinitions.${layerName}.layoutRect.${propertyInfo.targetPropertyName}`,
                        },
                    ]
                    const transformationName = transformation.at(-1).property
                    // console.log(transformationName)
                    target['rooms.layerDefinitions'][transformationName] = transformation
                })
            })
        })
    })
    // secondaryRooms.leftsAndTops
    Object.entries(ASSOCIATED_STAGES)
    .filter(([stageName, stageInfo]) => {
        return stageName in ROOMS && stageInfo.associatedStageName in ROOMS
    })
    .forEach(([stageName, stageInfo]) => {
        Object.entries(ROOMS[stageName])
        .filter(([roomName, layerNames]) => {
            return roomName in ROOMS[stageInfo.associatedStageName]
        })
        .forEach(([roomName, layerNames]) => {
            const properties = [
                {
                    sourcePropertyName: 'left',
                    dimensionName: '_columns',
                },
                {
                    sourcePropertyName: 'top',
                    dimensionName: '_rows',
                },
            ]
            properties
            .forEach((propertyInfo) => {
                const transformation = []
                if (stageInfo.reversed) {
                    transformation.push({
                        action: 'get',
                        type: 'constant',
                        constant: 64,
                    })
                    transformation.push({
                        action: 'subtract',
                        type: 'property',
                        property: `stages.${stageInfo.associatedStageName}.rooms.${roomName}.${propertyInfo.sourcePropertyName}`,
                    })
                    transformation.push({
                        action: 'subtract',
                        type: 'property',
                        property: `stages.${stageInfo.associatedStageName}.rooms.${roomName}.${propertyInfo.dimensionName}`,
                    })
                }
                else {
                    transformation.push({
                        action: 'get',
                        type: 'property',
                        property: `stages.${stageInfo.associatedStageName}.rooms.${roomName}.${propertyInfo.sourcePropertyName}`,
                    })
                }
                transformation.push({
                    action: 'set',
                    type: 'property',
                    property: `stages.${stageName}.rooms.${roomName}.${propertyInfo.sourcePropertyName}`,
                })
                const transformationName = transformation.at(-1).property
                // console.log(transformationName)
                target['secondaryRooms.leftsAndTops'][transformationName] = transformation
            })
        })
    })
    // secretMapTileReveals, bossTeleporters
    const dependencies = [
        {
            dependencyName: 'secretMapTileReveals',
            dependencyInfo: SECRET_MAP_TILE_REVEALS,
        },
        {
            dependencyName: 'bossTeleporters',
            dependencyInfo: BOSS_TELEPORTERS,
        },
    ]
    dependencies
    .forEach((dependency) => {
        Object.entries(dependency.dependencyInfo)
        .forEach(([targetKey, targetInfo]) => {
            const properties = [
                {
                    sourcePropertyName: 'top',
                    sourceValue: targetInfo.top,
                    targetPropertyName: 'roomY',
                },
                {
                    sourcePropertyName: 'left',
                    sourceValue: targetInfo.left,
                    targetPropertyName: 'roomX',
                },
            ]
            properties
            .forEach((propertyInfo) => {
                const transformation = []
                transformation.push({
                    action: 'get',
                    type: 'property',
                    property: `stages.${targetInfo.stageName}.rooms.${targetInfo.roomName}.${propertyInfo.sourcePropertyName}`,
                })
                if (propertyInfo.sourceValue !== 0) {
                    transformation.push({
                        action: 'add',
                        type: 'constant',
                        constant: propertyInfo.sourceValue,
                    })
                }
                transformation.push({
                    action: 'set',
                    type: 'property',
                    property: `${dependency.dependencyName}.${targetKey}.${propertyInfo.targetPropertyName}`,
                })
                // ...
                const transformationName = transformation.at(-1).property
                // console.log(transformationName)
                target[dependency.dependencyName][transformationName] = transformation
            })
        })
    })
    // familiarEvents
    Object.keys(FAMILIAR_OVERLAYS)
    .toSorted()
    .forEach((familiarKey) => {
        Object.entries(FAMILIAR_EVENTS)
        .forEach(([transformationKey, eventInfo]) => {
            const properties = [
                {
                    sourcePropertyName: 'top',
                    targetPropertyName: 'roomY',
                },
                {
                    sourcePropertyName: 'left',
                    targetPropertyName: 'roomX',
                },
            ]
            properties
            .forEach((propertyInfo) => {
                const transformation = []
                transformation.push({
                    action: 'get',
                    type: 'property',
                    property: `stages.${eventInfo.stageName}.rooms.${eventInfo.roomName}.${propertyInfo.sourcePropertyName}`,
                })
                if (eventInfo.inverted && propertyInfo.sourcePropertyName === 'left') {
                    transformation.push({
                        action: 'multiply',
                        type: 'constant',
                        constant: -1,
                    })
                }
                transformation.push({
                    action: 'set',
                    type: 'property',
                    property: `familiarEvents.${familiarKey}.${transformationKey}.${propertyInfo.targetPropertyName}`,
                })
                // ...
                const transformationName = transformation.at(-1).property
                // console.log(transformationName)
                target['familiarEvents'][transformationName] = transformation
            })
        })
    })
    // bossRooms
    Object.entries(BOSS_ROOMS)
    .forEach(([stageName, stageInfo]) => {
        Object.entries(stageInfo)
        .forEach(([roomName, roomInfo]) => {
            const properties = [
                {
                    propertyName: 'top',
                    offsetValue: roomInfo.offsetTop,
                },
                {
                    propertyName: 'left',
                    offsetValue: roomInfo.offsetLeft,
                },
            ]
            properties
            .forEach((propertyInfo) => {
                const transformation = []
                transformation.push({
                    action: 'get',
                    type: 'property',
                    property: `stages.${roomInfo.sourceStageName}.rooms.${roomInfo.sourceRoomName}.${propertyInfo.propertyName}`,
                })
                if (propertyInfo.offsetValue !== 0) {
                    transformation.push({
                        action: 'add',
                        type: 'constant',
                        constant: propertyInfo.offsetValue,
                    })
                }
                transformation.push({
                    action: 'set',
                    type: 'property',
                    property: `stages.${stageName}.rooms.${roomName}.${propertyInfo.propertyName}`,
                })
                const transformationName = transformation.at(-1).property
                // console.log(transformationName)
                target['bossRooms.leftsAndTops'][transformationName] = transformation
            })
        })
    })
    // liveMapRepaints
    LIVE_MAP_REPAINTS
    .forEach((repaintInfo) => {
        const properties = [
            {
                castleName: 'firstCastle',
                address: repaintInfo.addressA,
            },
            {
                castleName: 'reverseCastle',
                address: repaintInfo.addressB,
            },
        ]
        properties
        .forEach((propertyInfo) => {
            const transformation = [
                {
                    'action': 'get',
                    'type': 'property',
                    'property': `stages.undergroundCaverns.rooms.${repaintInfo.roomName}.${repaintInfo.edge}`,
                },
                {
                    'action': 'add',
                    'type': 'constant',
                    'constant': repaintInfo.offset,
                },
                {
                    'action': 'set',
                    'type': 'address',
                    'name': `liveMapRepaints.${propertyInfo.castleName}.${repaintInfo.specialId}.${repaintInfo.edge}`,
                    'address': propertyInfo.address,
                    'element': {
                        'structure': 'value',
                        'type': 'u8',
                    },
                },
            ]
            const transformationName = transformation.at(-1).name
            // console.log(transformationName)
            target['liveMapRepaints'][transformationName] = transformation
        })
    })
    // ...
    const result = {
        authors: [
            'Sestren',
        ],
        description: [
            'Updates secondary values to be consistent with the primary values they are dependent on',
        ],
        changes: [],
    }
    ORDERED_DEPENDENCY_NAMES
    .forEach((dependencyName) => {
        result.changes.push({
            changeType: 'evaluate',
            description: dependencyName,
            evaluate: target[dependencyName],
        })
    })
    return result
}

export function getDefaultChangeDependencies() {
    const source = JSON.parse(fs.readFileSync('./bins/sotn-us/data/change-dependencies-template.json', 'utf8'))
    return getChangeDependencies(source)
}