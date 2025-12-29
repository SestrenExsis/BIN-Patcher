
import { Address, GameData, constants, toHex } from './common.js'

function extractArray(bin, metadata) {
    const array = {
        metadata: metadata,
        data: [],
    }
    for (let elementId = 0; elementId < metadata.elementCount; elementId++) {
        let elementData = {}
        Object.entries(metadata.fields).forEach(([fieldName, fieldInfo]) => {
            bin.set(metadata.start + elementId * metadata.elementSize + fieldInfo.offset)
            const value = bin.read(fieldInfo.type)
            elementData[fieldName] = value
        })
        array.data.push(elementData)
    }
    const result = array
    return result
}

function extractIndexedBitmap(bin, start, rows, columns) {
    const indexesPerByte = 2
    const indexedBitmap = {
        metadata: {
            start: start,
            rows: rows,
            columns: columns,
            indexesPerByte: indexesPerByte,
            bytesPerRow: Math.floor(columns / indexesPerByte),
            type: 'indexed-bitmap',
        },
        data: [],
    }
    bin.set(indexedBitmap.metadata.start)
    // Bitmap data is typically stored as an array of 4-bit color indexes
    for (let row = 0; row < indexedBitmap.metadata.rows; row++) {
        let rowData = ''
        for (let byteIndex = 0; byteIndex < indexedBitmap.metadata.bytesPerRow; byteIndex++) {
            // Each byte contains 2 of the color indexes
            const byteData = bin.read('uint8').toString(16).padStart(2, '0')
            // The "left" nibble of the byte refers to the "right" color index, and vice versa
            rowData += byteData[1] + byteData[0]
        }
        indexedBitmap.data.push(rowData)
    }
    const result = indexedBitmap
    return result
}

function extractCastleMapReveals(bin) {
    const castleMapReveals = {
        metadata: {
            start: 0x0009840C,
            count: 0,
            type: 'binary-string-array',
            footprint: 0,
        },
        data: [],
    }
    bin.set(castleMapReveals.metadata.start)
    // Castle map reveal data is stored serially with a sential value of 0xFF to signify termination
    // Each section starts with a header that describes how much additional data is read for that particular section
    // While the vanilla game only defines one section, the underlying data format has support for multiple sections
    // However, for ROM hacking purposes, the total footprint will still be a limiting factor
    while (true) {
        const castleMapReveal = {
            left: bin.read('uint8'),
            top: bin.read('uint8'),
            bytesPerRow: bin.read('uint8'),
            rows: bin.read('uint8'),
            grid: [],
        }
        castleMapReveals.metadata.footprint += 4
        for (let row = 0; row < castleMapReveal.rows; row++) {
            let rowData = ''
            for (let byteIndex = 0; byteIndex < castleMapReveal.bytesPerRow; byteIndex++) {
                // For visualization purposes, 0s are replaced with a space and 1s are replaced with a '#'
                const byteData = bin.read('uint8').toString(2).padStart(8, '0').replaceAll('0', ' ').replaceAll('1', '#')
                rowData += byteData.split('').reverse().join('')
                castleMapReveals.metadata.footprint += 1
            }
            castleMapReveal.grid.push(rowData)
        }
        castleMapReveals.data.push(castleMapReveal)
        if (bin.read('uint8', false) == 0xFF) {
            const bytePadding = 4 - castleMapReveals.metadata.footprint % 4
            castleMapReveals.metadata.footprint += bytePadding
            break
        }
    }
    castleMapReveals.metadata.count = castleMapReveals.data.length
    const result = castleMapReveals
    return result
}

export function getExtractionData(bin) {
    const OFFSET = 0x80180000
    let extraction = {
        // baseDropRates: extractBaseDropRates(bin),
        bossTeleporters: extractArray(bin, {
            start: 0x0009817C,
            elementSize: 20,
            elementCount: 28,
            fields: {
                roomX: {
                    offset: 0x00,
                    type: 'uint8',
                },
                roomY: {
                    offset: 0x04,
                    type: 'uint8',
                },
                stageId: {
                    offset: 0x08,
                    type: 'uint32',
                },
                eventId: {
                    offset: 0x0C,
                    type: 'int8',
                },
                teleporterIndex: {
                    offset: 0x10,
                    type: 'int32',
                },
            },
        }),
        castleMap: extractIndexedBitmap(bin, 0x001AF800, 256, 256),
        castleMapReveals: extractCastleMapReveals(bin),
        // constants: extractConstants(bin),
        // enemyDefinitions: extractEnemyDefinitions(bin),
        // entityLayouts: extractEntityLayouts(bin),
        familiarEvents: extractArray(bin, {
            start: 0x0392A760,
            elementSize: 48,
            elementCount: 49,
            fields: {
                unknown00: {
                    offset: 0x00,
                    type: 'uint32',
                },
                unknown04: {
                    offset: 0x04,
                    type: 'uint32',
                },
                servantId: {
                    offset: 0x08,
                    type: 'int32',
                },
                roomX: {
                    offset: 0x0C,
                    type: 'int32',
                },
                roomY: {
                    offset: 0x10,
                    type: 'int32',
                },
                cameraX: {
                    offset: 0x14,
                    type: 'int32',
                },
                cameraY: {
                    offset: 0x18,
                    type: 'int32',
                },
                condition: {
                    offset: 0x1C,
                    type: 'int32',
                },
                delay: {
                    offset: 0x20,
                    type: 'int32',
                },
                entityId: {
                    offset: 0x24,
                    type: 'int32',
                },
                params: {
                    offset: 0x28,
                    type: 'int32',
                },
                unknown2C: {
                    offset: 0x2C,
                    type: 'uint32',
                },
            },
        }),
        stages: {},
        teleporters: extractArray(bin, {
            start: 0x00097C5C,
            elementSize: 10,
            elementCount: 131,
            fields: {
                playerX: {
                    offset: 0x00,
                    type: 'uint16',
                },
                playerY: {
                    offset: 0x02,
                    type: 'uint16',
                },
                room: {
                    offset: 0x04,
                    type: 'uint16',
                },
                sourceStageId: {
                    offset: 0x06,
                    type: 'uint16',
                },
                targetStageId: {
                    offset: 0x08,
                    type: 'uint16',
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
    extraction.stages.warpRooms.warpDestinations = extractArray(
        bin,
        {
            start: extraction.stages.warpRooms.start + constants.warpRooms.offsets.warpDestinations,
            elementSize: 4,
            elementCount: 5,
            fields: {
                roomX: {
                    offset: 0x00,
                    type: 'uint16',
                },
                roomY: {
                    offset: 0x02,
                    type: 'uint16',
                },
            }
        }
    )
    extraction.stages.reverseWarpRooms.warpDestinations = extractArray(
        bin,
        {
            start: extraction.stages.reverseWarpRooms.start + constants.reverseWarpRooms.offsets.warpDestinations,
            elementSize: 4,
            elementCount: 5,
            fields: {
                roomX: {
                    offset: 0x00,
                    type: 'uint16',
                },
                roomY: {
                    offset: 0x02,
                    type: 'uint16',
                },
            }
        }
    )
    const result = extraction
    return result
}
