import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions } from '../types.js'
import type { PeerId } from '@libp2p/interface-peer-id'

export interface BWOptions extends ClientOptions {
  /**
   * Specifies a peer to print bandwidth for
   */
  peer?: PeerId

  /**
   * Specifies a protocol to print bandwidth for
   */
  proto?: string

  /**
   * Is used to yield bandwidth info at an interval
   */
  poll?: boolean

  /**
   * The time interval to wait between updating output, if `poll` is `true`.
   */
  interval?: number | string
}

export interface BWResult {
  totalIn: bigint
  totalOut: bigint
  rateIn: number
  rateOut: number
}

export const createBw = configure(api => {
  /**
   * Return bandwidth usage stats
   */
  async function * bw (options?: BWOptions): AsyncIterable<BWResult> {
    const res = await api.post('stats/bw', {
      signal: options?.signal,
      searchParams: toUrlSearchParams(options),
      headers: options?.headers,
      transform: (stats) => ({
        totalIn: BigInt(stats.TotalIn),
        totalOut: BigInt(stats.TotalOut),
        rateIn: parseFloat(stats.RateIn),
        rateOut: parseFloat(stats.RateOut)
      })
    })

    yield * res.ndjson()
  }
  return bw
})
