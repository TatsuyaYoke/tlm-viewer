import { VStack } from '@chakra-ui/react'
import { useRecoilState, useSetRecoilState } from 'recoil'

import { isChoosedState, testCaseListState } from '@atoms/PlotSettingAtom'
import { MySwitch, MySelect } from '@parts'

import type { selectOptionType } from '@types'
import type { MultiValue } from 'chakra-react-select'

type Props = {
  options?: selectOptionType[]
}

export const TestCaseSelect = (props: Props) => {
  const { options } = props
  const [isChoosed, setIsChoosed] = useRecoilState(isChoosedState)
  const setTestCaseList = useSetRecoilState(testCaseListState)

  const toggleValue = (value: boolean) => {
    setIsChoosed(() => !value)
  }

  const selectValue = (value: MultiValue<selectOptionType>) => {
    setTestCaseList(() => value)
  }

  return (
    <VStack>
      <MySwitch label="Choose test cases" value={isChoosed} toggleValue={toggleValue} />
      <MySelect
        instanceId="testCase"
        color="teal.500"
        width="100%"
        height="40px"
        options={options}
        isMulti={true}
        selectValue={selectValue}
      />
    </VStack>
  )
}
