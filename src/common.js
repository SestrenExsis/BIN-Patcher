
export class Address {
    constructor(addressType, address, offset=0) {
        switch (addressType) {
            case 'DISC':
                this.gameDataAddress = Address.getGamedataAddress(toVal(address)) + toVal(offset)
                break
            default:
                this.gameDataAddress = toVal(address) + toVal(offset)
                break
        }
    }

    clone(offset=0) {
        return new Address('GAMEDATA', this.gameDataAddress, toVal(offset))
    }

    toDiscAddress(offset=0) {
        return Address.getDiscAddress(this.gameDataAddress + toVal(offset))
    }

    toGameDataAddress(offset=0) {
        return this.gameDataAddress + toVal(offset)
    }

    static sectorHeaderSize = 24
    static sectorDataSize = 2048
    static sectorErrorCorrectionDataSize = 280
    static sectorSize = Address.sectorHeaderSize + Address.sectorDataSize + Address.sectorErrorCorrectionDataSize

    static getGamedataAddress(discAddress) {
        const addressValue = toVal(discAddress)
        const sector = Math.floor(addressValue / Address.sectorSize)
        let offset = addressValue % Address.sectorSize
        if (offset < Address.sectorHeaderSize) {
            // The disc address supplied lands in a sector header,
            // so round it up to the first byte in the sector data instead
            offset = Address.sectorHeaderSize
        }
        else if (offset >= (Address.sectorHeaderSize + Address.sectorDataSize)) {
            // The disc address supplied lands in a sector error correction data,
            // so round it down to the last byte in the sector data instead
            offset = Address.sectorHeaderSize + Address.sectorDataSize - 1
        }
        const result = sector * Address.sectorDataSize + (offset - Address.sectorHeaderSize) % Address.sectorDataSize
        return result
    }

    static getDiscAddress(gameDataAddress) {
        const addressValue = toVal(gameDataAddress)
        const sector = Math.floor(addressValue / Address.sectorDataSize)
        const offset = addressValue % Address.sectorDataSize
        const result = sector * Address.sectorSize + Address.sectorHeaderSize + offset
        return result
    }
}

export class GameData {
    constructor(buffer, cursorOffset=0) {
        // TODO(sestren): Consider removing sector headers and error correction and storing gamedata only
        this.buffer = buffer
        this.cursor = new Address('GAMEDATA', toVal(cursorOffset))
        this.prevRead = []
    }

    clone(offset=0) {
        return new GameData(this.buffer, this.cursor.clone(toVal(offset)).gameDataAddress)
    }

    set(offset) {
        this.cursor.gameDataAddress = toVal(offset)
        return this
    }

    seek(offset) {
        this.cursor.gameDataAddress += toVal(offset)
        return this
    }

