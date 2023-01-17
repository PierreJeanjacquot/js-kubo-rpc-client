import type { Options } from '../types.js'
import { createGet } from './get.js'
import { createPut } from './put.js'
import { createRm } from './rm.js'
import { createStat } from './stat.js'

export function createBlock (options: Options) {
  return {
    get: createGet(options),
    put: createPut(options),
    rm: createRm(options),
    stat: createStat(options)
  }
}
