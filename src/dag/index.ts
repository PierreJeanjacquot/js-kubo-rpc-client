import type { Multicodecs, Options } from '../types.js'
import { createExport } from './export.js'
import { createGet } from './get.js'
import { createImport } from './import.js'
import { createPut } from './put.js'
import { createResolve } from './resolve.js'

export function createDag (codecs: Multicodecs, options: Options) {
  return {
    export: createExport(options),
    get: createGet(codecs, options),
    import: createImport(options),
    put: createPut(codecs, options),
    resolve: createResolve(options)
  }
}
