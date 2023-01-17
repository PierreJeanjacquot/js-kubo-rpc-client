import { objectToCamel } from './lib/object-to-camel.js'
import { configure } from './lib/configure.js'
import { toUrlSearchParams } from './lib/to-url-search-params.js'
import type { ClientOptions } from './types.js'

export interface MountOptions extends ClientOptions {
  ipfsPath?: string
  ipnsPath?: string
}

export interface MountResult {
  fuseAllowOther?: boolean
  ipfs?: string
  ipns?: string
}

export const createMount = configure(api => {
  async function mount (options?: MountOptions): Promise<MountResult> {
    const res = await api.post('dns', {
      signal: options?.signal,
      searchParams: toUrlSearchParams(options),
      headers: options?.headers
    })

    return objectToCamel(await res.json())
  }
  return mount
})
