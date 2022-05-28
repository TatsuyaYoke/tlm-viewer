import { useColorModeValue } from '@chakra-ui/react'
import Plot from 'react-plotly.js'

import type { graphDataType } from '@types'

type Props = {
  graphData: graphDataType[]
  // color: string
}

export const Graph = (props: Props) => {
  const { graphData } = props
  const graphBgColor = useColorModeValue('#FFFFFF', '#1A202C')
  const graphFontColor = useColorModeValue('#000000', '#FFFFFF')
  const graphGridColor = useColorModeValue('#A0AEC0', '#636363')
  const graphLineColor = useColorModeValue('#A0AEC0', '#636363')
  return (
    <Plot
      data={graphData.map((element) => ({
        x: element.x,
        y: element.y,
        type: 'scattergl',
        mode: 'lines+markers',
        name: element.tlmName,
      }))}
      layout={{
        width: 700,
        height: 500,
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
          autorange: true,
          autotick: true,
        },
        yaxis: {
          gridcolor: graphGridColor,
          linecolor: graphLineColor,
          zerolinecolor: graphLineColor,
          mirror: 'ticks',
          showgrid: true,
          zeroline: true,
          showline: true,
          autorange: true,
          autotick: true,
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
  )
}
