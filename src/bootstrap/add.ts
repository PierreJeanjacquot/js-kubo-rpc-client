import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import { multiaddr } from '@multiformats/multiaddr'
import type { Multiaddr } from '@multiformats/multiaddr'
import type { ClientOptions } from '../types.js'

export const createAdd = configure(api => {
  /**
   * Add a peer address to the bootstrap list
   *
   * @example
   * ```js
   * const validIp4 = '/ip4/104....9z'
   *
   * const res = await ipfs.bootstrap.add(validIp4)
   * console.log(res.Peers)
   * // Logs:
   * // ['/ip4/104....9z']
   * ```
   */
  async function add (addr: Multiaddr, options?: ClientOptions): Promise<{ Peers: Multiaddr[] }> {
    const res = await api.post('bootstrap/add', {
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

  return add
})
