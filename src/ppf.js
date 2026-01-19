
import { Address, encodeString, GameData, getSizeOfType, toHex, toVal } from './common.js'

// TODO(sestren) structures:
//     object-array:
//         - can index into array
//         - sparse access to root-level properties
//     value-array:
//         - can index into array
//     object:
//         - sparse access to root-level properties
//     value:
//         - simple replace only
//     tilemap:
//         - TODO(sestren): add to extract
//     indexed-bitmap:
//         - can specify a square, sparse region, with some restrictions
//     binary-string-array:
//         - simple replace only

export class PPF {
    constructor(buffer, cursorOffset=0) {
        this.writes = {}
        this.buffer = Buffer.alloc(1024)
    }

    bytes(description="Default description") {
        let ppfData = Buffer.alloc(1024 * 1024)
        let cursor = 0
        cursor = ppfData.write('PPF30', cursor)
        cursor = ppfData.writeUInt8(2, cursor) // Encoding method = PPF3.0
        const descriptionBuffer = Buffer.alloc(50, 0x20) // All spaces
        descriptionBuffer.write(description, 0)
        cursor += descriptionBuffer.copy(ppfData, cursor, 0, 50)
        cursor = ppfData.writeUInt8(0, cursor) // Imagetype = BIN
        cursor = ppfData.writeUInt8(0, cursor) // Blockcheck = Disabled
        cursor = ppfData.writeUInt8(0, cursor) // Undo data = Not available
        cursor = ppfData.writeUInt8(0, cursor) // Dummy
        Object.entries(this.writes)
        .forEach(([groupKey, groupWrites]) => {
            let prevAddress = -1
            let sizeAddress = -1
            Object.entries(groupWrites)
            .filter(([addressKey, addressWrites]) => (
                // Don't write out to the PPF if the final write is the same as the original data
                addressWrites.at(0) != addressWrites.at(-1)
            ))
            .forEach(([addressKey, addressWrites]) => {
                const currAddress = parseInt(addressKey, 16)
                if (currAddress <= prevAddress)  {
                    throw Error('Addresses processed out of order')
                }
                if (currAddress > (prevAddress + 1)) {
                    // The address is assumed to fit into 32 bits, so the high half is all 0s
                    cursor = ppfData.writeUInt32LE(currAddress, cursor)
                    cursor = ppfData.writeUInt32LE(0x00000000, cursor)
                    sizeAddress = cursor
                    cursor = ppfData.writeUInt8(0, cursor)
                }
                cursor = ppfData.writeUint8(addressWrites.at(-1), cursor)
                // Update the size as we go
                const currSize = ppfData.readUInt8(sizeAddress)
                ppfData.writeUInt8(currSize + 1, sizeAddress)
                prevAddress = currAddress
            })
        })
        console.log(cursor)
        const result = ppfData.slice(0, cursor)
        return result
    }

    write(address, type, data) {
        let byteCount = 0
        switch (type) {
            case 'int8':
            case 's8':
                this.buffer.writeInt8(data, 0)
                byteCount = 1
                break
            case 'uint8':
            case 'u8':
                this.buffer.writeUInt8(data, 0)
                byteCount = 1
                break
            case 'int16':
            case 's16':
                this.buffer.writeInt16LE(data, 0)
                byteCount = 2
                break
            case 'uint16':
            case 'u16':
                this.buffer.writeUInt16LE(data, 0)
                byteCount = 2
                break
            case 'int32':
            case 's32':
                this.buffer.writeInt32LE(data, 0)
                byteCount = 4
                break
            case 'uint32':
            case 'u32':
                this.buffer.writeUInt32LE(data, 0)
                byteCount = 4
                break
            case 'rgba32':
                let red = Math.floor(parseInt(data.substring(1, 3), 16) / 8)
                let green = Math.floor(parseInt(data.substring(3, 5), 16) / 8)
                let blue = Math.floor(parseInt(data.substring(5, 7), 16) / 8)
                let alpha = Math.floor(parseInt(data.substring(7, 9), 16) / 128)
                let value = (alpha << 15) + (blue << 10) + (green << 5) + red
                this.buffer.writeUInt16LE(value, 0)
                byteCount = 2
                break
            case 'layout-rect':
                break
            case 'zone-offset':
                break
            case 'string':
                byteCount = encodeString(data, this.buffer, 0)
                break
            case 'shifted-string':
                break
        }
        for (let i = 0; i < byteCount; i++) {
            const discAddress = new Address('GAMEDATA', address + i).toDiscAddress()
            const addressGroup = toHex(0x80 * (Math.floor(discAddress / 0x80)))
            if (!this.writes.hasOwnProperty(addressGroup)) {
                this.writes[addressGroup] = {}
            }
            const addressKey = toHex(discAddress)
            if (!this.writes[addressGroup].hasOwnProperty(addressKey)) {
                this.writes[addressGroup][addressKey] = []
            }
            this.writes[addressGroup][addressKey].push(this.buffer.readUint8(i))
        }
    }

}

