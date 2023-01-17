import type { PBLink } from '@ipld/dag-pb'
import { CID } from 'multiformats/cid'
import { configure } from '../../lib/configure.js'
import { toUrlSearchParams } from '../../lib/to-url-search-params.js'
import type { ClientOptions } from '../../types.js'

export const createRmLink = configure(api => {
  /**
   * @deprecated function will be removed in the future.
   */
  async function rmLink (cid: CID, link: PBLink | string, options?: ClientOptions): Promise<CID> {
    const res = await api.post('object/patch/rm-link', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: [
          cid.toString(),
          // @ts-expect-error loose types
          dLink.Name ?? dLink.name ?? null
        ],
        ...options
      }),
      headers: options?.headers
    })

    const { Hash } = await res.json()
    return CID.parse(Hash)
  }
  return rmLink
})
