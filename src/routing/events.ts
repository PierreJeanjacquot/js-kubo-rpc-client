import type { PeerId } from '@libp2p/interface-peer-id'
import type { PeerInfo } from '@libp2p/interface-peer-info'

export enum EventTypes {
  SENDING_QUERY = 0,
  PEER_RESPONSE,
  FINAL_PEER,
  QUERY_ERROR,
  PROVIDER,
  VALUE,
  ADDING_PEER,
  DIALING_PEER
}

/**
 * The types of messages set/received during DHT queries
 */
export enum MessageType {
  PUT_VALUE = 0,
  GET_VALUE,
  ADD_PROVIDER,
  GET_PROVIDERS,
  FIND_NODE,
  PING
}

export type MessageName = keyof typeof MessageType

export interface DHTRecord {
  key: Uint8Array
  value: Uint8Array
  timeReceived?: Date
}

export interface SendingQueryEvent {
  type: EventTypes.SENDING_QUERY
  name: 'SENDING_QUERY'
}

export interface PeerResponseEvent {
  from: PeerId
  type: EventTypes.PEER_RESPONSE
  name: 'PEER_RESPONSE'
  messageType: MessageType
  messageName: MessageName
  providers: PeerInfo[]
  closer: PeerInfo[]
  record?: DHTRecord
}

export interface FinalPeerEvent {
  peer: PeerInfo
  type: EventTypes.FINAL_PEER
  name: 'FINAL_PEER'
}

export interface QueryErrorEvent {
  type: EventTypes.QUERY_ERROR
  name: 'QUERY_ERROR'
  error: Error
}

export interface ProviderEvent {
  type: EventTypes.PROVIDER
  name: 'PROVIDER'
  providers: PeerInfo[]
}

export interface ValueEvent {
  type: EventTypes.VALUE
  name: 'VALUE'
  value: Uint8Array
}

export interface AddingPeerEvent {
  type: EventTypes.ADDING_PEER
  name: 'ADDING_PEER'
  peer: PeerId
}

export interface DialingPeerEvent {
  peer: PeerId
  type: EventTypes.DIALING_PEER
  name: 'DIALING_PEER'
}

export type QueryEvent = SendingQueryEvent | PeerResponseEvent | FinalPeerEvent | QueryErrorEvent | ProviderEvent | ValueEvent | AddingPeerEvent | DialingPeerEvent
