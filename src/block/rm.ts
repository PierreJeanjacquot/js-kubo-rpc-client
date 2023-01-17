import { CID } from 'multiformats/cid'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions } from '../types.js'

export interface RmOptions extends ClientOptions {
  /**
   * Ignores non-existent blocks
   */
  force?: boolean

  /**
   * Do not return output if true
   */
  quiet?: boolean
}

export interface RmResult {
  /**
   * The CID of the removed block
   */
  cid: CID

  /**
   * Any error that occurred while trying to remove the block
   */
  error?: Error
}

export const createRm = configure(api => {
  /**
   * Remove one or more IPFS block(s) from the underlying block store
   *
   * @example
   * ```js
   * for await (const result of ipfs.block.rm(cid)) {
   *   if (result.error) {
   *     console.error(`Failed to remove block ${result.cid} due to ${result.error.message}`)
   *   } else {
   *    console.log(`Removed block ${result.cid}`)
   *   }
   * }
   * ```
   */
  async function * rm (cid: CID | CID[], options?: RmOptions): AsyncIterable<RmResult> {
    if (!Array.isArray(cid)) {
      cid = [cid]
    }

    const res = await api.post('block/rm', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: cid.map(cid => cid.toString()),
        'stream-channels': true,
        ...options
      }),
      headers: options?.headers
    })

    for await (const removed of res.ndjson()) {
      yield toCoreInterface(removed)
    }
  }

  return rm
})

function toCoreInterface (removed: Record<string, string>): RmResult {
  const out: RmResult = {
    cid: CID.parse(removed.Hash)
  }

  if (removed.Error != null) {
    out.error = new Error(removed.Error)
  }

  return out
}
