import { CID } from 'multiformats/cid'
import { multipartRequest } from 'ipfs-core-utils/multipart-request'
import { configure } from '../../lib/configure.js'
import { toUrlSearchParams } from '../../lib/to-url-search-params.js'
import { abortSignal } from '../../lib/abort-signal.js'
import type { ClientOptions } from '../../types.js'

export const createSetData = configure(api => {
  /**
   * @deprecated function will be removed in the future.
   */
  async function setData (cid: CID, data: Uint8Array, options?: ClientOptions): Promise<CID> {
    // allow aborting requests on body errors
    const controller = new AbortController()
    const signal = abortSignal(controller.signal, options?.signal)

    const res = await api.post('object/patch/set-data', {
      signal,
      searchParams: toUrlSearchParams({
        arg: [
          cid.toString()
        ],
        ...options
      }),
      ...(
        await multipartRequest([data], controller, options?.headers)
      )
    })

    const { Hash } = await res.json()

    return CID.parse(Hash)
  }
  return setData
})
