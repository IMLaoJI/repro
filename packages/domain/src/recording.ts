import {
  createView,
  IntegerDescriptor,
  StructDescriptor,
  UINT32,
  UINT8,
} from '@repro/typed-binary-encoder'
import z from 'zod'

export interface Sample<T> {
  from: T
  to: T
  duration: number
}

// type RecordingMode: enum {
//   None: 0
//   Snapshot: 1
//   Live: 2
//   Replay: 3
// }

export enum RecordingMode {
  None = 0,
  Snapshot = 1,
  Live = 2,
  Replay = 3,
}

export const RecordingModeSchema = z.nativeEnum(RecordingMode)

export const RecordingModeView = createView<RecordingMode, IntegerDescriptor>(
  UINT8,
  RecordingModeSchema
)

// tbe.extensions.js
// defineCustomType('uuid', {
//   as: 'char[36]',
//   schema: z => z.string().uuid(),
// })
//
// defineCustomType('timestamp', {
//   as: 'char[25]',
//   schema: z => z.string().regex(/\d{4}-\d{2}-\d{2}/))
// })

// type RecordingMetadata: struct {
//   id: uuid
//   title: string
//   url: string
//   description: string
//   mode: RecordingMode
//   duration: uint32
//   createdAt: timestamp
//   projectId: uuid
//   projectName: string
//   authorId: uuid
//   authorName: string
//   browserName?: string
//   browserVersion?: string
//   operatingSystem?: string
//   public: bool
//   codecVersion: string
// }

export const RecordingMetadataSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  url: z.string(),
  description: z.string(),
  mode: RecordingModeSchema,
  duration: z
    .number()
    .min(0)
    .max(2 ** 32 - 1),
  createdAt:
    z.string() /*.regex(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{4}/)*/,
  projectId: z.string().uuid(),
  projectName: z.string(),
  authorId: z.string().uuid(),
  authorName: z.string(),
  browserName: z.string().nullable(),
  browserVersion: z.string().nullable(),
  operatingSystem: z.string().nullable(),
  public: z.boolean(),
  codecVersion: z.string(),
})

export type RecordingMetadata = z.infer<typeof RecordingMetadataSchema>

export const RecordingMetadataView = createView<
  RecordingMetadata,
  StructDescriptor
>(
  {
    type: 'struct',
    fields: [
      ['id', { type: 'char', bytes: 36 }],
      ['title', { type: 'string' }],
      ['url', { type: 'string' }],
      ['description', { type: 'string' }],
      ['mode', RecordingModeView.descriptor],
      ['duration', UINT32],
      ['createdAt', { type: 'string' }],
      ['projectId', { type: 'char', bytes: 36 }],
      ['projectName', { type: 'string' }],
      ['authorId', { type: 'char', bytes: 36 }],
      ['authorName', { type: 'string' }],
      ['browserName', { type: 'string', nullable: true }],
      ['browserVersion', { type: 'string', nullable: true }],
      ['operatingSystem', { type: 'string', nullable: true }],
      ['public', { type: 'bool' }],
      ['codecVersion', { type: 'string' }],
    ],
  },
  RecordingMetadataSchema
)
