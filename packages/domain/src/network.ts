import {
  CharDescriptor,
  createView,
  IntegerDescriptor,
  StructDescriptor,
  UINT16,
  UINT8,
  UnionDescriptor,
} from '@repro/typed-binary-encoder'
import z from 'zod'

// type NetworkMessageType: enum {
//   FetchRequest: 0
//   FetchResponse: 1
//   WebSocketOutbound: 2
//   WebSocketInbound: 3
//   WebSocketOpen: 4
//   WebSocketClose: 5
// }

export enum NetworkMessageType {
  FetchRequest,
  FetchResponse,
  WebSocketOutbound,
  WebSocketInbound,
  WebSocketOpen,
  WebSocketClose,
}

export const NetworkMessageTypeSchema = z.nativeEnum(NetworkMessageType)

// type RequestType: enum {
//   Fetch
//   XHR
// }

export enum RequestType {
  Fetch = 0,
  XHR = 1,
}

export const RequestTypeSchema = z.nativeEnum(RequestType)

// type CorrelationId: char[4]
//
// type FetchRequest: struct {
//   type: NetworkMessageType.FetchRequest
//   correlationId: CorrelationId
//   requestType: RequestType
//   url: string
//   method: string
//   headers: map<string, string>
//   body: buffer
// }

export const CorrelationIdSchema = z.string().length(4)
export type CorrelationId = z.infer<typeof CorrelationIdSchema>
export const CorrelationIdView = createView<CorrelationId, CharDescriptor>(
  {
    type: 'char',
    bytes: 4,
  },
  CorrelationIdSchema
)

export const FetchRequestSchema = z.object({
  type: z.literal(NetworkMessageType.FetchRequest),
  correlationId: CorrelationIdSchema,
  requestType: RequestTypeSchema,
  url: z.string(),
  method: z.string(),
  headers: z.record(z.string(), z.string()),
  body: z.instanceof(ArrayBuffer),
})

export type FetchRequest = z.infer<typeof FetchRequestSchema>

export const FetchRequestView = createView<FetchRequest, StructDescriptor>(
  {
    type: 'struct',
    fields: [
      ['type', UINT8],
      ['correlationId', CorrelationIdView.descriptor],
      ['requestType', UINT8],
      ['url', { type: 'string' }],
      ['method', { type: 'string' }],
      [
        'headers',
        { type: 'dict', key: { type: 'string' }, value: { type: 'string' } },
      ],
      ['body', { type: 'buffer' }],
    ],
  },
  FetchRequestSchema
)

// type FetchResponse: struct {
//   type: NetworkMessageType.FetchResponse
//   correlationId: CorrelationId
//   status: uint16
//   headers: map<string, string>
//   body: buffer
// }

export const FetchResponseSchema = z.object({
  type: z.literal(NetworkMessageType.FetchResponse),
  correlationId: CorrelationIdSchema,
  status: z
    .number()
    .min(0)
    .max(2 ** 16 - 1),
  headers: z.record(z.string(), z.string()),
  body: z.instanceof(ArrayBuffer),
})

export type FetchResponse = z.infer<typeof FetchResponseSchema>

export const FetchResponseView = createView<FetchResponse, StructDescriptor>(
  {
    type: 'struct',
    fields: [
      ['type', UINT8],
      ['correlationId', CorrelationIdView.descriptor],
      ['status', UINT16],
      [
        'headers',
        { type: 'dict', key: { type: 'string' }, value: { type: 'string' } },
      ],
      ['body', { type: 'buffer' }],
    ],
  },
  FetchResponseSchema
)

// type WebSocketMessageType: enum {
//   Text: 0
//   Binary: 1
// }

export enum WebSocketMessageType {
  Text = 0,
  Binary = 1,
}

export const WebSocketMessageTypeSchema = z.nativeEnum(WebSocketMessageType)
export const WebSocketMessageTypeView = createView<
  WebSocketMessageType,
  IntegerDescriptor
>(UINT8, WebSocketMessageTypeSchema)

// type WebSocketOpen: struct {
//   type: NetworkMessageType.WebSocketOpen
//   correlationId: CorrelationId
//   url: string
// }

export const WebSocketOpenSchema = z.object({
  type: z.literal(NetworkMessageType.WebSocketOpen),
  correlationId: CorrelationIdSchema,
  url: z.string(),
})

export type WebSocketOpen = z.infer<typeof WebSocketOpenSchema>

