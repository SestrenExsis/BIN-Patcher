
import {
    Address,
    encodeShiftedString,
    encodeString,
    encodeTextCrawl,
    GameData,
    getSizeOfType,
    toHex,
    toVal,
    valueAliases,
} from './common.js'

// TODO(sestren) structures:
//     tilemap:
//         - can specify a range of tiles
//     indexed-bitmap:
//         - can specify a square, sparse region, with some restrictions

export class PPF {
    constructor(buffer, cursorOffset=0) {
        this.writes = {}
        this.buffer = Buffer.alloc(2048)
    }

    bytes(description="Default description") {
        const changes = {}
        Object.entries(this.writes)
        .sort()
        .forEach(([writeKey, writeValues]) => {
            // Group writes into sub-regions so that no single write will be too big for the PPF3 format
            const discAddress = new Address('GAMEDATA', toVal(writeKey)).toDiscAddress()
            const addressGroup = toHex(0x80 * (Math.floor(discAddress / 0x80)))
            if (!changes.hasOwnProperty(addressGroup)) {
                changes[addressGroup] = {}
            }
            const addressKey = toHex(discAddress)
            changes[addressGroup][addressKey] = writeValues.at(-1)
        })
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
        Object.entries(changes)
        .forEach(([addressGroup, groupWrites]) => {
            let prevAddress = -1
            let sizeAddress = -1
            Object.entries(groupWrites)
            .forEach(([addressKey, writeValue]) => {
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
                cursor = ppfData.writeUint8(writeValue, cursor)
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
        if (data == null) {
            return
        }
        let byteCount = 0
        let value
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
            case 'item-drop-id':
                let aliasFound = false
                Object.entries(valueAliases.itemDropIds)
                .filter(([itemDropName, itemDropId]) => {
                    return data == itemDropName
                })
                .forEach(([itemDropName, itemDropId]) => {
                    aliasFound = true
                    value = itemDropId
                })
                if (!aliasFound) {
                    value = parseInt(data.substring('unknownId'.length), 10)
                    console.log('Alias not found for', data)
                }
                this.buffer.writeUInt16LE(value, 0)
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
                value = (alpha << 15) + (blue << 10) + (green << 5) + red
                this.buffer.writeUInt16LE(value, 0)
                byteCount = 2
                break
            case 'layout-rect':
                // NOTE(sestren): Using a weird workaround for shifting flags left 24 bits to avoid overflow issues
                value = 2 * (data.flags << 23) + (data.bottom << 18) + (data.right << 12) + (data.top << 6) + data.left
                this.buffer.writeUInt32LE(value, 0)
                byteCount = 4
                break
            case 'zone-offset':
                if (data == 'NULL') {
                    value = 0x00000000
                }
                else {
                    value = parseInt(data, 16) + 0x80180000
                }
                this.buffer.writeUInt32LE(value, 0)
                byteCount = 4
                break
            case 'string':
                byteCount = encodeString(data, this.buffer, 0)
                break
            case 'shifted-string':
                byteCount = encodeShiftedString(data, this.buffer, 0)
                break
            case 'text-crawl':
                byteCount = encodeTextCrawl(data, this.buffer, 0)
                break
        }
        for (let i = 0; i < byteCount; i++) {
            const addressKey = toHex(address + i)
            const value = this.buffer.readUint8(i)
            if (!this.writes.hasOwnProperty(addressKey)) {
                this.writes[addressKey] = []
            }
            this.writes[addressKey].push(value)
        }
    }

}

export function parsePatchNode(ppf, patchNode) {
    if (patchNode.hasOwnProperty('metadata') && patchNode.hasOwnProperty('data')) {
        const targetMeta = patchNode.metadata
        const targetData = patchNode.data
        switch (targetMeta.element.structure) {
            case 'object':
                Object.entries(targetMeta.element.properties)
                .filter(([propertyName, propertyInfo]) => (
                    targetData.hasOwnProperty(propertyName)
                ))
                .forEach(([propertyName, propertyInfo]) => {
                    if (targetData[propertyName] == null) {
                        return
                    }
                    ppf.write(toVal(targetMeta.address) + toVal(propertyInfo.offset), propertyInfo.type, targetData[propertyName], false)
                })
                break
            case 'object-array':
                for (let i = 0; i < targetData.length; i++) {
                    Object.entries(targetMeta.element.properties)
                    .filter(([propertyName, propertyInfo]) => (
                        targetData[i].hasOwnProperty(propertyName)
                    ))
                    .forEach(([propertyName, propertyInfo]) => {
                        if (targetData[i][propertyName] == null) {
                            return
                        }
                        ppf.write(toVal(targetMeta.address) + i * targetMeta.element.size + toVal(propertyInfo.offset), propertyInfo.type, targetData[i][propertyName], false)
                    })
                }
                break
            case 'value':
                if (targetData !== null) {
                    ppf.write(toVal(targetMeta.address), targetMeta.element.type, targetData, false)
                }
                break
            case 'value-array':
                if (!targetMeta.element.hasOwnProperty('size')) {
                    targetMeta.element.size = getSizeOfType(targetMeta.element.type)
                }
                for (let i = 0; i < targetData.length; i++) {
                    if (targetData[i] == null) {
                        continue
                    }
                    if (targetData[i] == ' '.repeat(targetData[i].length)) {
                        continue
                    }
                    if (targetData[i] == '.'.repeat(targetData[i].length)) {
                        continue
                    }
                    ppf.write(toVal(targetMeta.address) + i * targetMeta.element.size, targetMeta.element.type, targetData[i], false)
                }
                break
            case 'indexed-bitmap':
                for (let row = 0; row < targetMeta.element.rows; row++) {
                    for (let col2 = 0; col2 < targetMeta.element.bytesPerRow; col2++) {
                        const address = toVal(targetMeta.address) + row * targetMeta.element.bytesPerRow + col2
                        // NOTE(sestren): Color index data is stored 2 colors per byte, in reverse order
                        let targetBytes = targetData.at(row).charAt(2 * col2 + 1) + targetData.at(row).charAt(2 * col2 + 0)
                        if (targetBytes == '..') {
                            continue
                        }
                        ppf.write(toVal(address), 'u8', parseInt(targetBytes, 16), false)
                    }
                }
                break
            case 'binary-string-array':
                if (targetData != null) {
                    ppf.write(toVal(targetMeta.address) + 0, 'u8', targetData.left, false)
                    ppf.write(toVal(targetMeta.address) + 1, 'u8', targetData.top, false)
                    ppf.write(toVal(targetMeta.address) + 2, 'u8', targetData.bytesPerRow, false)
                    ppf.write(toVal(targetMeta.address) + 3, 'u8', targetData.rows, false)
                    for (let row = 0; row < targetData.rows; row++) {
                        for (let col8 = 0; col8 < targetData.bytesPerRow; col8++) {
                            const address = toVal(targetMeta.address) + 4 + row * targetData.bytesPerRow + col8
                            // NOTE(sestren): Reveal data is stored 8 cells per byte
                            let targetBytes = 0
                            // NOTE(sestren): Process the bits in reverse order
                            for (let i = 7; i >= 0; i--) {
                                targetBytes += (targetData.grid.at(row).charAt(8 * col8 + i) == ' ') ? '0' : '1'
                            }
                            ppf.write(toVal(address), 'u8', parseInt(targetBytes, 2), false)
                        }
                    }
                    ppf.write(toVal(targetMeta.address) + 4 + targetData.rows * targetData.bytesPerRow, 'u8', 0xFF, false)
                }
                break
            case 'tilemap':
                const bytesPerRow = targetMeta.element.columns * targetMeta.element.bytesPerIndex
                for (let row = 0; row < targetMeta.element.rows; row++) {
                    for (let col = 0; col < targetMeta.element.columns; col++) {
                        const address = toVal(targetMeta.address) + row * bytesPerRow + 2 * col
                        const targetBytes = targetData.at(row).substring(5 * col, 5 * col + 4)
                        if (targetBytes == '....') {
                            continue
                        }
                        ppf.write(toVal(address), 'u16', parseInt(targetBytes, 16), false)
                    }
                }
                break
        }
    }
    else {
        Object.entries(patchNode)
        .filter(([nodeName, nodeInfo]) => {
            return (nodeInfo !== null) && !(['data', 'metadata', 'aliases'].includes(nodeName))
        })
        .forEach(([nodeName, nodeInfo]) => {
            // console.log(nodeName)
            parsePatchNode(ppf, patchNode[nodeName])
        })
    }
}

export function toPPF(patchData) {
    let ppf = new PPF()
    parsePatchNode(ppf, patchData)
    const result = ppf.bytes()
    return result
}