    read(type, advanceCursor=true) {
        let byteCount = 0
        if (['string', 'shifted-string', 'text-crawl'].includes(type)) {
            // Strings are terminated with a sentinel value and have a 4-byte alignment
            let sentinelValue = (type == 'shifted-string') ? 0xFF : 0x00
            while (true) {
                const byteOffset = this.cursor.toDiscAddress(byteCount)
                const byte = this.buffer.readUInt8(byteOffset)
                byteCount += 1
                if (byte == sentinelValue) {
                    break
                }
            }
            byteCount += 4 - (byteCount % 4)
        } else {
            byteCount = getSizeOfType(type)
        }
        const bytes = Buffer.alloc(byteCount)
        for (let byteIndex = 0; byteIndex < byteCount; byteIndex++) {
            const byteOffset = this.cursor.toDiscAddress(byteIndex)
            const byte = this.buffer.readUInt8(byteOffset)
            bytes.writeUint8(byte, byteIndex)
        }
        this.prevRead = bytes
        let value = 0
        switch (type) {
            case 'int8':
            case 's8':
                value = bytes.readInt8(0)
                break
            case 'uint8':
            case 'u8':
                value = bytes.readUInt8(0)
                break
            case 'int16':
            case 's16':
                value = bytes.readInt16LE(0)
                break
            case 'item-drop-id':
            case 'uint16':
            case 'u16':
            case 'rgba32':
                value = bytes.readUInt16LE(0)
                break
            case 'int32':
            case 's32':
                value = bytes.readInt32LE(0)
                break
            case 'uint32':
            case 'u32':
            case 'layout-rect':
            case 'zone-offset':
                value = bytes.readUInt32LE(0)
                break
            case 'string':
                value = decodeString(bytes)
                break
            case 'shifted-string':
                value = decodeShiftedString(bytes)
                break
            case 'text-crawl':
                value = decodeTextCrawl(bytes)
                break
        }
        let result = value
        switch (type) {
            case 'item-drop-id':
                result = 'unknownId' + value
                Object.entries(valueAliases.itemDropIds)
                .filter(([itemDropName, itemDropId]) => {
                    return value == itemDropId
                })
                .forEach(([itemDropName, itemDropId]) => {
                    result = itemDropName
                })
                break
            case 'rgba32':
                const red = value % 32
                value = Math.floor(value / 32)
                const green = value % 32
                value = Math.floor(value / 32)
                const blue = value % 32
                value = Math.floor(value / 32)
                const alpha = value % 32
                const rr = (8 * red).toString(16).padStart(2, '0')
                const gg = (8 * green).toString(16).padStart(2, '0')
                const bb = (8 * blue).toString(16).padStart(2, '0')
                const aa = (alpha > 0) ? 'ff' : '7f'
                result = '#' + rr + gg + bb + aa
                break
            case 'layout-rect':
                result = {
                    left: 0x3F & (value >> 0),
                    top: 0x3F & (value >> 6),
                    right: 0x3F & (value >> 12),
                    bottom: 0x3F & (value >> 18),
                    flags: 0xFF & (value >> 24),
                }
                break
            case 'zone-offset':
                if (value == 0x00000000) {
                    result = 'NULL'
                }
                else {
                    result = toHex(value - 0x80180000, 6)
                }
                break
        }
        if (advanceCursor) {
            this.seek(byteCount)
        }
        return result
    }

}

export function getSizeOfType(type) {
    let byteCount = 0
    switch (type) {
        case 'int8':
        case 'uint8':
        case 's8':
        case 'u8':
            byteCount = 1
            break
        case 'item-drop-id':
        case 'int16':
        case 'uint16':
        case 's16':
        case 'u16':
        case 'rgba32':
            byteCount = 2
            break
        case 'int32':
        case 'uint32':
        case 's32':
        case 'u32':
        case 'layout-rect':
        case 'zone-offset':
            byteCount = 4
            break
    }
    const result = byteCount
    return result
}

export function decodeString(bytes) {
    let prefixByte = 0x00
    let string = ''
    bytes.forEach((byte) => {
        let char = ''
        if (prefixByte == 0x81) {
            switch (byte) {
                case 0x44: char = '.'; break
                case 0x48: char = '?'; break
                case 0x66: char = "'"; break
                case 0x68: char = '"'; break
                default:   char = '*'; break
            }
            prefixByte = 0x00
        }
        else if (prefixByte == 0x82) {
            switch (byte) {
                case 0x4F: char = '0'; break
                case 0x50: char = '1'; break
                case 0x51: char = '2'; break
                case 0x52: char = '3'; break
                case 0x53: char = '4'; break
                case 0x54: char = '5'; break
                case 0x55: char = '6'; break
                case 0x56: char = '7'; break
                case 0x57: char = '8'; break
                case 0x58: char = '9'; break
                default:   char = '*'; break
            }
            prefixByte = 0x00
        }
        else {
            switch (byte) {
                case 0x00:
                case 0x81:
                case 0x82:
                    break
                default:
                    char = String.fromCharCode(byte)
                    if (!'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(char)) {
                        char = '*'
                    }
                    break
            }
            prefixByte = byte
        }
        string += char
    })
    const result = string
    return result
}

