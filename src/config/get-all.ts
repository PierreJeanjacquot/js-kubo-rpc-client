import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions } from '../types.js'
import type { Config } from './utils.js'

export const createGetAll = configure(api => {
  /**
   * Returns the full config been used. If the daemon is off, it returns the
   * stored config
   */
  const getAll = async (options?: ClientOptions): Promise<Config> => {
    const res = await api.post('config/show', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        ...options
      }),
      headers: options?.headers
    })
    const data = await res.json()

    return data
  }

  return getAll
})
