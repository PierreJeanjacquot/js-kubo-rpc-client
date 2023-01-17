import { createId } from './id.js'
import type { Options } from './types.js'

export const createIsOnline = (options: Options) => {
  const id = createId(options)

  async function isOnline (): Promise<boolean> {
    const res = await id()
    return Boolean(res?.addresses?.length)
  }
  return isOnline
}
