import yargs from 'yargs'
import fs from 'fs'
import crypto from 'crypto'
import { Address, GameData, toHex } from './src/common.js'

const argv = yargs(process.argv.slice(2))
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
    .command({ // dependencies
        command: 'dependencies',
        describe: 'Construct change dependencies for template',
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
            console.log('    rooms:')
            Object.entries(extractionData.stages)
            .forEach(([stageName, stageInfo]) => {
                if (stageName != argv.property) {
                    return;
                }
                console.log(`        '${stageName}': {`)
                Object.entries(stageInfo.rooms.aliases).forEach(([roomName, roomIndex]) => {
                    console.log(`            '${roomName}': [`)
                    const roomInfo = stageInfo.rooms.data[roomIndex]
                    Object.entries(stageInfo.layers.layerDefinitions.aliases).forEach(([layerName, layerIndex]) => {
                        const layerInfo = stageInfo.layers.layerDefinitions.data[layerIndex]
                        if (
                            (layerInfo.layoutRect.left == roomInfo.left) &&
                            (layerInfo.layoutRect.top == roomInfo.top) &&
                            (layerInfo.layoutRect.right == roomInfo.right) &&
                            (layerInfo.layoutRect.bottom == roomInfo.bottom)
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
                //             roomInfo.left == layerDefinition.layoutRect.left &&
                //             roomInfo.top == layerDefinition.layoutRect.top &&
                //             roomInfo.right == layerDefinition.layoutRect.right &&
                //             roomInfo.bottom == layerDefinition.layoutRect.bottom
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
                console.log('        rooms:')
                const tilemaps = {}
                stageInfo.layers.layerDefinitions.data.map((element, index) => {
                    const rows = 1 + element.layoutRect.bottom - element.layoutRect.top
                    const cols = 1 + element.layoutRect.right - element.layoutRect.left
                    let matchingRoomId = '-'
                    Object.entries(legacyData['Stages'][argv.name]['Rooms']).forEach(([roomId, roomInfo]) => {
                        if (
                            (roomInfo['Top']['Value'] == element.layoutRect.top) &&
                            (roomInfo['Left']['Value'] == element.layoutRect.left) &&
                            ((1 + roomInfo['Bottom']['Value'] - roomInfo['Top']['Value']) == rows) &&
                            ((1 + roomInfo['Right']['Value'] - roomInfo['Left']['Value']) == cols)
                        ) {
                            matchingRoomId = roomId
                        }
                    })
                    let matchingAlias = null
                    Object.entries(aliasData[argv.name]).forEach(([roomAlias, roomId]) => {
                        if (roomId == matchingRoomId) {
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
                            roomInfo.left == layerDefinition.layoutRect.left &&
                            roomInfo.top == layerDefinition.layoutRect.top &&
                            roomInfo.right == layerDefinition.layoutRect.right &&
                            roomInfo.bottom == layerDefinition.layoutRect.bottom
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
    .demandCommand(1)
    .help()
    .parse()