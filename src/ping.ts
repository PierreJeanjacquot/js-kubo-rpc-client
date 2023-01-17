import { objectToCamel } from './lib/object-to-camel.js'
import { configure } from './lib/configure.js'
import { toUrlSearchParams } from './lib/to-url-search-params.js'
import type { ClientOptions, IpfsUtilsHttpClient } from './types'
import type { PeerId } from '@libp2p/interface-peer-id'

export interface PingOptions extends ClientOptions {
  count?: number
}

export interface PingResult {
  success: boolean
  time: number
  text: string
}

export const createPing = configure((api: IpfsUtilsHttpClient) => {
  /**
   * Send echo request packets to IPFS hosts.
   *
   * @example
   * ```js
   * for await (const res of ipfs.ping('Qmhash')) {
   *   if (res.time) {
   *     console.log(`Pong received: time=${res.time} ms`)
   *   } else {
   *     console.log(res.text)
   *   }
   * }
   * ```
   */
  async function * ping (peerId: PeerId, options?: PingOptions): AsyncIterable<PingResult> {
    const res = await api.post('ping', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: peerId.toString(),
        ...options
      }),
      headers: options?.headers,
      transform: objectToCamel
    })

    yield * res.ndjson()
  }
  return ping
})
