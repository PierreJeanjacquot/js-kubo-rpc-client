import { CID } from 'multiformats/cid'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { PeerId } from '@libp2p/interface-peer-id'
import type { ClientOptions } from '../types.js'

export interface WantlistOptions extends ClientOptions {
  peer: PeerId
}

export const createWantlist = configure(api => {
  /**
   * Returns the wantlist for your node
   *
   * @example
   * ```js
   * const list = await ipfs.bitswap.wantlist()
   * console.log(list)
   * // [ CID('QmHash') ]
   * ```
   */
  async function wantlist (options?: WantlistOptions): Promise<CID[]> {
    const searchParams: any = { ...options }
    if (options?.peer != null) {
      searchParams.peer = options.peer.toString()
    }

    const res = await (await api.post('bitswap/wantlist', {
      signal: options?.signal,
      searchParams: toUrlSearchParams(searchParams),
      headers: options?.headers
    })).json()

    return (res.Keys ?? []).map((k: Record<string, any>) => CID.parse(k['/']))
  }
  return wantlist
})
