
import { Address, GameData, constants, toHex } from './common.js'

function extractCastleMap(bin) {
    const castleMap = {
        metadata: {
            start: 0x001AF800,
            rows: 256,
            columns: 128,
            type: 'indexed-bitmap',
        },
        data: [],
    }
    bin.set(castleMap.metadata.start)
    // Castle map data is stored as an array of 4-bit color indexes
    for (let row = 0; row < castleMap.metadata.rows; row++) {
        let rowData = ''
        for (let col = 0; col < castleMap.metadata.columns; col++) {
            // Each byte contains 2 of the color indexes
            const colData = bin.read('uint8').toString(16).padStart(2, '0')
            // The "left" nibble of the byte refers to the "right" color index, and vice versa
            rowData += colData[1] + colData[0]
        }
        castleMap.data.push(rowData)
    }
    const result = castleMap
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
        stages: {},
        castleMap: extractCastleMap(bin),
        castleMapReveals: extractCastleMapReveals(bin),
    }
    Object.entries(constants).forEach(([stageKey, stageInfo]) => {
        // name: 'Alchemy Laboratory',
        // start: 0x049BE800,
        // size: 0x04B780,
        // offsets: {
        //     baseDropRate: 0x18C0,
        // }
        const baseAddress = new Address('GAMEDATA', stageInfo.start)
        extraction.stages[stageKey] = {
            entitiesOffset: bin.set(baseAddress.gameDataAddress).seek(0x0C).read('uint32') - OFFSET,
            roomOffset: bin.set(baseAddress.gameDataAddress).seek(0x10).read('uint32') - OFFSET,
            layoutsOffset: bin.set(baseAddress.gameDataAddress).seek(0x20).read('uint32') - OFFSET,
        }
    })
    const result = extraction
    return result
}
