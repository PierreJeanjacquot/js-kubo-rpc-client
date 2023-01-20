import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions } from '../types.js'

export const createVersion = configure(api => {
  /**
   * If the repo has been initialized, report the current version,
   * otherwise report the version that would be initialized
   */
  async function version (options?: ClientOptions): Promise<number> {
    const res = await (await api.post('repo/version', {
      signal: options?.signal,
      searchParams: toUrlSearchParams(options),
      headers: options?.headers
    })).json()

    return res.Version
  }
  return version
})
