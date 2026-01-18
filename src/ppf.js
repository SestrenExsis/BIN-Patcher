
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
            this.writes[addressGroup][toHex(discAddress)] = this.buffer.readUint8(i)
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
                        ppf.write(extractMeta.address + i * extractMeta.element.size + propertyInfo.offset, propertyInfo.type, patchNode[i][propertyName])
                    })
                }
                break
            case 'value':
                ppf.write(extractMeta.address, extractMeta.element.type, patchNode)
                break
            case 'value-array':
                for (let i = 0; i < patchNode.length; i++) {
                    ppf.write(extractMeta.address + i * extractMeta.element.size, extractMeta.element.type, patchNode[i])
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
    const result = ppf
    return result
}
