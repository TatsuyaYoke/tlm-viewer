import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { Box, Button, Flex } from '@chakra-ui/react'
import { isStoredState, isChoosedState, isMultiState, testCaseListState, tlmListState } from '../atoms/PlotSettingAtom'
import Graph from './Graph'
import { DataType, ObjectArrayType } from '../../electron/functions'

const GraphPlot = () => {
  const isStored = useRecoilValue(isStoredState)
  const isChoosed = useRecoilValue(isChoosedState)
  const isMulti = useRecoilValue(isMultiState)
  const testCaseList = useRecoilValue(testCaseListState)
  const tlmList = useRecoilValue(tlmListState)

  const [graphTime, setGraphTime] = useState<DataType>(null)
  const [graphData, setGraphData] = useState<ObjectArrayType | null>(null)

  const plot = async () => {
    console.log(tlmList)
  }
  const send = async () => {
    const path = 'G:/Shared drives/0705_Sat_Dev_Tlm/system_test.db'
    const query =
      "select distinct DATE, PCDU_BAT_VOLTAGE, PCDU_BAT_CURRENT from DSX0201_tlm_id_1 where DATE between '2022-04-18' and '2022-04-19'"
    const data = await window.Main.getData(path, query)
    if (data) {
      setGraphTime(data.DATE)
      delete data.DATE
      setGraphData(data)
    }
  }

  return (
    <Box p={8} w="100%">
      <Flex justify="right">
        <Button onClick={send}>Send</Button>
        <Button colorScheme="teal" onClick={plot} mr="10">
          Plot
        </Button>
      </Flex>
      <Flex wrap="wrap">
        {graphData &&
          Object.keys(graphData).map((key) => <Graph key={key} x={graphTime} y={graphData[key]} color="red" />)}
      </Flex>
    </Box>
  )
}

export default GraphPlot
