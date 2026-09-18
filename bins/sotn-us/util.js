import yargs from 'yargs'
import fs from 'fs'
import crypto from 'crypto'

import {
    ALIASED_TYPES,
    Address,
    GameData,
    toHex,
    toVal,
} from '../../src/common.js'

import {
    BASE_DROP_RATES,
    FAMILIAR_OVERLAYS,
    MUSIC,
    STAGES,
    UNIQUE_ITEM_DROPS,
    getChangeDependencies,
} from './sotn-us.js'

export class CutsceneInstruction {
    constructor(bin) {
        this.startAddress = new Address('GAMEDATA', bin.cursor.gameDataAddress)
        const firstByte = bin.read('u8')
        // this.index = 0
        this.instruction = 'unknown'
        this.arguments = []
        this.hex = toHex(firstByte, 2).slice(2)
        this.size = 0
        if (firstByte >= 0x00 && firstByte <= 0x18) {
            switch (firstByte) {
                case 0x00:
                    this.instruction = 'end'
                    break
                case 0x01:
                    this.instruction = 'line'
                    break
                case 0x02:
                    this.arguments.push(bin.read('u8'))
                    this.instruction = `delay`
                    break
                case 0x03:
                    this.arguments.push(bin.read('u8'))
                    this.instruction = `pause`
                    break
                case 0x04:
                    this.instruction = 'hideDialog'
                    break
                case 0x05:
                    this.arguments.push(bin.read('u8'))
                    this.arguments.push(bin.read('u8'))
                    this.instruction = `setPortrait`
                    break
                case 0x06:
                    this.instruction = 'nextDialog'
                    break
                case 0x07:
                    this.arguments.push(bin.read('u8'))
                    this.arguments.push(bin.read('u8'))
                    this.instruction = `setPosition`
                    break
                case 0x08:
                    this.instruction = 'closeDialog'
                    break
                case 0x09:
                    this.arguments.push(bin.read('u8'))
                    this.arguments.push(bin.read('u8'))
                    this.instruction = `playSound`
                    break
                case 0x0A:
                    this.instruction = 'waitForSound'
                    break
                case 0x0B:
                    this.instruction = 'unknown0B'
                    break
                case 0x0C:
                    this.arguments.push(bin.read('u8'))
                    this.arguments.push(bin.read('u8'))
                    this.arguments.push(bin.read('u8'))
                    this.arguments.push(bin.read('u8'))
                    this.instruction = `setEnd`
                    break
                case 0x0D:
                    this.instruction = 'unknown0D'
                    break
                case 0x0E:
                    this.arguments.push(bin.read('u8'))
                    this.arguments.push(bin.read('u8'))
                    this.arguments.push(bin.read('u8'))
                    this.arguments.push(bin.read('u8'))
                    this.arguments.push(bin.read('u8'))
                    this.arguments.push(bin.read('u8'))
                    this.arguments.push(bin.read('u8'))
                    this.arguments.push(bin.read('u8'))
                    this.instruction = `unknown0E`
                    break
                case 0x0F:
                    this.arguments.push(bin.read('u8'))
                    this.arguments.push(bin.read('u8'))
                    this.arguments.push(bin.read('u8'))
                    this.arguments.push(bin.read('u8'))
                    this.instruction = `unknown0F`
                    break
                case 0x10:
                    this.arguments.push(bin.read('u8'))
                    this.instruction = `waitForFlag`
                    break
                case 0x11:
                    this.arguments.push(bin.read('u8'))
                    this.instruction = `setFlag`
                    break
                case 0x12:
                    this.instruction = 'unknown12'
                    break
                case 0x13:
                    this.arguments.push(bin.read('u8'))
                    this.arguments.push(bin.read('u8'))
                    this.arguments.push(bin.read('u8'))
                    this.arguments.push(bin.read('u8'))
                    this.arguments.push(bin.read('u8'))
                    this.instruction = `loadPortrait`
                    break
                case 0x14:
                    this.arguments.push(bin.read('u8'))
                    this.arguments.push(bin.read('u8'))
                    this.instruction = `unknown14`
                    break
                case 0x15:
                    this.instruction = 'unknown15'
                    break
                case 0x16:
                    this.arguments.push(bin.read('u8'))
                    this.instruction = `unknown16`
                    break
                case 0x17:
                    this.instruction = 'unknown17'
                    break
                case 0x18:
                    this.arguments.push(bin.read('u8'))
                    this.instruction = `waitForFlagReset`
                    break
                default:
                    break
            }
            this.size = 1 + this.arguments.length
            this.hex += ' ' + this.arguments.map((value) => {
                return toHex(value, 2).slice(2)
            }).join(' ')
        }
        else if (firstByte >= 0x20 && firstByte <= 0x7e) {
            this.instruction = 'text'
            const chars = []
            chars.push(String.fromCharCode(firstByte))
            while (bin.read('u8', false) >= 0x20 && bin.read('u8', false) <= 0x7e) {
                const nextByte = bin.read('u8')
                this.hex += ' ' + toHex(nextByte, 2).slice(2)
                chars.push(String.fromCharCode(nextByte))
            }
            this.size = chars.length
            this.arguments.push(chars.join(''))
        }
        else {
            this.instruction = 'invalid'
            this.size = -1
        }
    }