export function encodeString(string, buffer, start=0) {
    let cursor = 0
    for (let i = 0; i < string.length; i++) {
        const char = string.charAt(i)
        switch (char) {
            case '.':
            case '?':
            case "'":
            case '"':
                buffer.writeUint8(0x81, start + cursor)
                cursor++
                break
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                buffer.writeUint8(0x82, start + cursor)
                cursor++
                break
        }
        switch (char) {
            case '.': buffer.writeUint8(0x44, start + cursor); cursor++; break
            case '?': buffer.writeUint8(0x48, start + cursor); cursor++; break
            case "'": buffer.writeUint8(0x66, start + cursor); cursor++; break
            case '"': buffer.writeUint8(0x68, start + cursor); cursor++; break
            case '0': buffer.writeUint8(0x4F, start + cursor); cursor++; break
            case '1': buffer.writeUint8(0x50, start + cursor); cursor++; break
            case '2': buffer.writeUint8(0x51, start + cursor); cursor++; break
            case '3': buffer.writeUint8(0x52, start + cursor); cursor++; break
            case '4': buffer.writeUint8(0x53, start + cursor); cursor++; break
            case '5': buffer.writeUint8(0x54, start + cursor); cursor++; break
            case '6': buffer.writeUint8(0x55, start + cursor); cursor++; break
            case '7': buffer.writeUint8(0x56, start + cursor); cursor++; break
            case '8': buffer.writeUint8(0x57, start + cursor); cursor++; break
            case '9': buffer.writeUint8(0x58, start + cursor); cursor++; break
            default:
                if ('abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(char)) {
                    buffer.writeUint8(char.charCodeAt(0), start + cursor)
                    cursor++
                }
                break
        }
    }
    const padding = 4 - (cursor % 4)
    for (let i = 0; i < padding; i++) {
        buffer.writeUint8(0x00, start + cursor)
        cursor++
    }
    const result = cursor
    return result
}

export function decodeShiftedString(bytes) {
    let string = ''
    bytes.forEach((byte) => {
        let char = ''
        switch (byte) {
            case 0xFF:
                break
            default:
                char = String.fromCharCode(byte + 0x20)
                if (!'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789'.includes(char)) {
                    char = '*'
                }
                break
        }
        string += char
    })
    const result = string
    return result
}

export function encodeShiftedString(string, buffer, start=0) {
    let cursor = 0
    for (let i = 0; i < string.length; i++) {
        const char = string.charAt(i)
        switch (char) {
            default:
                if ('abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789'.includes(char)) {
                    buffer.writeUint8(char.charCodeAt(0) - 0x20, start + cursor)
                    cursor++
                }
                break
        }
    }
    buffer.writeUint8(0xFF, start + cursor)
    cursor++
    const padding = 4 - (cursor % 4)
    for (let i = 0; i < padding; i++) {
        buffer.writeUint8(0x00, start + cursor)
        cursor++
    }
    const result = cursor
    return result
}

export function decodeTextCrawl(bytes) {
    const ALIGN = '_'
    const DEFAULT = ' '
    const text = [
        // NOTE(sestren): The first line has a fixed amount of indentation, it seems
        ALIGN.repeat(22),
    ]
    // NOTE(sestren): Indentations are 4 pixels wide, the SPACE character is 8 pixels wide, and all other characters are 12 pixels wide
    let mode = 'TEXT'
    bytes.forEach((byte) => {
        switch (mode) {
            case 'TEXT':
                let char = ''
                switch (byte) {
                    case 0x00:
                        mode = 'END'
                        break
                    case 0x01:
                        mode = 'INDENT'
                        break
                    case 0x02:
                        text.push('')
                        mode = 'INDENT'
                        break
                    default:
                        char = String.fromCharCode(byte)
                        if (!'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789 .,'.includes(char)) {
                            char = DEFAULT
                        }
                        const kerning = (char == ' ') ? 1 : 2
                        text[text.length - 1] += char + ALIGN.repeat(kerning)
                        break
                }
                break
            case 'INDENT':
                text.push(ALIGN.repeat(byte))
                mode = 'TEXT'
                break
            default:
                return
                break
        }
    })
    const result = text
    return result
}

