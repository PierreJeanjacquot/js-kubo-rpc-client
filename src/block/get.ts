import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { CID } from 'multiformats/cid'
import type { ClientOptions, PreloadOptions } from '../types.js'

export const createGet = configure(api => {
  /**
   * Get a raw IPFS block
   *
   * @example
   * ```js
   * const block = await ipfs.block.get(cid)
   * console.log(block)
   * ```
   */
  async function get (cid: CID, options?: ClientOptions & PreloadOptions): Promise<Uint8Array> {
    const res = await api.post('block/get', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: cid.toString(),
        ...options
      }),
      headers: options?.headers
    })

    return new Uint8Array(await res.arrayBuffer())
  }
  return get
})
