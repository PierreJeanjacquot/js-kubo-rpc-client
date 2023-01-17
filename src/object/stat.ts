import { CID } from 'multiformats/cid'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions, PreloadOptions } from '../types.js'

export interface StatResult {
  Hash: CID
  NumLinks: number
  BlockSize: number
  LinksSize: number
  DataSize: number
  CumulativeSize: number
}

export const createStat = configure(api => {
  /**
   * @deprecated function will be removed in the future.
   */
  async function stat (cid: CID, options?: ClientOptions & PreloadOptions): Promise<StatResult> {
    const res = await api.post('object/stat', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: cid.toString(),
        ...options
      }),
      headers: options?.headers
    })

    const output = await res.json()

    return {
      ...output,
      Hash: CID.parse(output.Hash)
    }
  }
  return stat
})
