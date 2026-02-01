import yargs from 'yargs'
import fs from 'fs'
import crypto from 'crypto'
import { Address, GameData, toHex, toVal } from './src/common.js'
import { parseExtractionNode } from './src/extract.js'
import { applyChange } from './src/change.js'
import { toPPF } from './src/ppf.js'

// An EXTRACTION file describes a structured template of modifiable or readable elements in the BINARY
// An EXTRACTION file can be used to produce an unmodified (i.e., vanilla) PATCH file as a template for further modifications
// A CHANGE file describes an ordered list of operations intended to alter a given PATCH file, the possible operations are:
//  - MERGE: Directly overwrite one or more mapped values in the PATCH file, in accordance with the mappings already provided
//  - EXTEND: Defines a new mapping and provides its own data and metadata to facilitate it
//  - EVALUATE: An operation that reads from and writes to the PATCH file via a set of simple instructions
// One or more CHANGE files can be applied to a given PATCH file in succession to alter it
// An altered PATCH file can be combined with the original EXTRACTION file to produce a PPF
// A PPF file can be used along with a PPF tool to produce a modified BINARY

// CHANGE file
//  - authors
//  - description
//  - changes (MERGE | EXTEND | EVALUATE)[]

// MERGE
// changeType: merge
// merge: ... data

// EXTEND
// changeType: extend
// extend: ... data + metadata

// EVALUATE
// changeType: evaluate
// evaluate:
//   evaluationOrder: ...
//   evaluations: ...

// An ALIAS file provides ...

