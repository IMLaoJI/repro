import { Inline } from 'jsxstyle'
import { VText } from '@repro/domain'
import React from 'react'
import { colors } from '~/config/theme'
import { Container } from './Container'

interface Props {
  node: VText
}

export const TextR: React.FC<Props> = ({ node }) => (
  <Container>
    <Inline color={colors.slate['700']}>{node.value}</Inline>
  </Container>
)
