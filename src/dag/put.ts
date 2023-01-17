import { CID } from 'multiformats/cid'
import { configure } from '../lib/configure.js'
import { multipartRequest } from 'ipfs-core-utils/multipart-request'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import { abortSignal } from '../lib/abort-signal.js'
import type { ClientOptions, Multicodecs, Options, PreloadOptions } from '../types.js'

export interface PutOptions extends ClientOptions, PreloadOptions {
  /**
   * The codec that the input object is encoded with if a pre-encoded object is supplied.
   */
  inputCodec?: string

  /**
   * The codec that the stored object will be encoded with (defaults to 'dag-cbor')
   */
  storeCodec?: string

  /**
   * Multihash hashing algorithm to use (defaults to 'sha2-256')
   */
  hashAlg?: string

  /**
   * Pin this block when adding. (Defaults to `false`)
   */
  pin?: boolean
}

export const createPut = (codecs: Multicodecs, options: Options) => {
  const fn = configure((api) => {
    /**
     * Store an IPLD format node
     *
     * @example
     * ```js
     * const obj = { simple: 'object' }
     * const cid = await ipfs.dag.put(obj, { storeCodec: 'dag-cbor', hashAlg: 'sha2-512' })
     *
     * console.log(cid.toString())
     * // zBwWX9ecx5F4X54WAjmFLErnBT6ByfNxStr5ovowTL7AhaUR98RWvXPS1V3HqV1qs3r5Ec5ocv7eCdbqYQREXNUfYNuKG
     * ```
     */
    const put = async (dagNode: any, options?: PutOptions): Promise<CID> => {
      const settings = {
        storeCodec: 'dag-cbor',
        hashAlg: 'sha2-256',
        ...options
      }

      let serialized

      if (settings?.inputCodec != null) {
        // if you supply an inputCodec, we assume you're passing in a raw, encoded
        // block using that codec, so we'll just pass that on to the server and let
        // it deal with the decode/encode/store cycle
        if (!(dagNode instanceof Uint8Array)) {
          throw new Error('Can only inputCodec on raw bytes that can be decoded')
        }
        serialized = dagNode
      } else {
        // if you don't supply an inputCodec, we assume you've passed in a JavaScript
        // object you want to have encoded using storeCodec, so we'll prepare it for
        // you if we have the codec
        const storeCodec = await codecs.getCodec(settings.storeCodec)
        serialized = storeCodec.encode(dagNode)
        // now we have a serialized form, the server should be told to receive it
        // in that format
        settings.inputCodec = settings.storeCodec
      }

      // allow aborting requests on body errors
      const controller = new AbortController()
      const signal = abortSignal(controller.signal, settings.signal)

      const res = await api.post('dag/put', {
        timeout: settings.timeout,
        signal,
        searchParams: toUrlSearchParams(settings),
        ...(
          await multipartRequest([serialized], controller, settings.headers)
        )
      })
      const data = await res.json()

      return CID.parse(data.Cid['/'])
    }

    return put
  })

  return fn(options)
}
