
import fs from 'fs'

import {
    ALIASED_TYPES,
} from '../../src/common.js'

import {
    aliasIndexedNodes,
    aliasNodeKeys,
    parseExtractionNode,
} from '../../src/extract.js'

import {
    ALIASES,
    ASSOCIATED_STAGES,
    BASE_DROP_RATES,
    BOSS_ROOMS,
    BOSS_TELEPORTERS,
    CHANGE_DEPENDENCIES_TEMPLATE,
    EXTRACTION_TEMPLATE,
    FAMILIAR_EVENTS,
    FAMILIAR_OVERLAYS,
    LIVE_MAP_REPAINTS,
    MUSIC,
    ORDERED_DEPENDENCY_NAMES,
    ROOMS,
    SECONDARY_STAGES,
    SECRET_MAP_TILE_REVEALS,
    STAGES,
    UNIQUE_ITEM_DROPS,
} from './constants.js'

export function getChangeDependencies(source) {
    const target = structuredClone(source)
    ORDERED_DEPENDENCY_NAMES
    .filter((dependencyName) => {
        return !(dependencyName in target)
    })
    .forEach((dependencyName) => {
        target[dependencyName] = {}
    })
    // primaryRooms.rightsAndBottoms
    Object.entries(ROOMS)
    .forEach(([stageName, stageInfo]) => {
        Object.entries(stageInfo)
        .forEach(([roomName, layerNames]) => {
            const properties = [
                {
                    targetPropertyName: 'right',
                    sourcePropertyName: 'left',
                    dimensionName: '_columns',
                },
                {
                    targetPropertyName: 'bottom',
                    sourcePropertyName: 'top',
                    dimensionName: '_rows',
                },
            ]
            properties
            .forEach((propertyInfo) => {
                const transformation = [
                    {
                        action: 'get',
                        type: 'property',
                        property: `stages.${stageName}.rooms.${roomName}.${propertyInfo.sourcePropertyName}`,
                    },
                    {
                        action: 'add',
                        type: 'property',
                        property: `stages.${stageName}.rooms.${roomName}.${propertyInfo.dimensionName}`,
                    },
                    {
                        action: 'subtract',
                        type: 'constant',
                        constant: 1,
                    },
                    {
                        action: 'set',
                        type: 'property',
                        property: `stages.${stageName}.rooms.${roomName}.${propertyInfo.targetPropertyName}`,
                    },
                ]
                const transformationName = transformation.at(-1).property
                // console.log(transformationName)
                const dependencyName = (SECONDARY_STAGES.includes(stageName)) ? 'secondaryRooms.rightsAndBottoms' : 'primaryRooms.rightsAndBottoms'
                target[dependencyName][transformationName] = transformation
            })
        })
    })
    // rooms.layerDefinitions
    Object.entries(ROOMS)
    .forEach(([stageName, stageInfo]) => {
        Object.entries(stageInfo)
        .forEach(([roomName, layerNames]) => {
            layerNames
            .forEach((layerName) => {
                const properties = [
                    {
                        targetPropertyName: 'left',
                        sourcePropertyName: 'left',
                    },
                    {
                        targetPropertyName: 'top',
                        sourcePropertyName: 'top',
                    },
                    {
                        targetPropertyName: 'right',
                        sourcePropertyName: 'right',
                    },
                    {
                        targetPropertyName: 'bottom',
                        sourcePropertyName: 'bottom',
                    },
                ]
                properties
                .forEach((propertyInfo) => {
                    const transformation = [
                        {
                            'action': 'get',
                            'type': 'property',
                            'property': `stages.${stageName}.rooms.${roomName}.${propertyInfo.sourcePropertyName}`,
                        },
                        {
                            'action': 'set',
                            'type': 'property',
                            'property': `stages.${stageName}.layers.layerDefinitions.${layerName}.layoutRect.${propertyInfo.targetPropertyName}`,
                        },
                    ]
                    const transformationName = transformation.at(-1).property
                    // console.log(transformationName)
                    target['rooms.layerDefinitions'][transformationName] = transformation
                })
            })
        })
    })
    // secondaryRooms.leftsAndTops
    Object.entries(ASSOCIATED_STAGES)
    .filter(([stageName, stageInfo]) => {
        return stageName in ROOMS && stageInfo.associatedStageName in ROOMS
    })
    .forEach(([stageName, stageInfo]) => {
        Object.entries(ROOMS[stageName])
        .filter(([roomName, layerNames]) => {
            return roomName in ROOMS[stageInfo.associatedStageName]
        })
        .forEach(([roomName, layerNames]) => {
            const properties = [
                {
                    sourcePropertyName: 'left',
                    dimensionName: '_columns',
                },
                {
                    sourcePropertyName: 'top',
                    dimensionName: '_rows',
                },
            ]
            properties
            .forEach((propertyInfo) => {
                const transformation = []
                if (stageInfo.reversed) {
                    transformation.push({
                        action: 'get',
                        type: 'constant',
                        constant: 64,
                    })
                    transformation.push({
                        action: 'subtract',
                        type: 'property',
                        property: `stages.${stageInfo.associatedStageName}.rooms.${roomName}.${propertyInfo.sourcePropertyName}`,
                    })
                    transformation.push({
                        action: 'subtract',
                        type: 'property',
                        property: `stages.${stageInfo.associatedStageName}.rooms.${roomName}.${propertyInfo.dimensionName}`,
                    })
                }
                else {
                    transformation.push({
                        action: 'get',
                        type: 'property',
                        property: `stages.${stageInfo.associatedStageName}.rooms.${roomName}.${propertyInfo.sourcePropertyName}`,
                    })
                }
                transformation.push({
                    action: 'set',
                    type: 'property',
                    property: `stages.${stageName}.rooms.${roomName}.${propertyInfo.sourcePropertyName}`,
                })
                const transformationName = transformation.at(-1).property
                // console.log(transformationName)
                target['secondaryRooms.leftsAndTops'][transformationName] = transformation
            })
        })
    })
    // secretMapTileReveals, bossTeleporters
    const dependencies = [
        {
            dependencyName: 'secretMapTileReveals',
            dependencyInfo: SECRET_MAP_TILE_REVEALS,
        },
        {
            dependencyName: 'bossTeleporters',
            dependencyInfo: BOSS_TELEPORTERS,
        },
    ]
    dependencies
    .forEach((dependency) => {
        Object.entries(dependency.dependencyInfo)
        .forEach(([targetKey, targetInfo]) => {
            const properties = [
                {
                    sourcePropertyName: 'top',
                    sourceValue: targetInfo.top,
                    targetPropertyName: 'roomY',
                },
                {
                    sourcePropertyName: 'left',
                    sourceValue: targetInfo.left,
                    targetPropertyName: 'roomX',
                },
            ]
            properties
            .forEach((propertyInfo) => {
                const transformation = []
                transformation.push({
                    action: 'get',
                    type: 'property',
                    property: `stages.${targetInfo.stageName}.rooms.${targetInfo.roomName}.${propertyInfo.sourcePropertyName}`,
                })
                if (propertyInfo.sourceValue !== 0) {
                    transformation.push({
                        action: 'add',
                        type: 'constant',
                        constant: propertyInfo.sourceValue,
                    })
                }
                transformation.push({
                    action: 'set',
                    type: 'property',
                    property: `${dependency.dependencyName}.${targetKey}.${propertyInfo.targetPropertyName}`,
                })
                // ...
                const transformationName = transformation.at(-1).property
                // console.log(transformationName)
                target[dependency.dependencyName][transformationName] = transformation
            })
        })
    })
    // familiarEvents
    Object.keys(FAMILIAR_OVERLAYS)
    .toSorted()
    .forEach((familiarKey) => {
        Object.entries(FAMILIAR_EVENTS)
        .forEach(([transformationKey, eventInfo]) => {
            const properties = [
                {
                    sourcePropertyName: 'top',
                    targetPropertyName: 'roomY',
                },
                {
                    sourcePropertyName: 'left',
                    targetPropertyName: 'roomX',
                },
            ]
            properties
            .forEach((propertyInfo) => {
                const transformation = []
                transformation.push({
                    action: 'get',
                    type: 'property',
                    property: `stages.${eventInfo.stageName}.rooms.${eventInfo.roomName}.${propertyInfo.sourcePropertyName}`,
                })
                if (eventInfo.inverted && propertyInfo.sourcePropertyName === 'left') {
                    transformation.push({
                        action: 'multiply',
                        type: 'constant',
                        constant: -1,
                    })
                }
                transformation.push({
                    action: 'set',
                    type: 'property',
                    property: `familiarEvents.${familiarKey}.${transformationKey}.${propertyInfo.targetPropertyName}`,
                })
                // ...
                const transformationName = transformation.at(-1).property
                // console.log(transformationName)
                target['familiarEvents'][transformationName] = transformation
            })
        })
    })
    // bossRooms
    Object.entries(BOSS_ROOMS)
    .forEach(([stageName, stageInfo]) => {
        Object.entries(stageInfo)
        .forEach(([roomName, roomInfo]) => {
            const properties = [
                {
                    propertyName: 'top',
                    offsetValue: roomInfo.offsetTop,
                },
                {
                    propertyName: 'left',
                    offsetValue: roomInfo.offsetLeft,
                },
            ]
            properties
            .forEach((propertyInfo) => {
                const transformation = []
                transformation.push({
                    action: 'get',
                    type: 'property',
                    property: `stages.${roomInfo.sourceStageName}.rooms.${roomInfo.sourceRoomName}.${propertyInfo.propertyName}`,
                })
                if (propertyInfo.offsetValue !== 0) {
                    transformation.push({
                        action: 'add',
                        type: 'constant',
                        constant: propertyInfo.offsetValue,
                    })
                }
                transformation.push({
                    action: 'set',
                    type: 'property',
                    property: `stages.${stageName}.rooms.${roomName}.${propertyInfo.propertyName}`,
                })
                const transformationName = transformation.at(-1).property
                // console.log(transformationName)
                target['bossRooms.leftsAndTops'][transformationName] = transformation
            })
        })
    })
    // liveMapRepaints
    LIVE_MAP_REPAINTS
    .forEach((repaintInfo) => {
        const properties = [
            {
                castleName: 'firstCastle',
                address: repaintInfo.addressA,
            },
            {
                castleName: 'reverseCastle',
                address: repaintInfo.addressB,
            },
        ]
        properties
        .forEach((propertyInfo) => {
            const transformation = [
                {
                    'action': 'get',
                    'type': 'property',
                    'property': `stages.undergroundCaverns.rooms.${repaintInfo.roomName}.${repaintInfo.edge}`,
                },
                {
                    'action': 'add',
                    'type': 'constant',
                    'constant': repaintInfo.offset,
                },
                {
                    'action': 'set',
                    'type': 'address',
                    'name': `liveMapRepaints.${propertyInfo.castleName}.${repaintInfo.specialId}.${repaintInfo.edge}`,
                    'address': propertyInfo.address,
                    'element': {
                        'structure': 'value',
                        'type': 'u8',
                    },
                },
            ]
            const transformationName = transformation.at(-1).name
            // console.log(transformationName)
            target['liveMapRepaints'][transformationName] = transformation
        })
    })
    // ...
    const result = {
        authors: [
            'Sestren',
        ],
        description: [
            'Updates secondary values to be consistent with the primary values they are dependent on',
        ],
        changes: [],
    }
    ORDERED_DEPENDENCY_NAMES
    .forEach((dependencyName) => {
        result.changes.push({
            changeType: 'evaluate',
            description: dependencyName,
            evaluate: target[dependencyName],
        })
    })
    return result
}

