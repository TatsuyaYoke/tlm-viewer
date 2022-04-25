import { useRecoilState } from 'recoil'
import { VStack } from '@chakra-ui/react'
import { MultiValue } from 'chakra-react-select'
import MySelect from '../MySelect'
import MySwitch from '../MySwitch'
import { isChoosedState, testCaseListState } from '../../atoms/PlotSettingAtom'
import type { selectOptionType } from '../../../types/index'

const TestCaseSelect = () => {
  const [isChoosed, setIsChoosed] = useRecoilState(isChoosedState)
  const [testCaseList, setTestCaseList] = useRecoilState(testCaseListState)

  const toggleValue = (value: boolean) => {
    setIsChoosed(() => !value)
  }

  const testCases = ['Flatsat', 'Initial', 'Vibration', 'Shock', 'Thermal', 'Final']
  const testCaseOptions: selectOptionType[] = testCases.map((element) => ({
    label: element,
    value: element,
  }))

  const selectValue = (value: MultiValue<selectOptionType>) => {
    setTestCaseList(() => value)
  }

  return (
    <VStack>
      <MySwitch label="Choose test cases" htmlFor="choose-test-cases" value={isChoosed} toggleValue={toggleValue} />
      <MySelect
        instanceId="testCase"
        color="teal.500"
        width="100%"
        height="40px"
        options={testCaseOptions}
        selectValue={selectValue}
      />
    </VStack>
  )
}

export default TestCaseSelect
