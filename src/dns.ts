import { configure } from './lib/configure.js'
import { toUrlSearchParams } from './lib/to-url-search-params.js'
import type { ClientOptions } from './types.js'

export interface DNSOptions extends ClientOptions {
  recursive?: boolean
}

export const createDns = configure(api => {
  /**
   * Resolve DNS links
   */
  const dns = async (domain: string, options?: DNSOptions): Promise<string> => {
    const res = await api.post('dns', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: domain,
        ...options
      }),
      headers: options?.headers
    })
    const data = await res.json()

    return data.Path
  }

  return dns
})
