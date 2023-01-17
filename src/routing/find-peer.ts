import type { PeerId } from '@libp2p/interface-peer-id'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions } from '../types.js'
import type { QueryEvent } from './events.js'
import { mapEvent } from './map-event.js'

export const createFindPeer = configure(api => {
  /**
   * Query the DHT for all multiaddresses associated with a `PeerId`.
   *
   * @example
   * ```js
   * const info = await ipfs.dht.findPeer('QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt')
   *
   * console.log(info.id)
   * // QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt
   *
   * info.addrs.forEach(addr => console.log(addr.toString()))
   * // '/ip4/147.75.94.115/udp/4001/quic'
   * // '/ip6/2604:1380:3000:1f00::1/udp/4001/quic'
   * // '/dnsaddr/bootstrap.libp2p.io'
   * // '/ip6/2604:1380:3000:1f00::1/tcp/4001'
   * // '/ip4/147.75.94.115/tcp/4001'
   * ```
   */
  async function * findPeer (peerId: PeerId, options?: ClientOptions): AsyncIterable<QueryEvent> {
    const res = await api.post('dht/findpeer', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: peerId,
        ...options
      }),
      headers: options?.headers
    })

    for await (const event of res.ndjson()) {
      yield mapEvent(event)
    }
  }

  return findPeer
})
