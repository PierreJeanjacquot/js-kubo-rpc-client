import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions } from '../types.js'

export const createTail = configure(api => {
  async function * tail (options?: ClientOptions): AsyncIterable<any> {
    const res = await api.post('log/tail', {
      signal: options?.signal,
      searchParams: toUrlSearchParams(options),
      headers: options?.headers
    })

    yield * res.ndjson()
  }
  return tail
})
