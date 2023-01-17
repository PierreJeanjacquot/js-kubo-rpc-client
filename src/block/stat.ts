import { CID } from 'multiformats/cid'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions, PreloadOptions } from '../types.js'

export interface StatResult {
  /**
   * The CID of the block
   */
  cid: CID

  /**
   * The size of the block
   */
  size: number
}

export const createStat = configure(api => {
  /**
   * Print information of a raw IPFS block
   *
   * @example
   * ```js
   * const cid = CID.parse('QmQULBtTjNcMwMr4VMNknnVv3RpytrLSdgpvMcTnfNhrBJ')
   * const stats = await ipfs.block.stat(cid)
   * console.log(stats.cid.toString())
   * // Logs: QmQULBtTjNcMwMr4VMNknnVv3RpytrLSdgpvMcTnfNhrBJ
   * console.log(stat.size)
   * // Logs: 3739
   * ```
   */
  async function stat (cid: CID, options?: ClientOptions & PreloadOptions): Promise<StatResult> {
    const res = await api.post('block/stat', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: cid.toString(),
        ...options
      }),
      headers: options?.headers
    })
    const data = await res.json()

    return { cid: CID.parse(data.Key), size: data.Size }
  }

  return stat
})
