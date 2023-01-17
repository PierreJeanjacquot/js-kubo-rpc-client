import { CID } from 'multiformats/cid'
import { multipartRequest } from 'ipfs-core-utils/multipart-request'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import { abortSignal } from '../lib/abort-signal.js'
import type { ClientOptions, PreloadOptions } from '../types.js'

export interface PutOptions extends ClientOptions, PreloadOptions {
  /**
   * Multicodec to use in returned CID. (Defaults to 'raw')
   */
  cidCodec?: string

  /**
   * Multihash hashing algorithm to use. (Defaults to 'sha2-256')
   */
  mhtype?: string

  /**
   * Multihash hash length. (Defaults to `-1`)
   */
  mhlen?: number

  /**
   * Pin this block when adding. (Defaults to `false`)
   */
  pin?: boolean

  /**
   * Disable block size check and allow creation of blocks larger than 1 MiB.
   * WARNING: such blocks won't be transferable over the standard bitswap.
   */
  allowBigBlock?: boolean

  /**
   * DEPRECATED: The codec to use to create the CID
   */
  format?: string
}

export const createPut = configure(api => {
  /**
   * Stores a Uint8Array as a block in the underlying blockstore
   *
   * @example
   * ```js
   * import * as dagPB from '@ipld/dag-pb'
   * // Defaults
   * const encoder = new TextEncoder()
   * const decoder = new TextDecoder()
   *
   * const bytes = encoder.encode('a serialized object')
   * const cid = await ipfs.block.put(bytes)
   *
   * console.log(decoder.decode(block.data))
   * // Logs:
   * // a serialized object
   * console.log(block.cid.toString())
   * // Logs:
   * // the CID of the object
   * ```
   */
  async function put (data: Uint8Array, options?: PutOptions): Promise<CID> {
    // allow aborting requests on body errors
    const controller = new AbortController()
    const signal = abortSignal(controller.signal, options?.signal)

    let res
    try {
      const response = await api.post('block/put', {
        signal,
        searchParams: toUrlSearchParams(options),
        ...(
          await multipartRequest([data], controller, options?.headers)
        )
      })
      res = await response.json()
    } catch (/** @type {any} */ err) {
      // Retry with "protobuf"/"cbor" format for go-ipfs
      // TODO: remove when https://github.com/ipfs/go-cid/issues/75 resolved
      if (options?.format === 'dag-pb') {
        return await put(data, { ...options, format: 'protobuf' })
      } else if (options?.format === 'dag-cbor') {
        return await put(data, { ...options, format: 'cbor' })
      }

      throw err
    }

    return CID.parse(res.Key)
  }

  return put
})
