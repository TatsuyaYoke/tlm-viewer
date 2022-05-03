import { useEffect, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { VStack } from '@chakra-ui/react'
import type { MultiValue } from 'chakra-react-select'
import type { selectOptionType } from '@types'
import { MySwitch, MySelect } from '@parts'
import { isChoosedState, testCaseListState } from '@atoms/PlotSettingAtom'

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
      const testCaseOptionListTemp: selectOptionType[] = testCaseListOnlyValue.map((element) => ({
        label: element,
        value: element,
      }))
      setTestCaseOptionList(() => testCaseOptionListTemp)
    }
  }, [])

  return (
    <VStack>
      <MySwitch label="Choose test cases" htmlFor="choose-test-cases" value={isChoosed} toggleValue={toggleValue} />
      <MySelect
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
