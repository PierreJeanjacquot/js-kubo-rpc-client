import { objectToCamel } from '../lib/object-to-camel.js'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions } from '../types.js'

export const createRename = configure(api => {
  /**
   * Rename a key
   *
   * @example
   * ```js
   * const key = await ipfs.key.rename('my-key', 'my-new-key')
   *
   * console.log(key)
   * // { id: 'Qmd4xC46Um6s24MradViGLFtMitvrR4SVexKUgPgFjMNzg',
   * //   was: 'my-key',
   * //   now: 'my-new-key',
   * //   overwrite: false }
   * ```
   */
  async function rename (oldName: string, newName: string, options?: ClientOptions): Promise<RenameKeyResult> {
    const res = await api.post('key/rename', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: [
          oldName,
          newName
        ],
        ...options
      }),
      headers: options?.headers
    })

    // @ts-expect-error server output is not typed
    return objectToCamel(await res.json())
  }
  return rename
})

export interface RenameKeyResult {
  id: string
  was: string
  now: string
  overwrite: boolean
}
