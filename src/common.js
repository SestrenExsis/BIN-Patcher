
export class Address {
    constructor(addressType, address, offset=0) {
        switch (addressType) {
            case 'DISC':
                this.gameDataAddress = Address.getGamedataAddress(address) + offset
                break
            default:
                this.gameDataAddress = address + offset
                break
        }
    }

    clone(offset=0) {
        return new Address('GAMEDATA', this.gameDataAddress, offset)
    }

    toDiscAddress(offset=0) {
        return Address.getDiscAddress(this.gameDataAddress + offset)
    }

    toGameDataAddress(offset=0) {
        return this.gameDataAddress + offset
    }

    static sectorHeaderSize = 24
    static sectorDataSize = 2048
    static sectorErrorCorrectionDataSize = 280
    static sectorSize = Address.sectorHeaderSize + Address.sectorDataSize + Address.sectorErrorCorrectionDataSize

    static getGamedataAddress(discAddress) {
        const sector = Math.floor(discAddress / Address.sectorSize)
        let offset = discAddress % Address.sectorSize
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
        const sector = Math.floor(gameDataAddress / Address.sectorDataSize)
        const offset = gameDataAddress % Address.sectorDataSize
        const result = sector * Address.sectorSize + Address.sectorHeaderSize + offset
        return result
    }
}

export class GameData {
    constructor(buffer, cursorOffset=0) {
        // TODO(sestren): Remove sector headers and error correction and store gamedata only
        this.buffer = buffer
        this.cursor = new Address('GAMEDATA', cursorOffset)
    }

    clone(offset=0) {
        return new GameData(this.buffer, this.cursor.clone(offset).gameDataAddress)
    }

    set(offset) {
        this.cursor.gameDataAddress = offset
        return this
    }

    seek(offset) {
        this.cursor.gameDataAddress += offset
        return this
    }