const argv = yargs(process.argv.slice(2))
    .command({ // extract
        command: 'extract',
        describe: 'Extract data from a PS1 SOTN binary',
        builder: (yargs) => {
            return yargs
            .option('bin', {
                alias: 'b',
                describe: 'Binary file to extract data from',
                type: 'string',
                normalize: true,
            })
            .option('data', {
                alias: 'd',
                describe: 'Include data in the output',
                type: 'boolean',
                default: true,
            })
            .option('extraction', {
                alias: 'e',
                describe: 'Path to the extraction file to create',
                type: 'string',
                normalize: true,
            })
            .option('meta', {
                alias: 'm',
                describe: 'Include metadata in the output',
                type: 'boolean',
                default: true,
            })
            .option('template', {
                alias: 't',
                describe: 'JSON file describing the extraction template',
                type: 'string',
                normalize: true,
            })
            .demandOption(['bin', 'template', 'extraction'])
        },
        handler: (argv) => {
            const binFile = fs.openSync(argv.bin, 'r')
            const binFileSize = fs.fstatSync(binFile).size
            const buffer = Buffer.alloc(binFileSize)
            fs.readSync(binFile, buffer, 0, binFileSize)
            fs.closeSync(binFile)
            const digest = crypto.createHash('sha256').update(buffer).digest()
            console.log('Digest of disc image', digest.toString('hex'))
            const bin = new GameData(buffer)
            let extractionTemplate = JSON.parse(fs.readFileSync(argv.template, 'utf8'))
            const extractionData = parseExtractionNode(bin, extractionTemplate, 0, argv.data, argv.meta)
            fs.writeFileSync(argv.extraction, JSON.stringify(extractionData, null, 4));
        }
    })
    .command({ // change
        command: 'change',
        describe: 'Build a change file',
        builder: (yargs) => {
            return yargs
            // Debug logging
            .option('pokes', {
                // --p 0x04081F20=0x28420100
                // --p 0x04081F7C=0x0010
                // --p 0x0408255C=0x0001
                alias: 'p',
                describe: 'pokes',
                type: 'array',
            })
            .middleware([(argv, yargs) => {
                console.log('MIDDLEWARE')
                if ('debug' in argv) {
                    console.log('DEBUG')
                }
            }])
        },
        handler: (argv) => {
            console.log(argv)
        }
    })
    .command({ // patch
        command: 'patch',
        describe: 'Apply a changes file to a patch file',
        builder: (yargs) => {
            return yargs
            .option('changes', {
                alias: 'c',
                describe: 'Path to the changes file to apply',
                type: 'string',
                normalize: true,
            })
            .option('patch', {
                alias: 'p',
                describe: 'Path to the patch file',
                type: 'string',
                normalize: true,
            })
            .option('aliases', {
                alias: 'a',
                describe: 'Path to the aliases file',
                type: 'string',
                normalize: true,
            })
            .demandOption(['changes', 'patch', 'aliases'])
        },
        handler: (argv) => {
            let patchData = JSON.parse(fs.readFileSync(argv.patch, 'utf8'))
            let changesData = JSON.parse(fs.readFileSync(argv.changes, 'utf8'))
            let aliasesData = JSON.parse(fs.readFileSync(argv.aliases, 'utf8'))
            changesData.changes.forEach((changeData) => {
                applyChange(patchData, changeData, aliasesData)
            })
            fs.writeFileSync(argv.patch, JSON.stringify(patchData, null, 4));
        }
    })
    .command({ // ppf
        command: 'ppf',
        describe: 'Generate a PPF file, given an extraction file and a patch file',
        builder: (yargs) => {
            return yargs
            .option('extraction', {
                alias: 'e',
                describe: 'JSON file describing the extraction data',
                type: 'string',
                normalize: true,
            })
            .option('patch', {
                alias: 'p',
                describe: 'JSON file describing the patch data',
                type: 'string',
                normalize: true,
            })
            .option('out', {
                alias: 'o',
                describe: 'Folder to output the PPF to',
                type: 'string',
                normalize: true,
            })
            .demandOption(['extraction', 'patch', 'out'])
        },
        handler: (argv) => {
            let extractionData = JSON.parse(fs.readFileSync(argv.extraction, 'utf8'))
            let patchData = JSON.parse(fs.readFileSync(argv.patch, 'utf8'))
            const ppfData = toPPF(extractionData, patchData)
            fs.writeFileSync(argv.out + '/current-patch.ppf', ppfData);
        }
    })
    .command({ // address
        command: 'address',
        describe: 'Convert a DISC address to a GAMEDATA address and vice versa',
        builder: (yargs) => {
            return yargs
            .option('type', {
                alias: 't',
                describe: 'Type of address, GAMEDATA is contiguous, DISC is broken up by sectors',
                choices: [ 'DISC', 'GAMEDATA'],
            })
            .option('address', {
                alias: 'a',
                describe: 'Address value',
                type: 'number',
            })
            .option('offset', {
                alias: 'o',
                describe: 'Offset applied to the address value AFTER normalizing it to a GAMEDATA address',
                type: 'number',
                default: 0,
            })
            .demandOption(['type', 'address'])
        },
        handler: (argv) => {
            const address = new Address(argv.type, argv.address, argv.offset)
            const conversions = {
                gameData: {
                    hex: toHex(address.gameDataAddress),
                    value: address.gameDataAddress,
                },
                disc: {
                    hex: toHex(address.toDiscAddress()),
                    value: address.toDiscAddress(),
                },
            }
            console.log(conversions)
        }
    })
    .command({ // search
        command: 'search',
        describe: 'Search for data on a PS1 binary',
        builder: (yargs) => {
            return yargs
            .option('bin', {
                alias: 'b',
                describe: 'Binary file to extract data from',
                type: 'string',
                normalize: true,
            })
            .option('hex', {
                alias: 'h',
                describe: 'Byte-string to search for',
                type: 'string',
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
            .demandOption(['bin', 'hex'])
        },
        handler: (argv) => {
            const binFile = fs.openSync(argv.bin, 'r')
            const binFileSize = fs.fstatSync(binFile).size
            const buffer = Buffer.alloc(binFileSize)
            fs.readSync(binFile, buffer, 0, binFileSize)
            fs.closeSync(binFile)
            const digest = crypto.createHash('sha256').update(buffer).digest()
            console.log('Digest of disc image', digest.toString('hex'))
            const bin = new GameData(buffer, toVal(argv.start))
            const bytes = argv.hex.split(' ').map((hexString) => { return Number.parseInt(hexString, 16)})
            for (let offset = 0; offset < argv.length; offset++) {
                bin.set(argv.start + offset)
                let matchInd = true
                for (let matchCount = 0; matchCount < bytes.length; matchCount++) {
                    const byte = bin.read('u8')
                    if (byte != bytes[matchCount])  {
                        matchInd = false
                        break
                    }
                }
                if (matchInd) {
                    const address = new Address('GAMEDATA', argv.start, offset)
                    console.log('game:', toHex(address.gameDataAddress, 8), 'disc:', toHex(address.toDiscAddress(), 8))
                }
            }
        }
    })
    .demandCommand(1)
    .help()
    .parse()