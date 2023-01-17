import { createStat as createBitswap } from '../bitswap/stat.js'
import { createStat as createRepo } from '../repo/stat.js'
import { createBw } from './bw.js'

/**
 * @param {import('../types').Options} options
 */
export function createStats (options) {
  return {
    bitswap: createBitswap(options),
    repo: createRepo(options),
    bw: createBw(options)
  }
}
