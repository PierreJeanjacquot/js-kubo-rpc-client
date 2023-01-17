import type { PeerId } from '@libp2p/interface-peer-id'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions } from '../types.js'

export interface ResolveOptions extends ClientOptions {
  /**
   * resolve until the result is not an IPNS name
   */
  recursive?: boolean

  /**
   * do not use cached entries
   */
  nocache?: boolean
}

export const createResolve = configure(api => {
  /**
   * Given a key, query the DHT for its best value.
   *
   * @example
   * ```js
   * // The IPNS address you want to resolve
   * const addr = '/ipns/ipfs.io'
   *
   * for await (const name of ipfs.name.resolve(addr)) {
   *   console.log(name)
   * }
   * // Logs: /ipfs/QmQrX8hka2BtNHa8N8arAq16TCVx5qHcb46c5yPewRycLm
   * ```
   */
  async function * resolve (path: PeerId | string, options?: ResolveOptions): AsyncIterable<string> {
    const res = await api.post('name/resolve', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: path,
        stream: true,
        ...options
      }),
      headers: options?.headers
    })

    for await (const result of res.ndjson()) {
      yield result.Path
    }
  }
  return resolve
})
