import { createQuery } from './query.js'
import { createRouting } from '../routing'
import type { Options } from '../types.js'

export function createDht (options: Options) {
  const routing = createRouting(options)

  return {
    /**
     * @deprecated use routing.findPeer instead.
     */
    findPeer: routing.findPeer,
    /**
     * @deprecated use routing.findProvs instead.
     */
    findProvs: routing.findProvs,
    /**
     * @deprecated use routing.get instead.
     */
    get: routing.get,
    /**
     * @deprecated use routing.provide instead.
     */
    provide: routing.provide,
    /**
     * @deprecated use routing.put instead.
     */
    put: routing.put,
    query: createQuery(options)
  }
}
