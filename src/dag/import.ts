import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import { abortSignal } from '../lib/abort-signal.js'
import { multipartRequest } from 'ipfs-core-utils/multipart-request'
import { CID } from 'multiformats/cid'
import type { ClientOptions, PreloadOptions } from '../types.js'

export interface ImportOptions extends ClientOptions, PreloadOptions {
  /**
   * Recursively pin roots for the imported CARs, defaults to true.
   */
  pinRoots?: boolean
}

export interface ImportResult {
  /**
   * A list of roots and their pin status if `pinRoots` was set.
   */
  root: ImportRootStatus
}

export interface ImportRootStatus {
  /**
   * CID of a root that was recursively pinned.
   */
  cid: CID

  /**
   * The error message if the pin was unsuccessful.
   */
  pinErrorMsg?: string
}

export const createImport = configure(api => {
  /**
   * Import all blocks from one or more CARs and optionally recursively pin the roots identified
   * within the CARs.
   */
  async function * dagImport (source: Iterable<Uint8Array> | AsyncIterable<Uint8Array> | AsyncIterable<AsyncIterable<Uint8Array>> | Iterable<AsyncIterable<Uint8Array>>, options?: ImportOptions): AsyncIterable<ImportResult> {
    const controller = new AbortController()
    const signal = abortSignal(controller.signal, options?.signal)
    const { headers, body } = await multipartRequest(source, controller, options?.headers)

    const res = await api.post('dag/import', {
      signal,
      headers,
      body,
      searchParams: toUrlSearchParams({ 'pin-roots': options?.pinRoots })
    })

    for await (const { Root } of res.ndjson()) {
      if (Root !== undefined) {
        const { Cid: { '/': Cid }, PinErrorMsg } = Root

        yield {
          root: {
            cid: CID.parse(Cid),
            pinErrorMsg: PinErrorMsg
          }
        }
      }
    }
  }

  return dagImport
})
