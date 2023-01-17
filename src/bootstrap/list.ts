import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import { Multiaddr, multiaddr } from '@multiformats/multiaddr'
import type { ClientOptions } from '../types.js'

export const createList = configure(api => {
  /**
   * List all peer addresses in the bootstrap list
   *
   * @example
   * ```js
   * const res = await ipfs.bootstrap.list()
   * console.log(res.Peers)
   * // Logs:
   * // [address1, address2, ...]
   * ```
   */
  async function list (options?: ClientOptions): Promise<{ Peers: Multiaddr[] }> {
    const res = await api.post('bootstrap/list', {
      signal: options?.signal,
      searchParams: toUrlSearchParams(options),
      headers: options?.headers
    })

    const { Peers } = await res.json()

    return { Peers: Peers.map((ma: string) => multiaddr(ma)) }
  }

  return list
})
