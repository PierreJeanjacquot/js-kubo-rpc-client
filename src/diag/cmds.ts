import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions } from '../types.js'

export interface CmdsResult {
  active: boolean
  args: string[]
  endTime: Date
  id: string
  options: Record<string, any>
  startTime: Date
}

export const createCmds = configure(api => {
  async function cmds (options?: ClientOptions): Promise<CmdsResult[]> {
    const res = await api.post('diag/cmds', {
      signal: options?.signal,
      searchParams: toUrlSearchParams(options),
      headers: options?.headers
    })

    return await res.json()
  }
  return cmds
})
