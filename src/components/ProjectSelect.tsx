import { useEffect } from 'react'

import { Box, Text } from '@chakra-ui/react'
import { useSetRecoilState } from 'recoil'

import { projectState } from '@atoms/PlotSettingAtom'
import { MySelect } from '@parts'

import type { selectOptionType } from '@types'
import type { SingleValue } from 'chakra-react-select'

type Props = {
  options: selectOptionType[]
  defaultValue?: SingleValue<selectOptionType>
}

export const ProjectSelect = (props: Props) => {
  const { options, defaultValue } = props
  const setProject = useSetRecoilState(projectState)

  const selectValue = (value: SingleValue<selectOptionType>) => {
    setProject(() => value)
  }

  useEffect(() => {
    if (defaultValue) selectValue(defaultValue)
  }, [])
  return (
    <Box>
      <Text fontWeight={600}>Project</Text>
      <MySelect
        instanceId="projectSelect"
        color="teal.500"
        width="100%"
        height="40px"
        options={options}
        selectValue={selectValue}
        defaultValue={defaultValue}
      />
    </Box>
  )
}
