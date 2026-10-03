import * as esbuild from 'esbuild'

const shared = {
    entryPoints: [
        'browser.js',
    ],
    bundle: true,
    target: 'es2015',
    inject: ['./shims/buffer.js'],
    sourcemap: true,
    logLevel: 'info',
}

// Browser-friendly script: load it with a <script> tag and use `window.BinPatcher`
await esbuild.build({
    ...shared,
    format: 'iife',
    globalName: 'BinPatcher',
    outfile: 'dist/bin-patcher.js',
})

// ES module build for bundlers and `import` consumers
await esbuild.build({
    ...shared,
    format: 'esm',
    outfile: 'dist/bin-patcher.esm.js',
})