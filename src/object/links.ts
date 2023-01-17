import type { PBLink } from '@ipld/dag-pb'
import { CID } from 'multiformats/cid'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions, PreloadOptions } from '../types.js'

export const createLinks = configure(api => {
  /**
   * @deprecated function will be removed in the future.
   */
  async function links (cid: CID, options?: ClientOptions & PreloadOptions): Promise<PBLink[]> {
    const res = await api.post('object/links', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: (cid instanceof Uint8Array ? CID.decode(cid) : cid).toString(),
        ...options
      }),
      headers: options?.headers
    })
    const data = await res.json()

    return (data.Links ?? []).map((link: any) => ({
      Name: link.Name,
      Tsize: link.Size,
      Hash: CID.parse(link.Hash)
    }))
  }
  return links
})
