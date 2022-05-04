import { Box, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'

import { projectState } from '@atoms/PlotSettingAtom'
import { MySelectSingle } from '@parts'

import type { selectOptionType } from '@types'
import type { SingleValue } from 'chakra-react-select'

export const ProjectSelect = () => {
  const [projectOptionList, setProjectOptionList] = useState<selectOptionType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const setProject = useSetRecoilState(projectState)

  const selectValue = (value: SingleValue<selectOptionType>) => {
    setProject(() => value)
  }

  useEffect(() => {
    const projects = ['DSX0201', 'DSX0202']
    if (projects) {
      setProjectOptionList(() =>
        projects.map((element) => ({
          label: element,
          value: element,
        }))
      )
      setIsLoading(false)
    }
  }, [])
  return (
    <Box>
      <Text fontWeight={600}>Project</Text>
      {!isLoading && (
        <MySelectSingle
          instanceId="projectSelect"
          color="teal.500"
          width="100%"
          height="40px"
          options={projectOptionList}
          selectValue={selectValue}
          defauleValue={projectOptionList[0]}
        />
      )}
    </Box>
  )
}
