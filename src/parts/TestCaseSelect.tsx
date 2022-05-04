import { VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'

import { isChoosedState, testCaseListState } from '@atoms/PlotSettingAtom'
import { MySwitch, MySelectMultiple } from '@parts'

import type { selectOptionType } from '@types'
import type { MultiValue } from 'chakra-react-select'

export const TestCaseSelect = () => {
  const [isChoosed, setIsChoosed] = useRecoilState(isChoosedState)
  const [testCaseOptionList, setTestCaseOptionList] = useState<selectOptionType[]>([])
  const setTestCaseList = useSetRecoilState(testCaseListState)

  const toggleValue = (value: boolean) => {
    setIsChoosed(() => !value)
  }

  const selectValue = (value: MultiValue<selectOptionType>) => {
    setTestCaseList(() => value)
  }

  useEffect(() => {
    const project = 'DSX0201'
    const testCaseListOnlyValue = window.Main.getTestCaseList(project)
    if (testCaseListOnlyValue) {
      setTestCaseOptionList(() =>
        testCaseListOnlyValue.map((element) => ({
          label: element,
          value: element,
        }))
      )
    }
  }, [])

  return (
    <VStack>
      <MySwitch label="Choose test cases" htmlFor="choose-test-cases" value={isChoosed} toggleValue={toggleValue} />
      <MySelectMultiple
        instanceId="testCase"
        color="teal.500"
        width="100%"
        height="40px"
        options={testCaseOptionList}
        selectValue={selectValue}
      />
    </VStack>
  )
}