    valueOf() {
        const sectorPosition = this.startAddress.toGameDataAddress(0) % Address.sectorDataSize
        return {
            // index: this.index,
            arguments: this.arguments,
            // sectorStart: sectorPosition,
            // sectorEnd: sectorPosition + this.size,
            crossesSectorBoundary: ((sectorPosition + this.size) > Address.sectorDataSize),
            hex: this.hex,
            instruction: this.instruction,
            size: this.size,
            startAddress: this.startAddress.valueOf(),
        }
    }
}

const argv = yargs(process.argv.slice(2))
    .command({ // extract
        command: 'extract',
        describe: 'Generate an extraction template for SOTN',
        builder: (yargs) => {
            return yargs
            .option('template', {
                alias: 't',
                describe: 'JSON file describing the initial layout of the extraction template',
                type: 'string',
                normalize: true,
                default: './bins/sotn-us/data/extraction-template.json',
            })
            .option('out', {
                alias: 'o',
                describe: 'Path to the output file to create',
                type: 'string',
                normalize: true,
                default: './build/sotn-us/extraction-processed.json',
            })
            .option('previous', {
                alias: 'p',
                describe: 'Path to a previously-generated extraction file (allows introspection into extracted data)',
                type: 'string',
                normalize: true,
            })
            .demandOption(['template', 'out'])
        },
        handler: (argv) => {
            const source = JSON.parse(fs.readFileSync(argv.template, 'utf8'))
            const previous = (argv.previous) ? JSON.parse(fs.readFileSync(argv.previous, 'utf8')) : {}
            // familiarEvents
            source.familiarEvents = {}
            Object.entries(FAMILIAR_OVERLAYS)
            .forEach(([familiarName, familiarAddress]) => {
                source.familiarEvents[familiarName] = {
                    metadata: {
                        address: {
                            method: 'absolute',
                            value: familiarAddress,
                        },
                        element: {
                            structure: 'object-array',
                            size: 48,
                            constraint: {
                                method: 'elementCount',
                                elementCount: 49,
                            },
                            properties: {
                                '0x00': {
                                    offset: '0x00',
                                    type: 'u32',
                                },
                                '0x04': {
                                    offset: '0x04',
                                    type: 'u32',
                                },
                                servantId: {
                                    offset: '0x08',
                                    type: 's32',
                                },
                                roomX: {
                                    offset: '0x0C',
                                    type: 's32',
                                },
                                roomY: {
                                    offset: '0x10',
                                    type: 's32',
                                },
                                cameraX: {
                                    offset: '0x14',
                                    type: 's32',
                                },
                                cameraY: {
                                    offset: '0x18',
                                    type: 's32',
                                },
                                condition: {
                                    offset: '0x1C',
                                    type: 's32',
                                },
                                delay: {
                                    offset: '0x20',
                                    type: 's32',
                                },
                                entityId: {
                                    offset: '0x24',
                                    type: 's32',
                                },
                                params: {
                                    offset: '0x28',
                                    type: 's32',
                                },
                                '0x2C': {
                                    offset: '0x2C',
                                    type: 'u32',
                                },
                            },
                        },
                    },
                }
            })
            // stages.STAGE_NAME.constants.music.EVENT_NAME
            Object.entries(MUSIC)
            .forEach(([stageName, stageInfo]) => {
                let context = source.stages
                // stages.STAGE_NAME.constants.music.EVENT_NAME
                if (!(stageName in context)) {
                    context[stageName] = {}
                }
                context = context[stageName]
                // stages.STAGE_NAME.constants.music.EVENT_NAME
                if (!('constants' in context)) {
                    context.constants = {}
                }
                context = context.constants
                // stages.STAGE_NAME.constants.music.EVENT_NAME
                if (!('music' in context)) {
                    context.music = {}
                }
                context = context.music
                // stages.STAGE_NAME.constants.music.EVENT_NAME
                Object.entries(MUSIC[stageName])
                .forEach(([eventName, offset]) => {
                    context[eventName] = {
                        metadata: {
                            address: {
                                value: offset,
                                method: 'relative',
                            },
                            element: {
                                structure: 'value',
                                type: 'music-id',
                            },
                        },
                    }
                })
            })
            Object.entries(STAGES)
            .forEach(([stageName, stageOffset]) => {
                // stages.STAGE_NAME
                if (!(stageName in source.stages)) {
                    source.stages[stageName] = {}
                }
                // stages.STAGE_NAME.metadata
                if (!('metadata' in source.stages[stageName])) {
                    source.stages[stageName].metadata = {
                        address: {
                            value: STAGES[stageName],
                            method: 'absolute',
                        },
                    }
                }
                // stages.STAGE_NAME.constants
                if (!('constants' in source.stages[stageName])) {
                    source.stages[stageName].constants = {}
                }
                // stages.STAGE_NAME.constants.baseDropRates
                if (stageName in BASE_DROP_RATES) {
                    source.stages[stageName].constants.baseDropRates = {
                        metadata: {
                            address: {
                                value: BASE_DROP_RATES[stageName],
                                method: 'relative',
                            },
                            element: {
                                structure: 'value-array',
                                constraint: {
                                    method: 'elementCount',
                                    elementCount: 4,
                                },
                                type: 'u8',
                            }
                        },
                    }
                }
                // stages.STAGE_NAME.constants.uniqueItemDrops
                if (stageName in UNIQUE_ITEM_DROPS) {
                    source.stages[stageName].constants.uniqueItemDrops = {
                        metadata: {
                            address: {
                                value: UNIQUE_ITEM_DROPS[stageName].offset,
                                method: 'relative',
                            },
                            element: {
                                structure: 'value-array',
                                constraint: {
                                    method: 'elementCount',
                                    elementCount: UNIQUE_ITEM_DROPS[stageName].elementCount,
                                },
                                type: 'item-drop-id',
                            }
                        },
                    }
                }
                // stages.STAGE_NAME.rooms
                if (!('rooms' in source.stages[stageName])) {
                    source.stages[stageName].rooms = {
                        metadata: {
                            address: {
                                method: 'indirect',
                                value: '0x000010',
                                type: 'u32',
                                base: '0x80180000',
                            },
                            element: {
                                structure: 'object-array',
                                size: 8,
                                constraint: {
                                    method: 'sentinelValues',
                                    sentinelValues: [
                                        {
                                            value: '0x40',
                                            type: 'u8',
                                        },
                                    ],
                                },
                                postProcessing: [
                                    {
                                        process: 'calculateDerivedValue',
                                        propertyName: '_rows',
                                        actions: [
                                            {
                                                action: 'get',
                                                type: 'property',
                                                property: 'bottom',
                                            },
                                            {
                                                action: 'add',
                                                type: 'constant',
                                                constant: 1,
                                            },
                                            {
                                                action: 'subtract',
                                                type: 'property',
                                                property: 'top',
                                            }
                                        ],
                                    },
                                    {
                                        process: 'calculateDerivedValue',
                                        propertyName: '_columns',
                                        actions: [
                                            {
                                                action: 'get',
                                                type: 'property',
                                                property: 'right',
                                            },
                                            {
                                                action: 'add',
                                                type: 'constant',
                                                constant: 1,
                                            },
                                            {
                                                action: 'subtract',
                                                type: 'property',
                                                property: 'left',
                                            }
                                        ],
                                    },
                                ],
                                properties: {
                                    left: {
                                        offset: '0x00',
                                        type: 'u8',
                                    },
                                    top: {
                                        offset: '0x01',
                                        type: 'u8',
                                    },
                                    right: {
                                        offset: '0x02',
                                        type: 'u8',
                                    },
                                    bottom: {
                                        offset: '0x03',
                                        type: 'u8',
                                    },
                                    tileLayoutId: {
                                        offset: '0x04',
                                        type: 'u8',
                                    },
                                    tilesetId: {
                                        offset: '0x05',
                                        type: 's8',
                                    },
                                    objectGraphicsId: {
                                        offset: '0x06',
                                        type: 'u8',
                                    },
                                    objectLayoutId: {
                                        offset: '0x07',
                                        type: 'u8',
                                    },
                                },
                            },
                        }
                    }
                }
                // stages.STAGE_NAME.layers
                if (!('layers' in source.stages[stageName])) {
                    source.stages[stageName].layers = {}
                }
                // stages.STAGE_NAME.entities
                if (!('entities' in source.stages[stageName])) {
                    source.stages[stageName].entities = {}
                }
                // stages.STAGE_NAME.entities.layoutOffsets
                if (!('layoutOffsets' in source.stages[stageName].entities)) {
                    source.stages[stageName].entities.layoutOffsets = {
                        metadata: {
                            address: {
                                method: 'indirect',
                                value: '0x00000C',
                                type: 'u32',
                                base: '0x80180000',
                            },
                            element: {
                                structure: 'object',
                                size: '0x2A',
                                properties: {
                                    horizontalEntities: {
                                        offset: '0x1C',
                                        type: 'u16',
                                    },
                                    verticalEntities: {
                                        offset: '0x28',
                                        type: 'u16',
                                    },
                                },
                            },
                        },
                    }
                }
                const previousStageInfo = previous?.stages?.[stageName]
                if (previousStageInfo) {
                    // stages.STAGE_NAME.layers.roomDefinitions
                    previousStageInfo.rooms.data
                    .filter((room) => {
                        return room.tilesetId !== -1
                    })
                    .forEach((room, roomIndex, rooms) => {
                        source.stages[stageName].layers.roomDefinitions = {
                            metadata: {
                                address: {
                                    method: 'indirect',
                                    value: '0x000020',
                                    type: 'u32',
                                    base: '0x80180000',
                                },
                                element: {
                                    structure: 'object-array',
                                    size: 8,
                                    constraint: {
                                        method: 'elementCount',
                                        elementCount: rooms.length,
                                    },
                                    properties: {
                                        foreground: {
                                            offset: '0x00',
                                            type: 'zone-offset'
                                        },
                                        background: {
                                            offset: '0x04',
                                            type: 'zone-offset'
                                        },
                                    },
                                },
                            },
                        }
                    })
                    // stages.STAGE_NAME.layers.layerDefinitions
                    const roomDefinitions = previousStageInfo.layers.roomDefinitions
                    if (roomDefinitions?.data) {
                        let minLayerDefinition = Number.MAX_SAFE_INTEGER
                        let maxLayerDefinition = Number.MIN_SAFE_INTEGER
                        roomDefinitions.data
                        .forEach((roomDefinition) => {
                            const bg = parseInt(roomDefinition.background, 16)
                            const fg = parseInt(roomDefinition.foreground, 16)
                            minLayerDefinition = Math.min(minLayerDefinition, bg, fg)
                            maxLayerDefinition = Math.max(maxLayerDefinition, bg, fg)
                        })
                        if (minLayerDefinition > Number.MIN_SAFE_INTEGER && maxLayerDefinition < Number.MAX_SAFE_INTEGER) {
                            source.stages[stageName].layers.layerDefinitions = {
                                metadata: {
                                    address: {
                                        method: 'relative',
                                        value: minLayerDefinition,
                                    },
                                    element: {
                                        structure: 'object-array',
                                        size: 16,
                                        constraint: {
                                            method: 'elementCount',
                                            elementCount: 1 + Math.floor((maxLayerDefinition - minLayerDefinition) / 16),
                                        },
                                        properties: {
                                            tilesOffset: {
                                                offset: '0x00',
                                                type: 'zone-offset',
                                            },
                                            defsOffset: {
                                                offset: '0x04',
                                                type: 'zone-offset',
                                            },
                                            layoutRect: {
                                                offset: '0x08',
                                                type: 'layout-rect',
                                            },
                                            _layoutRect: {
                                                offset: '0x08',
                                                type: 'u32',
                                            },
                                            zPriority: {
                                                offset: '0x0C',
                                                type: 'u16',
                                            },
                                            flags: {
                                                offset: '0x0E',
                                                type: 'u16',
                                            },
                                        },
                                    },
                                },
                            }
                        }
                    }
                    // stages.STAGE_NAME.tilemaps
                    const layerDefinitions = previousStageInfo.layers.layerDefinitions
                    if (layerDefinitions?.data) {
                        const tilemaps = {}
                        layerDefinitions.data
                        .filter((layerDefinition) => {
                            return layerDefinition.tilesOffset && layerDefinition.tilesOffset !== 'NULL'
                        })
                        .forEach((layerDefinition) => {
                            const tilemapId = layerDefinition.tilesOffset
                            const layoutRect = layerDefinition.layoutRect
                            tilemaps[tilemapId] = {
                                metadata: {
                                    address: {
                                        method: 'relative',
                                        value: tilemapId,
                                    },
                                    element: {
                                        structure: 'tilemap',
                                        heightInScreens: 1 + (layoutRect.bottom - layoutRect.top),
                                        widthInScreens: 1 + (layoutRect.right - layoutRect.left),
                                    },
                                },
                            }
                        })
                        source.stages[stageName].tilemaps = tilemaps
                    }
                    // stages.STAGE_NAME.entities.horizontalRows, stages.STAGE_NAME.entities.verticalRows
                    const layoutOffsets = previousStageInfo.entities.layoutOffsets
                    const horizontalOffset = layoutOffsets.data.horizontalEntities
                    const verticalOffset = layoutOffsets.data.verticalEntities
                    if (horizontalOffset && verticalOffset) {
                        const entityRowCount = Math.floor((verticalOffset - horizontalOffset) / 4)
                        source.stages[stageName].entities.horizontalRows = {
                            metadata: {
                                address: {
                                    method: 'relative',
                                    value: horizontalOffset,
                                    type: 'u32',
                                },
                                element: {
                                    structure: 'value-array',
                                    constraint: {
                                        method: 'elementCount',
                                        elementCount: entityRowCount,
                                    },
                                    type: 'u32',
                                }
                            }
                        }
                        source.stages[stageName].entities.verticalRows = {
                            metadata: {
                                address: {
                                    method: 'relative',
                                    value: verticalOffset,
                                    type: 'u32',
                                },
                                element: {
                                    structure: 'value-array',
                                    constraint: {
                                        method: 'elementCount',
                                        elementCount: entityRowCount,
                                    },
                                    type: 'u32',
                                }
                            }
                        }
                        const horizontalRows = previousStageInfo.entities.horizontalRows?.data
                        const verticalRows = previousStageInfo.entities.verticalRows?.data
                        if (horizontalRows && verticalRows) {
                            const horizontalStart = Math.min(...horizontalRows)
                            const verticalStart = Math.min(...verticalRows)
                            const entityCount = Math.floor((verticalStart - horizontalStart) / 10)
                            const entityTables = [
                                {
                                    propertyName: 'horizontal',
                                    addressStart: horizontalStart,
                                },
                                {
                                    propertyName: 'vertical',
                                    addressStart: verticalStart,
                                },
                            ]
                            entityTables
                            .forEach((entityTable) => {
                                source.stages[stageName].entities[entityTable.propertyName] = {
                                    metadata: {
                                        address: {
                                            method: 'relative',
                                            value: entityTable.addressStart - 0x80180000,
                                            type: 'u32',
                                        },
                                        element: {
                                            structure: 'object-array',
                                            size: 10,
                                            constraint: {
                                                method: 'elementCount',
                                                elementCount: entityCount,
                                            },
                                            properties: {
                                                x: {
                                                    offset: '0x00',
                                                    type: 's16',
                                                },
                                                y: {
                                                    offset: '0x02',
                                                    type: 's16',
                                                },
                                                entityTypeId: {
                                                    offset: '0x04',
                                                    type: 'u16',
                                                },
                                                entityRoomIndex: {
                                                    offset: '0x06',
                                                    type: 'u16',
                                                },
                                                params: {
                                                    offset: '0x08',
                                                    type: 'u16',
                                                },
                                            },
                                        },
                                    },
                                }
                            })
                            // After processing 70 elements in Marble Gallery's entity layout table, add 12 bytes of padding
                            // - Marble Gallery has 12 bytes of what appear to be garbage data in the middle of the entity layout table
                            // - In order to process the entity layout table as one contiguous piece of data, these bytes need to be ignored
                            // [350:356] = (2B42, 8018, 2B7E, 8018, 2BB0, 8018)
                            if (stageName === 'marbleGallery') {
                                source.stages[stageName].entities.vertical.metadata.element.postProcessing = [
                                    {
                                        process: 'paddingAfterElement',
                                        whenArrayLength: 70,
                                        paddingAmount: 12,
                                    },
                                ]
                                source.stages[stageName].entities.horizontal.metadata.element.postProcessing = [
                                    {
                                        process: 'paddingAfterElement',
                                        whenArrayLength: 70,
                                        paddingAmount: 12,
                                    },
                                ]
                            }
                        }
                    }
                }
            })
            // ...
            fs.writeFileSync(argv.out, JSON.stringify(source, null, 4))
        }
    })
    .command({ // dependencies
        command: 'dependencies',
        describe: 'Generate a change dependencies file for SOTN',
        builder: (yargs) => {
            return yargs
            .option('template', {
                alias: 't',
                describe: 'JSON file describing the initial layout of the change dependencies template',
                type: 'string',
                normalize: true,
                default: './bins/sotn-us/data/change-dependencies-template.json',
            })
            .option('out', {
                alias: 'o',
                describe: 'Path to the output file to create',
                type: 'string',
                normalize: true,
                default: './build/sotn-us/change-dependencies.json',
            })
            .demandOption(['template', 'out'])
        },
        handler: (argv) => {
            const source = JSON.parse(fs.readFileSync(argv.template, 'utf8'))
            const target = getChangeDependencies(source)
            fs.writeFileSync(argv.out, JSON.stringify(target, null, 4))
        }
    })
    .command({ // alias
        command: 'alias',
        describe: 'Reformat room names for stage in alias file',
        builder: (yargs) => {
            return yargs
        },
        handler: (argv) => {
            let aliasData = JSON.parse(fs.readFileSync('./build/alias.json', 'utf8'))
            console.log('stages:')
            Object.entries(aliasData).forEach(([stageName, aliasInfo]) => {
                let stageProperty = stageName
                    .replaceAll(" to ", " To ")
                    .replaceAll(" of ", " Of ")
                    .replaceAll(" and ", " And ")
                    .replaceAll(" ID ", " Id ")
                    .replaceAll("'", '')
                    .replaceAll('-', '')
                    .replaceAll(' ', '')
                stageProperty = stageProperty.at(0).toLowerCase() + stageProperty.slice(1)
                console.log(`    ${stageProperty}:`)
                console.log('        rooms:')
                Object.entries(aliasInfo).forEach(([roomName, roomKey]) => {
                    let roomProperty = roomName
                        .replaceAll("Fake Room with", "trigger")
                        .replaceAll(" to ", " To ")
                        .replaceAll(" of ", " Of ")
                        .replaceAll(" and ", " And ")
                        .replaceAll(" ID ", " Id ")
                        .replaceAll("'", '')
                        .replaceAll('-', '')
                        .replaceAll(' ', '')
                    roomProperty = roomProperty.at(0).toLowerCase() + roomProperty.slice(1)
                    console.log(`            ${roomProperty}: ${roomKey}`)
                })
            })
        }
    })
    .command({ // stage
        command: 'stage',
        describe: 'Construct rooms data for a given stage for the change dependencies template',
        builder: (yargs) => {
            return yargs
            .option('property', {
                alias: 'p',
                describe: 'Stage property (e.g., alchemyLaboratory)',
                type: 'string',
            })
            .demandOption(['property'])
        },
        handler: (argv) => {
            let extractionData = JSON.parse(fs.readFileSync('./build/sotn-us/extraction-aliased.json', 'utf8'))
            console.log('    rooms:')
            Object.entries(extractionData.stages)
            .forEach(([stageName, stageInfo]) => {
                if (stageName != argv.property) {
                    return;
                }
                console.log(`        '${stageName}': {`)
                Object.entries(stageInfo.rooms.aliases)
                .forEach(([roomName, roomIndex]) => {
                    console.log(`            '${roomName}': [`)
                    const roomInfo = stageInfo.rooms.data[roomIndex]
                    Object.entries(stageInfo.layers.layerDefinitions.aliases)
                    .forEach(([layerName, layerIndex]) => {
                        const layerInfo = stageInfo.layers.layerDefinitions.data[layerIndex]
                        if (
                            (layerInfo.layoutRect.left === roomInfo.left) &&
                            (layerInfo.layoutRect.top === roomInfo.top) &&
                            (layerInfo.layoutRect.right === roomInfo.right) &&
                            (layerInfo.layoutRect.bottom === roomInfo.bottom)
                        ) {
                            console.log(`                '${layerName}',`)
                        }
                    })
                    console.log(`            ],`)
                })
                console.log(`        },`)
                // stageInfo.layers.layerDefinitions.data.filter((layerDefinition) => {
                //     return (
                //         layerDefinition.left !== 0 ||
                //         layerDefinition.top !== 0 ||
                //         layerDefinition.right !== 0 ||
                //         layerDefinition.bottom !== 0 ||
                //         layerDefinition.flags !== 0 ||
                //         layerDefinition.tilesOffset !== 'NULL'
                //     )
                // }).map((layerDefinition, index) => {
                //     let roomAlias = 'unknown' + index
                //     const possibleIndexes = []
                //     Object.values(stageInfo.rooms.data).filter((roomInfo) => {
                //         return (
                //             roomInfo.hasOwnProperty('_alias') &&
                //             roomInfo.left === layerDefinition.layoutRect.left &&
                //             roomInfo.top === layerDefinition.layoutRect.top &&
                //             roomInfo.right === layerDefinition.layoutRect.right &&
                //             roomInfo.bottom === layerDefinition.layoutRect.bottom
                //         )
                //     }).map((roomInfo) => {
                //         roomAlias = roomInfo._alias
                //         possibleIndexes.push(layerDefinition._elementIndex)
                //     })
                //     if (possibleIndexes.length > 0) {
                //         console.log(`                ${roomAlias}: ${possibleIndexes.join(', ')}`)
                //     }
                // })
            })
        }
    })
    .command({ // tilemap
        command: 'tilemap',
        describe: 'Search for matching stage info for tilemaps',
        builder: (yargs) => {
            return yargs
            .option('property', {
                alias: 'p',
                describe: 'Stage property (e.g., alchemyLaboratory)',
                type: 'string',
            })
            .option('name', {
                alias: 'n',
                describe: 'Stage name (e.g., Alchemy Laboratory)',
                type: 'string',
            })
            .demandOption(['property', 'name'])
        },
        handler: (argv) => {
            let legacyData = JSON.parse(fs.readFileSync('./build/extraction-legacy.json', 'utf8'))
            let extractionData = JSON.parse(fs.readFileSync('./build/extraction.json', 'utf8'))
            let aliasData = JSON.parse(fs.readFileSync('./build/alias.json', 'utf8'))
            console.log('stages:')
            Object.entries(extractionData.stages).forEach(([stageName, stageInfo]) => {
                if (stageName != argv.property) {
                    return;
                }
                console.log(`    ${stageName}:`)
                console.log('        tilemaps:')
                const tilemaps = {}
                stageInfo.layers.layerDefinitions.data.map((element, index) => {
                    const rows = 1 + element.layoutRect.bottom - element.layoutRect.top
                    const cols = 1 + element.layoutRect.right - element.layoutRect.left
                    let matchingRoomId = '-'
                    Object.entries(legacyData['Stages'][argv.name]['Rooms']).forEach(([roomId, roomInfo]) => {
                        if (
                            (roomInfo['Top']['Value'] === element.layoutRect.top) &&
                            (roomInfo['Left']['Value'] === element.layoutRect.left) &&
                            ((1 + roomInfo['Bottom']['Value'] - roomInfo['Top']['Value']) === rows) &&
                            ((1 + roomInfo['Right']['Value'] - roomInfo['Left']['Value']) === cols)
                        ) {
                            matchingRoomId = roomId
                        }
                    })
                    let matchingAlias = null
                    Object.entries(aliasData[argv.name]).forEach(([roomAlias, roomId]) => {
                        if (roomId == matchingRoomId) { // Strings and integers representing the same value should match
                            matchingAlias = roomAlias
                        }
                    })
                    const tilemap = {
                        metadata: {
                            address: {
                                method: 'relative',
                                value: element.tilesOffset,
                            },
                            element: {
                                structure: 'tilemap',
                                heightInScreens: rows,
                                widthInScreens: cols,
                            },
                        },
                    }
                    let tilemapKey = element.tilesOffset
                    if (matchingAlias != null) {
                        tilemapKey = matchingAlias
                                .replaceAll(" to ", " To ")
                                .replaceAll(" of ", " Of ")
                                .replaceAll(" and ", " And ")
                                .replaceAll(" ID ", " Id ")
                                .replaceAll("'", '')
                                .replaceAll('-', '')
                                .replaceAll(' ', '')
                        tilemapKey = tilemapKey.at(0).toLowerCase() + tilemapKey.slice(1)
                        if (tilemaps.hasOwnProperty(tilemapKey)) {
                            tilemapKey += ' ' + element.tilesOffset
                        }
                    }
                    tilemaps[tilemapKey] = tilemap
                    // console.log(' ', index, element.tilesOffset, element.layoutRect.top, element.layoutRect.left, 'hw(', rows, ',', cols, ')', matchingRoomId, '->', matchingAlias)
                    console.log(`            ${tilemapKey}: '${element.tilesOffset}'`)
                })
                // console.log(JSON.stringify(tilemaps, null, '    '))
            });
        }
    })
    .command({ // layerDefinitions
        command: 'layerDefinitions',
        describe: 'Search for matching stage info for layer definitions',
        builder: (yargs) => {
            return yargs
            .option('property', {
                alias: 'p',
                describe: 'Stage property (e.g., alchemyLaboratory)',
                type: 'string',
            })
            .demandOption(['property'])
        },
        handler: (argv) => {
            let extractionData = JSON.parse(fs.readFileSync('./build/extraction-aliased.json', 'utf8'))
            console.log('stages:')
            Object.entries(extractionData.stages).forEach(([stageName, stageInfo]) => {
                if (stageName != argv.property) {
                    return;
                }
                console.log(`    ${stageName}:`)
                console.log('        layers:')
                console.log('            layerDefinitions:')
                stageInfo.layers.layerDefinitions.data.filter((layerDefinition) => {
                    return (
                        layerDefinition.left !== 0 ||
                        layerDefinition.top !== 0 ||
                        layerDefinition.right !== 0 ||
                        layerDefinition.bottom !== 0 ||
                        layerDefinition.flags !== 0 ||
                        layerDefinition.tilesOffset !== 'NULL'
                    )
                }).map((layerDefinition, index) => {
                    let roomAlias = 'unknown' + index
                    const possibleIndexes = []
                    Object.values(stageInfo.rooms.data).filter((roomInfo) => {
                        return (
                            roomInfo.hasOwnProperty('_alias') &&
                            roomInfo.left === layerDefinition.layoutRect.left &&
                            roomInfo.top === layerDefinition.layoutRect.top &&
                            roomInfo.right === layerDefinition.layoutRect.right &&
                            roomInfo.bottom === layerDefinition.layoutRect.bottom
                        )
                    }).map((roomInfo) => {
                        roomAlias = roomInfo._alias
                        possibleIndexes.push(layerDefinition._elementIndex)
                    })
                    if (possibleIndexes.length > 0) {
                        console.log(`                ${roomAlias}: ${possibleIndexes.join(', ')}`)
                    }
                })
            });
        }
    })
    .command({ // cutscene
        command: 'cutscene',
        describe: 'Search for cutscene data on a PS1 binary',
        builder: (yargs) => {
            return yargs
            .option('bin', {
                alias: 'b',
                describe: 'Binary file to extract data from',
                type: 'string',
                normalize: true,
            })
            .option('start', {
                alias: 's',
                describe: 'Starting index in GAMEDATA',
                type: 'number',
            })
            .option('length', {
                alias: 'l',
                describe: 'Number of bytes in GAMEDATA to search',
                type: 'number',
            })
            .demandOption(['bin'])
        },
        handler: (argv) => {
            const binFile = fs.openSync(argv.bin, 'r')
            const binFileSize = fs.fstatSync(binFile).size
            const buffer = Buffer.alloc(binFileSize)
            fs.readSync(binFile, buffer, 0, binFileSize)
            fs.closeSync(binFile)
            const cutscenes = []
            const digest = crypto.createHash('sha256').update(buffer).digest()
            // console.log('Digest of disc image', digest.toString('hex'))
            const bin = new GameData(buffer, toVal(argv.start ?? 0))
            const preamble = '10 00'.split(' ').map((hexString) => { return Number.parseInt(hexString, 16)})
            for (let offset = 0; offset < (argv.length ?? 0x100); offset += 1) {
                bin.set((argv.start ?? 0) + offset)
                let validCutsceneInd = true
                for (let matchCount = 0; matchCount < preamble.length; matchCount++) {
                    const byte = bin.read('u8')
                    if (byte != preamble[matchCount])  {
                        validCutsceneInd = false
                        break
                    }
                }
                if (!validCutsceneInd) {
                    continue
                }
                bin.set((argv.start ?? 0) + offset)
                validCutsceneInd = true
                const instructions = []
                while (validCutsceneInd) {
                    const instruction = new CutsceneInstruction(bin)
                    instructions.push(instruction)
                    if (instruction.instruction === 'invalid') {
                        validCutsceneInd = false
                    }
                    else if (instruction.instruction === 'end') {
                        break
                    }
                }
                // console.log('validCutsceneInd:', validCutsceneInd)
                // console.log('instructions:', instructions)
                const maxTextLength = Math.max(
                    ...instructions
                    .map((instruction) => {
                        if (instruction.instruction === 'text') {
                            return instruction.size
                        }
                        else {
                            return 0
                        }
                    })
                )
                // console.log('maxTextLength:', maxTextLength)
                if (validCutsceneInd && instructions.length > 20 && maxTextLength >= 3) {
                    // console.log('')
                    const address = new Address('GAMEDATA', argv.start ?? 0, offset)
                    // console.log('game:', toHex(address.gameDataAddress, 8), 'disc:', toHex(address.toDiscAddress(), 8))
                    // instructions.forEach((instruction) => {
                    //     console.log(instruction.valueOf())
                    // })
                    cutscenes.push({
                        startAddress: address.valueOf(),
                        instructions: instructions
                        .map((instruction) => {
                            return instruction.valueOf()
                        }),
                    })
                }
            }
            console.log(JSON.stringify({
                cutscenes: cutscenes,
            }, null, 4))
        }
    })
    .command({ // teleporters
        command: 'teleporters',
        describe: 'XXX',
        builder: (yargs) => {
            return yargs
            .option('extraction', {
                alias: 'e',
                describe: 'Path to the aliased extraction file',
                type: 'string',
                normalize: true,
                default: './build/sotn-us/extraction.json',
            })
            .option('out', {
                alias: 'o',
                describe: 'Path to the output file to create',
                type: 'string',
                normalize: true,
                default: './build/sotn-us/extraction-processed.json',
            })
        },
        handler: (argv) => {
            const extraction = JSON.parse(fs.readFileSync(argv.extraction, 'utf8'))
            const processed = Object.assign({}, extraction)
            processed.teleporters.metadata.element.properties.roomOffset.type = 'room-offset'
            for (let index = 0; index < processed.teleporters.data.length; index++) {
                const targetStageName = processed.teleporters.data.at(index).targetStageId
                const teleporter = {}
                Object.entries(processed.teleporters.data.at(index))
                .forEach(([propertyKey, propertyValue]) => {
                    if (propertyKey === 'roomOffset') {
                        const roomOffsetValue = propertyValue / 8
                        teleporter[propertyKey] = propertyValue
                        Object.entries(ALIASED_TYPES['room-id'].values)
                        .filter(([aliasKey, aliasValue]) => {
                            return roomOffsetValue === aliasValue
                        })
                        .filter(([aliasKey, aliasValue]) => {
                            return aliasKey.startsWith(targetStageName)
                        })
                        .forEach(([aliasKey, aliasValue]) => {
                            teleporter[propertyKey] = aliasKey
                        })
                    }
                    else {
                        teleporter[propertyKey] = propertyValue
                    }
                })
                processed.teleporters.data[index] = teleporter
            }
            fs.writeFileSync(argv.out, JSON.stringify(processed, null, 4))
        }
    })
    .demandCommand(1)
    .help()
    .parse()