import { useState } from 'react'

import { Box, Button, Flex, Spacer, Spinner, useToast } from '@chakra-ui/react'
import { useRecoilValue } from 'recoil'

import {
  isOrbitState,
  isStoredState,
  isChosenState,
  testCaseListState,
  tlmListState,
  projectState,
  settingState,
  dateSettingState,
} from '@atoms/PlotSettingAtom'
import { Error } from '@components'
import { Graph } from '@parts'
import { isNotNull, isNotNumber, isNotUndefined } from '@types'

import type { requestDataType, requestTlmType, GraphDataArrayType, TlmDataObjectType } from '@types'

export const GraphPlot = () => {
  const isStored = useRecoilValue(isStoredState)
  const isChosen = useRecoilValue(isChosenState)
  const isOrbit = useRecoilValue(isOrbitState)
  const testCaseList = useRecoilValue(testCaseListState)
  const project = useRecoilValue(projectState)
  const tlmList = useRecoilValue(tlmListState)
  const setting = useRecoilValue(settingState)
  const dateSetting = useRecoilValue(dateSettingState)

  const [isWarning, setIsWarning] = useState(false)
  const [warningMessage, setWarningMessage] = useState<string[]>([])
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [responseTlmData, setResponseTLmData] = useState<TlmDataObjectType | null>(null)
  const [graphData, setGraphData] = useState<GraphDataArrayType>([])
  const [xMax, setXMax] = useState<string | undefined>(undefined)
  const [xMin, setXMin] = useState<string | undefined>(undefined)

  const toast = useToast()

  const plot = async () => {
    setIsLoading(true)
    // const response = await window.Main.getData(path, query)
    const response: TlmDataObjectType = {
      tlm: {
        PCDU_BAT_CURRENT: {
          time: ['2022-04-18 00:00:00', '2022-04-18 00:00:01', '2022-04-18 00:00:02'],
          data: [0, 1, 2],
        },
        PCDU_BAT_VOLTAGE: {
          time: ['2022-04-18 00:00:00', '2022-04-18 00:00:01', '2022-04-18 00:00:02'],
          data: [2, 1, null],
        },
        OBC_AD590_01: {
          time: ['2022-04-18 00:00:00', '2022-04-18 00:00:01', '2022-04-18 00:00:04'],
          data: [1, 1, 1],
        },
        OBC_AD590_02: {
          time: ['2022-04-18 00:00:00', '2022-04-18 00:00:01', '2022-04-18 00:00:02'],
          data: [null, 2, 2],
        },
      },
      warningMessages: [],
    }

    const timeList = Object.keys(response.tlm)
      .map((tlmName) => {
        const tlmObject = response.tlm
        if (tlmObject) {
          return tlmObject[tlmName] ? tlmObject[tlmName]?.time : null
        }
        return null
      })
      .flat()
      .filter(isNotNull)
      .filter(isNotUndefined)
      .filter(isNotNumber)
      .sort()
    setXMin(timeList[0])
    setXMax(timeList[timeList.length - 1])

    setResponseTLmData(response)
    const filteredTlmList = [
      {
        plotId: 1,
        tlm: [
          { label: 'PCDU_BAT_CURRENT', value: 'PCDU_BAT_CURRENT' },
          { label: 'PCDU_BAT_VOLTAGE', value: 'PCDU_BAT_VOLTAGE' },
        ],
      },
      {
        plotId: 2,
        tlm: [
          { label: 'OBC_AD590_01', value: 'OBC_AD590_01' },
          { label: 'OBC_AD590_02', value: 'OBC_AD590_0' },
        ],
      },
    ]

    setGraphData(() =>
      filteredTlmList.map((plotObject) => {
        const tlmListEachPlotId = plotObject.tlm.map((e) => e.value)
        return {
          plotId: plotObject.plotId,
          tlm: tlmListEachPlotId
            .map((tlmName) => {
              const tlmData = response.tlm[tlmName]
              const xData = tlmData?.time
              const yData = tlmData?.data
              if (tlmData && xData && yData)
                return {
                  tlmName: tlmName,
                  x: xData,
                  y: yData,
                }
              return null
            })
            .filter(isNotNull),
        }
      })
    )

    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  const initializeWarningError = () => {
    setIsWarning(false)
    setIsError(false)
    setWarningMessage(() => [])
  }

  const set = () => {
    initializeWarningError()
    const projectValue = project?.value
    if (!projectValue) return
    const tlmIdList = setting?.tlmId
    if (!tlmIdList) return

    if (isOrbit && !setting.orbitDatasetPath) {
      setIsError(true)
      setErrorMessage(`Orbit telemetry for ${projectValue} not found`)
      return
    }
    if (!isOrbit && !setting.testCase) {
      setIsError(true)
      setErrorMessage(`Ground test telemetry for ${projectValue} not found`)
      return
    }

    // delete test cases if no test cases in selected project
    const filteredTestCaseList = testCaseList.filter((element) => {
      if (setting?.testCase?.indexOf(element.value) === -1) {
        setIsWarning(true)
        setWarningMessage((prev) => [...prev, `Test case: ${element.value} deleted because not exist`])
        return false
      }
      return true
    })

    if (isChosen && filteredTestCaseList.length === 0) {
      setErrorMessage('Test case not selected, although Choose test cases is on')
      setIsError(true)
      return
    }

    // delete telemetries if no telemetries in selected project
    const projectTlmList = Object.keys(tlmIdList)
    const filteredTlmList = tlmList.map((element) => {
      const filteredList = element.tlm.filter((tlm) => {
        if (projectTlmList.indexOf(tlm.value) === -1) {
          setIsWarning(true)
          setWarningMessage((prev) => [...prev, `TLM list: ${tlm.value} of ${element.id} deleted because not exist`])
          return false
        }
        return true
      })
      return {
        plotId: element.id,
        tlm: filteredList,
      }
    })

    const requestTlmList: requestTlmType[] = []
    filteredTlmList.forEach((filteredElement) => {
      filteredElement.tlm.forEach((tlm) => {
        const tlmId = tlmIdList[tlm.value]
        const selectedTlmIdList = requestTlmList.map((requestElement) => requestElement.tlmId)
        if (tlmId && selectedTlmIdList.indexOf(tlmId) === -1) {
          requestTlmList.push({
            tlmId: tlmId,
            tlmList: [tlm.value],
          })
        } else {
          const foundIndex = requestTlmList.findIndex((requestElement) => requestElement.tlmId === tlmId)
          const foundTlmElement = requestTlmList[foundIndex]
          if (foundTlmElement && foundTlmElement.tlmList.indexOf(tlm.value) === -1)
            foundTlmElement.tlmList.push(tlm.value)
        }
      })
    })

    if (requestTlmList.length === 0) {
      setErrorMessage('Telemetry not selected')
      setIsError(true)
      return
    }

    const request: requestDataType = {
      project: projectValue,
      isOrbit: isOrbit,
      isStored: isStored,
      isChosen: isChosen,
      dateSetting: dateSetting,
      tesCase: filteredTestCaseList,
      tlm: requestTlmList,
    }
    console.log(request)
  }

  const outputCsv = async () => {
    if (responseTlmData) {
      const response = await window.Main.saveFile(responseTlmData.tlm)
      toast({
        title: response.success ? `success: ${response.path}` : `error: ${response.error}`,
        status: response.success ? 'success' : 'error',
        isClosable: true,
      })
    } else {
      toast({
        title: 'error: tlm data not found',
        status: 'error',
        isClosable: true,
      })
    }
  }

  return (
    <Box p={8} w="100%">
      <Flex>
        <Error
          isError={isError}
          errorMessage={errorMessage}
          isWarning={isWarning}
          warningMessages={warningMessage}
          noDisplayWhenSuccess={true}
        />
        <Spacer />
        <Button colorScheme="teal" onClick={plot} mx="10" flexShrink={0} width="80px">
          Plot
        </Button>
        <Button colorScheme="teal" onClick={set} mr="10" flexShrink={0} width="80px">
          Set
        </Button>
        {responseTlmData && (
          <Button colorScheme="teal" onClick={outputCsv} mr="10" flexShrink={0} width="80px">
            CSV
          </Button>
        )}
      </Flex>
      <Flex wrap="wrap" mt="20px">
        {!isLoading ? (
          graphData.map((element, index) => (
            <Graph key={element.plotId} graphData={element} graphNumber={index + 1} xMax={xMax} xMin={xMin} />
          ))
        ) : (
          <Spinner thickness="5px" speed="0.5s" emptyColor="gray.200" color="blue.500" size="xl" />
        )}
      </Flex>
    </Box>
  )
}
