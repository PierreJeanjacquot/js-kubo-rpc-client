import { objectToCamel } from '../../lib/object-to-camel.js'
import { configure } from '../../lib/configure.js'
import { toUrlSearchParams } from '../../lib/to-url-search-params.js'
import type { ClientOptions } from '../../types.js'

export interface PubsubStateResult {
  enabled: boolean
}

export const createState = configure(api => {
  /**
   * Query the state of IPNS pubsub.
   *
   * @returns {Promise<{ enabled: boolean }>}
   * ```js
   * const result = await ipfs.name.pubsub.state()
   * console.log(result.enabled)
   * // Logs: true
   * ```
   */
  async function state (options?: ClientOptions): Promise<PubsubStateResult> {
    const res = await api.post('name/pubsub/state', {
      signal: options?.signal,
      searchParams: toUrlSearchParams(options),
      headers: options?.headers
    })

    // @ts-expect-error server output is not typed
    return objectToCamel(await res.json())
  }
  return state
})
