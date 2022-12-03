import { Click, InteractionEvent, InteractionType } from '@repro/domain'
import { Block, Inline, Row } from 'jsxstyle'
import {
  MousePointerClick as ClickIcon,
  Link2 as LinkIcon,
  Scaling as ViewportResizeIcon,
} from 'lucide-react'
import React from 'react'
import { colors } from '~/config/theme'
import { useSelectedNode } from '../hooks'
import { BaseEntry } from './BaseEntry'

interface Props {
  eventIndex: number
  event: InteractionEvent
  rowIndex: number
  style: React.CSSProperties
}

const icons = {
  // Ignored interaction events
  [InteractionType.KeyUp]: null,
  [InteractionType.KeyDown]: null,
  [InteractionType.Scroll]: null,
  [InteractionType.PointerUp]: null,
  [InteractionType.PointerDown]: null,
  [InteractionType.PointerMove]: null,

  [InteractionType.ViewportResize]: (
    <ViewportResizeIcon size={16} color={colors.blue['500']} />
  ),

  [InteractionType.Click]: <ClickIcon size={16} color={colors.blue['500']} />,

  [InteractionType.DoubleClick]: (
    <ClickIcon size={16} color={colors.blue['500']} />
  ),
}

export const InteractionEntry: React.FC<Props> = ({
  eventIndex,
  event,
  rowIndex,
  style,
}) => {
  const [, setSelectedNode] = useSelectedNode()
  const icon = icons[event.data.type]

  const label =
    event.data.type === InteractionType.Click
      ? createClickLabel(event.data)
      : null

  function onClick() {
    if (event.data.type === InteractionType.Click) {
      const firstTarget = event.data.targets[0]

      if (firstTarget) {
        setSelectedNode(firstTarget)
      }
    }
  }

  return (
    <BaseEntry
      eventIndex={eventIndex}
      event={event}
      rowIndex={rowIndex}
      style={style}
      icon={icon}
      onClick={onClick}
    >
      {label}
    </BaseEntry>
  )
}

function createClickLabel(interaction: Click): React.ReactNode {
  const tagName = interaction.meta.node.tagName
  const isLinkElement = tagName === 'a'

  let content: React.ReactNode

  if (isLinkElement) {
    content = (
      <Row
        alignItems="center"
        gap={5}
        paddingH={6}
        paddingV={3}
        borderRadius={4}
        backgroundColor={colors.blue['200']}
        color={colors.blue['900']}
      >
        <LinkIcon size={14} color={colors.blue['900']} strokeWidth={3} />
        <Block>{interaction.meta.humanReadableLabel}</Block>
      </Row>
    )
  } else {
    content = (
      <Row
        alignItems="center"
        paddingH={6}
        paddingV={3}
        fontFamily="monospace"
        backgroundColor={colors.blue['50']}
        borderRadius={4}
      >
        <Inline color={colors.slate['500']}>{`<`}</Inline>
        <Inline color={colors.pink['700']}>
          {interaction.meta.node.tagName}
        </Inline>
        <Inline color={colors.slate['500']}>{`>`}</Inline>
      </Row>
    )
  }

  return (
    <Row alignItems="center" gap={5}>
      <Block>Clicked</Block>
      {content}
    </Row>
  )
}