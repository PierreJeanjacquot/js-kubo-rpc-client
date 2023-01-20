import { CID } from 'multiformats/cid'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions } from '../types.js'

export interface GCOptions extends ClientOptions {
  quiet?: boolean
}

export interface GCError {
  err: Error
  cid?: never
}

export interface GCSuccess {
  err?: never
  cid: CID
}

export type GCResult = GCSuccess | GCError

export const createGc = configure(api => {
  /**
   * Perform garbage collection on the repo
   *
   * Any unpinned blocks will be deleted
   */
  async function * gc (options?: GCOptions): AsyncIterable<GCResult> {
    const res = await api.post('repo/gc', {
      signal: options?.signal,
      searchParams: toUrlSearchParams(options),
      headers: options?.headers,
      transform: (res) => {
        return {
          err: res.Error != null ? new Error(res.Error) : null,
          cid: res?.Key?.['/'] != null ? CID.parse(res.Key['/']) : null
        }
      }
    })

    yield * res.ndjson()
  }
  return gc
})
