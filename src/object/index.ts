import { createData } from './data.js'
import { createGet } from './get.js'
import { createLinks } from './links.js'
import { createNew } from './new.js'
import { createPut } from './put.js'
import { createStat } from './stat.js'
import { createPatch } from './patch/index.js'
import type { Multicodecs, Options } from '../types.js'

export function createObject (codecs: Multicodecs, options: Options) {
  return {
    data: createData(options),
    get: createGet(options),
    links: createLinks(options),
    new: createNew(options),
    put: createPut(codecs, options),
    stat: createStat(options),
    patch: createPatch(options)
  }
}
