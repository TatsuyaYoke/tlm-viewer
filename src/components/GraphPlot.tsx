import { useState } from 'react'

import { Box, Button, Flex, Spacer } from '@chakra-ui/react'
import { useRecoilValue } from 'recoil'

import {
  isOrbitState,
  isStoredState,
  isChoosedState,
  testCaseListState,
  tlmListState,
  projectState,
  settingState,
} from '@atoms/PlotSettingAtom'
import { Error } from '@components'
import { Graph } from '@parts'

import type { ObjectArrayType } from '@types'

export const GraphPlot = () => {
  const isStored = useRecoilValue(isStoredState)
  const isChoosed = useRecoilValue(isChoosedState)
  const isOrbit = useRecoilValue(isOrbitState)
  const testCaseList = useRecoilValue(testCaseListState)
  const project = useRecoilValue(projectState)
  const tlmList = useRecoilValue(tlmListState)
  const setting = useRecoilValue(settingState)

  const [isWarning, setIsWarning] = useState(false)
  const [warningMessage, setWarningMessage] = useState<string[]>([])
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [graphTime, setGraphTime] = useState<string[] | null>(null)
  const [graphData, setGraphData] = useState<ObjectArrayType | null>(null)

  const plot = async () => {
    const path = 'G:/Shared drives/0705_Sat_Dev_Tlm/system_test.db'
    const query =
      "select distinct DATE, PCDU_BAT_VOLTAGE, PCDU_BAT_CURRENT from DSX0201_tlm_id_1 where DATE between '2022-04-18' and '2022-04-19'"
    const response = await window.Main.getData(path, query)
    if (response.success) {
      const { DATE: dateData, ...dataWithoutDate } = response.data
      setGraphTime(dateData)
      setGraphData(dataWithoutDate)
    }
  }

  const set = () => {
    setIsWarning(false)
    setWarningMessage(() => [])
    const filteredTestCaseList = testCaseList.filter((element) => {
      if (setting?.testCase?.indexOf(element.value) === -1) {
        setIsWarning(true)
        setWarningMessage((prev) => [...prev, `Test case: ${element.value} deleted because not exist`])
        return false
      }
      return true
    })

    console.log(filteredTestCaseList)
    console.log(warningMessage)
  }

  return (
    <Box p={8} w="100%">
      <Flex>
        <Error isWarning={isWarning} warningMessages={warningMessage} noDisplayWhenSuccess={true} />
        <Spacer />
        <Button colorScheme="teal" onClick={plot} mx="10" flexShrink={0} width="80px">
          Plot
        </Button>
        <Button colorScheme="teal" onClick={set} mr="10" flexShrink={0} width="80px">
          Set
        </Button>
      </Flex>
      <Flex wrap="wrap">
        {graphData &&
          graphTime &&
          Object.keys(graphData).map((key) => {
            const yData = graphData[key]
            if (yData) return <Graph key={key} x={graphTime} y={yData} />
            return null
          })}
      </Flex>
    </Box>
  )
}
