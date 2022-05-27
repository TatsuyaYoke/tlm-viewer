import { VStack } from '@chakra-ui/react'
import { useRecoilState, useSetRecoilState } from 'recoil'

import { isChosenState, testCaseListState } from '@atoms/PlotSettingAtom'
import { MySwitch, MySelect } from '@parts'

import type { selectOptionType } from '@types'
import type { MultiValue } from 'chakra-react-select'

type Props = {
  options?: selectOptionType[]
}

export const TestCaseSelect = (props: Props) => {
  const { options } = props
  const [isChosen, setIsChosen] = useRecoilState(isChosenState)
  const setTestCaseList = useSetRecoilState(testCaseListState)

  const toggleValue = (value: boolean) => {
    setIsChosen(() => !value)
  }

  const selectValue = (value: MultiValue<selectOptionType>) => {
    setTestCaseList(() => value)
  }

  return (
    <VStack>
      <MySwitch label="Choose test cases" value={isChosen} toggleValue={toggleValue} />
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
