import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions } from '../types.js'

export const createSet = configure(api => {
  /**
   * Adds or replaces a config value. Note that restarting the node will be
   * necessary for any change to take effect.
   */
  const set = async (key: string, value: any, options?: ClientOptions): Promise<void> => {
    if (typeof key !== 'string') {
      throw new Error('Invalid key type')
    }

    const params = {
      ...options,
      ...encodeParam(key, value)
    }

    const res = await api.post('config', {
      signal: options?.signal,
      searchParams: toUrlSearchParams(params),
      headers: options?.headers
    })

    await res.text()
  }

  return set
})

const encodeParam = (key: string, value: any): object => {
  switch (typeof value) {
    case 'boolean':
      return { arg: [key, value.toString()], bool: true }
    case 'string':
      return { arg: [key, value] }
    default:
      return { arg: [key, JSON.stringify(value)], json: true }
  }
}
