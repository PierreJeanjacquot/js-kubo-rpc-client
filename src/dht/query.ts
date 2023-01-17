import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import { mapEvent } from '../routing/map-event.js'
import type { PeerId } from '@libp2p/interface-peer-id'
import type { QueryEvent } from '../routing/events.js'
import type { ClientOptions } from '../types.js'

export const createQuery = configure(api => {
  /**
   * Find the closest peers to a given `PeerId` or `CID`, by querying the DHT.
   */
  async function * query (peerId: PeerId, options?: ClientOptions): AsyncIterable<QueryEvent> {
    const res = await api.post('dht/query', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: peerId.toString(),
        ...options
      }),
      headers: options?.headers
    })

    for await (const event of res.ndjson()) {
      yield mapEvent(event)
    }
  }

  return query
})
