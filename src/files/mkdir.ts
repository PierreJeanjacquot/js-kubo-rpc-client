import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { MFSOptions } from './utils.js'
import type { Version as CIDVersion } from 'multiformats/cid'
import type { ClientOptions } from '../types.js'

export interface MkdirOptions extends MFSOptions, ClientOptions {
  /**
   * If true, create intermediate directories
   */
  parents?: boolean

  /**
   * The hash algorithm to use for any updated entries
   */
  hashAlg?: string

  /**
   * The CID version to use for any updated entries
   */
  cidVersion?: CIDVersion
}

export const createMkdir = configure(api => {
  /**
   * Make a directory in your MFS
   */
  async function mkdir (path: string, options?: MkdirOptions): Promise<void> {
    const res = await api.post('files/mkdir', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: path,
        ...options
      }),
      headers: options?.headers
    })

    await res.text()
  }
  return mkdir
})
