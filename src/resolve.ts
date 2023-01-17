import { configure } from './lib/configure.js'
import { toUrlSearchParams } from './lib/to-url-search-params.js'
import type { ClientOptions, IpfsUtilsHttpClient } from './types'

export interface ResolveOptions extends ClientOptions {
  recursive?: boolean
  cidBase?: string
}

export const createResolve = configure((api: IpfsUtilsHttpClient) => {
  /**
   * Resolve the value of names to IPFS
   *
   * There are a number of mutable name protocols that can link among themselves
   * and into IPNS. For example IPNS references can (currently) point at an IPFS
   * object, and DNS links can point at other DNS links, IPNS entries, or IPFS
   * objects. This command accepts any of these identifiers and resolves them
   * to the referenced item.
   *
   * @example
   * ```js
   * // Resolve the value of your identity:
   * const name = '/ipns/QmatmE9msSfkKxoffpHwNLNKgwZG8eT9Bud6YoPab52vpy'
   *
   * const res = await ipfs.resolve(name)
   * console.log(res)
   * // Logs: /ipfs/Qmcqtw8FfrVSBaRmbWwHxt3AuySBhJLcvmFYi3Lbc4xnwj
   *
   * // Resolve the value of another name recursively:
   * const name = '/ipns/QmbCMUZw6JFeZ7Wp9jkzbye3Fzp2GGcPgC3nmeUjfVF87n'
   *
   * // Where:
   * // /ipns/QmbCMUZw6JFeZ7Wp9jkzbye3Fzp2GGcPgC3nmeUjfVF87n
   * // ...resolves to:
   * // /ipns/QmatmE9msSfkKxoffpHwNLNKgwZG8eT9Bud6YoPab52vpy
   * // ...which in turn resolves to:
   * // /ipfs/Qmcqtw8FfrVSBaRmbWwHxt3AuySBhJLcvmFYi3Lbc4xnwj
   *
   * const res = await ipfs.resolve(name, { recursive: true })
   * console.log(res)
   * // Logs: /ipfs/Qmcqtw8FfrVSBaRmbWwHxt3AuySBhJLcvmFYi3Lbc4xnwj
   *
   * // Resolve the value of an IPFS path:
   * const name = '/ipfs/QmeZy1fGbwgVSrqbfh9fKQrAWgeyRnj7h8fsHS1oy3k99x/beep/boop'
   * const res = await ipfs.resolve(name)
   * console.log(res)
   * // Logs: /ipfs/QmYRMjyvAiHKN9UTi8Bzt1HUspmSRD8T8DwxfSMzLgBon1
   * ```
   */
  async function resolve (path: string, options?: ResolveOptions): Promise<string> {
    const res = await api.post('resolve', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: path,
        ...options
      }),
      headers: options?.headers
    })
    const { Path } = await res.json()
    return Path
  }
  return resolve
})
