import { objectToCamel } from '../lib/object-to-camel.js'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { Key } from './key.js'
import type { ClientOptions } from '../types.js'

export const createImport = configure(api => {
  /**
   * Import a key
   *
   * @example
   * ```js
   * const key = await ipfs.key.import('clone', pem, 'password')
   *
   * console.log(key)
   * // { id: 'QmQRiays958UM7norGRQUG3tmrLq8pJdmJarwYSk2eLthQ',
   * //   name: 'clone' }
   * ```
   */
  async function importKey (name: string, pem: string, password: string, options?: ClientOptions): Promise<Key> {
    const res = await api.post('key/import', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: name,
        pem,
        password,
        ...options
      }),
      headers: options?.headers
    })
    const data = await res.json()

    // @ts-expect-error server output is not typed
    return objectToCamel(data)
  }
  return importKey
})
