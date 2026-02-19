
import { Address, GameData, getSizeOfType, toHex, toVal } from './common.js'

function extractData(bin, elementInfo, offset) {
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

function getOffset(bin, addressInfo, baseOffset) {
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

function extractValue(bin, elementInfo, baseOffset) {
    let data = bin.set(toVal(baseOffset)).read(elementInfo.type)
    elementInfo.size = bin.prevRead.length
    const result = data
    bin.set(toVal(baseOffset) + elementInfo.size)
    return result
}

function extractObject(bin, elementInfo, baseOffset) {
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

function extractArray(bin, elementInfo, baseOffset) {
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

function extractIndexedBitmap(bin, elementInfo, baseOffset) {
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

function extractTilemap(bin, elementInfo, baseOffset) {
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

function extractCastleMapReveals(bin, elementInfo, baseOffset) {
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

export function parseExtractionNode(bin, extractionNode, baseOffset) {
    // It is assumed that a node that specifies a metadata.element property 
    // will not have any other properties at the same scope as metadata
    let result = {}
    let nodeOffset = baseOffset
    if (extractionNode.hasOwnProperty('metadata')) {
        if (extractionNode.metadata.hasOwnProperty('address')) {
            nodeOffset = getOffset(bin, extractionNode.metadata.address, baseOffset)
        }
        if (extractionNode.metadata.hasOwnProperty('element')) {
            result.data = extractData(bin, extractionNode.metadata.element, nodeOffset)
            result.metadata = {
                address: nodeOffset,
                element: extractionNode.metadata.element,
            }
        }
    }
    Object.entries(extractionNode)
    .filter(([nodeName, nodeInfo]) => (
        nodeName != 'metadata' && nodeName != 'data'
    ))
    .forEach(([nodeName, nodeInfo]) => {
        result[nodeName] = parseExtractionNode(bin, nodeInfo, nodeOffset)
    })
    return result
}

export function aliasIndexedNodes(sourceData, aliasesData) {
    let result = {}
    Object.entries(sourceData).forEach(([nodeName, nodeInfo]) => {
        if (aliasesData !== null && aliasesData.hasOwnProperty(nodeName)) {
            const aliasNode = aliasesData[nodeName]
            let leafNodeFound = false
            if (aliasesData[nodeName] !== null) {
                const aliasesLookup = {}
                let hasAliasLookup = false
                Object.entries(aliasNode).forEach(([aliasName, aliasKey]) => {
                    if (typeof aliasKey === 'number') {
                        leafNodeFound = true
                        if (nodeInfo.hasOwnProperty('data')) {
                            hasAliasLookup = true
                            aliasesLookup[aliasName] = aliasKey
                            if (typeof nodeInfo.data[aliasKey] === 'object') {
                                nodeInfo.data[aliasKey]._alias = aliasName
                            }
                        }
                        else {
                            if (typeof nodeInfo[aliasKey] === 'object') {
                                nodeInfo[aliasKey]._alias = aliasName
                            }
                        }
                    }
                })
                if (hasAliasLookup) {
                    if (nodeInfo.hasOwnProperty('data')) {
                        nodeInfo.aliases = aliasesLookup
                    }
                }
            }
            if (leafNodeFound) {
                result[nodeName] = nodeInfo
            }
            else {
                result[nodeName] = aliasIndexedNodes(nodeInfo, aliasNode)
            }
        }
        else {
            result[nodeName] = nodeInfo
        }
    })
    return result
}

export function aliasNodeKeys(sourceData, aliasesData) {
    let result = {}
    Object.entries(sourceData).forEach(([nodeName, nodeInfo]) => {
        let nodeKey = nodeName
        if (aliasesData !== null && typeof aliasesData === 'object') {
            let leafNodeFound = false
            if (nodeInfo.hasOwnProperty("data")) {
                leafNodeFound = true
            }
            Object.entries(aliasesData).forEach(([aliasName, aliasKey]) => {
                if (typeof aliasKey === 'string' && aliasKey == nodeName) {
                    leafNodeFound = true
                    nodeKey = aliasName
                }
            })
            if (leafNodeFound) {
                result[nodeKey] = nodeInfo
            }
            else {
                result[nodeKey] = aliasNodeKeys(nodeInfo, aliasesData[nodeKey])
            }
        }
        else {
            result[nodeKey] = nodeInfo
        }
    })
    return result
}

export function dropNodes(sourceData, nodeNameToDrop) {
    let result = {}
    Object.entries(sourceData).forEach(([nodeName, nodeInfo]) => {
        if (nodeName == nodeNameToDrop) {
            // Drop the node
        }
        else if (['metadata', 'data'].includes(nodeName)) {
            result[nodeName] = nodeInfo
        }
        else {
            result[nodeName] = dropNodes(nodeInfo, nodeNameToDrop)
        }
    })
    return result
}

export function maskNode(nodeInfo, nodeStructure) {
    switch (nodeStructure) {
        case 'binary-string-array':
            nodeInfo = null
            break
        case 'indexed-bitmap':
            for (let row = 0; row < nodeInfo.length; row++) {
                nodeInfo[row] = '.'.repeat(nodeInfo[row].length)
            }
            break
        case 'object':
            Object.keys(nodeInfo).forEach((propertyName) => {
                if (propertyName.at(0) != '_') {
                    nodeInfo[propertyName] = null
                }
            })
            break
        case 'object-array':
            for (let index = 0; index < nodeInfo.length; index++) {
                Object.keys(nodeInfo[index]).forEach((propertyName) => {
                    if (propertyName.at(0) != '_') {
                        nodeInfo[index][propertyName] = null
                    }
                })
            }
            break
        case 'tilemap':
            for (let row = 0; row < nodeInfo.length; row++) {
                const columns = Math.floor((nodeInfo[row].length + 1) / 5)
                
                nodeInfo[row] = ('.... '.repeat(columns)).slice(0, -1)
            }
            break
        case 'value':
            nodeInfo = null
            break
        case 'value-array':
            for (let index = 0; index < nodeInfo.length; index++) {
                nodeInfo[index] = null
            }
            break
        default:
            nodeInfo = null
            break
    }
    return nodeInfo
}

export function maskNodes(sourceData, nodeNameToMask) {
    let result = {}
    Object.entries(sourceData).forEach(([nodeName, nodeInfo]) => {
        if (nodeName == nodeNameToMask) {
            const nodeStructure = sourceData.metadata.element.structure
            result[nodeName] = maskNode(nodeInfo, nodeStructure)
        }
        else if (['metadata', 'data', 'aliases'].includes(nodeName)) {
            result[nodeName] = nodeInfo
        }
        else {
            result[nodeName] = maskNodes(nodeInfo, nodeNameToMask)
        }
    })
    return result
}

export function promoteNodes(sourceData, nodeNameToPromote) {
    let result = {}
    Object.entries(sourceData).forEach(([nodeName, nodeInfo]) => {
        if (nodeName == nodeNameToPromote) {
            result = nodeInfo
        }
        else if (['metadata', 'data'].includes(nodeName)) {
            result[nodeName] = nodeInfo
        }
        else {
            result[nodeName] = promoteNodes(nodeInfo, nodeNameToPromote)
        }
    })
    return result
}