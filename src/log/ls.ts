import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions } from '../types.js'

export const createLs = configure(api => {
  async function ls (options?: ClientOptions): Promise<any> {
    const res = await api.post('log/ls', {
      signal: options?.signal,
      searchParams: toUrlSearchParams(options),
      headers: options?.headers
    })

    const data = await res.json()
    return data.Strings
  }
  return ls
})
