import type { Options } from '../types.js'
import { createAddrs } from './addrs.js'
import { createConnect } from './connect.js'
import { createDisconnect } from './disconnect.js'
import { createLocalAddrs } from './local-addrs.js'
import { createPeers } from './peers.js'

export function createSwarm (options: Options) {
  return {
    addrs: createAddrs(options),
    connect: createConnect(options),
    disconnect: createDisconnect(options),
    localAddrs: createLocalAddrs(options),
    peers: createPeers(options)
  }
}
