import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { multipartRequest } from 'ipfs-core-utils/multipart-request'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import { abortSignal } from '../lib/abort-signal.js'
import type { Config } from './utils.js'
import type { ClientOptions } from '../types.js'

export const createReplace = configure(api => {
  /**
   * Replaces the full config. Note that restarting the node will be
   * necessary for any change to take effect.
   */
  const replace = async (config: Config, options?: ClientOptions): Promise<void> => {
    // allow aborting requests on body errors
    const controller = new AbortController()
    const signal = abortSignal(controller.signal, options?.signal)

    const res = await api.post('config/replace', {
      signal,
      searchParams: toUrlSearchParams(options),
      ...(
        await multipartRequest([uint8ArrayFromString(JSON.stringify(config))], controller, options?.headers)
      )
    })

    await res.text()
  }

  return replace
})