export function getDefaultChangeDependencies() {
    return getChangeDependencies(CHANGE_DEPENDENCIES_TEMPLATE)
}

export function getExtractionTemplate(template, previous={}) {
    const result = structuredClone(template)
    // familiarEvents
    result.familiarEvents = {}
    Object.entries(FAMILIAR_OVERLAYS)
    .forEach(([familiarName, familiarAddress]) => {
        result.familiarEvents[familiarName] = {
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
        let context = result.stages
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
        if (!(stageName in result.stages)) {
            result.stages[stageName] = {}
        }
        // stages.STAGE_NAME.metadata
        if (!('metadata' in result.stages[stageName])) {
            result.stages[stageName].metadata = {
                address: {
                    value: STAGES[stageName],
                    method: 'absolute',
                },
            }
        }
        // stages.STAGE_NAME.constants
        if (!('constants' in result.stages[stageName])) {
            result.stages[stageName].constants = {}
        }
        // stages.STAGE_NAME.constants.baseDropRates
        if (stageName in BASE_DROP_RATES) {
            result.stages[stageName].constants.baseDropRates = {
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
            result.stages[stageName].constants.uniqueItemDrops = {
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
        if (!('rooms' in result.stages[stageName])) {
            result.stages[stageName].rooms = {
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
        if (!('layers' in result.stages[stageName])) {
            result.stages[stageName].layers = {}
        }
        // stages.STAGE_NAME.entities
        if (!('entities' in result.stages[stageName])) {
            result.stages[stageName].entities = {}
        }
        // stages.STAGE_NAME.entities.layoutOffsets
        if (!('layoutOffsets' in result.stages[stageName].entities)) {
            result.stages[stageName].entities.layoutOffsets = {
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
                result.stages[stageName].layers.roomDefinitions = {
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
                    result.stages[stageName].layers.layerDefinitions = {
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
                result.stages[stageName].tilemaps = tilemaps
            }
            // stages.STAGE_NAME.entities.horizontalRows, stages.STAGE_NAME.entities.verticalRows
            const layoutOffsets = previousStageInfo.entities.layoutOffsets
            const horizontalOffset = layoutOffsets.data.horizontalEntities
            const verticalOffset = layoutOffsets.data.verticalEntities
            if (horizontalOffset && verticalOffset) {
                const entityRowCount = Math.floor((verticalOffset - horizontalOffset) / 4)
                result.stages[stageName].entities.horizontalRows = {
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
                result.stages[stageName].entities.verticalRows = {
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
                        result.stages[stageName].entities[entityTable.propertyName] = {
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
                        result.stages[stageName].entities.vertical.metadata.element.postProcessing = [
                            {
                                process: 'paddingAfterElement',
                                whenArrayLength: 70,
                                paddingAmount: 12,
                            },
                        ]
                        result.stages[stageName].entities.horizontal.metadata.element.postProcessing = [
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
    return result
}

export function processBinary(bin, rounds=4) {
    const result = {
        extraction: {},
        template: EXTRACTION_TEMPLATE,
    }
    for (let i = 0; i < rounds; i++) {
        result.template = getExtractionTemplate(result.template, result.extraction)
        result.extraction = parseExtractionNode(bin, result.template, 0)
    }
    // Process roomOffset values of teleporters
    result.extraction.teleporters.metadata.element.properties.roomOffset.type = 'room-offset'
    for (let index = 0; index < result.extraction.teleporters.data.length; index++) {
        const targetStageName = result.extraction.teleporters.data.at(index).targetStageId
        const teleporter = {}
        Object.entries(result.extraction.teleporters.data.at(index))
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
        result.extraction.teleporters.data[index] = teleporter
    }
    // Add aliases to extraction
    result.extraction = aliasIndexedNodes(result.extraction, ALIASES)
    result.extraction = aliasNodeKeys(result.extraction, ALIASES)
    return result
}

