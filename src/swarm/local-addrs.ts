import { Multiaddr, multiaddr } from '@multiformats/multiaddr'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions } from '../types.js'

export const createLocalAddrs = configure(api => {
  /**
   * Local addresses this node is listening on
   */
  async function localAddrs (options?: ClientOptions): Promise<Multiaddr[]> {
    const res = await api.post('swarm/addrs/local', {
      signal: options?.signal,
      searchParams: toUrlSearchParams(options),
      headers: options?.headers
    })

    const { Strings } = await res.json()
    return (Strings ?? []).map((a: string) => multiaddr(a))
  }
  return localAddrs
})
