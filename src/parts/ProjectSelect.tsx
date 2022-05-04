import { useEffect, useState } from 'react'
import { MySelectSingle } from '@parts'
import type { SingleValue } from 'chakra-react-select'
import type { selectOptionType } from '@types'
import { useSetRecoilState } from 'recoil'
import { projectState } from '@atoms/PlotSettingAtom'
import { Box, Text } from '@chakra-ui/react'

export const ProjectSelect = () => {
  const [projectOptionList, setProjectOptionList] = useState<selectOptionType[]>([])
  const setProject = useSetRecoilState(projectState)

  const selectValue = (value: SingleValue<selectOptionType>) => {
    setProject(() => value)
  }

  useEffect(() => {
    const projects = ['DSX0201', 'DSX0202']
    if (projects) {
      const projectOptionListTemp: selectOptionType[] = projects.map((element) => ({
        label: element,
        value: element,
      }))
      setProjectOptionList(() => projectOptionListTemp)
    }
  }, [])
  return (
    <Box>
      <Text fontWeight={600}>Project</Text>
      <MySelectSingle
        instanceId="projectSelect"
        color="teal.500"
        width="100%"
        height="40px"
        options={projectOptionList}
        selectValue={selectValue}
      />
    </Box>
  )
}
