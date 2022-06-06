import { useRef, useEffect } from 'react'

import { Box, Container } from '@chakra-ui/react'
import useSize from '@react-hook/size'
import { useSetRecoilState } from 'recoil'

import { isMaximizeState } from '@atoms/PlotSettingAtom'
import { AppBar, GraphPlot, PlotSetting } from '@components'

export const App = () => {
  const headerHeight = '30px'
  const target = useRef(null)
  const setIsMaximize = useSetRecoilState(isMaximizeState)

  const handleResize = async () => {
    setIsMaximize(await window.Main.isMaximize())
  }

  const [width, height] = useSize(target)
  useEffect(() => {
    handleResize()
  }, [width, height])

  return (
    <Box ref={target} h="100vh">
      {window.Main && <AppBar height={headerHeight} />}
      <Container maxW="container.2xl" p={0} pt={headerHeight} display="flex" minH="100vh">
        <PlotSetting width="450px" flexShrink={0} />
        <GraphPlot />
      </Container>
    </Box>
  )
}
