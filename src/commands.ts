import { configure } from './lib/configure.js'
import { toUrlSearchParams } from './lib/to-url-search-params.js'
import type { ClientOptions } from './types.js'

export const createCommands = configure(api => {
  /**
   * Returns a list of available commands
   */
  const commands = async (options?: ClientOptions): Promise<string[]> => {
    const res = await api.post('commands', {
      signal: options?.signal,
      searchParams: toUrlSearchParams(options),
      headers: options?.headers
    })

    const data: string[] = await res.json()
    return data
  }
  return commands
})
