import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import { multipartRequest } from 'ipfs-core-utils/multipart-request'
import { abortSignal } from '../lib/abort-signal.js'
import { textToUrlSafeRpc } from '../lib/http-rpc-wire-format.js'
import type { ClientOptions } from '../types.js'

export const createPublish = configure(api => {
  /**
   * Publish a data message to a pubsub topic
   *
   * @example
   * ```js
   * const topic = 'fruit-of-the-day'
   * const msg = new TextEncoder().encode('banana')
   *
   * await ipfs.pubsub.publish(topic, msg)
   * // msg was broadcasted
   * console.log(`published to ${topic}`)
   * ```
   */
  async function publish (topic: string, data: Uint8Array, options?: ClientOptions): Promise<void> {
    const searchParams = toUrlSearchParams({
      arg: textToUrlSafeRpc(topic),
      ...options
    })

    // allow aborting requests on body errors
    const controller = new AbortController()
    const signal = abortSignal(controller.signal, options?.signal)

    const res = await api.post('pubsub/pub', {
      signal,
      searchParams,
      ...(
        await multipartRequest([data], controller, options?.headers)
      )
    })

    await res.text()
  }
  return publish
})
