import { Container } from '@chakra-ui/react'
import AppBar from './AppBar'
import PlotSetting from './components/PlotSetting'
import GraphPlot from './components/GraphPlot'

const App = () => (
  <>
    {window.Main && <AppBar />}
    <Container maxW="container.2xl" p={0} display="flex">
      <PlotSetting minW="400px" />
      <GraphPlot />
    </Container>
  </>
)

export default App
