import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import HTTP from 'ipfs-utils/src/http.js'
import type { ClientOptions } from '../types.js'
import type { MFSOptions } from './utils.js'

export interface RmOptions extends MFSOptions, ClientOptions {
  /**
   * If true all paths under the specifed path(s) will be removed
   */
  recursive?: boolean

  /**
   * Forcibly remove target at path; implies recursive for directories.
   */
  force?: boolean
}

export const createRm = configure(api => {
  /**
   * Remove a file or directory
   *
   * @example
   * ```js
   * // To remove a file
   * await ipfs.files.rm('/my/beautiful/file.txt')
   *
   * // To remove multiple files
   * await ipfs.files.rm(['/my/beautiful/file.txt', '/my/other/file.txt'])
   *
   * // To remove a directory
   * await ipfs.files.rm('/my/beautiful/directory', { recursive: true })
   * ```
   */
  async function rm (path: string | string[], options?: RmOptions): Promise<void> {
    const res = await api.post('files/rm', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: path,
        ...options
      }),
      headers: options?.headers
    })

    const body = await res.text()
    // we don't expect text body to be ever present
    // (if so, it means an error such as https://github.com/ipfs/go-ipfs/issues/8606)
    if (body !== '') {
      /** @type {Error} */
      const error = new HTTP.HTTPError(res)
      error.message = body
      throw error
    }
  }
  return rm
})
