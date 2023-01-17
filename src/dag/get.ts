import { configure } from '../lib/configure.js'
import { resolve } from '../lib/resolve.js'
import first from 'it-first'
import last from 'it-last'
import errCode from 'err-code'
import { createGet as createBlockGet } from '../block/get.js'
import type { ClientOptions, Multicodecs, Options, PreloadOptions } from '../types.js'
import type { CID } from 'multiformats'

// TODO: this does not use the RPC API.

export interface GetOptions extends ClientOptions, PreloadOptions {
  /**
   * An optional path within the DAG to resolve
   */
  path?: string

  /**
   * If set to true, it will avoid resolving through different objects
   */
  localResolve?: boolean
}

export interface GetResult {
  /**
   * The value or node that was fetched during the get operation
   */
  value: any

  /**
   * The remainder of the Path that the node was unable to resolve or what was left in a localResolve scenario
   */
  remainderPath?: string
}

export const createGet = (codecs: Multicodecs, options: Options) => {
  const fn = configure((api, opts) => {
    const getBlock = createBlockGet(opts)

    /**
     * Retrieve an IPLD format node
     *
     * @example
     * ```js
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
     * // zdpuAmtur968yprkhG9N5Zxn6MFVoqAWBbhUAkNLJs2UtkTq5
     *
     * async function getAndLog(cid, path) {
     *   const result = await ipfs.dag.get(cid, { path })
     *   console.log(result.value)
     * }
     *
     * await getAndLog(cid, '/a')
     * // Logs:
     * // 1
     *
     * await getAndLog(cid, '/b')
     * // Logs:
     * // [1, 2, 3]
     *
     * await getAndLog(cid, '/c')
     * // Logs:
     * // {
     * //   ca: [5, 6, 7],
     * //   cb: 'foo'
     * // }
     *
     * await getAndLog(cid, '/c/ca/1')
     * // Logs:
     * // 6
     * ```
     */
    const get = async (cid: CID, options?: GetOptions): Promise<GetResult> => {
      if (options?.path != null) {
        const entry = options.localResolve != null
          ? await first(resolve(cid, options.path, codecs, getBlock, options))
          : await last(resolve(cid, options.path, codecs, getBlock, options))
        /** @type {import('../types').GetResult | undefined} - first and last will return undefined when empty */
        const result: GetResult | undefined = (entry)

        if (result == null) {
          throw errCode(new Error('Not found'), 'ERR_NOT_FOUND')
        }

        return result
      }

      const codec = await codecs.getCodec(cid.code)
      const block = await getBlock(cid, options)
      const node = codec.decode(block)

      return {
        value: node,
        remainderPath: ''
      }
    }

    return get
  })

  return fn(options)
}
