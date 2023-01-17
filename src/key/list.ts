import { objectToCamel } from '../lib/object-to-camel.js'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { Key } from './key.js'
import type { ClientOptions } from '../types.js'

export const createList = configure(api => {
  /**
   * List all the keys
   *
   * @example
   * ```js
   * const keys = await ipfs.key.list()
   *
   * console.log(keys)
   * // [
   * //   { id: 'QmTe4tuceM2sAmuZiFsJ9tmAopA8au71NabBDdpPYDjxAb',
   * //     name: 'self' },
   * //   { id: 'QmWETF5QvzGnP7jKq5sPDiRjSM2fzwzNsna4wSBEzRzK6W',
   * //     name: 'my-key' }
   * // ]
   * ```
   */
  async function list (options?: ClientOptions): Promise<Key[]> {
    const res = await api.post('key/list', {
      signal: options?.signal,
      searchParams: toUrlSearchParams(options),
      headers: options?.headers
    })
    const data = await res.json()

    return (data.Keys ?? []).map((k: any) => objectToCamel(k))
  }
  return list
})
