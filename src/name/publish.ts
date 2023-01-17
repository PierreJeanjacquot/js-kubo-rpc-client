import { objectToCamel } from '../lib/object-to-camel.js'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { CID } from 'multiformats'
import type { ClientOptions } from '../types.js'

export interface PublishOptions extends ClientOptions {
  /**
   * Resolve given path before publishing
   */
  resolve?: boolean
  /**
   * Time duration of the record
   */
  lifetime?: string
  /**
   * Time duration this record should be cached
   */
  ttl?: string
  /**
   * Name of the key to be used
   */
  key?: string
  /**
   * When offline, save the IPNS record
   * to the the local datastore without broadcasting to the network instead of
   * simply failing.
   *
   * This option is not yet implemented in js-ipfs. See tracking issue [ipfs/js-ipfs#1997]
   * (https://github.com/ipfs/js-ipfs/issues/1997).
   */
  allowOffline?: boolean
}

export interface PublishResult {
  /**
   * The published IPNS name
   */
  name: string

  /**
   * The IPNS record
   */
  value: string
}

export const createPublish = configure(api => {
  /**
   * IPNS is a PKI namespace, where names are the hashes of public keys, and
   * the private key enables publishing new (signed) values. In both publish
   * and resolve, the default name used is the node's own PeerID,
   * which is the hash of its public key.
   *
   * @example
   * ```js
   * // The address of your files.
   * const addr = '/ipfs/QmbezGequPwcsWo8UL4wDF6a8hYwM1hmbzYv2mnKkEWaUp'
   * const res = await ipfs.name.publish(addr)
   * // You now have a res which contains two fields:
   * //   - name: the name under which the content was published.
   * //   - value: the "real" address to which Name points.
   * console.log(`https://gateway.ipfs.io/ipns/${res.name}`)
   * ```
   */
  async function publish (path: CID | string, options?: PublishOptions): Promise<PublishResult> {
    const res = await api.post('name/publish', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: `${path.toString()}`,
        ...options
      }),
      headers: options?.headers
    })

    // @ts-expect-error server output is not typed
    return objectToCamel(await res.json())
  }
  return publish
})
