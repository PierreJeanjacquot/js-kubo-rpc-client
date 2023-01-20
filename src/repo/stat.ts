import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions } from '../types.js'

export interface StatResult {
  numObjects: bigint
  repoPath: string
  repoSize: bigint
  version: string
  storageMax: bigint
}

export const createStat = configure(api => {
  /**
   * Return stats about the repo
   */
  async function stat (options?: ClientOptions): Promise<StatResult> {
    const res = await api.post('repo/stat', {
      signal: options?.signal,
      searchParams: toUrlSearchParams(options),
      headers: options?.headers
    })
    const data = await res.json()

    return {
      numObjects: BigInt(data.NumObjects),
      repoSize: BigInt(data.RepoSize),
      repoPath: data.RepoPath,
      version: data.Version,
      storageMax: BigInt(data.StorageMax)
    }
  }
  return stat
})
