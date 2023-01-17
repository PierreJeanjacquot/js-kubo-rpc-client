import { CID } from 'multiformats/cid'
import { objectToCamel } from './lib/object-to-camel.js'
import { configure } from './lib/configure.js'
import { multipartRequest } from 'ipfs-core-utils/multipart-request'
import { toUrlSearchParams } from './lib/to-url-search-params.js'
import { abortSignal } from './lib/abort-signal.js'
import type { ClientOptions, IPFSCoreAddProgressFn, IPFSUtilsHttpUploadProgressFn } from './types.js'
import type { Version as CIDVersion } from 'multiformats/cid'
import type { Mtime } from 'ipfs-unixfs'
import type { ImportCandidateStream } from 'ipfs-core-types/src/utils.js'

export interface AddProgressFn { (bytes: number, path?: string): void }

export interface AddOptions extends ClientOptions {
  /**
   * Chunking algorithm used to build ipfs DAGs. (defaults to 'size-262144')
   */
  chunker?: string
  /**
   * The CID version to use when storing the data
   */
  cidVersion?: CIDVersion

  /**
   * Multihash hashing algorithm to use. (Defaults to 'sha2-256')
   */
  hashAlg?: string

  /**
   * If true, will not add blocks to the blockstore. (Defaults to `false`)
   */
  onlyHash?: boolean

  /**
   * Pin this object when adding. (Defaults to `true`)
   */
  pin?: boolean

  /**
   * A function that will be called with the number of bytes added as a file is
   * added to ipfs and the path of the file being added.
   *
   * **Note** It will not be called for directory entries.
   */
  progress?: AddProgressFn

  /**
   * If true, DAG leaves will contain raw file data and not be wrapped in a
   * protobuf. (Defaults to `false`)
   */
  rawLeaves?: boolean

  /**
   * If true will use the
   * [trickle DAG](https://godoc.org/github.com/ipsn/go-ipfs/gxlibs/github.com/ipfs/go-unixfs/importer/trickle)
   * format for DAG generation. (Defaults to `false`).
   */
  trickle?: boolean

  /**
   * Adds a wrapping node around the content. (Defaults to `false`)
   */
  wrapWithDirectory?: boolean

  /**
   * Whether to preload all blocks created during this operation
   */
  preload?: boolean

  /**
   * How many blocks from a file to write concurrently
   */
  blockWriteConcurrency?: number
}

export interface AddAllOptions extends AddOptions {

  /**
   * Allows to create directories with an unlimited number of entries currently
   * size of unixfs directories is limited by the maximum block size.
   * ** Note ** that this is an experimental feature. (Defaults to `false`)
   */
  enableShardingExperiment?: boolean

  /**
   * Directories with more than this number of files will be created as HAMT -
   * sharded directories. (Defaults to 1000)
   */
  shardSplitThreshold?: number

  /**
   * How many files to write concurrently
   */
  fileImportConcurrency?: number
}

export interface AddResult {
  cid: CID
  size: number
  path: string
  mode?: number
  mtime?: Mtime
}

export const createAddAll = configure((api) => {
  /**
   * Import multiple files and data into IPFS
   */
  async function * addAll (source: ImportCandidateStream, options?: AddAllOptions): AsyncIterable<AddResult> {
    // allow aborting requests on body errors
    const controller = new AbortController()
    const signal = abortSignal(controller.signal, options?.signal)
    const { headers, body, total, parts } =
      await multipartRequest(source, controller, options?.headers)

    // In browser response body only starts streaming once upload is
    // complete, at which point all the progress updates are invalid. If
    // length of the content is computable we can interpret progress from
    // `{ total, loaded}` passed to `onUploadProgress` and `multipart.total`
    // in which case we disable progress updates to be written out.
    const [progressFn, onUploadProgress] = typeof options?.progress === 'function'
      ? createProgressHandler(total, parts, options.progress)
      : [undefined, undefined]

    const res = await api.post('add', {
      searchParams: toUrlSearchParams({
        'stream-channels': true,
        ...options,
        progress: Boolean(progressFn)
      }),
      onUploadProgress,
      signal,
      headers,
      body
    })

    for await (let file of res.ndjson()) {
      file = objectToCamel(file)

      if (file.hash !== undefined) {
        yield toCoreInterface(file)
      } else if (progressFn != null) {
        progressFn(file.bytes ?? 0, file.name)
      }
    }
  }
  return addAll
})

interface ProgressPart {
  name: string
  start: number
  end: number
}

/**
 * Returns simple progress callback when content length isn't computable or a
 * progress event handler that calculates progress from upload progress events.
 */
const createProgressHandler = (total: number, parts: ProgressPart[]|null, progress: IPFSCoreAddProgressFn): [IPFSCoreAddProgressFn|undefined, IPFSUtilsHttpUploadProgressFn|undefined] =>
  parts != null ? [undefined, createOnUploadProgress(total, parts, progress)] : [progress, undefined]

/**
 * Creates a progress handler that interpolates progress from upload progress
 * events and total size of the content that is added.
 */
const createOnUploadProgress = (size: number, parts: ProgressPart[], progress: IPFSCoreAddProgressFn): IPFSUtilsHttpUploadProgressFn => {
  let index = 0
  const count = parts.length
  return ({ loaded, total }) => {
    // Derive position from the current progress.
    const position = Math.floor(loaded / total * size)
    while (index < count) {
      const { start, end, name } = parts[index]
      // If within current part range report progress and break the loop
      if (position < end) {
        progress(position - start, name)
        break
      // If passed current part range report final byte for the chunk and
      // move to next one.
      } else {
        progress(end - start, name)
        index += 1
      }
    }
  }
}

function toCoreInterface ({ name, hash, size, mode, mtime, mtimeNsecs }: any) {
  const output: AddResult = {
    path: name,
    cid: CID.parse(hash),
    size: parseInt(size)
  }

  if (mode != null) {
    output.mode = parseInt(mode, 8)
  }

  if (mtime != null) {
    output.mtime = {
      secs: mtime,
      nsecs: mtimeNsecs ?? 0
    }
  }

  return output
}