export function parsePatchNode(ppf, extractionNode, patchNode) {
    if (extractionNode.hasOwnProperty('metadata') && extractionNode.hasOwnProperty('data')) {
        const extractData = extractionNode.data
        const extractMeta = extractionNode.metadata
        switch (extractMeta.element.structure) {
            case 'object':
                Object.entries(extractMeta.element.properties)
                .filter(([propertyName, propertyInfo]) => (
                    patchNode.hasOwnProperty(propertyName)
                ))
                .forEach(([propertyName, propertyInfo]) => {
                    ppf.write(extractMeta.address + propertyInfo.offset, propertyInfo.type, extractData[propertyName])
                    ppf.write(extractMeta.address + propertyInfo.offset, propertyInfo.type, patchNode[propertyName])
                })
                break
            case 'object-array':
                for (let i = 0; i < patchNode.length; i++) {
                    Object.entries(extractMeta.element.properties)
                    .filter(([propertyName, propertyInfo]) => (
                        patchNode[i].hasOwnProperty(propertyName)
                    ))
                    .forEach(([propertyName, propertyInfo]) => {
                        ppf.write(extractMeta.address + i * extractMeta.element.size + propertyInfo.offset, propertyInfo.type, extractData[i][propertyName])
                        ppf.write(extractMeta.address + i * extractMeta.element.size + propertyInfo.offset, propertyInfo.type, patchNode[i][propertyName])
                    })
                }
                break
            case 'value':
                ppf.write(extractMeta.address, extractMeta.element.type, extractData)
                ppf.write(extractMeta.address, extractMeta.element.type, patchNode)
                break
            case 'value-array':
                for (let i = 0; i < patchNode.length; i++) {
                    ppf.write(extractMeta.address + i * extractMeta.element.size, extractMeta.element.type, extractData[i])
                    ppf.write(extractMeta.address + i * extractMeta.element.size, extractMeta.element.type, patchNode[i])
                }
                break
            case 'indexed-bitmap':
                for (let row = 0; row < extractMeta.element.rows; row++) {
                    for (let col2 = 0; col2 < extractMeta.element.bytesPerRow; col2++) {
                        const address = extractMeta.address + row * extractMeta.element.bytesPerRow + col2
                        // NOTE(sestren): Color index data is stored 2 colors per byte, in reverse order
                        const extractByte = extractData.at(row).charAt(2 * col2 + 1) + extractData.at(row).charAt(2 * col2 + 0)
                        const patchByte = patchNode.at(row).charAt(2 * col2 + 1) + patchNode.at(row).charAt(2 * col2 + 0)
                        ppf.write(address, 'u8', parseInt(extractByte, 16))
                        ppf.write(address, 'u8', parseInt(patchByte, 16))
                    }
                }
                break
            case 'binary-string-array':
                ppf.write(extractMeta.address + 0, 'u8', extractData.left)
                ppf.write(extractMeta.address + 0, 'u8', patchNode.left)
                ppf.write(extractMeta.address + 1, 'u8', extractData.top)
                ppf.write(extractMeta.address + 1, 'u8', patchNode.top)
                ppf.write(extractMeta.address + 2, 'u8', extractData.bytesPerRow)
                ppf.write(extractMeta.address + 2, 'u8', patchNode.bytesPerRow)
                ppf.write(extractMeta.address + 3, 'u8', extractData.rows)
                ppf.write(extractMeta.address + 3, 'u8', patchNode.rows)
                for (let row = 0; row < extractMeta.element.rows; row++) {
                    for (let col8 = 0; col8 < extractMeta.element.bytesPerRow; col8++) {
                        const address = extractMeta.address + row * extractMeta.element.bytesPerRow + col8
                        // NOTE(sestren): Reveal data is stored 8 cells per byte
                        let extractByte = 0
                        let patchByte = 0
                        for (let i = 0; i < 8; i++) {
                            extractByte += (extractData.at(row).charAt(8 * col8 + i) == ' ') ? '0' : '1'
                            patchByte += (patchNode.at(row).charAt(8 * col8 + i) == ' ') ? '0' : '1'
                        }
                        ppf.write(address, 'u8', parseInt(extractByte, 2))
                        ppf.write(address, 'u8', parseInt(patchByte, 2))
                    }
                }
                break
        }
    }
    else {
        Object.entries(patchNode)
        .filter(([nodeName, nodeInfo]) => (
            extractionNode.hasOwnProperty(nodeName)
        ))
        .forEach(([nodeName, nodeInfo]) => {
            parsePatchNode(ppf, extractionNode[nodeName], patchNode[nodeName])
        })
    }
}

export function toPPF(extractionData, patchData) {
    let ppf = new PPF()
    parsePatchNode(ppf, extractionData, patchData)
    console.log(ppf.writes)
    const result = ppf.bytes()
    return result
}
