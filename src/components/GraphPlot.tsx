import { useState, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { Box, Button, Flex } from '@chakra-ui/react'
import { isStoredState, isChoosedState, isMultiState, testCaseListState, tlmListState } from '../atoms/PlotSettingAtom'
import Graph from './Graph'
import { ObjectArrayType } from '../../electron/functions'

const GraphPlot = () => {
  const isStored = useRecoilValue(isStoredState)
  const isChoosed = useRecoilValue(isChoosedState)
  const isMulti = useRecoilValue(isMultiState)
  const testCaseList = useRecoilValue(testCaseListState)
  const tlmList = useRecoilValue(tlmListState)

  const [isSent, setSent] = useState(false)

  const plot = async () => {
    console.log(tlmList)
  }
  const send = () => {
    const path = 'G:/共有ドライブ/0705_Sat_Dev_Tlm/system_test.db'
    const query =
      "select distinct DATE, PCDU_BAT_VOLTAGE, PCDU_BAT_CURRENT from DSX0201_tlm_id_1 where DATE between '2022-04-18' and '2022-04-19'"
    window.Main.getData(path, query)
    setSent(true)
  }

  useEffect(() => {
    if (isSent && window.Main)
      window.Main.on('data', (data: ObjectArrayType) => {
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
