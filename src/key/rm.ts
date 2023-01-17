import { objectToCamel } from '../lib/object-to-camel.js'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { Key } from './key.js'
import type { ClientOptions } from '../types.js'

export const createRm = configure(api => {
  /**
   * Remove a key
   *
   * @example
   * ```js
   * const key = await ipfs.key.rm('my-key')
   *
   * console.log(key)
   * // { id: 'QmWETF5QvzGnP7jKq5sPDiRjSM2fzwzNsna4wSBEzRzK6W',
   * //   name: 'my-key' }
   * ```
   */
  async function rm (name: string, options?: ClientOptions): Promise<Key> {
    const res = await api.post('key/rm', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: name,
        ...options
      }),
      headers: options?.headers
    })
    const data = await res.json()

    // @ts-expect-error server output is not typed
    return objectToCamel(data.Keys[0])
  }
  return rm
})