export function encodeTextCrawl(text, buffer, start=0) {
    let cursor = 0
    let lineSpacing = 0
    text.forEach((line, lineIndex) => {
        if (lineSpacing > 0) {
            buffer.writeUint8(lineSpacing, start + cursor)
            cursor++
            lineSpacing = 0
        }
        if (line.length < 1) {
            lineSpacing++
        }
        let indentation = 0
        while (line.charAt(indentation) == '_') {
            indentation++
        }
        if (lineIndex > 0) {
            buffer.writeUint8(indentation, start + cursor)
            cursor++
        }
        for (let i = indentation; i < line.length; i++) {
            const char = line.charAt(i)
            if ('abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789 .,'.includes(char)) {
                // console.log(char, lineIndex)
                buffer.writeUint8(char.charCodeAt(0), start + cursor)
                cursor++
            }
        }
        lineSpacing++
    })
    // Text crawls are NULL-terminated
    buffer.writeUint8(0x00, start + cursor)
    cursor++
    // Add padding
    const padding = 4 - (cursor % 4)
    for (let i = 0; i < padding; i++) {
        buffer.writeUint8(0x00, start + cursor)
        cursor++
    }
    const result = cursor
    return result
}

export const stageNames = {
    abandonedMine: 'Abandoned Mine',
    alchemyLaboratory: 'Alchemy Laboratory',
    antiChapel: 'Anti-Chapel',
    blackMarbleGallery: 'Black Marble Gallery',
    bossAkmodanII: 'Boss - Akmodan II',
    bossBeelzebub: 'Boss - Beelzebub',
    bossCerberus: 'Boss - Cerberus',
    bossCreature: 'Boss - Creature',
    bossDeath: 'Boss - Death',
    bossDoppelganger10: 'Boss - Doppelganger 10',
    bossDoppelganger40: 'Boss - Doppelganger 40',
    bossGalamoth: 'Boss - Galamoth',
    bossGranfaloon: 'Boss - Granfaloon',
    bossHippogryph: 'Boss - Hippogryph',
    bossMedusa: 'Boss - Medusa',
    bossMinotaurAndWerewolf: 'Boss - Minotaur and Werewolf',
    bossOlrox: 'Boss - Olrox',
    bossRichter: 'Boss - Richter',
    bossScylla: 'Boss - Scylla',
    bossShaftAndDracula: 'Boss - Shaft and Dracula',
    bossSuccubus: 'Boss - Succubus',
    bossTrio: 'Boss - Trio',
    castleCenter: 'Castle Center',
    castleEntrance: 'Castle Entrance',
    castleEntranceRevisited: 'Castle Entrance Revisited',
    castleKeep: 'Castle Keep',
    catacombs: 'Catacombs',
    cave: 'Cave',
    clockTower: 'Clock Tower',
    colosseum: 'Colosseum',
    cutsceneMeetingMariaInClockRoom: 'Cutscene - Meeting Maria in Clock Room',
    deathWingsLair: "Death Wing's Lair",
    floatingCatacombs: 'Floating Catacombs',
    forbiddenLibrary: 'Forbidden Library',
    longLibrary: 'Long Library',
    marbleGallery: 'Marble Gallery',
    necromancyLaboratory: 'Necromancy Laboratory',
    olroxsQuarters: "Olrox's Quarters",
    outerWall: 'Outer Wall',
    prologue: 'Prologue',
    reverseCaverns: 'Reverse Caverns',
    reverseCastleCenter: 'Reverse Castle Center',
    reverseClockTower: 'Reverse Clock Tower',
    reverseColosseum: 'Reverse Colosseum',
    reverseEntrance: 'Reverse Entrance',
    reverseKeep: 'Reverse Keep',
    reverseOuterWall: 'Reverse Outer Wall',
    reverseWarpRooms: 'Reverse Warp Rooms',
    royalChapel: 'Royal Chapel',
    undergroundCaverns: 'Underground Caverns',
    warpRooms: 'Warp Rooms',
}

export function toHex(value, padding=8) {
    return '0x' + value.toString(16).padStart(padding, '0')
}

export function toVal(value) {
    if (typeof(value) == 'string') {
        if (value.substring(0, 2) == '0b') {
            return parseInt(value, 2)
        }
        else {
            return parseInt(value, 16)
        }
    }
    else {
        return value
    }
}

