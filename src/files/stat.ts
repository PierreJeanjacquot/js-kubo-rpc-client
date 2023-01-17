import { CID } from 'multiformats/cid'
import { objectToCamelWithMetadata } from '../lib/object-to-camel-with-metadata.js'
import { configure } from '../lib/configure.js'
import { toUrlSearchParams } from '../lib/to-url-search-params.js'
import type { ClientOptions, IPFSPath } from '../types.js'
import type { Mtime } from 'ipfs-unixfs'

export interface StatOptions extends ClientOptions {
  /**
   * If true, return only the CID
   */
  hash?: boolean

  /**
   * If true, return only the size
   */
  size?: boolean

  /**
   * If true, compute the amount of the DAG that is local and if possible the total size
   */
  withLocal?: boolean
}

export interface StatResult {
  /**
   * A CID instance
   */
  cid: CID

  /**
   * The file size in Bytes
   */
  size: number

  /**
   * The size of the DAGNodes making up the file in Bytes
   */
  cumulativeSize: number

  /**
   * Either directory or file
   */
  type: 'directory' | 'file'

  /**
   * If type is directory, this is the number of files in the directory. If it is file it is the number of blocks that make up the file
   */
  blocks: number

  /**
   * Indicates if locality information is present
   */
  withLocality: boolean

  /**
   * Indicates if the queried dag is fully present locally
   */
  local?: boolean

  /**
   * Indicates the cumulative size of the data present locally
   */
  sizeLocal?: number

  /**
   * UnixFS mode if applicable
   */
  mode?: number

  /**
   * UnixFS mtime if applicable
   */
  mtime?: Mtime
}

export const createStat = configure(api => {
  /**
   * Get file or directory statistics
   */
  async function stat (path: IPFSPath, options?: StatOptions): Promise<StatResult> {
    const res = await api.post('files/stat', {
      signal: options?.signal,
      searchParams: toUrlSearchParams({
        arg: path,
        ...options
      }),
      headers: options?.headers
    })
    const data = await res.json()

    data.WithLocality = data.WithLocality ?? false
    return toCoreInterface(objectToCamelWithMetadata(data))
  }
  return stat
})

function toCoreInterface (entry: any) {
  entry.cid = CID.parse(entry.hash)
  delete entry.hash
  return entry
}
