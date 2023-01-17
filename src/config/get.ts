import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions } from '../types.js'

export const createGet = configure(api => {
  /**
   * Returns a value from the currently being used config. If the daemon
   * is off, it returns the value from the stored config.
   */
  const get = async (key: string, options?: ClientOptions): Promise<string | object> => {
    if (key == null) {
      throw new Error('key argument is required')
    }

    const res = await api.post('config', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: key,
        ...options
      }),
      headers: options?.headers
    })
    const data = await res.json()
    return data.Value
  }

  return get
})
