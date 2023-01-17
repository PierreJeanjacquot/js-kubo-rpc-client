/* eslint-disable etc/prefer-interface */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { Agent as HttpAgent } from 'http'
import type { Agent as HttpsAgent } from 'https'
import type { Multiaddr } from '@multiformats/multiaddr'
import type { MultihashHasher } from 'multiformats/hashes/interface'
import type { Message } from '@libp2p/interface-pubsub'
import type IpfsUtilsHttp from 'ipfs-utils/src/http.js'

export interface LoadBaseFn { (codeOrName: number | string): Promise<MultibaseCodec<any>> }
export interface LoadCodecFn { (codeOrName: number | string): Promise<BlockCodec<any, any>> }
export interface LoadHasherFn { (codeOrName: number | string): Promise<MultihashHasher> }

export interface IPLDOptions {
  loadBase: LoadBaseFn
  loadCodec: LoadCodecFn
  loadHasher: LoadHasherFn
  bases: Array<MultibaseCodec<any>>
  codecs: Array<BlockCodec<any, any>>
  hashers: MultihashHasher[]
}

export interface Options {
  host?: string
  port?: number
  protocol?: string
  headers?: Headers | Record<string, string>
  timeout?: number | string
  apiPath?: string
  url?: URL | string | Multiaddr
  ipld?: Partial<IPLDOptions>
  agent?: HttpAgent | HttpsAgent
  signal?: AbortSignal
}

export interface EndpointConfig {
  host: string
  port: string
  protocol: string
  pathname: string
  'api-path': string
}

// TODO(hacdias): rename this?
export interface IpfsUtilsHttpClient extends IpfsUtilsHttp {

}

export type PubsubSubscription = {
  handler: MessageHandlerFn
  controller: AbortController
}
export type ConfigureFn<T> = (client: IpfsUtilsHttpClient, clientOptions: Options) => T
export type ConfigureFactory<T> = (clientOptions: Options) => T

export type { IPFSEntry, AddResult, AddProgressFn as IPFSCoreAddProgressFn } from 'ipfs-core-types/src/root'
export type { GetResult } from 'ipfs-core-types/src/dag'
export type { IPFSPath, PreloadOptions } from 'ipfs-core-types/src/utils'
export type { LsResult } from 'ipfs-core-types/src/pin'
export type { IPFS } from 'ipfs-core-types'
export type { Multicodecs } from 'ipfs-core-utils/multicodecs'
export type { Query, Status, Pin, AddOptions } from 'ipfs-core-types/src/pin/remote'
export type { RmResult } from 'ipfs-core-types/src/block'
export type { HTTPOptions, ProgressFn as IPFSUtilsHttpUploadProgressFn, ExtendedResponse } from 'ipfs-utils/src/types'
export type {
  RemotePinServiceWithStat,
  Stat
} from 'ipfs-core-types/src/pin/remote/service'

export type BlockCodec<T1 = any, T2 = any> = import('multiformats/codecs/interface').BlockCodec<T1, T2>
export type MessageHandlerFn<EventType = Message> = import('@libp2p/interfaces/events').EventHandler<EventType>
export type PinAPI = import('ipfs-core-types/src/pin').API<ClientOptions>
export type PubsubApiErrorHandlerFn = (err: Error, fatal: boolean, msg?: Message) => void
export type PubsubAPI = import('ipfs-core-types/src/pubsub').API<ClientOptions & { onError?: PubsubApiErrorHandlerFn }>
export type RefsAPI = import('ipfs-core-types/src/refs').API<ClientOptions>
export type RemotePiningAPI = import('ipfs-core-types/src/pin/remote').API<ClientOptions>
export type RemotePiningServiceAPI = import('ipfs-core-types/src/pin/remote/service').API<ClientOptions>
export type RepoAPI = import('ipfs-core-types/src/repo').API<ClientOptions>
export type StatsAPI = import('ipfs-core-types/src/stats').API<ClientOptions>
export type SwarmAPI = import('ipfs-core-types/src/swarm').API<ClientOptions>

export type MultibaseCodec<Prefix extends string = any> = import('multiformats/bases/interface').MultibaseCodec<Prefix>
export type { Message, MultihashHasher, Multiaddr }

export interface SubscribeMessage {
  from: import('ipfsd-ctl').Controller['peer']
  type: string
  data: Uint8Array
  sequenceNumber: BigInt
  topic: string
  key: Uint8Array
  signature: Uint8Array
}

export interface AbortOptions {
  /**
   * Can be provided to a function that starts a long running task, which will
   * be aborted when signal is triggered.
   */
  signal?: AbortSignal
  /**
   * Can be provided to a function that starts a long running task, which will
   * be aborted after provided timeout (in ms).
   */
  timeout?: number
}

export interface ClientOptions extends AbortOptions {
  headers?: Record<string, string>
  searchParams?: URLSearchParams
}
