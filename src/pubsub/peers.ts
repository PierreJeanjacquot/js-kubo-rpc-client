import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import { textToUrlSafeRpc } from '../lib/http-rpc-wire-format.js'
import type { ClientOptions } from '../types.js'
import type { PeerId } from '@libp2p/interface-peer-id'

export const createPeers = configure(api => {
  /**
   * Returns the peers that are subscribed to one topic.
   *
   * @example
   * ```js
   * const topic = 'fruit-of-the-day'
   *
   * const peerIds = await ipfs.pubsub.peers(topic)
   * console.log(peerIds)
   * ```
   */
  async function peers (topic: string, options?: ClientOptions): Promise<PeerId[]> {
    const res = await api.post('pubsub/peers', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: textToUrlSafeRpc(topic),
        ...options
      }),
      headers: options?.headers
    })

    const { Strings } = await res.json()

    return Strings ?? []
  }
  return peers
})
