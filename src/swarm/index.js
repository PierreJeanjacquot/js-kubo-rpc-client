import { createAddrs } from './addrs.js'
import { createConnect } from './connect.js'
import { createDisconnect } from './disconnect.js'
import { createLocalAddrs } from './local-addrs.js'
import { createPeers } from './peers.js'

/**
 * @param {import('../types').Options} options
 */
export function createSwarm (options) {
  return {
    addrs: createAddrs(options),
    connect: createConnect(options),
    disconnect: createDisconnect(options),
    localAddrs: createLocalAddrs(options),
    peers: createPeers(options)
  }
}
