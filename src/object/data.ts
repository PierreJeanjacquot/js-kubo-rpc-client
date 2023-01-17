import { CID } from 'multiformats/cid'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions, PreloadOptions } from '../types.js'

export const createData = configure(api => {
  /**
   * @deprecated function will be removed in the future.
   */
  async function data (cid: CID, options?: ClientOptions & PreloadOptions): Promise<Uint8Array> {
    const res = await api.post('object/data', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: (cid instanceof Uint8Array ? CID.decode(cid) : cid).toString(),
        ...options
      }),
      headers: options?.headers
    })
    const data = await res.arrayBuffer()

    return new Uint8Array(data, 0, data.byteLength)
  }
  return data
})
