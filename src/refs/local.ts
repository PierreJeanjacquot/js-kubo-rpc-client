import { objectToCamel } from '../lib/object-to-camel.js'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions } from '../types.js'
import type { RefsResult } from './index.js'

export const createLocal = configure(api => {
  /**
   * List blocks stored in the local block store
   */
  async function * refsLocal (options?: ClientOptions): AsyncIterable<RefsResult> {
    const res = await api.post('refs/local', {
      signal: options?.signal,
      transform: objectToCamel,
      searchParams: toUrlSearchParams(options),
      headers: options?.headers
    })

    yield * res.ndjson()
  }
  return refsLocal
})
