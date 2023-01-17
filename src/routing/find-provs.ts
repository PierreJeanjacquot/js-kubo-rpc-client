import type { CID } from 'multiformats'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions } from '../types.js'
import type { QueryEvent } from './events.js'
import { mapEvent } from './map-event.js'

export const createFindProvs = configure(api => {
  /**
   * Find peers in the DHT that can provide a specific value, given a CID.
   *
   * @example
   * ```js
   * const providers = ipfs.dht.findProvs('QmdPAhQRxrDKqkGPvQzBvjYe3kU8kiEEAd2J6ETEamKAD9')
   * for await (const provider of providers) {
   *   console.log(provider.id.toString())
   * }
   * ```
   */
  async function * findProvs (cid: CID, options?: ClientOptions): AsyncIterable<QueryEvent> {
    const res = await api.post('dht/findprovs', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: cid.toString(),
        ...options
      }),
      headers: options?.headers
    })

    for await (const event of res.ndjson()) {
      yield mapEvent(event)
    }
  }

  return findProvs
})
