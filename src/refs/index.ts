import { CID } from 'multiformats/cid'
import { objectToCamel } from '../lib/object-to-camel.js'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import { createLocal } from './local.js'
import type { ClientOptions, IPFSPath, PreloadOptions } from '../types.js'

export interface RefsOptions extends ClientOptions, PreloadOptions {
  recursive?: boolean
  unique?: boolean
  format?: string
  edges?: boolean
  maxDepth?: number
}

export interface RefsResult {
  ref: string
  err?: Error
}

export const createRefs = configure((api, opts) => {
  /**
   * @type {import('../types').RefsAPI["refs"]}
   */
  const refs = async function * (args: IPFSPath | IPFSPath[], options?: RefsOptions): AsyncIterable<RefsResult> {
    const argsArr: IPFSPath[] = Array.isArray(args) ? args : [args]

    const res = await api.post('refs', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: argsArr.map(arg => (arg instanceof Uint8Array ? CID.decode(arg) : arg).toString()),
        ...options
      }),
      headers: options?.headers,
      transform: objectToCamel
    })

    yield * res.ndjson()
  }

  return Object.assign(refs, {
    local: createLocal(opts)
  })
})
