import type { Mtime } from 'ipfs-unixfs'
import type { CID } from 'multiformats'

export interface MFSOptions {
  /**
   * If true the changes will be immediately flushed to disk
   */
  flush?: boolean
}

export interface MFSEntry {
  /**
   * The object's name
   */
  name: string

  /**
   * The object's type (directory or file)
   */
  type: 'directory' | 'file'

  /**
   * The size of the file in bytes
   */
  size: number

  /**
   * The CID of the object
   */
  cid: CID

  /**
   * The UnixFS mode as a Number
   */
  mode?: number

  /**
   * An object with numeric secs and nsecs properties
   */
  mtime?: Mtime
}