    read(type, advanceCursor=true) {
        let byteCount = getSizeOfType(type)
        const bytes = Buffer.alloc(byteCount)
        for (let byteIndex = 0; byteIndex < byteCount; byteIndex++) {
            const byteOffset = this.cursor.toDiscAddress(byteIndex)
            const byte = this.buffer.readUInt8(byteOffset)
            bytes.writeUint8(byte, byteIndex)
        }
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
        this.seek(byteCount)
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

export const constants = {
    abandonedMine: {
        name: 'Abandoned Mine',
        start: 0x03CDF800,
        size: 0x02F428,
        offsets: {
            baseDropRate: 0x0D6C,
        },
    },
    alchemyLaboratory: {
        name: 'Alchemy Laboratory',
        start: 0x049BE800,
        size: 0x04B780,
        offsets: {
            baseDropRate: 0x18C0,
        },
    },
    // 'Anti-Chapel': {
    //     'Stage': {
    //         'Start': 0x04416000,
    //         'Size': 295736,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x10E4,
    //     },
    // },
    // 'Black Marble Gallery': {
    //     'Stage': {
    //         'Start': 0x0453D800,
    //         'Size': 347020,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x13B4,
    //     },
    // },
    // 'Boss - Olrox': {
    //     'Stage': {
    //         'Start': 0x0534C800,
    //         'Size': 320948,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x17C4,
    //     },
    // },
    // 'Boss - Granfaloon': {
    //     'Stage': {
    //         'Start': 0x053F7000,
    //         'Size': 205756,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x138C,
    //     },
    // },
    // 'Boss - Minotaur and Werewolf': {
    //     'Stage': {
    //         'Start': 0x05473800,
    //         'Size': 223540,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x1010,
    //     },
    // },
    // 'Boss - Scylla': {
    //     'Stage': {
    //         'Start': 0x05507000,
    //         'Size': 210224,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x1444,
    //     },
    // },
    // 'Boss - Doppelganger 10': {
    //     'Stage': {
    //         'Start': 0x05593000,
    //         'Size': 347704,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x09FC,
    //     },
    // },
    // 'Boss - Hippogryph': {
    //     'Stage': {
    //         'Start': 0x05638800,
    //         'Size': 218672,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x10AC,
    //     },
    // },
    // 'Boss - Richter': {
    //     'Stage': {
    //         'Start': 0x056C8800,
    //         'Size': 333544,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x0A34,
    //     },
    // },
    // 'Boss - Cerberus': {
    //     'Stage': {
    //         'Start': 0x0596D000,
    //         'Size': 144480,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x0C34,
    //     },
    // },
    // 'Boss - Trio': {
    //     'Stage': {
    //         'Start': 0x05775000,
    //         'Size': 160988,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x117C,
    //     },
    // },
    // 'Boss - Beelzebub': {
    //     'Stage': {
    //         'Start': 0x05870000,
    //         'Size': 139104,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x0D3C,
    //     },
    // },
    // 'Boss - Death': {
    //     'Stage': {
    //         'Start': 0x058ED800,
    //         'Size': 190792,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x0F7C,
    //     },
    // },
    // 'Boss - Medusa': {
    //     'Stage': {
    //         'Start': 0x059E9800,
    //         'Size': 132656,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x0A9C,
    //     },
    // },
    // 'Boss - Creature': {
    //     'Stage': {
    //         'Start': 0x05A65000,
    //         'Size': 154660,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x0BA8,
    //     },
    // },
    // 'Boss - Doppelganger 40': {
    //     'Stage': {
    //         'Start': 0x05AE3800,
    //         'Size': 345096,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x0A88,
    //     },
    // },
    // 'Boss - Shaft and Dracula': {
    //     'Stage': {
    //         'Start': 0x05B93800,
    //         'Size': 213060,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x0C90,
    //     },
    // },
    // 'Boss - Succubus': {
    //     'Stage': {
    //         'Start': 0x04F31000,
    //         'Size': 147456,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x0CC8,
    //     },
    // },
    // 'Boss - Akmodan II': {
    //     'Stage': {
    //         'Start': 0x05C24000,
    //         'Size': 142572,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x0AF4,
    //     },
    // },
    // 'Boss - Galamoth': {
    //     'Stage': {
    //         'Start': 0x05C9F800,
    //         'Size': 161212,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x1B28,
    //     },
    // },
    // 'Castle Center': {
    //     'Stage': {
    //         'Start': 0x03C65000,
    //         'Size': 119916,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x0B04,
    //     },
    // },
    // 'Castle Entrance': {
    //     'Stage': {
    //         'Start': 0x041A7800,
    //         'Size': 0,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x200C,
    //     },
    // },
    // 'Castle Entrance Revisited': {
    //     'Stage': {
    //         'Start': 0x0491A800,
    //         'Size': 0,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x1998,
    //     },
    // },
    // 'Castle Keep': {
    //     'Stage': {
    //         'Start': 0x04AEF000,
    //         'Size': 247132,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x1194,
    //     },
    // },
    // 'Catacombs': {
    //     'Stage': {
    //         'Start': 0x03BB3000,
    //         'Size': 361920,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x1AE4,
    //     },
    // },
    // 'Cave': {
    //     'Stage': {
    //         'Start': 0x0439B800,
    //         'Size': 174880,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x0C68,
    //     },
    // },
    // 'Clock Tower': {
    //     'Stage': {
    //         'Start': 0x04A67000,
    //         'Size': 271168,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x1664,
    //     },
    // },
    // 'Colosseum': {
    //     'Stage': {
    //         'Start': 0x03B00000,
    //         'Size': 352636,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x1364,
    //     },
    // },
    // 'Cutscene - Meeting Maria in Clock Room': {
    //     'Stage': {
    //         'Start': 0x057F9800,
    //         'Size': 0,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x0AB0,
    //     },
    // },
    // 'Death Wing\'s Lair': {
    //     'Stage': {
    //         'Start': 0x04680800,
    //         'Size': 313816,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x1294,
    //     },
    // },
    // 'Floating Catacombs': {
    //     'Stage': {
    //         'Start': 0x04307000,
    //         'Size': 278188,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x18B0,
    //     },
    // },
    // 'Forbidden Library': {
    //     'Stage': {
    //         'Start': 0x044B0000,
    //         'Size': 201776,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x0F80,
    //     },
    // },
    // 'Long Library': {
    //     'Stage': {
    //         'Start': 0x03E5F800,
    //         'Size': 348876,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x1FC8,
    //     },
    // },
    marbleGallery: {
        name: 'Marble Gallery',
        start: 0x03F8B000,
        size: 0x05F58C,
        offsets: {
            baseDropRate: 0x1488,
        },
    },
    // 'Necromancy Laboratory': {
    //     'Stage': {
    //         'Start': 0x04D81000,
    //         'Size': 281512,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x110C,
    //     },
    // },
    // 'Olrox\'s Quarters': {
    //     'Stage': {
    //         'Start': 0x040FB000,
    //         'Size': 327100,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x1374,
    //     },
    // },
    // 'Outer Wall': {
    //     'Stage': {
    //         'Start': 0x04047000,
    //         'Size': 356452,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x1DA8,
    //     },
    // },
    // 'Prologue': {
    //     'Stage': {
    //         'Start': 0x0487C800,
    //         'Size': 271812,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x1934,
    //     },
    // },
    // 'Reverse Caverns': {
    //     'Stage': {
    //         'Start': 0x047C3800,
    //         'Size': 384020,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x1AF4,
    //     },
    // },
    // 'Reverse Castle Center': {
    //     'Stage': {
    //         'Start': 0x04B87800,
    //         'Size': 186368,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x0DD8,
    //     },
    // },
    // 'Reverse Clock Tower': {
    //     'Stage': {
    //         'Start': 0x04E22000,
    //         'Size': 260960,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x1698,
    //     },
    // },
    // 'Reverse Colosseum': {
    //     'Stage': {
    //         'Start': 0x04C07800,
    //         'Size': 234384,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x0E2C,
    //     },
    // },
    // 'Reverse Entrance': {
    //     'Stage': {
    //         'Start': 0x0471E000,
    //         'Size': 304428,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x1498,
    //     },
    // },
    // 'Reverse Keep': {
    //     'Stage': {
    //         'Start': 0x04C84000,
    //         'Size': 200988,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x0C7C,
    //     },
    // },
    // 'Reverse Outer Wall': {
    //     'Stage': {
    //         'Start': 0x045EE000,
    //         'Size': 357020,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x1158,
    //     },
    // },
    reverseWarpRooms: {
        name: 'Reverse Warp Rooms',
        start: 0x04EBE000,
        size: 0x16800,
        offsets: {
            warpDestinations: 0x065C,
            baseDropRate: 0x09DC,
        },
    },
    // 'Royal Chapel': {
    //     'Stage': {
    //         'Start': 0x03D5A800,
    //         'Size': 373764,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x13BC,
    //     },
    // },
    // 'Underground Caverns': {
    //     'Stage': {
    //         'Start': 0x04257800,
    //         'Size': 391260,
    //     },
    //     'Offsets': {
    //         'Base Drop Rate': 0x1D40,
    //     },
    // },
    warpRooms: {
        name: 'Warp Rooms',
        start: 0x04D12800,
        size: 0x014800,
        offsets: {
            warpDestinations: 0x065C,
            baseDropRate: 0x09DC,
        },
    },
}

export function toHex(value, padding=8) {
    return '0x' + value.toString(16).padStart(padding, '0')
}
