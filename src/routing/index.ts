import { createFindPeer } from './find-peer.js'
import { createFindProvs } from './find-provs.js'
import { createGet } from './get.js'
import { createProvide } from './provide.js'
import { createPut } from './put.js'
import type { Options } from '../types.js'

export function createRouting (options: Options) {
  return {
    findPeer: createFindPeer(options),
    findProvs: createFindProvs(options),
    get: createGet(options),
    provide: createProvide(options),
    put: createPut(options)
  }
}
