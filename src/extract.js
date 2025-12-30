
import { Address, GameData, constants, getSizeOfType, toHex } from './common.js'

function extractData(bin, metadata) {
    if ('type' in metadata && metadata.type == 'indexed-bitmap') {
        return extractIndexedBitmap(bin, metadata)
    }
    else if ('type' in metadata && metadata.type == 'binary-string-array') {
        return extractCastleMapReveals(bin, metadata)
    }
    else if (['elementSize', 'elementCount', 'fields'].every(function(propertyName) { return propertyName in metadata })) {
        return extractObjectArray(bin, metadata)
    }
    else if ('elementCount' in metadata) {
        return extractValueArray(bin, metadata)
    }
    else if (['start', 'type'].every(function(propertyName) { return propertyName in metadata })) {
        return extractValue(bin, metadata)
    }
    else {
        return null
    }
}

// IDEA(sestren)
// extract --get abandonedMine.uniqueItemDrops 0x03CE01E4 u16 13
// extract --get bossTeleporters 0x0009817C 20 28  roomX 0x00 u8  roomY 0x04 u8  stageId 0x08 u32  eventId 0x0C s8  teleporterIndex 0x10 s32

function extractValue(bin, metadata) {
    bin.set(metadata.start)
    const data = bin.read(metadata.type)
    const result = {
        metadata: metadata,
        data: data,
    }
    return result
}

function extractValueArray(bin, metadata) {
    const data = []
    metadata.elementSize = getSizeOfType(metadata.type)
    for (let elementId = 0; elementId < metadata.elementCount; elementId++) {
        let elementData = bin.set(metadata.start + elementId * metadata.elementSize).read(metadata.type)
        data.push(elementData)
    }
    const result = {
        metadata: metadata,
        data: data,
    }
    return result
}

function extractObjectArray(bin, metadata) {
    const data = []
    for (let elementId = 0; elementId < metadata.elementCount; elementId++) {
        let elementData = {}
        Object.entries(metadata.fields).forEach(([fieldName, fieldInfo]) => {
            bin.set(metadata.start + elementId * metadata.elementSize + fieldInfo.offset)
            const value = bin.read(fieldInfo.type)
            elementData[fieldName] = value
        })
        data.push(elementData)
    }
    const result = {
        metadata: metadata,
        data: data,
    }
    return result
}

