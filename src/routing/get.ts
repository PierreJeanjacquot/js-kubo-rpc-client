import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import { mapEvent } from './map-event.js'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import type { ClientOptions } from '../types.js'
import type { QueryEvent } from './events.js'

export const createGet = configure(api => {
  /**
   * Given a key, query the DHT for its best value.
   */
  async function * get (key: string | Uint8Array, options?: ClientOptions): AsyncIterable<QueryEvent> {
    const res = await api.post('dht/get', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        // arg: base36.encode(key),
        arg: key instanceof Uint8Array ? uint8ArrayToString(key) : key.toString(),
        ...options
      }),
      headers: options?.headers
    })

    for await (const event of res.ndjson()) {
      yield mapEvent(event)
    }
  }

  return get
})
