
import { configure } from '../../lib/configure.js'
import { toUrlSearchParams } from '../../lib/to-url-search-params.js'
import type { ClientOptions } from '../../types.js'

export const createSubs = configure(api => {
  /**
   * Show current name subscriptions.
   *
   * @example
   * ```js
   * const result = await ipfs.name.pubsub.subs()
   * console.log(result)
   * // Logs: ['/ipns/QmQrX8hka2BtNHa8N8arAq16TCVx5qHcb46c5yPewRycLm']
   * ```
   */
  async function subs (options?: ClientOptions): Promise<string[]> {
    const res = await api.post('name/pubsub/subs', {
      signal: options?.signal,
      searchParams: toUrlSearchParams(options),
      headers: options?.headers
    })
    const data = await res.json()

    return data.Strings ?? []
  }
  return subs
})