function extractIndexedBitmap(bin, metadata) {
    const data = []
    metadata.indexesPerByte = 2
    metadata.bytesPerRow = Math.floor(metadata.columns / metadata.indexesPerByte)
    bin.set(metadata.start)
    // Bitmap data is typically stored as an array of 4-bit color indexes
    for (let row = 0; row < metadata.rows; row++) {
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

function extractCastleMapReveals(bin, metadata) {
    const data = []
    bin.set(metadata.start)
    // Castle map reveal data is stored serially with a sential value of 0xFF to signify termination
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

export function getExtractionData(bin) {
    const OFFSET = 0x80180000
    let extraction = {
        // baseDropRates: extractBaseDropRates(bin),
        bossTeleporters: extractData(bin, {
            start: 0x0009817C,
            elementSize: 20,
            elementCount: 28,
            fields: {
                roomX: {
                    offset: 0x00,
                    type: 'u8',
                },
                roomY: {
                    offset: 0x04,
                    type: 'u8',
                },
                stageId: {
                    offset: 0x08,
                    type: 'u32',
                },
                eventId: {
                    offset: 0x0C,
                    type: 's8',
                },
                teleporterIndex: {
                    offset: 0x10,
                    type: 's32',
                },
            },
        }),
        castleMap: extractIndexedBitmap(bin, {
            type: 'indexed-bitmap',
            start: 0x001AF800,
            rows: 256,
            columns: 256,
        }),
        castleMapReveals: extractCastleMapReveals(bin, {
            start: 0x0009840C,
            count: 0,
            type: 'binary-string-array',
            footprint: 0,
        }),
        constants: {
            castleMapColorPalettes: {
                dra: extractData(bin, { start: 0x03128800, type: 'rgba32', elementCount: 16 }),
                ric: extractData(bin, { start: 0x0316A800, type: 'rgba32', elementCount: 16 }),
            },
            falseSaveRoom: {
                roomX: extractData(bin, { start: 0x0E7DC8, type: 'u16' }),
                roomY: extractData(bin, { start: 0x0E7DD0, type: 'u16' }),
            },
            shopRelicIds: extractData(bin, { start: 0x03E60CD4, type: 'u16', elementCount: 2 }),
        },
        enemyDefinitions: extractData(bin, {
            start: 0x0009E100,
            elementSize: 40,
            elementCount: 400,
            fields: {
                namePointer: {
                    offset: 0x00,
                    type: 'u32',
                },
                level: {
                    offset: 0x16,
                    type: 'u16',
                },
                rareItemId: {
                    offset: 0x1A,
                    type: 'u16',
                },
                uncommonItemId: {
                    offset: 0x1C,
                    type: 'u16',
                },
                rareItemDropRate: {
                    offset: 0x1E,
                    type: 'u16',
                },
                uncommonItemDropRate: {
                    offset: 0x20,
                    type: 'u16',
                },
                flags: {
                    offset: 0x24,
                    type: 'u32',
                },
            },
        }),
        // entityLayouts: extractEntityLayouts(bin),
        familiarEvents: extractData(bin, {
            start: 0x0392A760,
            elementSize: 48,
            elementCount: 49,
            fields: {
                unknown00: {
                    offset: 0x00,
                    type: 'u32',
                },
                unknown04: {
                    offset: 0x04,
                    type: 'u32',
                },
                servantId: {
                    offset: 0x08,
                    type: 's32',
                },
                roomX: {
                    offset: 0x0C,
                    type: 's32',
                },
                roomY: {
                    offset: 0x10,
                    type: 's32',
                },
                cameraX: {
                    offset: 0x14,
                    type: 's32',
                },
                cameraY: {
                    offset: 0x18,
                    type: 's32',
                },
                condition: {
                    offset: 0x1C,
                    type: 's32',
                },
                delay: {
                    offset: 0x20,
                    type: 's32',
                },
                entityId: {
                    offset: 0x24,
                    type: 's32',
                },
                params: {
                    offset: 0x28,
                    type: 's32',
                },
                unknown2C: {
                    offset: 0x2C,
                    type: 'u32',
                },
            },
        }),
        stages: {},
        teleporters: extractData(bin, {
            start: 0x00097C5C,
            elementSize: 10,
            elementCount: 131,
            fields: {
                playerX: {
                    offset: 0x00,
                    type: 'u16',
                },
                playerY: {
                    offset: 0x02,
                    type: 'u16',
                },
                room: {
                    offset: 0x04,
                    type: 'u16',
                },
                sourceStageId: {
                    offset: 0x06,
                    type: 'u16',
                },
                targetStageId: {
                    offset: 0x08,
                    type: 'u16',
                },
            },
        }),
    }
    Object.entries(constants).forEach(([stageKey, stageInfo]) => {
        const baseAddress = new Address('GAMEDATA', stageInfo.start)
        extraction.stages[stageKey] = {
            start: stageInfo.start,
            // entitiesOffset: bin.set(baseAddress.gameDataAddress).seek(0x0C).read('uint32') - OFFSET,
            // roomOffset: bin.set(baseAddress.gameDataAddress).seek(0x10).read('uint32') - OFFSET,
            // layoutsOffset: bin.set(baseAddress.gameDataAddress).seek(0x20).read('uint32') - OFFSET,
        }
    })
    extraction.stages.warpRooms.warpDestinations = extractData(
        bin,
        {
            start: extraction.stages.warpRooms.start + constants.warpRooms.offsets.warpDestinations,
            elementSize: 4,
            elementCount: 5,
            fields: {
                roomX: {
                    offset: 0x00,
                    type: 'u16',
                },
                roomY: {
                    offset: 0x02,
                    type: 'u16',
                },
            }
        }
    )
    extraction.stages.reverseWarpRooms.warpDestinations = extractData(
        bin,
        {
            start: extraction.stages.reverseWarpRooms.start + constants.reverseWarpRooms.offsets.warpDestinations,
            elementSize: 4,
            elementCount: 5,
            fields: {
                roomX: {
                    offset: 0x00,
                    type: 'u16',
                },
                roomY: {
                    offset: 0x02,
                    type: 'u16',
                },
            }
        }
    )
    const result = extraction
    return result
}
