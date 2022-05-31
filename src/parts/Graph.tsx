import { Box, Flex, useColorModeValue, Text, Button } from '@chakra-ui/react'
import Plot from 'react-plotly.js'

import type { GraphDataEachPlotIdType } from '@types'

type Props = {
  graphData: GraphDataEachPlotIdType
  graphNumber: number
}

export const Graph = (props: Props) => {
  const { graphData, graphNumber } = props
  const graphBgColor = useColorModeValue('#FFFFFF', '#1A202C')
  const graphFontColor = useColorModeValue('#000000', '#FFFFFF')
  const graphGridColor = useColorModeValue('#A0AEC0', '#636363')
  const graphLineColor = useColorModeValue('#A0AEC0', '#636363')
  return (
    <Box mb="20px">
      <Flex alignItems="center">
        <Text mx="20px">Graph No.{graphNumber}</Text>
        <Button colorScheme="teal" h="1.8em" fontSize="1em">
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
          margin: {
            l: 50,
            r: 50,
            t: 35,
            b: 80,
          },
          xaxis: {
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
            range: [undefined, undefined],
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
        }}
        config={{
          responsive: false,
        }}
      />
    </Box>
  )
}
