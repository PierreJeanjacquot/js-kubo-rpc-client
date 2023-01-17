import { configure } from '../lib/configure.js'
import { createPut as createDagPut } from '../dag/put.js'
import type { ClientOptions, Multicodecs, Options, PreloadOptions } from '../types.js'
import type { PBNode } from '@ipld/dag-pb'
import type { CID } from 'multiformats'

export interface PutOptions extends ClientOptions, PreloadOptions {
  pin?: boolean
}

export const createPut = (codecs: Multicodecs, options: Options) => {
  const fn = configure((api) => {
    const dagPut = createDagPut(codecs, options)

    /**
     * @deprecated function will be removed in the future.
     */
    async function put (obj: PBNode, options?: PutOptions): Promise<CID> {
      return dagPut(obj, {
        ...options,
        storeCodec: 'dag-pb',
        hashAlg: 'sha2-256',
        version: 1
      })
    }
    return put
  })

  return fn(options)
}
