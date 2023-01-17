import { createWantlist } from './wantlist.js'
import { createStat } from './stat.js'
import type { Options } from '../types.js'

export function createBitswap (options: Options) {
  return {
    // TODO: https://github.com/ipfs/js-kubo-rpc-client/issues/99
    wantlist: createWantlist(options),
    stat: createStat(options)
  }
}
