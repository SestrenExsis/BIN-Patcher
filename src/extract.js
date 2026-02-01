
import { Address, GameData, getSizeOfType, toHex, toVal } from './common.js'

function extractData(bin, elementInfo, offset=0) {
    switch (elementInfo.structure ?? 'none') {
        case 'object-array':
        case 'value-array':
            return extractArray(bin, elementInfo, offset)
            break
        case 'binary-string-array':
            return extractCastleMapReveals(bin, elementInfo, offset)
            break
        case 'indexed-bitmap':
            return extractIndexedBitmap(bin, elementInfo, offset)
            break
        case 'object':
            return extractObject(bin, elementInfo, offset)
            break
        case 'tilemap':
            return extractTilemap(bin, elementInfo, offset)
            break
        case 'value':
            return extractValue(bin, elementInfo, offset)
            break
        default:
            return null
            break
    }
}

function getOffset(bin, addressInfo, baseOffset=0) {
    let result = 0
    switch (addressInfo.method ?? 'none') {
        case 'absolute':
            result = toVal(addressInfo.value ?? 0)
            break
        case 'indirect':
            const prevCursorAddress = bin.cursor.gameDataAddress
            const relativeAddress = toVal(baseOffset) + toVal(addressInfo.value ?? 0)
            const indirectOffset = bin.set(relativeAddress).read(addressInfo.type ?? 'u32')
            result = toVal(baseOffset) + indirectOffset - toVal(addressInfo.base ?? 0)
            bin.set(prevCursorAddress)
            break
        case 'relative':
            result = toVal(baseOffset) + toVal(addressInfo.value ?? 0)
            break
        case 'none':
            result = toVal(baseOffset)
            break
    }
    return result
}

function extractValue(bin, elementInfo, baseOffset=0) {
    let data = bin.set(toVal(baseOffset)).read(elementInfo.type)
    elementInfo.size = bin.prevRead.length
    const result = data
    bin.set(toVal(baseOffset) + elementInfo.size)
    return result
}

function extractObject(bin, elementInfo, baseOffset=0) {
    const data = {}
    Object.entries(elementInfo.properties).forEach(([propName, propInfo]) => {
        const offset = toVal(baseOffset) + toVal(propInfo.offset)
        let value = bin.set(offset).read(propInfo.type)
        if ('shift' in propInfo) {
            value = value >> toVal(propInfo.shift)
        }
        if ('mask' in propInfo) {
            value = value & toVal(propInfo.mask)
        }
        data[propName] = value
    })
    bin.set(toVal(baseOffset) + toVal(elementInfo.size))
    const result = data
    return result
}

function extractArray(bin, elementInfo, baseOffset=0) {
    const data = []
    let offset = toVal(baseOffset)
    if (elementInfo.structure == 'value-array') {
        elementInfo.size = getSizeOfType(elementInfo.type)
    }
    let validInd = true
    let sentinelId = 0
    let element;
    while (validInd) {
        switch (elementInfo.structure) {
            case 'value-array':
                element = extractValue(bin, elementInfo, offset)
                data.push(element)
                offset += toVal(elementInfo.size)
                break
            case 'object-array':
                element = extractObject(bin, elementInfo, offset)
                element._elementIndex = data.length
                data.push(element)
                offset += toVal(elementInfo.size)
                if (elementInfo.hasOwnProperty('postProcessing')) {
                    elementInfo.postProcessing.forEach((processInfo) => {
                        switch (processInfo.process) {
                            case 'paddingAfterElement':
                                if (processInfo.whenArrayLength == data.length) {
                                    offset += processInfo.paddingAmount
                                }
                                break
                            case 'calculateDerivedValue':
                                let finalValue = 0
                                processInfo.actions.forEach((actionInfo) => {
                                    let currentValue = 0
                                    switch (actionInfo.type) {
                                        case 'constant':
                                            currentValue = actionInfo.constant
                                            break
                                        case 'property':
                                            currentValue = element[actionInfo.property]
                                            break
                                    }
                                    switch (actionInfo.action) {
                                        case 'get':
                                            finalValue = currentValue
                                            break
                                        case 'add':
                                            finalValue += currentValue
                                            break
                                        case 'subtract':
                                            finalValue -= currentValue
                                            break
                                    }
                                })
                                // if (processInfo.action == data.length) {
                                //     offset += processInfo.action
                                // }
                                // {
                                //     'action': 'get',
                                //     'type': 'property',
                                //     'property': 'bottom',
                                // },
                                // {
                                //     'action': 'add',
                                //     'type': 'constant',
                                //     'constant': 1,
                                // },
                                // {
                                //     'action': 'subtract',
                                //     'type': 'property',
                                //     'property': 'top',
                                // }
                                element[processInfo.propertyName] = finalValue
                                break
                        }
                    })
                }
                break
        }
        switch (elementInfo.constraint.method) {
            case 'elementCount':
                validInd = (data.length < toVal(elementInfo.constraint.elementCount))
                break
            case 'sentinelValues':
                const sentinelValue = elementInfo.constraint.sentinelValues[sentinelId]
                if (bin.read(sentinelValue.type, false) == toVal(sentinelValue.value)) {
                    sentinelId++
                }
                else {
                    sentinelId = 0
                }
                validInd = (sentinelId < elementInfo.constraint.sentinelValues.length)
                break
        }
        if (data.length >= 512) {
            console.log('Maximum data length reached!')
            break
        }
    }
    elementInfo.count = data.length
    const result = data
    return result
}