export const valueAliases = {
    itemDropIds: {
        itemPineapple: 162,
        itemParfait: 169,
        itemPudding: 170,
        itemHamburger: 173,
        itemOmelette: 177,
        itemLunchB: 180,
        itemCurryRice: 181,
        itemGryosPlate: 182,
        itemSpaghetti: 183,
        itemGrapeJuice: 184,
        itemChineseBun: 193,
        itemDimSumSet: 194,
        item$100: 5,
        item$1000: 9,
        item$2000: 10,
        item$400: 7,
        itemAlucardMail: 312,
        itemAlucardShield: 144,
        itemAlucardSword: 251,
        itemAlucartMail: 386,
        itemAlucartShield: 295,
        itemAlucartSword: 296,
        itemAnkhOfLife: 377,
        itemAntivenom: 272,
        itemApple: 158,
        itemAquamarine: 361,
        itemAttackPotion: 279,
        itemAxeLordArmor: 322,
        itemAxeLordShield: 136,
        itemBadelaire: 253,
        itemBallroomMask: 325,
        itemBanana: 159,
        itemBandanna: 326,
        itemBarleyTea: 185,
        itemBasilard: 146,
        itemBastardSword: 224,
        itemBatPentagram: 202,
        itemBekatowa: 220,
        itemBerylCirclet: 339,
        itemBloodCloak: 351,
        itemBloodstone: 357,
        itemBlueKnuckles: 265,
        itemBoomerang: 209,
        itemBrilliantMail: 317,
        itemBroadsword: 219,
        itemBronzeCuirass: 300,
        itemBuffaloStar: 205,
        itemBwakaKnife: 208,
        itemCatEyeCirclet: 340,
        itemChakram: 261,
        itemCheese: 175,
        itemCheesecake: 166,
        itemCirclet: 334,
        itemClaymore: 226,
        itemClothCape: 346,
        itemClothTunic: 298,
        itemCombatKnife: 148,
        itemCoralCirclet: 341,
        itemCovenantStone: 383,
        itemCrissaegrim: 292,
        itemCrossShuriken: 204,
        itemCrystalCloak: 349,
        itemCutlass: 216,
        itemDamascusSword: 221,
        itemDarkArmor: 313,
        itemDarkBlade: 246,
        itemDarkShield: 138,
        itemDiamond: 366,
        itemDragonHelm: 342,
        itemDynamite: 266,
        itemElixir: 289,
        itemElvenCloak: 348,
        itemEstoc: 223,
        itemFalchion: 218,
        itemFeltHat: 327,
        itemFireBoomerang: 262,
        itemFireMail: 307,
        itemFireShield: 143,
        itemFirebrand: 239,
        itemFistOfTulkas: 248,
        itemFlamberge: 229,
        itemFlameStar: 206,
        itemFrankfurter: 172,
        itemFuryPlate: 319,
        itemGarnet: 364,
        itemGauntlet: 376,
        itemGladius: 214,
        itemGodsGarb: 321,
        itemGoddessShield: 139,
        itemGoggles: 329,
        itemGoldCirclet: 335,
        itemGoldPlate: 304,
        itemGoldRing: 369,
        itemGram: 236,
        itemGrapes: 160,
        itemGreatSword: 255,
        itemGreenTea: 186,
        itemGurthang: 249,
        itemHamAndEggs: 176,
        itemHammer: 275,
        itemHealingMail: 314,
        itemHeartBroach: 374,
        itemHeartMaxUp: 12,
        itemHeartRefresh: 270,
        itemHeavenSword: 247,
        itemHeraldShield: 137,
        itemHideCuirass: 299,
        itemHighPotion: 288,
        itemHolbeinDagger: 264,
        itemHolyMail: 315,
        itemHolyRod: 258,
        itemHolySword: 243,
        itemHunterSword: 222,
        itemIceCream: 171,
        itemIceMail: 309,
        itemIcebrand: 241,
        itemIronBall: 263,
        itemIronCuirass: 301,
        itemIronFist: 230,
        itemIronShield: 135,
        itemJavelin: 210,
        itemJewelKnuckles: 225,
        itemJewelSword: 237,
        itemKarmaCoin: 152,
        itemKatana: 228,
        itemKingsStone: 382,
        itemKnightShield: 134,
        itemKnuckleDuster: 213,
        itemLapisLazuli: 367,
        itemLeatherShield: 133,
        itemLibraryCard: 294,
        itemLifeApple: 274,
        itemLifeMaxUp: 23,
        itemLightningMail: 308,
        itemLuckPotion: 277,
        itemLuminus: 233,
        itemLunchA: 179,
        itemMablungSword: 252,
        itemMagicMissile: 153,
        itemMannaPrism: 290,
        itemMarsil: 245,
        itemMasamune: 268,
        itemMealTicket: 198,
        itemMedal: 379,
        itemMedusaShield: 141,
        itemMirrorCuirass: 310,
        itemMisoSoup: 189,
        itemMojoMail: 318,
        itemMonsterVial1: 129,
        itemMonsterVial2: 130,
        itemMonsterVial3: 131,
        itemMoonRod: 260,
        itemMoonstone: 355,
        itemMormegil: 238,
        itemMorningSet: 178,
        itemMorningstar: 257,
        itemMourneblade: 250,
        itemMuramasa: 269,
        itemMysticPendant: 373,
        itemNamakura: 212,
        itemNatou: 187,
        itemNauglamir: 384,
        itemNecklaceOfJ: 375,
        itemNeutronBomb: 199,
        itemNunchaku: 149,
        itemObsidianSword: 235,
        itemOnyx: 363,
        itemOpal: 365,
        itemOpalCirclet: 337,
        itemOrange: 157,
        itemOsafuneKatana: 267,
        itemPeanuts: 163,
        itemPentagram: 201,
        itemPizza: 174,
        itemPlatinumMail: 305,
        itemPorkBun: 191,
        itemPotRoast: 195,
        itemPotion: 287,
        itemPowerOfSire: 200,
        itemRamen: 188,
        itemRapier: 151,
        itemRedBeanBun: 192,
        itemRedRust: 154,
        itemResistDark: 286,
        itemResistFire: 281,
        itemResistHoly: 285,
        itemResistIce: 283,
        itemResistStone: 284,
        itemResistThunder: 282,
        itemRingOfArcana: 372,
        itemRingOfAres: 368,
        itemRingOfFeanor: 378,
        itemRingOfVarda: 371,
        itemRoyalCloak: 350,
        itemRubyCirclet: 336,
        itemRunesword: 271,
        itemSaber: 217,
        itemScimitar: 215,
        itemSecretBoots: 385,
        itemShamanShield: 140,
        itemShieldPotion: 280,
        itemShieldRod: 132,
        itemShiitake: 165,
        itemShortSword: 147,
        itemShortcake: 167,
        itemShotel: 156,
        itemShuriken: 203,
        itemSilverPlate: 303,
        itemSilverRing: 370,
        itemSirloin: 196,
        itemSkullShield: 142,
        itemSmartPotion: 278,
        itemSpikeBreaker: 311,
        itemStarFlail: 259,
        itemStaurolite: 358,
        itemSteelHelm: 332,
        itemStoneMask: 333,
        itemStoneSword: 242,
        itemStrawberry: 161,
        itemStrengthPotion: 276,
        itemSunglasses: 324,
        itemSunstone: 356,
        itemSushi: 190,
        itemSwordOfDawn: 145,
        itemSwordOfHador: 232,
        itemTNT: 207,
        itemTakemitsu: 155,
        itemTalisman: 380,
        itemTalwar: 227,
        itemTart: 168,
        itemTerminusEst: 244,
        itemThunderbrand: 240,
        itemToadstool: 164,
        itemTopazCirclet: 338,
        itemTurkey: 197,
        itemTurquoise: 362,
        itemTwilightCloak: 353,
        itemTyrfing: 211,
        itemUncurse: 273,
        itemVelvetHat: 328,
        itemVorpalBlade: 291,
        itemWalkArmor: 316,
        itemWereBane: 150,
        itemWizardHat: 344,
        itemYasutsuna: 293,
        itemZircon: 360,
        itemZweiHander: 231,
        itemSubweaponAxe: 15,
    },
    stageIds: {
        abandonedMine: 5,
        alchemyLaboratory: 12,
        bossSuccubus: 18,
        castleCenter: 8,
        castleEntrance: 65,
        castleEntranceRevisited: 7,
        castleKeep: 11,
        catacombs: 3,
        clockTower: 13,
        colosseum: 10,
        longLibrary: 2,
        marbleGallery: 0,
        olroxsQuarters: 4,
        outerWall: 1,
        royalChapel: 6,
        undergroundCaverns: 9,
        warpRooms: 14,
    },
}