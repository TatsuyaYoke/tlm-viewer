import { Container } from '@chakra-ui/react'

import { AppBar, GraphPlot, PlotSetting } from '@components'

export const App = () => {
  const headerHeight = '30px'
  return (
    <>
      {window.Main && <AppBar height={headerHeight} />}
      <Container maxW="container.2xl" p={0} pt={headerHeight} display="flex" minH="100vh">
        <PlotSetting width="450px" flexShrink={0} />
        <GraphPlot />
      </Container>
    </>
  )
}
