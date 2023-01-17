import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions } from '../types.js'

export const createMv = configure(api => {
  /**
   * Move files from one location to another
   *
   * - If from has multiple values then to must be a directory.
   * - If from has a single value and to exists and is a directory, from will be moved into to.
   * - If from has a single value and to exists and is a file, from must be a file and the contents of to will be replaced with the contents of from otherwise an error will be returned.
   * - If from is an IPFS path, and an MFS path exists with the same name, the IPFS path will be chosen.
   * - If from is an IPFS path and the content does not exist in your node's repo, only the root node of the source file with be retrieved from the network and linked to from the destination. The remainder of the file will be retrieved on demand.
   * - All values of from will be removed after the operation is complete unless they are an IPFS path.
   *
   * @example
   * ```js
   * await ipfs.files.mv('/src-file', '/dst-file')
   *
   * await ipfs.files.mv('/src-dir', '/dst-dir')
   *
   * await ipfs.files.mv('/src-file1', '/src-file2', '/dst-dir')
   * ```
   */
  async function mv (sources: string | string[], destination: string, options?: ClientOptions): Promise<void> {
    if (!Array.isArray(sources)) {
      sources = [sources]
    }

    const res = await api.post('files/mv', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: sources.concat(destination),
        ...options
      }),
      headers: options?.headers
    })
    await res.text()
  }

  return mv
})
