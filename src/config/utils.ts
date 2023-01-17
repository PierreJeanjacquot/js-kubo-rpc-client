// TODO: ensure all options are here https://github.com/ipfs/kubo/blob/master/docs/config.md

export interface Config {
  Addresses?: AddressConfig
  API?: APIConfig
  Bootstrap?: string[]
  Datastore?: DatastoreConfig
  Discovery?: DiscoveryConfig
  Identity?: IdentityConfig
  Pubsub?: PubsubConfig
  Swarm?: SwarmConfig
  Routing?: RoutingConfig
}

/**
 * Contains information about various listener addresses to be used by this node
 */
export interface AddressConfig {
  API?: string | string[]
  Gateway?: string | string[]
  Swarm?: string[]
  Announce?: string[]
  AppendAnnounce?: string[]
  NoAnnounce?: string[]
}

export interface APIConfig {
  HTTPHeaders?: Record<string, string[]>
}

export interface DiscoveryConfig {
  MDNS?: MDNSDiscovery
  webRTCStar?: WebRTCStarDiscovery
}

export interface MDNSDiscovery {
  Enabled?: boolean
  Interval?: number
}

export interface WebRTCStarDiscovery {
  Enabled?: boolean
}

export interface DatastoreConfig {
  StorageMax?: string
  StorageGCWatermark?: number
  GCPeriod?: string
  HashOnRead?: boolean
  BloomFilterSize?: number
  Spec?: DatastoreSpec
}

export interface DatastoreType {
  type: string
  path: string
  sync?: boolean
  shardFunc?: string
  compression?: string
}

export interface DatastoreMountPoint {
  mountpoint: string
  type: string
  prefix: string
  child: DatastoreType
}

export interface DatastoreSpec {
  type?: string
  mounts?: DatastoreMountPoint[]
}

export interface IdentityConfig {
  /**
   * The unique PKI identity label for this configs peer. Set on init and never
   * read, its merely here for convenience. IPFS will always generate the peerID
   * from its keypair at runtime.
   */
  PeerID: string

  /**
   * The base64 encoded protobuf describing (and containing) the nodes private key.
   */
  PrivKey: string
}

export interface KeychainConfig {
  DEK?: DEK
}

export interface DEK {
  keyLength?: number
  iterationCount?: number
  salt?: string
  hash?: string
}

export interface PubsubConfig {
  PubSubRouter?: 'gossipsub' | 'floodsub'
  Enabled?: boolean
  DisableSigning?: boolean
  SeenMessagesTTL?: string
}

export interface SwarmConfig {
  ConnMgr?: ConnMgrConfig
  DisableNatPortMap?: boolean
}

export interface ConnMgrConfig {
  LowWater?: number
  HighWater?: number
}

export interface RoutingConfig {
  Type?: string
}
