import type { VFC } from 'react'
import { useColorModeValue } from '@chakra-ui/react'
import Plot from 'react-plotly.js'
import type { DataType } from '@types'

type Props = {
  x: DataType[]
  y: DataType[]
  // color: string
}

export const Graph: VFC<Props> = (props) => {
  const { x, y } = props
  const graphBgColor = useColorModeValue('#FFFFFF', '#1A202C')
  const graphFontColor = useColorModeValue('#000000', '#FFFFFF')
  const graphGridColor = useColorModeValue('#A0AEC0', '#636363')
  const graphLineColor = useColorModeValue('#A0AEC0', '#636363')
  return (
    <Plot
      data={[
        {
          x: x,
          y: y,
          type: 'scattergl',
          mode: 'lines+markers',
          // marker: { color: color },
        },
      ]}
      layout={{
        width: 600,
        height: 500,
        margin: {
          l: 50,
          r: 50,
          t: 35,
          b: 80,
        },
        xaxis: {
          // tickformat: '%m-%d, %H:%M',
          tickangle: -45,
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
      }}
      config={{
        responsive: false,
      }}
    />
  )
}
