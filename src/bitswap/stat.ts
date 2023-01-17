import { CID } from 'multiformats/cid'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import { peerIdFromString } from '@libp2p/peer-id'
import type { PeerId } from '@libp2p/interface-peer-id'
import type { ClientOptions } from '../types.js'

export interface Stats {
  provideBufLen: number
  wantlist: CID[]
  peers: PeerId[]
  blocksReceived: bigint
  dataReceived: bigint
  blocksSent: bigint
  dataSent: bigint
  dupBlksReceived: bigint
  dupDataReceived: bigint
}

export const createStat = configure(api => {
  /**
   * Show diagnostic information on the bitswap agent.
   * Note: `bitswap.stat` and `stats.bitswap` can be used interchangeably.
   *
   * @example
   * ```js
   * const stats = await ipfs.bitswap.stat()
   * console.log(stats)
   * ```
   */
  async function stat (options?: ClientOptions): Promise<Stats> {
    const res = await api.post('bitswap/stat', {
      searchParams: toUrlSearchParams(options),
      signal: options?.signal,
      headers: options?.headers
    })

    return toCoreInterface(await res.json())
  }
  return stat
})

function toCoreInterface (res: any): Stats {
  return {
    provideBufLen: res.ProvideBufLen,
    wantlist: (res.Wantlist ?? []).map((k: Record<string, any>) => CID.parse(k['/'])),
    peers: (res.Peers ?? []).map((str: string) => peerIdFromString(str)),
    blocksReceived: BigInt(res.BlocksReceived),
    dataReceived: BigInt(res.DataReceived),
    blocksSent: BigInt(res.BlocksSent),
    dataSent: BigInt(res.DataSent),
    dupBlksReceived: BigInt(res.DupBlksReceived),
    dupDataReceived: BigInt(res.DupDataReceived)
  }
}
