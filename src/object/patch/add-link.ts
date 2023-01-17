import { CID } from 'multiformats/cid'
import { configure } from '../../lib/configure.js'
import { toUrlSearchParams } from '../../lib/to-url-search-params.js'
import type { PBLink } from '@ipld/dag-pb'
import type { ClientOptions } from '../../types.js'

export const createAddLink = configure(api => {
  /**
   * @deprecated function will be removed in the future.
   */
  async function addLink (cid: CID, link: PBLink, options?: ClientOptions): Promise<CID> {
    const res = await api.post('object/patch/add-link', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: [
          cid.toString(),
          // @ts-expect-error loose types
          dLink.Name ?? dLink.name ?? '',
          // @ts-expect-error loose types
          (dLink.Hash ?? dLink.cid ?? '').toString() ?? null
        ],
        ...options
      }),
      headers: options?.headers
    })

    const { Hash } = await res.json()
    return CID.parse(Hash)
  }

  return addLink
})
