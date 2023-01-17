import { objectToCamel } from '../lib/object-to-camel.js'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { KeyType } from '@libp2p/interface-keychain'
import type { Key } from './key.js'
import type { ClientOptions } from '../types.js'

export interface GenOptions extends ClientOptions {
  type: KeyType
  size?: number
}

const defaultOptions: GenOptions = {
  type: 'Ed25519'
}

export const createGen = configure(api => {
  /**
   * Generate a new key
   *
   * @example
   * ```js
   * const key = await ipfs.key.gen('my-key', {
   *   type: 'rsa',
   *   size: 2048
   * })
   *
   * console.log(key)
   * // { id: 'QmYWqAFvLWb2G5A69JGXui2JJXzaHXiUEmQkQgor6kNNcJ',
   * //  name: 'my-key' }
   * ```
   */
  async function gen (name: string, options: GenOptions = defaultOptions): Promise<Key> {
    const res = await api.post('key/gen', {
      signal: options.signal,
      searchParams: toUrlSearchParams({
        arg: name,
        ...options
      }),
      headers: options.headers
    })
    const data = await res.json()

    // @ts-expect-error server output is not typed
    return objectToCamel(data)
  }
  return gen
})
