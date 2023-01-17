import type { Options } from '../types.js'
import { createGen } from './gen.js'
import { createImport } from './import.js'
import { createList } from './list.js'
import { createRename } from './rename.js'
import { createRm } from './rm.js'

export function createKey (options: Options) {
  return {
    gen: createGen(options),
    import: createImport(options),
    list: createList(options),
    rename: createRename(options),
    rm: createRm(options)
  }
}
