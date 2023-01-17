import type { CID } from 'multiformats'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions, PreloadOptions } from '../types.js'

export const createExport = configure(api => {
  /**
   * Exports a CAR for the entire DAG available from the given root CID. The CAR will have a single
   * root and IPFS will attempt to fetch and bundle all blocks that are linked within the connected
   * DAG.
   */
  async function * dagExport (root: CID, options?: ClientOptions & PreloadOptions): AsyncIterable<Uint8Array> {
    const res = await api.post('dag/export', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: root.toString()
      }),
      headers: options?.headers
    })

    yield * res.iterator()
  }

  return dagExport
})
