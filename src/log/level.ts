import { objectToCamel } from '../lib/object-to-camel.js'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions } from '../types.js'

export const createLevel = configure(api => {
  async function level (subsystem: string, level: string, options?: ClientOptions): Promise<any> {
    const res = await api.post('log/level', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: [
          subsystem,
          level
        ],
        ...options
      }),
      headers: options?.headers
    })

    return objectToCamel(await res.json())
  }
  return level
})
