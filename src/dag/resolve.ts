import { CID } from 'multiformats/cid'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions, IPFSPath, PreloadOptions } from '../types.js'

// TODO: this does not use the RPC API.

export interface ResolveOptions extends ClientOptions, PreloadOptions {
  /**
   * If ipfsPath is a CID, you may pass a path here
   */
  path?: string
}

export interface ResolveResult {
  /**
   * The last CID encountered during the traversal and the path to the end of the IPFS path inside the node referenced by the CID
   */
  cid: CID

  /**
   * The remainder of the Path that the node was unable to resolve
   */
  remainderPath?: string
}

export const createResolve = configure(api => {
  /**
   * Returns the CID and remaining path of the node at the end of the passed IPFS path
   *
   * @example
   * ```JavaScript
   * // example obj
   * const obj = {
   *   a: 1,
   *   b: [1, 2, 3],
   *   c: {
   *     ca: [5, 6, 7],
   *     cb: 'foo'
   *   }
   * }
   *
   * const cid = await ipfs.dag.put(obj, { storeCodec: 'dag-cbor', hashAlg: 'sha2-256' })
   * console.log(cid.toString())
   * // bafyreicyer3d34cutdzlsbe2nqu5ye62mesuhwkcnl2ypdwpccrsecfmjq
   *
   * const result = await ipfs.dag.resolve(`${cid}/c/cb`)
   * console.log(result)
   * // Logs:
   * // {
   * //   cid: CID(bafyreicyer3d34cutdzlsbe2nqu5ye62mesuhwkcnl2ypdwpccrsecfmjq),
   * //   remainderPath: 'c/cb'
   * // }
   * ```
   */
  const resolve = async (ipfsPath: IPFSPath, options?: ResolveOptions): Promise<ResolveResult> => {
    const res = await api.post('dag/resolve', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: `${ipfsPath.toString()}${options?.path != null ? `/${options.path}`.replace(/\/[/]+/g, '/') : ''}`,
        ...options
      }),
      headers: options?.headers
    })

    const data = await res.json()

    return { cid: CID.parse(data.Cid['/']), remainderPath: data.RemPath }
  }

  return resolve
})
