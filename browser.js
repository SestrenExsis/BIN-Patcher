// Entry point for the browser bundle (see build.js).
// Re-exports the library along with the bundled `Buffer` polyfill so that
// browser callers can wrap an ArrayBuffer / Uint8Array before handing it to GameData.
export * from './index.js'
export { Buffer } from 'buffer/'
export * from './bins/sotn-us'