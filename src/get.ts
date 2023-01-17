import { CID } from 'multiformats/cid'
import { configure } from './lib/configure.js'
import { toUrlSearchParams } from './lib/to-url-search-params.js'
import type { IPFSPath, PreloadOptions, IpfsUtilsHttpClient, ClientOptions } from './types.js'

export interface GetOptions extends ClientOptions, PreloadOptions {
  archive?: boolean
  compress?: boolean
  compressionLevel?: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
}

export const createGet = configure((api: IpfsUtilsHttpClient) => {
  /**
   * Fetch a file or an entire directory tree from IPFS that is addressed by a
   * valid IPFS Path
   */
  async function * get (path: IPFSPath, options?: GetOptions): AsyncIterable<Uint8Array> {
    const opts: Record<string, any> = {
      arg: `${path instanceof CID ? path.toString() : path}`,
      ...options
    }

    if (opts.compressionLevel != null) {
      opts['compression-level'] = opts.compressionLevel
      delete opts.compressionLevel
    }

    const res = await api.post('get', {
      searchParams: toUrlSearchParams(opts),
      signal: options?.signal,
      headers: options?.headers
    })

    yield * res.iterator()
  }

  return get
})
