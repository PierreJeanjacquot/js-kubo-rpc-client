import { modeToString } from '../lib/mode-to-string.js'
import { parseMtime } from '../lib/parse-mtime.js'
import { configure } from '../lib/configure.js'
import { multipartRequest } from 'ipfs-core-utils/multipart-request'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import { abortSignal } from '../lib/abort-signal.js'
import type { MtimeLike } from 'ipfs-unixfs'
import type { AddProgressFn } from '../add-all.js'
import type { Version as CIDVersion } from 'multiformats/cid'
import type { MFSOptions } from './utils.js'
import type { ClientOptions } from '../types.js'

export interface WriteOptions extends MFSOptions, ClientOptions {
  /**
   * An offset within the file to start writing at
   */
  offset?: number

  /**
   * Optionally limit how many bytes are written
   */
  length?: number

  /**
   * Create the MFS path if it does not exist
   */
  create?: boolean

  /**
   * Create intermediate MFS paths if they do not exist
   */
  parents?: boolean

  /**
   * Truncate the file at the MFS path if it would have been larger than the passed content
   */
  truncate?: boolean

  /**
   * If true, DAG leaves will contain raw file data and not be wrapped in a protobuf
   */
  rawLeaves?: boolean

  /**
   * An integer that represents the file mode
   */
  mode?: number

  /**
   * A Date object, an object with { secs, nsecs } properties where secs is the number of seconds since (positive) or before (negative) the Unix Epoch began and nsecs is the number of nanoseconds since the last full second, or the output of process.hrtime()
   */
  mtime?: MtimeLike

  /**
   * The hash algorithm to use for any updated entries
   */
  hashAlg?: string

  /**
   * The CID version to use for any updated entries
   */
  cidVersion?: CIDVersion

  /**
   * Callback to be notified of write progress
   */
  progress?: AddProgressFn
}

export const createWrite = configure(api => {
  /**
   * @type {import('../types').FilesAPI["write"]}
   */
  async function write (path: string, input: string | Uint8Array | Blob | AsyncIterable<Uint8Array> | Iterable<Uint8Array>, options?: WriteOptions): Promise<void> {
    // allow aborting requests on body errors
    const controller = new AbortController()
    const signal = abortSignal(controller.signal, options?.signal)

    const res = await api.post('files/write', {
      signal,
      searchParams: toUrlSearchParams({
        arg: path,
        streamChannels: true,
        count: options?.length,
        ...options
      }),
      ...(
        await multipartRequest([{
          content: input,
          path: 'arg',
          mode: modeToString(options?.mode),
          mtime: parseMtime(options?.mtime)
        }], controller, options?.headers)
      )
    })

    await res.text()
  }
  return write
})
