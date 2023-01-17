import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions } from '../types.js'

export const createSys = configure(api => {
  async function sys (options?: ClientOptions): Promise<any> {
    const res = await api.post('diag/sys', {
      signal: options?.signal,
      searchParams: toUrlSearchParams(options),
      headers: options?.headers
    })

    return await res.json()
  }
  return sys
})
