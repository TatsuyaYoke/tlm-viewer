import { useEffect, useState } from 'react'

import {
  Box,
  Flex,
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
  Input,
} from '@chakra-ui/react'
import Plot from 'react-plotly.js'

import { isNotNull, isNotNumber, isNotString } from '@types'

import type { GraphDataEachPlotIdType } from '@types'

type Props = {
  graphData: GraphDataEachPlotIdType
  graphNumber: number
}

type AxisType = {
  x: {
    max: string | undefined
    min: string | undefined
    div: number | undefined
  }
  y: {
    max: number | undefined
    min: number | undefined
    div: number | undefined
  }
}

export const Graph = (props: Props) => {
  const { graphData, graphNumber } = props
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
  const [yaxisMax, setYaxisMax] = useState<number | undefined>(undefined)

  const clickAxisSetting = () => {
    setAxis((prev) => {
      const newAxis = { ...prev }
      newAxis.y.max = yaxisMax
      return newAxis
    })
    onClose()
  }

  useEffect(() => {
    const xDataAll = Array.from(
      new Set(
        graphData.tlm
          .map((e) => e.x)
          .flat()
          .filter(isNotNumber)
          .filter(isNotNull)
      )
    ).sort()

    const xMin = xDataAll[0]
    const xMax = xDataAll[xDataAll.length - 1]

    const yDataAll = graphData.tlm
      .map((e) => e.y)
      .flat()
      .filter(isNotString)
      .filter(isNotNull)

    const yMax = Math.max(...yDataAll)
    const yMin = Math.min(...yDataAll)
    const yOutside = ((yMax - yMin) / 4) * 0.2

    setAxis((prev) => {
      const newAxis = { ...prev }
      newAxis.x.max = xMax
      newAxis.x.min = xMin
      newAxis.y.max = yMax + yOutside
      newAxis.y.min = yMin - yOutside
      return newAxis
    })
    setIsLoading(false)
  }, [])

  return (
    !isLoading && (
      <>
        <Box mb="20px">
          <Flex alignItems="center" mb="5px">
            <Text mx="20px">Graph No.{graphNumber}</Text>
            <Button colorScheme="teal" h="1.8em" fontSize="1em" onClick={onOpen}>
              Set
            </Button>
          </Flex>
          <Plot
            data={graphData.tlm.map((element) => ({
              x: element.x,
              y: element.y,
              type: 'scattergl',
              mode: 'lines+markers',
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
                dtick: undefined,
                // range: [undefined, undefined],
                range: ['2022-04-18 00:00:00', '2022-04-18 00:00:02'],
                tickformat: '%m-%d, %H:%M:%S',
                tickangle: -40,
                // dtick: 3 * 60 * 60 * 1000, // milliseconds
                gridcolor: graphGridColor,
                linecolor: graphLineColor,
                zerolinecolor: graphLineColor,
                mirror: 'ticks',
                showgrid: true,
                zeroline: true,
                showline: true,
                // autorange: true,
                // autotick: true,
              },
              yaxis: {
                dtick: undefined,
                // range: [undefined, undefined],
                range: [axis.y.min, axis.y.max],
                // range: [2, 2.1],
                gridcolor: graphGridColor,
                linecolor: graphLineColor,
                zerolinecolor: graphLineColor,
                mirror: 'ticks',
                showgrid: true,
                zeroline: true,
                showline: true,
                // autorange: true,
                // autotick: true,
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
        </Box>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Axis setting</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Text fontWeight="bold">Y-axis</Text>
              <FormControl>
                <Flex alignItems="center">
                  <FormLabel fontWeight="normal" m={0} mr="10px" w="40px">
                    Max
                  </FormLabel>
                  <NumberInput onChange={(_, value) => setYaxisMax(value)}>
                    <NumberInputField />
                  </NumberInput>
                  {/* <Input type="time" step={1} defaultValue="00:00:00" /> */}
                </Flex>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="teal" mr={3} onClick={clickAxisSetting}>
                Activate
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  )
}
