import {
  createView,
  IntegerDescriptor,
  StructDescriptor,
  UINT32,
  UINT8,
  UnionDescriptor,
} from '@repro/typed-binary-encoder'
import z from 'zod'
import { NodeIdSchema, NodeIdView } from './vdom'

// type LogLevel: enum {
//   Verbose: 0
//   Info: 1
//   Warning: 2
//   Error: 3
// }

export enum LogLevel {
  Verbose = 0,
  Info = 1,
  Warning = 2,
  Error = 3,
}

export const LogLevelSchema = z.nativeEnum(LogLevel)

export const LogLevelView = createView<LogLevel, IntegerDescriptor>(
  UINT8,
  LogLevelSchema
)

// type MessagePartType: enum {
//   String: 0
//   Node: 1
// }

export enum MessagePartType {
  String = 0,
  Node = 1,
}

export const MessagePartTypeSchema = z.nativeEnum(MessagePartType)

export const MessagePartTypeView = createView<
  MessagePartType,
  IntegerDescriptor
>(UINT8, MessagePartTypeSchema)

// type StringMessagePart: struct {
//   type: MessagePartType.String
//   value: string
// }

export const StringMessagePartSchema = z.object({
  type: z.literal(MessagePartType.String),
  value: z.string(),
})

export type StringMessagePart = z.infer<typeof StringMessagePartSchema>

export const StringMessagePartView = createView<
  StringMessagePart,
  StructDescriptor
>(
  {
    type: 'struct',
    fields: [
      ['type', MessagePartTypeView.descriptor],
      ['value', { type: 'string' }],
    ],
  },
  StringMessagePartSchema
)

// type NodeMessagePart: struct {
//   type: MessagePartType.Node
//   nodeId: NodeId
// }

export const NodeMessagePartSchema = z.object({
  type: z.literal(MessagePartType.Node),
  nodeId: NodeIdSchema,
})

export type NodeMessagePart = z.infer<typeof NodeMessagePartSchema>

export const NodeMessagePartView = createView<
  NodeMessagePart,
  StructDescriptor
>(
  {
    type: 'struct',
    fields: [
      ['type', MessagePartTypeView.descriptor],
      ['nodeId', NodeIdView.descriptor],
    ],
  },
  NodeMessagePartSchema
)

// type MessagePart: union on "type" {
//   StringMessagePart
//   NodeMessagePart
// }

export const MessagePartSchema = z.discriminatedUnion('type', [
  StringMessagePartSchema,
  NodeMessagePartSchema,
])

export type MessagePart = z.infer<typeof MessagePartSchema>

export const MessagePartView = createView<MessagePart, UnionDescriptor>(
  {
    type: 'union',
    tagField: 'type',
    descriptors: [
      StringMessagePartView.descriptor,
      NodeMessagePartView.descriptor,
    ],
  },
  MessagePartSchema
)

// type StackEntry: struct {
//   functionName?: string
//   fileName: string
//   lineNumber: uint32
//   columnNumber: uint32
// }

export const StackEntrySchema = z.object({
  functionName: z.string().nullable(),
  fileName: z.string(),
  lineNumber: z
    .number()
    .min(0)
    .max(2 ** 32 - 1),
  columnNumber: z
    .number()
    .min(0)
    .max(2 ** 32 - 1),
})

export type StackEntry = z.infer<typeof StackEntrySchema>

export const StackEntryView = createView<StackEntry, StructDescriptor>(
  {
    type: 'struct',
    fields: [
      ['functionName', { type: 'string', nullable: true }],
      ['fileName', { type: 'string' }],
      ['lineNumber', { type: 'integer', signed: false, bits: 32 }],
      ['columnNumber', { type: 'integer', signed: false, bits: 32 }],
    ],
  },
  StackEntrySchema
)

// type ConsoleMessage: struct {
//   level: LogLevel
//   parts: list<MessagePart>
//   stack: list<StackEntry>
// }

export const ConsoleMessageSchema = z.object({
  level: LogLevelSchema,
  parts: z.array(MessagePartSchema),
  stack: z.array(StackEntrySchema),
})

export type ConsoleMessage = z.infer<typeof ConsoleMessageSchema>

export const ConsoleMessageView = createView<ConsoleMessage, StructDescriptor>(
  {
    type: 'struct',
    fields: [
      ['level', LogLevelView.descriptor],
      ['parts', { type: 'vector', items: MessagePartView.descriptor }],
      ['stack', { type: 'vector', items: StackEntryView.descriptor }],
    ],
  },
  ConsoleMessageSchema
)

// type ConsoleSnapshot: struct {
//   messages: list<struct {
//     time: uint32
//     data: ConsoleMessage
//   }>
// }

export const ConsoleSnapshotSchema = z.object({
  messages: z.array(
    z.object({
      time: z
        .number()
        .min(0)
        .max(2 ** 32 - 1),
      data: ConsoleMessageSchema,
    })
  ),
})

export type ConsoleSnapshot = z.infer<typeof ConsoleSnapshotSchema>

// export interface ConsoleSnapshot {
//   messages: Array<{
//     time: number
//     data: ConsoleMessage
//   }>
// }

export const ConsoleSnapshotView = createView<
  ConsoleSnapshot,
  StructDescriptor
>(
  {
    type: 'struct',
    fields: [
      [
        'messages',
        {
          type: 'vector',
          items: {
            type: 'struct',
            fields: [
              ['time', UINT32],
              ['data', ConsoleMessageView.descriptor],
            ],
          },
        },
      ],
    ],
  },
  ConsoleSnapshotSchema
)
