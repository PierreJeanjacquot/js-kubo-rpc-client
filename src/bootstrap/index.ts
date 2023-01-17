import { createAdd } from './add.js'
import { createList } from './list.js'
import { createRm } from './rm.js'
import type { Options } from '../types.js'

export function createBootstrap (options: Options) {
  // TODO: https://github.com/ipfs/js-kubo-rpc-client/issues/96
  return {
    add: createAdd(options),
    list: createList(options),
    rm: createRm(options)
  }
}
