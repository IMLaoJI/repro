import { Block, Grid } from 'jsxstyle'
import React from 'react'
import { colors } from '@/config/theme'
import { PlaybackCanvas, usePlayback } from '@/libs/playback'
import { Toolbar } from './Toolbar'
import { PickerOverlay } from './PickerOverlay'
import { View } from './types'
import { ElementsPanel } from './ElementsPanel'
import { NetworkPanel } from './NetworkPanel'
import { ConsolePanel } from './ConsolePanel'
import { DragHandle } from './DragHandle'
import { MAX_INT32 } from './constants'
import {
  useActive,
  useCurrentDocument,
  useMask,
  usePicker,
  useSize,
  useView,
} from './hooks'

export const DevTools: React.FC = React.memo(() => {
  const playback = usePlayback()
  const [, setCurrentDocument] = useCurrentDocument()
  const [active] = useActive()
  const [picker] = usePicker()
  const [mask] = useMask()
  const [view] = useView()

  return (
    <Container open={!!(active && playback)}>
      {active && (
        <PlaybackRegion mask={mask}>
          <PlaybackCanvas
            interactive={true}
            scaling="full-width"
            onDocumentReady={setCurrentDocument}
          />
        </PlaybackRegion>
      )}

      {picker && <PickerOverlay />}

      <InspectorRegion>
        {active && <DragHandle />}

        <Toolbar />

        {active && (
          <ContentRegion>
            {view === View.Elements && <ElementsPanel />}
            {view === View.Network && <NetworkPanel />}
            {view === View.Console && <ConsolePanel />}
          </ContentRegion>
        )}
      </InspectorRegion>
    </Container>
  )
})

const Container: React.FC<{ open: boolean }> = ({ children, open }) => (
  <Grid
    position="fixed"
    top={open ? 0 : 'auto'}
    bottom={0}
    left={0}
    right={0}
    gridTemplateRows={open ? '1fr auto' : 'auto'}
    gridTemplateAreas={`"playback" "inspector"`}
    zIndex={MAX_INT32}
  >
    {children}
  </Grid>
)

const PlaybackRegion: React.FC<{ mask: boolean }> = ({ children, mask }) => (
  <Block gridArea="playback" pointerEvents={mask ? 'none' : 'all'}>
    {children}
  </Block>
)

const InspectorRegion: React.FC = ({ children }) => (
  <Grid
    gridArea="inspector"
    position="relative"
    isolation="isolate"
    backgroundColor={colors.white}
    gridTemplateRows="50px auto"
    boxShadow={`0 -4px 16px rgba(0, 0, 0, 0.1)`}
    zIndex={MAX_INT32}
  >
    {children}
  </Grid>
)

const ContentRegion: React.FC = ({ children }) => {
  const [size] = useSize()
  return (
    <Block
      height={size}
      borderTopStyle="solid"
      borderTopWidth={1}
      borderTopColor={colors.blueGray['300']}
      overflow="auto"
    >
      {children}
    </Block>
  )
}
