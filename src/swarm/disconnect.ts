
import type { PeerId } from '@libp2p/interface-peer-id'
import type { Multiaddr } from '@multiformats/multiaddr'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions } from '../types.js'

export const createDisconnect = configure(api => {
  /**
   * Close a connection to a given address or peer id
   */
  async function disconnect (addr: Multiaddr | PeerId, options?: ClientOptions): Promise<void> {
    const res = await api.post('swarm/disconnect', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: addr,
        ...options
      }),
      headers: options?.headers
    })
    const { Strings } = await res.json()

    return Strings ?? []
  }
  return disconnect
})
