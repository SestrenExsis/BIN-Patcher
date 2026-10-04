import { test } from 'node:test'
import { deepStrictEqual } from 'node:assert'
import {
    toPPF,
} from '../src/ppf.js'

const testPatches = [
    {
        testDescription: 'Enable debug mode',
        input: {
            _writes: {
                debugMode: {
                    data: '0xAC258850',
                    metadata: {
                        address: '0x000D9364',
                        element: {
                            structure: 'value',
                            type: 'u32',
                        },
                    },
                },
            },
        },
        expected: new Uint8Array([
        // 'PPF30'
            80, 80, 70, 51, 48,
        // Encoding method = PPF3.0
            2,
        // Description = 'Enable debug mode                                 '
            69, 110, 97, 98, 108, 101, 32, 100, 101, 98, 117, 103, 32, 109, 111, 100, 101, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
        // Imagetype = BIN
            0,
        // Blockcheck = Disabled
            0,
        // Undo data = Not available
            0,
        // Dummy
            0,
        // Address = 0x0F96DC (little-endian)
            220, 150, 15, 0, 0, 0, 0, 0,
        // Length = 4
            4,
        // Value = 0xAC258850 (little-endian)
            80, 136, 37, 172,
        ]),
    },
]

for (const testData of testPatches) {
    test('testPatches - ' + testData.testDescription, () => {
        const ppfData = toPPF(testData.input, 'Enable debug mode')
        deepStrictEqual(new Uint8Array(ppfData), testData.expected)
    })
}