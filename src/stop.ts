import { configure } from './lib/configure.js'
import { toUrlSearchParams } from './lib/to-url-search-params.js'
import type { ClientOptions, IpfsUtilsHttpClient } from './types'

// TODO(hacdias): rename to shutdown?
export const createStop = configure((api: IpfsUtilsHttpClient) => {
  /**
   * Stop the node
   */
  async function stop (options?: ClientOptions): Promise<void> {
    const res = await api.post('shutdown', {
      signal: options?.signal,
      searchParams: toUrlSearchParams(options),
      headers: options?.headers
    })

    await res.text()
  }
  return stop
})
