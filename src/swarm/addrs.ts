import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import { peerIdFromString } from '@libp2p/peer-id'
import { Multiaddr, multiaddr } from '@multiformats/multiaddr'
import type { ClientOptions } from '../types.js'
import type { PeerId } from '@libp2p/interface-peer-id'

export interface AddrsResult {
  id: PeerId
  addrs: Multiaddr[]
}

export const createAddrs = configure(api => {
  /**
   * List of known addresses of each peer connected
   */
  async function addrs (options?: ClientOptions): Promise<AddrsResult[]> {
    const res = await api.post('swarm/addrs', {
      signal: options?.signal,
      searchParams: toUrlSearchParams(options),
      headers: options?.headers
    })

    const { Addrs } = await res.json()

    return Object.keys(Addrs).map(id => ({
      id: peerIdFromString(id),
      addrs: (Addrs[id] ?? []).map((a: any) => multiaddr(a))
    }))
  }
  return addrs
})
