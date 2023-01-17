import { CID } from 'multiformats/cid'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions } from '../types.js'

export const createFlush = configure(api => {
  /**
   * Flush a given path's data to the disk
   *
   * @example
   * ```js
   * const cid = await ipfs.files.flush('/')
   * ```
   */
  async function flush (path: string, options?: ClientOptions): Promise<CID> {
    if (path == null || typeof path !== 'string') {
      throw new Error('ipfs.files.flush requires a path')
    }

    const res = await api.post('files/flush', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: path,
        ...options
      }),
      headers: options?.headers
    })
    const data = await res.json()

    return CID.parse(data.Cid)
  }
  return flush
})
