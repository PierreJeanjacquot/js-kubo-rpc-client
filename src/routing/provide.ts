import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import { mapEvent } from './map-event.js'
import type { CID } from 'multiformats'
import type { QueryEvent } from './events.js'
import type { ClientOptions } from '../types.js'

export interface DHTProvideOptions extends ClientOptions {
  recursive?: boolean
}

export const createProvide = configure(api => {
  /**
   * Announce to the network that we are providing given values.
   */
  async function * provide (cids: CID[] | CID, options: DHTProvideOptions = { recursive: false }): AsyncIterable<QueryEvent> {
    const cidArr: CID[] = Array.isArray(cids) ? cids : [cids]

    const res = await api.post('dht/provide', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: cidArr.map(cid => cid.toString()),
        ...options
      }),
      headers: options?.headers
    })

    for await (const event of res.ndjson()) {
      yield mapEvent(event)
    }
  }

  return provide
})
