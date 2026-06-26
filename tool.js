import yargs from 'yargs'
import fs from 'fs'
import crypto from 'crypto'
import { Address, GameData, toHex, toVal } from './src/common.js'

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
            const digest = crypto.createHash('sha256').update(buffer).digest()
            console.log('Digest of disc image', digest.toString('hex'))
            const bin = new GameData(buffer, toVal(argv.start ?? 0))
            const preamble = '10 00'.split(' ').map((hexString) => { return Number.parseInt(hexString, 16)})
            console.log('preamble:', preamble)
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
                let maxTextLength = 0
                const script = []
                const currentString = []
                let args = []
                while (validCutsceneInd) {
                    const byte = bin.read('u8')
                    if (byte >= 0x00 && byte <= 0x18) {
                        if (currentString.length > 0) {
                            maxTextLength = Math.max(maxTextLength, currentString.length)
                            script.push(`text(${currentString.join('')})`)
                            while (currentString.length > 0) {
                                currentString.pop()
                            }
                        }
                        switch (byte) {
                            case 0x00:
                                script.push('end')
                                break
                            case 0x01:
                                script.push('line')
                                break
                            case 0x02:
                                args.push(bin.read('u8'))
                                script.push(`delay(${args.join(', ')})`)
                                break
                            case 0x03:
                                args.push(bin.read('u8'))
                                script.push(`pause(${args.join(', ')})`)
                                break
                            case 0x04:
                                script.push('hideDialog')
                                break
                            case 0x05:
                                args.push(bin.read('u8'))
                                args.push(bin.read('u8'))
                                script.push(`setPortrait(${args.join(', ')})`)
                                break
                            case 0x06:
                                script.push('nextDialog')
                                break
                            case 0x07:
                                args.push(bin.read('u8'))
                                args.push(bin.read('u8'))
                                script.push(`setPosition(${args.join(', ')})`)
                                break
                            case 0x08:
                                script.push('closeDialog')
                                break
                            case 0x09:
                                args.push(bin.read('u8'))
                                args.push(bin.read('u8'))
                                script.push(`playSound(${args.join(', ')})`)
                                break
                            case 0x0A:
                                script.push('waitForSound')
                                break
                            case 0x0B:
                                script.push('unknown0B')
                                break
                            case 0x0C:
                                args.push(bin.read('u8'))
                                args.push(bin.read('u8'))
                                args.push(bin.read('u8'))
                                args.push(bin.read('u8'))
                                script.push(`setEnd(${args.join(', ')})`)
                                break
                            case 0x0D:
                                script.push('unknown0D')
                                break
                            case 0x0E:
                                args.push(bin.read('u8'))
                                args.push(bin.read('u8'))
                                args.push(bin.read('u8'))
                                args.push(bin.read('u8'))
                                args.push(bin.read('u8'))
                                args.push(bin.read('u8'))
                                args.push(bin.read('u8'))
                                args.push(bin.read('u8'))
                                script.push(`unknown0E(${args.join(', ')})`)
                                break
                            case 0x0F:
                                args.push(bin.read('u8'))
                                args.push(bin.read('u8'))
                                args.push(bin.read('u8'))
                                args.push(bin.read('u8'))
                                script.push(`unknown0F(${args.join(', ')})`)
                                break
                            case 0x10:
                                args.push(bin.read('u8'))
                                script.push(`waitForFlag(${args.join(', ')})`)
                                break
                            case 0x11:
                                args.push(bin.read('u8'))
                                script.push(`setFlag(${args.join(', ')})`)
                                break
                            case 0x12:
                                script.push('unknown12')
                                break
                            case 0x13:
                                args.push(bin.read('u8'))
                                args.push(bin.read('u8'))
                                args.push(bin.read('u8'))
                                args.push(bin.read('u8'))
                                args.push(bin.read('u8'))
                                script.push(`loadPortrait(${args.join(', ')})`)
                                break
                            case 0x14:
                                args.push(bin.read('u8'))
                                args.push(bin.read('u8'))
                                script.push(`unknown14(${args.join(', ')})`)
                                break
                            case 0x15:
                                script.push('unknown15')
                                break
                            case 0x16:
                                args.push(bin.read('u8'))
                                script.push(`unknown16(${args.join(', ')})`)
                                break
                            case 0x17:
                                script.push('unknown17')
                                break
                            case 0x18:
                                args.push(bin.read('u8'))
                                script.push(`waitForFlagReset(${args.join(', ')})`)
                                break
                            default:
                                break
                        }
                        while (args.length > 0) {
                            args.pop()
                        }
                    }
                    else if (byte >= 0x20 && byte <= 0x7e) {
                        currentString.push(String.fromCharCode(byte))
                    }
                    else {
                        validCutsceneInd = false
                    }
                    if (script.length > 0 && script.at(-1) === 'end') {
                        break
                    }
                }
                if (validCutsceneInd && script.length > 20 && maxTextLength >= 3) {
                    const address = new Address('GAMEDATA', argv.start ?? 0, offset)
                    console.log('game:', toHex(address.gameDataAddress, 8), 'disc:', toHex(address.toDiscAddress(), 8))
                    script.forEach((line, index) => {
                        console.log('  ', index, line)
                    })
                }
                maxTextLength = 0
            }
        }
    })
    .demandCommand(1)
    .help()
    .parse()