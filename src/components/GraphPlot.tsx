import { useState, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { Box, Button, Flex } from '@chakra-ui/react'
import { isStoredState, isChoosedState, isMultiState, testCaseListState, tlmListState } from '../atoms/PlotSettingAtom'
import Graph from './Graph'

const GraphPlot = () => {
  const isStored = useRecoilValue(isStoredState)
  const isChoosed = useRecoilValue(isChoosedState)
  const isMulti = useRecoilValue(isMultiState)
  const testCaseList = useRecoilValue(testCaseListState)
  const tlmList = useRecoilValue(tlmListState)

  const [isSent, setSent] = useState(false)
  // const [fromMain, setFromMain] = useState<string | null>(null)

  const plot = async () => {
    console.log(tlmList)
  }
  const send = () => {
    window.Main.getData()
    setSent(true)
  }

  useEffect(() => {
    if (isSent && window.Main)
      window.Main.on('data', (data: string) => {
        // setFromMain(message)
        console.log(data)
      })
  }, [isSent])

  return (
    <Box p={8}>
      <Flex justify="right">
        <Button onClick={send}>Send</Button>
        <Button colorScheme="teal" onClick={plot} mr="10">
          Plot
        </Button>
      </Flex>
      <Flex wrap="wrap">
        <Graph x={[0, 1, 2]} y={[0, 5, 3]} color="red" />
        <Graph x={[0, 1, 2]} y={[0, 5, 3]} color="red" />
        <Graph x={[0, 1, 2]} y={[0, 5, 3]} color="red" />
        <Graph x={[0, 1, 2]} y={[0, 5, 3]} color="red" />
        <Graph x={[0, 1, 2]} y={[0, 5, 3]} color="red" />
        <Graph x={[0, 1, 2]} y={[0, 5, 3]} color="red" />
      </Flex>
    </Box>
  )
}

export default GraphPlot
