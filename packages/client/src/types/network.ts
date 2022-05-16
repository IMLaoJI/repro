import type { IndexedRecord, SyntheticId } from './common'

export enum NetworkEventType {
  FetchRequest = 2,
  FetchResponse = 3,
  WebSocketOutbound = 4,
  WebSocketInbound = 5,
  WebSocketOpen = 6,
  WebSocketClose = 7,
}

export enum RequestType {
  Fetch = 0,
  XHR = 1,
}

export interface FetchRequest {
  type: NetworkEventType.FetchRequest
  correlationId: SyntheticId
  requestType: RequestType
  url: string
  method: string
  headers: Record<string, string>
  body: ArrayBufferLike
}

export interface FetchResponse {
  type: NetworkEventType.FetchResponse
  correlationId: SyntheticId
  status: number
  headers: Record<string, string>
  body: ArrayBufferLike
}

export interface FetchRequestSnapshot {
  correlationId: SyntheticId
  request: FetchRequest
  response: FetchResponse | null
  startAt: number
  endAt: number | null
}

export enum BinaryType {
  Blob = 0,
  ArrayBuffer = 1,
}

export interface WebSocketOpen {
  type: NetworkEventType.WebSocketOpen
  connectionId: SyntheticId
  url: string
}

export interface WebSocketClose {
  type: NetworkEventType.WebSocketClose
  connectionId: SyntheticId
}

export interface WebSocketInbound {
  type: NetworkEventType.WebSocketInbound
  connectionId: SyntheticId
  binaryType: BinaryType
  data: ArrayBufferLike
}

export interface WebSocketOutbound {
  type: NetworkEventType.WebSocketOutbound
  connectionId: SyntheticId
  binaryType: BinaryType
  data: ArrayBufferLike
}

export enum WebSocketStatus {
  Connecting = 0,
  Connected = 1,
  Closing = 2,
  Closed = 3,
}

export interface WebSocketSnapshot {
  connectionId: SyntheticId
  url: string
  status: WebSocketStatus
  messages: Array<WebSocketInbound | WebSocketOutbound>
  startAt: number
  endAt: number | null
}

export type NetworkEvent =
  | FetchRequest
  | FetchResponse
  | WebSocketInbound
  | WebSocketOutbound
  | WebSocketOpen
  | WebSocketClose

export interface NetworkSnapshot {
  fetchRequests: IndexedRecord<SyntheticId, FetchRequestSnapshot>
  websockets: IndexedRecord<SyntheticId, WebSocketSnapshot>
}
