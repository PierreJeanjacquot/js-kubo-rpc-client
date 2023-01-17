import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import { Multiaddr, multiaddr } from '@multiformats/multiaddr'
import type { ClientOptions } from '../types.js'

export const createRm = configure(api => {
  /**
   * Remove a peer address from the bootstrap list
   *
   * @example
   * ```js
   * const res = await ipfs.bootstrap.list()
   * console.log(res.Peers)
   * // Logs:
   * // [address1, address2, ...]
   * ```
   */
  async function rm (addr: Multiaddr, options?: ClientOptions): Promise<{ Peers: Multiaddr[] }> {
    const res = await api.post('bootstrap/rm', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: addr,
        ...options
      }),
      headers: options?.headers
    })

    const { Peers } = await res.json()

    return { Peers: Peers.map((ma: string) => multiaddr(ma)) }
  }

  return rm
})
