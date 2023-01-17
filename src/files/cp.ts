import { CID } from 'multiformats/cid'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions, IPFSPath } from '../types.js'
import type { MFSOptions } from './utils.js'

export interface CpOptions extends MFSOptions, ClientOptions {
  /**
   * The value or node that was fetched during the get operation
   */
  parents?: boolean
}

export const createCp = configure(api => {
  /**
   * Copy files from one location to another
   *
   * - If from has multiple values then to must be a directory.
   * - If from has a single value and to exists and is a directory, from will be copied into to.
   * - If from has a single value and to exists and is a file, from must be a file and the contents of to will be replaced with the contents of from otherwise an error will be returned.
   * - If from is an IPFS path, and an MFS path exists with the same name, the IPFS path will be chosen.
   * - If from is an IPFS path and the content does not exist in your node's repo, only the root node of the source file with be retrieved from the network and linked to from the destination. The remainder of the file will be retrieved on demand.
   *
   * @example
   * ```js
   * // To copy a file
   * await ipfs.files.cp('/src-file', '/dst-file')
   *
   * // To copy a directory
   * await ipfs.files.cp('/src-dir', '/dst-dir')
   *
   * // To copy multiple files to a directory
   * await ipfs.files.cp('/src-file1', '/src-file2', '/dst-dir')
   * ```
   */
  async function cp (sources: IPFSPath | IPFSPath[], destination: string, options?: CpOptions): Promise<void> {
    const sourceArr: IPFSPath[] = Array.isArray(sources) ? sources : [sources]

    const res = await api.post('files/cp', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: sourceArr.concat(destination).map(src => CID.asCID(src) != null ? `/ipfs/${src.toString()}` : src),
        ...options
      }),
      headers: options?.headers
    })

    await res.text()
  }
  return cp
})
