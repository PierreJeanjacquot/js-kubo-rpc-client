import { objectToCamel } from './lib/object-to-camel.js'
import { configure } from './lib/configure.js'
import { toUrlSearchParams } from './lib/to-url-search-params.js'
import type { ClientOptions, IpfsUtilsHttpClient } from './types'

/**
 * An object with the version information for the implementation,
 * the commit and the Repo, as well as the current 'kubo-rpc-client'
 * version in use.
 */
export interface VersionResult {
  version: string
  commit: string
  repo: string
  system: string
  golang: string
  'kubo-rpc-client': string
}

export const createVersion = configure((api: IpfsUtilsHttpClient) => {
  /**
   * Returns the implementation version
   *
   * @example
   * ```js
   * const version = await ipfs.version()
   * console.log(version)
   * ```
   */
  async function version (options?: ClientOptions): Promise<VersionResult> {
    const res = await api.post('version', {
      signal: options?.signal,
      searchParams: toUrlSearchParams(options),
      headers: options?.headers
    })

    // @ts-expect-error server output is not typed
    return {
      ...objectToCamel(await res.json()),
      'kubo-rpc-client': '1.0.0'
    }
  }

  return version
})
