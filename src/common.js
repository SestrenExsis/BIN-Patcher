
export class Address {
    constructor(addressType, address, offset=0) {
        switch (addressType) {
            case 'DISC':
                this.gameDataAddress = Address.getGamedataAddress(address) + toVal(offset)
                break
            default:
                this.gameDataAddress = address + toVal(offset)
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
        // TODO(sestren): Remove sector headers and error correction and store gamedata only
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
        if (['string', 'shifted-string'].includes(type)) {
            // Strings are terminated with a sentinel value and have a 4-byte alignment
            let sentinelValue = (type == 'string') ? 0x00 : 0xFF
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
                value = bytes.readUInt32LE(0)
                break
            case 'string':
                value = decodeString(bytes)
                break
            case 'shifted-string':
                value = decodeShiftedString(bytes)
                break
        }
        let result = value
        if (type == 'rgba32') {
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

export function decodeShiftedString(bytes) {
    let prefixByte = 0x00
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
