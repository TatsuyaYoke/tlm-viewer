import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { Box, Button, Flex } from '@chakra-ui/react'
import { DataType, ObjectArrayType } from 'types'
import { isStoredState, isChoosedState, isMultiState, testCaseListState, tlmListState } from '../atoms/PlotSettingAtom'
import Graph from './Graph'

const GraphPlot = () => {
  const isStored = useRecoilValue(isStoredState)
  const isChoosed = useRecoilValue(isChoosedState)
  const isMulti = useRecoilValue(isMultiState)
  const testCaseList = useRecoilValue(testCaseListState)
  const tlmList = useRecoilValue(tlmListState)

  const [graphTime, setGraphTime] = useState<DataType[] | null>(null)
  const [graphData, setGraphData] = useState<ObjectArrayType | null>(null)

  const plot = async () => {
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

  const set = () => {
    console.log(testCaseList)
  }

  return (
    <Box p={8} w="100%">
      <Flex justify="right">
        <Button colorScheme="teal" onClick={plot} mr="10">
          Plot
        </Button>
        <Button colorScheme="teal" onClick={set} mr="10">
          Set
        </Button>
      </Flex>
      <Flex wrap="wrap">
        {graphData &&
          graphTime &&
          Object.keys(graphData).map((key) => <Graph key={key} x={graphTime} y={graphData[key]} />)}
      </Flex>
    </Box>
  )
}

export default GraphPlot
