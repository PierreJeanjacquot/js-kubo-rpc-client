import { Multiaddr, multiaddr } from '@multiformats/multiaddr'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import { peerIdFromString } from '@libp2p/peer-id'
import type { ClientOptions } from '../types.js'
import type { PeerId } from '@libp2p/interface-peer-id'

export interface PeersOptions extends ClientOptions {
  direction?: boolean
  streams?: boolean
  verbose?: boolean
  latency?: boolean
}

export interface PeersResult {
  addr: Multiaddr
  peer: PeerId
  latency?: string
  muxer?: string
  streams?: string[]
  direction?: 'inbound' | 'outbound'
}

export const createPeers = configure(api => {
  /**
   * Return a list of connected peers
   */
  async function peers (options?: PeersOptions): Promise<PeersResult[]> {
    const res = await api.post('swarm/peers', {
      signal: options?.signal,
      searchParams: toUrlSearchParams(options),
      headers: options?.headers
    })

    const { Peers } = await res.json()

    return (Peers ?? []).map((peer: any) => {
      return {
        addr: multiaddr(peer.Addr),
        peer: peerIdFromString(peer.Peer),
        muxer: peer.Muxer,
        latency: peer.Latency,
        streams: peer.Streams,
        // eslint-disable-next-line no-nested-ternary
        direction: peer.Direction == null ? undefined : peer.Direction === 0 ? 'inbound' : 'outbound'
      }
    })
  }
  return peers
})
