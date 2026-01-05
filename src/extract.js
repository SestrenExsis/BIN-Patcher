
import { Address, GameData, getSizeOfType, toHex, toVal } from './common.js'

function extractData(bin, metadata, offset=0) {
    if ('indirectOffset' in metadata) {
        metadata.offset = bin.set(offset + toVal(metadata.indirectOffset)).read('u32') - 0x80180000
    }
    if ('type' in metadata && metadata.type == 'indexed-bitmap') {
        return extractIndexedBitmap(bin, metadata, offset)
    }
    else if ('type' in metadata && metadata.type == 'tilemap') {
        return extractTilemap(bin, metadata, offset)
    }
    else if ('type' in metadata && metadata.type == 'binary-string-array') {
        return extractCastleMapReveals(bin, metadata, offset)
    }
    else if ('fields' in metadata) {
        return extractObjectArray(bin, metadata, offset)
    }
    else if ('elementCount' in metadata) {
        return extractValueArray(bin, metadata, offset)
    }
    else if ('type' in metadata) {
        return extractValue(bin, metadata, offset)
    }
    else {
        return null
    }
}

function getOffset(metadata, offset=0) {
    if ('start' in metadata) {
        return toVal(metadata.start)
    }
    else if ('offset' in metadata) {
        return toVal(metadata.offset) + toVal(offset)
    }
    else {
        return toVal(offset)
    }
}

function extractValue(bin, metadata, offset=0) {
    bin.set(getOffset(metadata, offset))
    const data = bin.read(metadata.type)
    if (['string', 'shifted-string'].includes(metadata.type)) {
        metadata.footprint = bin.prevRead.length
    }
    const result = {
        metadata: metadata,
        data: data,
    }
    return result
}

function extractValueArray(bin, metadata, offset=0) {
    const data = []
    metadata.elementSize = getSizeOfType(metadata.type)
    for (let elementId = 0; elementId < toVal(metadata.elementCount); elementId++) {
        let elementData = bin.set(getOffset(metadata, offset) + elementId * toVal(metadata.elementSize)).read(metadata.type)
        data.push(elementData)
    }
    const result = {
        metadata: metadata,
        data: data,
    }
    return result
}

function extractObjectArray(bin, metadata, offset=0) {
    const data = []
    let elementId = 0
    while (true) {
        let elementData = {}
        Object.entries(metadata.fields).forEach(([fieldName, fieldInfo]) => {
            bin.set(getOffset(metadata, offset) + elementId * toVal(metadata.elementSize) + toVal(fieldInfo.offset))
            let value = bin.read(fieldInfo.type)
            if ('shift' in fieldInfo) {
                value = value >> toVal(fieldInfo.shift)
            }
            if ('mask' in fieldInfo) {
                value = value & toVal(fieldInfo.mask)
            }
            elementData[fieldName] = value
        })
        data.push(elementData)
        elementId += 1
        if (metadata.elementCount !== undefined) {
            if (elementId >= toVal(metadata.elementCount)) {
                break
            }
        }
        if (metadata.terminatorValue !== undefined) {
            if (bin.read('u8', false) == metadata.terminatorValue) {
                break
            }
        }
    }
    metadata.elementCount = data.length
    const result = {
        metadata: metadata,
        data: data,
    }
    return result
}

function extractIndexedBitmap(bin, metadata, offset=0) {
    const data = []
    metadata.indexesPerByte = 2
    metadata.bytesPerRow = Math.floor(toVal(metadata.columns) / metadata.indexesPerByte)
    bin.set(getOffset(metadata, offset))
    // Bitmap data is typically stored as an array of 4-bit color indexes
    for (let row = 0; row < toVal(metadata.rows); row++) {
        let rowData = ''
        for (let byteIndex = 0; byteIndex < metadata.bytesPerRow; byteIndex++) {
            // Each byte contains 2 of the color indexes
            const byteData = bin.read('uint8').toString(16).padStart(2, '0')
            // The "left" nibble of the byte refers to the "right" color index, and vice versa
            rowData += byteData[1] + byteData[0]
        }
        data.push(rowData)
    }
    const result = {
        metadata: metadata,
        data: data,
    }
    return result
}

