import yargs from 'yargs'
import fs from 'fs'
import crypto from 'crypto'
import { Address, GameData, toHex } from './src/common.js'
import { parseExtractionNode } from './src/extract.js'
import { toPPF } from './src/ppf.js'

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
            .option('json', {
                alias: 'j',
                describe: 'JSON file describing the extraction template',
                type: 'string',
                normalize: true,
            })
            .option('out', {
                alias: 'o',
                describe: 'Folder to output the extracted data to',
                type: 'string',
                normalize: true,
            })
            .demandOption(['bin', 'json', 'out'])
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
            let extractionTemplate = JSON.parse(fs.readFileSync(argv.json, 'utf8'))
            const extractionData = parseExtractionNode(bin, extractionTemplate)
            fs.writeFileSync(argv.out + '/extraction.json', JSON.stringify(extractionData, null, 4));
        }
    })
    .command({ // build
        command: 'build',
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
        describe: 'Generate a patch file, given one or more change files',
        builder: (yargs) => {
            return yargs
            .option('out', {
                alias: 'o',
                describe: 'Folder to output the patch file to',
                type: 'string',
                normalize: true,
            })
            .demandOption(['changes', 'out'])
        },
        handler: (argv) => {
            console.log(argv)
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
    .demandCommand(1)
    .help()
    .parse()