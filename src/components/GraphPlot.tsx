import sqlite3 from 'sqlite3'
import { useRecoilValue } from 'recoil'
import { Box, Button, Flex } from '@chakra-ui/react'
import { isStoredState, isChoosedState, isMultiState, testCaseListState, tlmListState } from '../atoms/PlotSettingAtom'
import Graph from './Graph'

const toObjectArray = (records) => {
  const objectArray = {}
  const keys = Object.keys(records[0])
  keys.forEach((key) => {
    objectArray[key] = []
  })
  records.forEach((record) => {
    keys.forEach((key) => {
      objectArray[key].push(record[key])
    })
  })
  return objectArray
}

// const readDbSyns = async (path: string) =>
//   new Promise((resolve) => {
//     const db = new sqlite3.Database(path)
//     db.serialize(() => {
//       db.all(
//         'select distinct DATE, PCDU_BAT_VOLTAGE, PCDU_BAT_CURRENT from DSX0201_tlm_id_1 limit 10',
//         (err, records) => {
//           const data = toObjectArray(records)
//           resolve(data)
//         }
//       )
//     })
//   })

const GraphPlot = () => {
  const isStored = useRecoilValue(isStoredState)
  const isChoosed = useRecoilValue(isChoosedState)
  const isMulti = useRecoilValue(isMultiState)
  const testCaseList = useRecoilValue(testCaseListState)
  const tlmList = useRecoilValue(tlmListState)
  const plot = async () => {
    console.log(tlmList)
    // const data = await readDbSyns('./db/system_test.db')
    // console.log(data)
  }
  return (
    <Box p={8}>
      <Flex justify="right">
        <Button colorScheme="teal" onClick={plot} mr="10">
          Plot
        </Button>
      </Flex>
      <Flex wrap="wrap">
        <Graph x={[0, 1, 2]} y={[0, 5, 3]} color="red" />
        <Graph x={[0, 1, 2]} y={[0, 5, 3]} color="red" />
        <Graph x={[0, 1, 2]} y={[0, 5, 3]} color="red" />
        <Graph x={[0, 1, 2]} y={[0, 5, 3]} color="red" />
        <Graph x={[0, 1, 2]} y={[0, 5, 3]} color="red" />
        <Graph x={[0, 1, 2]} y={[0, 5, 3]} color="red" />
      </Flex>
    </Box>
  )
}

export default GraphPlot