function extractTilemap(bin, metadata, offset=0) {
    const data = []
    metadata.rows = 16 * toVal(metadata.heightInScreens)
    metadata.columns = 16 * toVal(metadata.widthInScreens)
    metadata.bytesPerIndex = 2
    bin.set(getOffset(metadata, offset))
    // Each set of tiles can be thought of as a 2D array of 2-byte index values
    for (let row = 0; row < metadata.rows; row++) {
        const rowTiles = []
        for (let col = 0; col < metadata.columns; col++) {
            const tile = bin.read('uint16').toString(16).padStart(4, '0')
            rowTiles.push(tile)
        }
        data.push(rowTiles.join(' '))
    }
    const result = {
        metadata: metadata,
        data: data,
    }
    return result
}

function extractCastleMapReveals(bin, metadata, offset=0) {
    const data = []
    bin.set(getOffset(metadata, offset))
    // Castle map reveal data is stored serially with a sentinel value of 0xFF to signify termination
    // Each section starts with a header that describes how much additional data is read for that particular section
    // While the vanilla game only defines one section, the underlying data format has support for multiple sections
    // However, for ROM hacking purposes, the total footprint will still be a limiting factor
    metadata.footprint = 0
    while (true) {
        const castleMapReveal = {
            left: bin.read('uint8'),
            top: bin.read('uint8'),
            bytesPerRow: bin.read('uint8'),
            rows: bin.read('uint8'),
            grid: [],
        }
        metadata.footprint += 4
        for (let row = 0; row < castleMapReveal.rows; row++) {
            let rowData = ''
            for (let byteIndex = 0; byteIndex < castleMapReveal.bytesPerRow; byteIndex++) {
                // For visualization purposes, 0s are replaced with a space and 1s are replaced with a '#'
                const byteData = bin.read('uint8').toString(2).padStart(8, '0').replaceAll('0', ' ').replaceAll('1', '#')
                rowData += byteData.split('').reverse().join('')
                metadata.footprint += 1
            }
            castleMapReveal.grid.push(rowData)
        }
        data.push(castleMapReveal)
        if (bin.read('uint8', false) == 0xFF) {
            const bytePadding = 4 - metadata.footprint % 4
            metadata.footprint += bytePadding
            break
        }
    }
    metadata.count = data.length
    const result = {
        metadata: metadata,
        data: data,
    }
    return result
}

// TODO(sestren): CLI to extract specific things (for previewing?)
// extract --get abandonedMine.uniqueItemDrops 0x03CE01E4 u16 13
// extract --get bossTeleporters 0x0009817C 20 28  roomX 0x00 u8  roomY 0x04 u8  stageId 0x08 u32  eventId 0x0C s8  teleporterIndex 0x10 s32

// func_800F24F4: falseSaveRoom and finalSaveRoom

function parseExtractionNode(bin, extractionNode, offset=0) {
    const node = extractData(bin, extractionNode, offset)
    if (node === null) {
        const result = {}
        let relativeOffset = getOffset(extractionNode, offset)
        // Process all nodes other than 'start' and 'offset'
        Object.entries(extractionNode).forEach(([nodeName, nodeInfo]) => {
            if (nodeName == 'start' || nodeName == 'offset') {
                return
            }
            result[nodeName] = parseExtractionNode(bin, nodeInfo, relativeOffset)
        })
        return result
    }
    else {
        return node
    }
}

function preprocessExtractionTemplate(bin, extractionTemplate) {
    // Fill out offset and elementCount for stage layouts

    // offset = MIN(layoutOffsets.foreground, layoutOffsets.background) - 0x80180000
    // elementCount = (MAX(layoutOffsets.foreground, layoutOffsets.background) - 0x80180000) / 0x10
}

export function getExtractionData(bin, extractionTemplate) {
    const OFFSET = 0x80180000
    preprocessExtractionTemplate(bin, extractionTemplate)
    let extraction = parseExtractionNode(bin, extractionTemplate)
    const result = extraction
    return result
}
