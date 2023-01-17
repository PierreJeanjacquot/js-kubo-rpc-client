import { createGc } from './gc.js'
import { createStat } from './stat.js'
import { createVersion } from './version.js'

/**
 * @param {import('../types').Options} options
 */
export function createRepo (options) {
  return {
    gc: createGc(options),
    stat: createStat(options),
    version: createVersion(options)
  }
}
