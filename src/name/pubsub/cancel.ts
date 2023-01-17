import { objectToCamel } from '../../lib/object-to-camel.js'
import { configure } from '../../lib/configure.js'
import { toUrlSearchParams } from '../../lib/to-url-search-params.js'
import type { ClientOptions } from '../../types.js'

export interface PubsubCancelResult {
  canceled: boolean
}

export const createCancel = configure(api => {
  /**
   * Cancel a name subscription.
   *
   * @example
   * ```js
   * const name = 'QmQrX8hka2BtNHa8N8arAq16TCVx5qHcb46c5yPewRycLm'
   * const result = await ipfs.name.pubsub.cancel(name)
   * console.log(result.canceled)
   * // Logs: true
   * ```
   */
  async function cancel (name: string, options?: ClientOptions): Promise<PubsubCancelResult> {
    const res = await api.post('name/pubsub/cancel', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: name,
        ...options
      }),
      headers: options?.headers
    })

    // @ts-expect-error server output is not typed
    return objectToCamel(await res.json())
  }
  return cancel
})
