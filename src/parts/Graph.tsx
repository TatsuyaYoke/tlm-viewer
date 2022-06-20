import { useEffect, useState } from 'react'

import {
  Box,
  Flex,
  Input,
  useToast,
  useColorModeValue,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react'
import Plot from 'react-plotly.js'

import { checkDivSetting } from '@functions'
import { dateGraphSchema, nonNullable, isNotString } from '@types'

import type { GraphDataEachPlotIdType, AxisType } from '@types'

type Props = {
  graphNumber: number
  graphData: GraphDataEachPlotIdType
  xMax: string | undefined
  xMin: string | undefined
  xDiv: number | undefined
  activate: boolean
}

export const Graph = (props: Props) => {
  const { graphNumber, graphData, xMax, xMin, xDiv, activate } = props
  console.log(`Graph No.${graphNumber} Rendering`)
  const graphBgColor = useColorModeValue('#FFFFFF', '#1A202C')
  const graphFontColor = useColorModeValue('#000000', '#FFFFFF')
  const graphGridColor = useColorModeValue('#A0AEC0', '#636363')
  const graphLineColor = useColorModeValue('#A0AEC0', '#636363')
  const { isOpen, onOpen, onClose } = useDisclosure()
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

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [xaxisMax, setXaxisMax] = useState<string | undefined>(undefined)
  const [xaxisMin, setXaxisMin] = useState<string | undefined>(undefined)
  const [xaxisDiv, setXaxisDiv] = useState<number | undefined>(undefined)
  const [yaxisMax, setYaxisMax] = useState<number | undefined>(undefined)
  const [yaxisMin, setYaxisMin] = useState<number | undefined>(undefined)
  const [yaxisDiv, setYaxisDiv] = useState<number | undefined>(undefined)

  const toast = useToast()

  const activateAxis = () => {
    if (Number.isNaN(yaxisMax ?? NaN) || Number.isNaN(yaxisMin ?? NaN)) {
      toast({
        title: 'Max and Min required',
        status: 'error',
        isClosable: true,
      })
      return
    }

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

    const checkYaxisDivResult = checkDivSetting(yaxisMax, yaxisMin, yaxisDiv)
    if (!checkYaxisDivResult.success) {
      toast({
        title: `Y-axis ${checkYaxisDivResult.error}`,
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
      newAxis.y.max = yaxisMax
      newAxis.y.min = yaxisMin
      newAxis.y.div = yaxisDiv
      return newAxis
    })
    onClose()
  }

  useEffect(() => {
    const yDataAll = graphData.tlm
      .map((e) => e.y)
      .flat()
      .filter(isNotString)
      .filter(nonNullable)

    const yMax = yDataAll.reduce((a, b) => (a > b ? a : b))
    const yMin = yDataAll.reduce((a, b) => (a < b ? a : b))
    const yOutside = ((yMax - yMin) / 4) * 0.2

    setAxis((prev) => {
      const newAxis = { ...prev }
      newAxis.x.max = xMax
      newAxis.x.min = xMin
      newAxis.y.max = yMax + yOutside
      newAxis.y.min = yMin - yOutside
      return newAxis
    })
    setXaxisMax(() => axis.x.max)
    setXaxisMin(() => axis.x.min)
    setYaxisMax(() => axis.y.max)
    setYaxisMin(() => axis.y.min)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    setAxis((prev) => {
      const newAxis = { ...prev }
      newAxis.x.max = xMax
      newAxis.x.min = xMin
      newAxis.x.div = xDiv
      return newAxis
    })
    setXaxisMax(() => axis.x.max)
    setXaxisMin(() => axis.x.min)
    setXaxisDiv(() => axis.x.div)
  }, [activate])

  return (
    <>
      <Box mb="20px">
        <Flex alignItems="center" mb="5px">
          <Text mx="20px">Graph No.{graphNumber}</Text>
          <Button colorScheme="teal" h="1.8em" fontSize="1em" onClick={onOpen}>
            Set
          </Button>
        </Flex>
        {!isLoading && (
          <Plot
            data={graphData.tlm.map((element) => ({
              x: element.x,
              y: element.y,
              type: 'scattergl',
              mode: 'markers',
              name: element.tlmName,
            }))}
            layout={{
              width: 680,
              height: 550,
              margin: {
                l: 50,
                r: 50,
                t: 35,
                b: 80,
              },
              xaxis: {
                dtick: axis.x.div ? axis.x.div * 1000 : undefined, // msec
                range: [axis.x.min, axis.x.max],
                tickformat: '%m-%d, %H:%M:%S',
                tickangle: -40,
                gridcolor: graphGridColor,
                linecolor: graphLineColor,
                zerolinecolor: graphLineColor,
                mirror: 'ticks',
                showgrid: true,
                zeroline: true,
                showline: true,
              },
              yaxis: {
                dtick: axis.y.div,
                range: [axis.y.min, axis.y.max],
                gridcolor: graphGridColor,
                linecolor: graphLineColor,
                zerolinecolor: graphLineColor,
                mirror: 'ticks',
                showgrid: true,
                zeroline: true,
                showline: true,
              },
              font: {
                color: graphFontColor,
              },
              plot_bgcolor: graphBgColor,
              paper_bgcolor: graphBgColor,
              showlegend: true,
              legend: { orientation: 'h', x: 0, xanchor: 'left', y: -0.25 },
            }}
            config={{
              responsive: false,
            }}
          />
        )}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Set axis</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text fontWeight="bold">X-axis</Text>
            <FormControl my="10px">
              <Flex alignItems="center">
                <FormLabel fontWeight="normal" m={0} mr="10px" w="40px">
                  Min
                </FormLabel>
                <Input
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
            <Text fontWeight="bold">Y-axis</Text>
            <FormControl my="10px">
              <Flex alignItems="center">
                <FormLabel fontWeight="normal" m={0} mr="10px" w="40px">
                  Min
                </FormLabel>
                <NumberInput w="250px" defaultValue={axis.y.min} onChange={(_, value) => setYaxisMin(value)}>
                  <NumberInputField />
                </NumberInput>
              </Flex>
            </FormControl>
            <FormControl my="10px">
              <Flex alignItems="center">
                <FormLabel fontWeight="normal" m={0} mr="10px" w="40px">
                  Max
                </FormLabel>
                <NumberInput w="250px" defaultValue={axis.y.max} onChange={(_, value) => setYaxisMax(value)}>
                  <NumberInputField />
                </NumberInput>
              </Flex>
            </FormControl>
            <FormControl my="10px">
              <Flex alignItems="center">
                <FormLabel fontWeight="normal" m={0} mr="10px" w="40px">
                  Div
                </FormLabel>
                <NumberInput w="250px" defaultValue={axis.y.div} onChange={(_, value) => setYaxisDiv(value)}>
                  <NumberInputField />
                </NumberInput>
              </Flex>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={activateAxis}>
              Activate
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
