import yargs from 'yargs'
import fs from 'fs'
import crypto from 'crypto'
import { Address, GameData, toHex, toVal } from './src/common.js'

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
    .demandCommand(1)
    .help()
    .parse()