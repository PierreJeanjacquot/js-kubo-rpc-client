import { createStat as createBitswap } from '../bitswap/stat.js'
import { createStat as createRepo } from '../repo/stat.js'
import type { Options } from '../types.js'
import { createBw } from './bw.js'

export function createStats (options: Options) {
  return {
    bitswap: createBitswap(options),
    repo: createRepo(options),
    bw: createBw(options)
  }
}