export const WebSocketOpenView = createView<WebSocketOpen, StructDescriptor>(
  {
    type: 'struct',
    fields: [
      ['type', UINT8],
      ['correlationId', CorrelationIdView.descriptor],
      ['url', { type: 'string' }],
    ],
  },
  WebSocketOpenSchema
)

// type WebSocketClose: struct {
//   type: NetworkMessageType.WebSocketClose
//   correlationId: CorrelationId
// }

export const WebSocketCloseSchema = z.object({
  type: z.literal(NetworkMessageType.WebSocketClose),
  correlationId: CorrelationIdSchema,
})

export type WebSocketClose = z.infer<typeof WebSocketCloseSchema>

export const WebSocketCloseView = createView<WebSocketClose, StructDescriptor>(
  {
    type: 'struct',
    fields: [
      ['type', UINT8],
      ['correlationId', CorrelationIdView.descriptor],
    ],
  },
  WebSocketCloseSchema
)

// type WebSocketInbound: struct {
//   type: NetworkMessageType.WebSocketInbound
//   correlationId: CorrelationId
//   messageType: WebSocketMessageType
//   data: buffer
// }

export const WebSocketInboundSchema = z.object({
  type: z.literal(NetworkMessageType.WebSocketInbound),
  correlationId: CorrelationIdSchema,
  messageType: WebSocketMessageTypeSchema,
  data: z.instanceof(ArrayBuffer),
})

export type WebSocketInbound = z.infer<typeof WebSocketInboundSchema>

export const WebSocketInboundView = createView<
  WebSocketInbound,
  StructDescriptor
>(
  {
    type: 'struct',
    fields: [
      ['type', UINT8],
      ['correlationId', CorrelationIdView.descriptor],
      ['messageType', WebSocketMessageTypeView.descriptor],
      ['data', { type: 'buffer' }],
    ],
  },
  WebSocketInboundSchema
)

// type WebSocketOutbound: struct {
//   type: NetworkMessageType.WebSocketOutbound
//   correlationId: CorrelationId
//   messageType: WebSocketMessageType
//   data: buffer
// }

export const WebSocketOutboundSchema = z.object({
  type: z.literal(NetworkMessageType.WebSocketOutbound),
  correlationId: CorrelationIdSchema,
  messageType: WebSocketMessageTypeSchema,
  data: z.instanceof(ArrayBuffer),
})

export type WebSocketOutbound = z.infer<typeof WebSocketOutboundSchema>

export const WebSocketOutboundView = createView<
  WebSocketOutbound,
  StructDescriptor
>(
  {
    type: 'struct',
    fields: [
      ['type', UINT8],
      ['correlationId', CorrelationIdView.descriptor],
      ['messageType', WebSocketMessageTypeView.descriptor],
      ['data', { type: 'buffer' }],
    ],
  },
  WebSocketOutboundSchema
)

// type WebSocketStatus: enum {
//   Connecting: 0
//   Connected: 1
//   Closing: 2
//   Closed: 3
// }

export enum WebSocketStatus {
  Connecting = 0,
  Connected = 1,
  Closing = 2,
  Closed = 3,
}

// type NetworkMessage: union on "type" {
//   FetchRequest
//   FetchResponse
//   WebSocketInbound
//   WebSocketOutbound
//   WebSocketOpen
//   WebSocketClose
// }

export const NetworkMessageSchema = z.discriminatedUnion('type', [
  FetchRequestSchema,
  FetchResponseSchema,
  WebSocketInboundSchema,
  WebSocketOutboundSchema,
  WebSocketOpenSchema,
  WebSocketCloseSchema,
])

export type NetworkMessage = z.infer<typeof NetworkMessageSchema>

export const NETWORK_EVENT_TYPE_BYTE_LENGTH = 1
export const CORRELATION_ID_BYTE_LENGTH = 4
export const REQUEST_INITIATOR_BYTE_LENGTH = 1
export const BINARY_TYPE_BYTE_LENGTH = 1

export const NetworkMessageView = createView<NetworkMessage, UnionDescriptor>(
  {
    type: 'union',
    tagField: 'type',
    descriptors: {
      [NetworkMessageType.FetchRequest]: FetchRequestView.descriptor,
      [NetworkMessageType.FetchResponse]: FetchResponseView.descriptor,
      [NetworkMessageType.WebSocketOpen]: WebSocketOpenView.descriptor,
      [NetworkMessageType.WebSocketClose]: WebSocketCloseView.descriptor,
      [NetworkMessageType.WebSocketOutbound]: WebSocketOutboundView.descriptor,
      [NetworkMessageType.WebSocketInbound]: WebSocketInboundView.descriptor,
    },
  },
  NetworkMessageSchema
)
