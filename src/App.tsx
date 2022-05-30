import { useRef } from 'react'

import { Box, Container } from '@chakra-ui/react'
import { useSetRecoilState } from 'recoil'

import { isMaximizeState } from '@atoms/PlotSettingAtom'
import { AppBar, GraphPlot, PlotSetting } from '@components'
import { useResizeObserver } from '@hooks'

export const App = () => {
  const headerHeight = '30px'
  const appTopElement = useRef(null)
  const setIsMaximize = useSetRecoilState(isMaximizeState)

  const handleResize = async () => {
    setIsMaximize(await window.Main.isMaximize())
  }

  useResizeObserver(appTopElement, handleResize)

  return (
    <Box ref={appTopElement} h="100vh">
      {window.Main && <AppBar height={headerHeight} />}
      <Container maxW="container.2xl" p={0} pt={headerHeight} display="flex" minH="100vh">
        <PlotSetting width="450px" flexShrink={0} />
        <GraphPlot />
      </Container>
    </Box>
  )
}
