import { CID } from 'multiformats/cid'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions, PreloadOptions } from '../types.js'

export interface NewObjectOptions extends ClientOptions, PreloadOptions {
  template?: 'unixfs-dir'
}

export const createNew = configure(api => {
  /**
   * @deprecated function will be removed in the future.
   */
  async function newObject (options?: NewObjectOptions): Promise<CID> {
    const res = await api.post('object/new', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: options?.template,
        ...options
      }),
      headers: options?.headers
    })

    const { Hash } = await res.json()

    return CID.parse(Hash)
  }
  return newObject
})
