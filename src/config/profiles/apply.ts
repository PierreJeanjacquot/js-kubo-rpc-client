import { configure } from '../../lib/configure.js'
import { toUrlSearchParams } from '../../lib/to-url-search-params.js'
import type { ClientOptions } from '../../types.js'
import type { Config } from '../utils.js'

export interface ProfilesApplyOptions extends ClientOptions {
  dryRun?: boolean
}

export interface ProfilesApplyResult {
  original: Config
  updated: Config
}

export const createApply = configure(api => {
  /**
   * Apply a profile to the current config.  Note that restarting the node
   * will be necessary for any change to take effect.
   */
  async function apply (profile: string, options?: ProfilesApplyOptions): Promise<ProfilesApplyResult> {
    const res = await api.post('config/profile/apply', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: profile,
        ...options
      }),
      headers: options?.headers
    })
    const data = await res.json()

    return {
      original: data.OldCfg, updated: data.NewCfg
    }
  }

  return apply
})
