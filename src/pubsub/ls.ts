import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import { rpcArrayToTextArray } from '../lib/http-rpc-wire-format.js'
import type { ClientOptions } from '../types.js'

export const createLs = configure(api => {
  /**
   * Returns the list of subscriptions the peer is subscribed to
   */
  async function ls (options?: ClientOptions): Promise<string[]> {
    const { Strings } = await (await api.post('pubsub/ls', {
      signal: options?.signal,
      searchParams: toUrlSearchParams(options),
      headers: options?.headers
    })).json()

    return rpcArrayToTextArray(Strings) ?? []
  }
  return ls
})
