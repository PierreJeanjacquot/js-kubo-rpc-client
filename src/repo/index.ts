import type { Options } from '../types.js'
import { createGc } from './gc.js'
import { createStat } from './stat.js'
import { createVersion } from './version.js'

export function createRepo (options: Options) {
  return {
    gc: createGc(options),
    stat: createStat(options),
    version: createVersion(options)
  }
}
