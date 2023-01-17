import { CID } from 'multiformats/cid'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import type { ClientOptions, PreloadOptions } from '../types.js'
import type { PBNode } from '@ipld/dag-pb'

export const createGet = configure(api => {
  /**
   * @deprecated function will be removed in the future.
   */
  async function get (cid: CID, options?: ClientOptions & PreloadOptions): Promise<PBNode> {
    const res = await api.post('object/get', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: (cid instanceof Uint8Array ? CID.decode(cid) : cid).toString(),
        dataEncoding: 'base64',
        ...options
      }),
      headers: options?.headers
    })
    const data = await res.json()

    return {
      Data: uint8ArrayFromString(data.Data, 'base64pad'),
      Links: (data.Links ?? []).map((link: any) => ({
        Name: link.Name,
        Hash: CID.parse(link.Hash),
        Tsize: link.Size
      }))
    }
  }
  return get
})
