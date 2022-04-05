import { Row } from 'jsxstyle'
import React, { useCallback, useEffect } from 'react'
import { Play as PlayIcon, Pause as PauseIcon } from 'react-feather'
import { Shortcuts } from 'shortcuts'
import { colors } from '@/config/theme'
import { usePlayback } from '../hooks'
import { PlaybackState } from '../types'

export const PlayAction: React.FC = () => {
  const playback = usePlayback()
  const playing = playback.getPlaybackState() === PlaybackState.Playing

  const togglePlayback = useCallback(
    (evt: Event) => {
      evt.preventDefault()

      if (playing) {
        playback.pause()
      } else {
        playback.play()
      }
    },
    [playback, playing]
  )

  useEffect(() => {
    const shortcuts = new Shortcuts()

    shortcuts.add([
      {
        shortcut: 'Space',
        handler: togglePlayback,
      },
    ])

    return () => {
      shortcuts.reset()
    }
  }, [togglePlayback])

  return (
    <Row
      alignItems="center"
      justifyContent="center"
      width={32}
      height={32}
      color={playing ? colors.pink['500'] : colors.blue['700']}
      backgroundColor={playing ? colors.pink['100'] : 'transparent'}
      borderRadius={4}
      cursor="pointer"
      props={{ onClick: evt => togglePlayback(evt.nativeEvent) }}
    >
      {playing ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
    </Row>
  )
}