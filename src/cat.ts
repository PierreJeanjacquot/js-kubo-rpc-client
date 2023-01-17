import { configure } from './lib/configure.js'
import { toUrlSearchParams } from './lib/to-url-search-params.js'
import type { ClientOptions, IPFSPath, PreloadOptions } from './types.js'

export interface CatOptions extends ClientOptions, PreloadOptions {
  /**
   * An offset to start reading the file from
   */
  offset?: number
  /**
   * An optional max length to read from the file
   */
  length?: number
}

export const createCat = configure(api => {
  /**
   * Returns content of the file addressed by a valid IPFS Path or CID
   */
  async function * cat (path: IPFSPath, options?: CatOptions): AsyncIterable<Uint8Array> {
    const res = await api.post('cat', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: path.toString(),
        ...options
      }),
      headers: options?.headers
    })

    yield * res.iterator()
  }

  return cat
})
