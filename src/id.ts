import { objectToCamel } from './lib/object-to-camel.js'
import { multiaddr } from '@multiformats/multiaddr'
import { configure } from './lib/configure.js'
import { toUrlSearchParams } from './lib/to-url-search-params.js'
import { peerIdFromString } from '@libp2p/peer-id'

import type { Multiaddr, IpfsUtilsHttpClient, ClientOptions } from './types'
import type { PeerId } from '@libp2p/interface-peer-id'

export interface IDOptions extends ClientOptions {
  peerId?: PeerId
}

export interface IDResult {
  id: PeerId
  publicKey: string
  addresses: Multiaddr[]
  agentVersion: string
  protocolVersion: string
  protocols: string[]
}

export const createId = configure((api: IpfsUtilsHttpClient) => {
  /**
   * Returns the identity of the Peer
   *
   * @example
   * ```js
   * const identity = await ipfs.id()
   * console.log(identity)
   * ```
   */
  async function id (options?: IDOptions): Promise<IDResult> {
    const res = await api.post('id', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: options?.peerId != null ? options?.peerId.toString() : undefined,
        ...options
      }),
      headers: options?.headers
    })
    const data = await res.json()

    const output = {
      ...objectToCamel(data)
    }

    output.id = peerIdFromString(output.id)

    if (output.addresses != null) {
      output.addresses = output.addresses.map((ma: string) => multiaddr(ma))
    }

    // @ts-expect-error server output is not typed
    return output
  }
  return id
})
