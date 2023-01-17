import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
// @ts-expect-error no types
import toIterable from 'stream-to-it/source.js'
import type { ClientOptions, IPFSPath } from '../types.js'

export interface ReadOptions extends ClientOptions {
  /**
   * An offset to start reading the file from
   */
  offset?: number

  /**
   * An optional max length to read from the file
   */
  length?: number
}

export const createRead = configure(api => {
  /**
   * @type {import('../types').FilesAPI["read"]}
   */
  async function * read (path: IPFSPath, options?: ReadOptions): AsyncIterable<Uint8Array> {
    const res = await api.post('files/read', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: path,
        count: options?.length,
        ...options
      }),
      headers: options?.headers
    })

    yield * toIterable(res.body)
  }
  return read
})