function extractIndexedBitmap(bin, elementInfo, baseOffset=0) {
    const data = []
    elementInfo.indexesPerByte = 2
    elementInfo.bytesPerRow = Math.floor(toVal(elementInfo.columns) / elementInfo.indexesPerByte)
    bin.set(toVal(baseOffset))
    // Bitmap data is typically stored as an array of 4-bit color indexes
    for (let row = 0; row < toVal(elementInfo.rows); row++) {
        let rowData = ''
        for (let byteIndex = 0; byteIndex < elementInfo.bytesPerRow; byteIndex++) {
            // Each byte contains 2 of the color indexes
            const byteData = bin.read('uint8').toString(16).padStart(2, '0')
            // The "left" nibble of the byte refers to the "right" color index, and vice versa
            rowData += byteData.at(1) + byteData.at(0)
        }
        data.push(rowData)
    }
    const result = data
    return result
}

function extractTilemap(bin, elementInfo, baseOffset=0) {
    const data = []
    elementInfo.rows = 16 * toVal(elementInfo.heightInScreens)
    elementInfo.columns = 16 * toVal(elementInfo.widthInScreens)
    elementInfo.bytesPerIndex = 2
    bin.set(baseOffset)
    // Each set of tiles can be thought of as a 2D array of 2-byte index values
    for (let row = 0; row < elementInfo.rows; row++) {
        const rowTiles = []
        for (let col = 0; col < elementInfo.columns; col++) {
            const tile = bin.read('uint16').toString(16).padStart(4, '0')
            rowTiles.push(tile)
        }
        data.push(rowTiles.join(' '))
    }
    const result = data
    return result
}

function extractCastleMapReveals(bin, elementInfo, baseOffset=0) {
    const data = []
    // Castle map reveal data is stored serially with a sentinel value of 0xFF to signify termination
    // Each section starts with a header that describes how much additional data is read for that particular section
    bin.set(toVal(baseOffset))
    elementInfo.footprint = 0
    while (true) {
        const castleMapReveal = {
            left: bin.read('uint8'),
            top: bin.read('uint8'),
            bytesPerRow: bin.read('uint8'),
            rows: bin.read('uint8'),
            grid: [],
        }
        elementInfo.footprint += 4
        for (let row = 0; row < castleMapReveal.rows; row++) {
            let rowData = ''
            for (let byteIndex = 0; byteIndex < castleMapReveal.bytesPerRow; byteIndex++) {
                // For visualization purposes, 0s are replaced with a space and 1s are replaced with a '#'
                const byteData = bin.read('uint8').toString(2).padStart(8, '0').replaceAll('0', ' ').replaceAll('1', '#')
                rowData += byteData.split('').reverse().join('')
                elementInfo.footprint += 1
            }
            castleMapReveal.grid.push(rowData)
        }
        data.push(castleMapReveal)
        if (bin.read('uint8', false) == 0xFF) {
            const bytePadding = 4 - elementInfo.footprint % 4
            elementInfo.footprint += bytePadding
            break
        }
    }
    const result = data[0]
    // While the vanilla game only defines one section, the underlying data format may potentially have support for multiple sections in the future
    // However, for ROM hacking purposes, the total footprint will still be a limiting factor
    return result
}

// TODO(sestren): CLI to extract specific things (for previewing?)
// extract --get abandonedMine.uniqueItemDrops 0x03CE01E4 u16 13
// extract --get bossTeleporters 0x0009817C 20 28  roomX 0x00 u8  roomY 0x04 u8  stageId 0x08 u32  eventId 0x0C s8  teleporterIndex 0x10 s32

// func_800F24F4: falseSaveRoom and finalSaveRoom

export function parseExtractionNode(bin, extractionNode, baseOffset=0, includeData=true, includeMeta=true) {
    // It is assumed that a node that specifies a metadata.element property 
    // will not have any other properties at the same scope as metadata
    let result = {}
    let nodeOffset = baseOffset
    if (extractionNode.hasOwnProperty('metadata')) {
        if (extractionNode.metadata.hasOwnProperty('address')) {
            nodeOffset = getOffset(bin, extractionNode.metadata.address, baseOffset)
        }
        if (extractionNode.metadata.hasOwnProperty('element')) {
            if (includeData) {
                result.data = extractData(bin, extractionNode.metadata.element, nodeOffset)
                if (!includeMeta) {
                    result = result.data
                }
            }
            if (includeMeta) {
                result.metadata = {
                    address: nodeOffset,
                    element: extractionNode.metadata.element,
                }
                if (!includeData) {
                    result = result.metadata
                }
            }
        }
    }
    Object.entries(extractionNode)
    .filter(([nodeName, nodeInfo]) => (
        nodeName != 'metadata' && nodeName != 'data'
    ))
    .forEach(([nodeName, nodeInfo]) => {
        result[nodeName] = parseExtractionNode(bin, nodeInfo, nodeOffset, includeData, includeMeta)
    })
    return result
}
