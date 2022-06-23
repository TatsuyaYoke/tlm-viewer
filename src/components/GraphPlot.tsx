import { useRef, useState } from 'react'

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spacer,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { useRecoilValue } from 'recoil'
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts'

import { testCaseListState, settingState, dateSettingState } from '@atoms/PlotSettingAtom'
import { Error } from '@components'
import { checkDivSetting } from '@functions'
import { Graph } from '@parts'
import { dateGraphSchema, nonNullable } from '@types'

import type {
  RequestDataType,
  RequestTlmType,
  GraphDataArrayType,
  AxisType,
  ResponseDataType,
  SelectOptionType,
  TlmListType,
} from '@types'

export const GraphPlot = () => {
  console.log('GraphPlot Rendering...')
  const isStored = useReadLocalStorage<boolean>('IsStored') ?? false
  const isChosen = useReadLocalStorage<boolean>('IsChosen') ?? false
  const isOrbit = useReadLocalStorage<boolean>('IsOrbit') ?? false
  const testCaseList = useRecoilValue(testCaseListState)
  const tlmList = useReadLocalStorage<TlmListType[]>('TlmList') ?? [{ id: 1, tlm: [] }]
  const setting = useRecoilValue(settingState)
  const dateSetting = useRecoilValue(dateSettingState)

  const [isWarning, setIsWarning] = useState(false)
  const [warningMessages, setWarningMessages] = useState<string[]>([])
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [responseTlmData, setResponseTlmData] = useState<ResponseDataType | null>(null)
  const [graphData, setGraphData] = useState<GraphDataArrayType>([])

  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = useRef(null)
  const [xaxisMax, setXaxisMax] = useState<string | undefined>(undefined)
  const [xaxisMin, setXaxisMin] = useState<string | undefined>(undefined)
  const [xaxisDiv, setXaxisDiv] = useState<number | undefined>(undefined)
  const [activate, setActivate] = useState<boolean>(false)
  const [axis, setAxis] = useState<AxisType>({
    x: {
      max: undefined,
      min: undefined,
      div: undefined,
    },
    y: {
      max: undefined,
      min: undefined,
      div: undefined,
    },
  })

  const [graphConfig, setGraphConfig] = useLocalStorage('GraphConfig', {
    columnNumber: 3,
    graphHeight: 500,
    markerSize: 3,
  })
  const [columnNumber, setColumnNumber] = useState(graphConfig.columnNumber)
  const [graphHeight, setGraphHeight] = useState(graphConfig.graphHeight)
  const [markerSize, setMarkerSize] = useState(graphConfig.markerSize)

  const setPlot = async (
    response: ResponseDataType,
    filteredTlmList: { plotId: number; tlm: SelectOptionType[] }[]
  ) => {
    const timeList = response.tlm.time
    const sortedTimeList = [...timeList].sort()
    setAxis((prev) => {
      const newAxis = { ...prev }
      newAxis.x.max = sortedTimeList[sortedTimeList.length - 1]
      newAxis.x.min = sortedTimeList[0]
      setXaxisMin(newAxis.x.min)
      setXaxisMax(newAxis.x.max)
      return newAxis
    })

    setResponseTlmData(response)
    setGraphData(() =>
      filteredTlmList.map((plotObject) => {
        const tlmListEachPlotId = plotObject.tlm.map((e) => e.value)
        return {
          plotId: plotObject.plotId,
          tlm: tlmListEachPlotId
            .map((tlmName) => {
              const xData = timeList
              const yData = response.tlm.data[tlmName]
              if (xData && yData)
                return {
                  tlmName: tlmName,
                  x: xData,
                  y: yData,
                }
              return null
            })
            .filter(nonNullable),
        }
      })
    )
  }

  const initializeWarningError = () => {
    setIsWarning(false)
    setIsError(false)
    setWarningMessages(() => [])
  }

  const plot = async () => {
    initializeWarningError()
    if (setting) {
      const { pjName, tlmId: tlmIdList, testCase, ...restSetting } = setting
      if (!tlmIdList) return

      if (isOrbit && !restSetting.orbitDatasetPath) {
        setIsError(true)
        setErrorMessage(`Orbit telemetry for ${pjName} not found`)
        return
      }
      if (!isOrbit && !testCase) {
        setIsError(true)
        setErrorMessage(`Ground test telemetry for ${pjName} not found`)
        return
      }

      // delete test cases if no test cases in selected project
      const filteredTestCaseList = testCaseList.filter((element) => {
        if (testCase?.indexOf(element.value) === -1) {
          setIsWarning(true)
          setWarningMessages((prev) => [...prev, `Test case: ${element.value} deleted because not exist`])
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
            setWarningMessages((prev) => [...prev, `TLM list: ${tlm.value} deleted because not exist`])
            return false
          }
          return true
        })
        return {
          plotId: element.id,
          tlm: filteredList,
        }
      })

      const requestTlmList: RequestTlmType[] = []
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

      setIsLoading(true)
      const request: RequestDataType = {
        pjName: pjName,
        isOrbit: isOrbit,
        isStored: isStored,
        isChosen: isChosen,
        dateSetting: dateSetting,
        testCase: filteredTestCaseList,
        tlm: requestTlmList,
        ...restSetting,
      }

      const response = await window.Main.getData(request)
      if (response.success) {
        setPlot(response, filteredTlmList)
      } else {
        setIsWarning(true)
        setGraphData([])
        setWarningMessages((prev) => [...prev, ...response.errorMessages])
      }
      setIsLoading(false)
    }
  }

  const activateSetting = () => {
    const xaxisMaxResult = dateGraphSchema.safeParse(xaxisMax)
    const xaxisMinResult = dateGraphSchema.safeParse(xaxisMin)
    if (!(xaxisMaxResult.success && xaxisMinResult.success)) {
      toast({
        title: 'X-axis Format (yyyy-MM-dd HH:mm:ss) error',
        status: 'error',
        isClosable: true,
      })
      return
    }

    const xaxisMaxNumber = new Date(xaxisMaxResult.data)
    const xaxisMinNumber = new Date(xaxisMinResult.data)
    const checkXaxisDivResult = checkDivSetting(xaxisMaxNumber, xaxisMinNumber, xaxisDiv)
    if (!checkXaxisDivResult.success) {
      toast({
        title: `X-axis ${checkXaxisDivResult.error}`,
        status: 'error',
        isClosable: true,
      })
      return
    }

    setAxis((prev) => {
      const newAxis = { ...prev }
      newAxis.x.max = xaxisMax
      newAxis.x.min = xaxisMin
      newAxis.x.div = xaxisDiv
      return newAxis
    })
    setGraphConfig({
      columnNumber: columnNumber,
      graphHeight: graphHeight,
      markerSize: markerSize,
    })
    setActivate((prev) => !prev)
    onClose()
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
    <>
      <Box p={8} w="100%">
        <Flex>
          <Error
            isError={isError}
            errorMessage={errorMessage}
            isWarning={isWarning}
            warningMessages={warningMessages}
            noDisplayWhenSuccess={true}
          />
          <Spacer />
          <Button colorScheme="teal" onClick={plot} mx="5" flexShrink={0} width="100px">
            Plot
          </Button>
          <Button
            colorScheme="teal"
            onClick={outputCsv}
            mr="5"
            flexShrink={0}
            width="100px"
            isDisabled={responseTlmData === null}
          >
            CSV
          </Button>
          <Button
            colorScheme="teal"
            onClick={onOpen}
            mr="5"
            flexShrink={0}
            width="100px"
            isDisabled={responseTlmData === null}
          >
            Graph Set
          </Button>
        </Flex>
        <Flex wrap="wrap" mt="20px">
          {!isLoading ? (
            graphData.map((element, index) => (
              <Graph
                key={element.plotId}
                graphData={element}
                graphNumber={index + 1}
                xMax={axis.x.max}
                xMin={axis.x.min}
                xDiv={axis.x.div}
                columnNumber={graphConfig.columnNumber}
                graphHeight={graphConfig.graphHeight}
                markerSize={graphConfig.markerSize}
                activate={activate}
              />
            ))
          ) : (
            <Spinner thickness="5px" speed="0.5s" emptyColor="gray.200" color="blue.500" size="xl" />
          )}
        </Flex>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Graph Set</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl my="10px">
              <Flex alignItems="center">
                <FormLabel fontWeight="normal" m={0} mr="10px" w="130px">
                  Column Number
                </FormLabel>
                <NumberInput
                  w="160px"
                  defaultValue={graphConfig.columnNumber}
                  onChange={(_, value) => setColumnNumber(value)}
                  step={1}
                  min={1}
                  max={5}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>
            </FormControl>
            <FormControl my="10px">
              <Flex alignItems="center">
                <FormLabel fontWeight="normal" m={0} mr="10px" w="130px">
                  Graph height
                </FormLabel>
                <NumberInput
                  w="160px"
                  defaultValue={graphConfig.graphHeight}
                  onChange={(_, value) => setGraphHeight(value)}
                  step={50}
                  min={300}
                  max={1200}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Text ml="10px">px</Text>
              </Flex>
            </FormControl>
            <FormControl my="10px">
              <Flex alignItems="center">
                <FormLabel fontWeight="normal" m={0} mr="10px" w="130px">
                  Marker size
                </FormLabel>
                <NumberInput
                  w="160px"
                  defaultValue={graphConfig.markerSize}
                  onChange={(_, value) => setMarkerSize(value)}
                  step={1}
                  min={1}
                  max={20}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>
            </FormControl>
            <Text fontWeight="bold">X-axis</Text>
            <FormControl my="10px">
              <Flex alignItems="center">
                <FormLabel fontWeight="normal" m={0} mr="10px" w="40px">
                  Min
                </FormLabel>
                <Input
                  ref={initialRef}
                  w="250px"
                  placeholder="yyyy-MM-dd HH:mm:ss"
                  defaultValue={axis.x.min}
                  onChange={(event) => setXaxisMin(event.target.value)}
                />
              </Flex>
            </FormControl>
            <FormControl my="10px">
              <Flex alignItems="center">
                <FormLabel fontWeight="normal" m={0} mr="10px" w="40px">
                  Max
                </FormLabel>
                <Input
                  w="250px"
                  placeholder="yyyy-MM-dd HH:mm:ss"
                  defaultValue={axis.x.max}
                  onChange={(event) => setXaxisMax(event.target.value)}
                />
              </Flex>
            </FormControl>
            <FormControl my="10px">
              <Flex alignItems="center">
                <FormLabel fontWeight="normal" m={0} mr="10px" w="40px">
                  Div
                </FormLabel>
                <NumberInput w="250px" defaultValue={axis.x.div} onChange={(_, value) => setXaxisDiv(value)}>
                  <NumberInputField />
                </NumberInput>
                <Text ml="10px">sec</Text>
              </Flex>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={activateSetting}>
              Activate
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
