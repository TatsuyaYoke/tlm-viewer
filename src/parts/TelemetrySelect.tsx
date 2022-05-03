import { useState } from 'react'
import { useRecoilState } from 'recoil'
import { VStack, Text, Flex, IconButton } from '@chakra-ui/react'
import type { SingleValue, MultiValue } from 'chakra-react-select'
import { SmallCloseIcon, AddIcon } from '@chakra-ui/icons'
import type { selectOptionType } from '@types'
import { MySelectList, MySwitch } from '@parts'
import { isMultiState, tlmListState } from '@atoms/PlotSettingAtom'

const TelemetrySelect = () => {
  const [isMulti, setIsMulti] = useRecoilState(isMultiState)
  const [tlmList, setTlmList] = useRecoilState(tlmListState)
  const [countList, setCountList] = useState(1)

  const tlmNames = ['DATE', 'VOLTAGE', 'CURRENT']

  const tlmNamesOptions: selectOptionType[] = tlmNames.map((element) => ({
    label: element,
    value: element,
  }))

  const toggleValue = (value: boolean) => {
    setIsMulti(() => !value)
  }

  const addTlmList = () => {
    const newTlmList = [...tlmList]
    newTlmList.push({ id: countList + 1, tlm: [] })
    setCountList(() => countList + 1)
    setTlmList(newTlmList)
  }

  const deleteTlmList = (index: number) => {
    if (tlmList.length === 1) return
    const newTlmList = [...tlmList]
    newTlmList.splice(index, 1)
    setTlmList(newTlmList)
  }

  const selectValue = (value: SingleValue<selectOptionType> | MultiValue<selectOptionType>, instanceId: number) => {
    const findIndex = tlmList.findIndex((element) => element.id === instanceId)
    const newTlmList = tlmList.map((list) => ({ ...list }))
    if (Array.isArray(value)) {
      newTlmList[findIndex].tlm = value
    } else if (value !== null) {
      newTlmList[findIndex].tlm = [value]
    }
    setTlmList(() => newTlmList)
  }
  return (
    <VStack>
      <Flex w="100%">
        <Text fontWeight={600}>Choose telemeries</Text>
      </Flex>
      <MySwitch label="isMulti?" htmlFor="is-multi" value={isMulti} toggleValue={toggleValue} />
      <VStack w="100%">
        {tlmList.map((element, index) => (
          <Flex key={`tlm${element.id}`} w="100%" alignItems="center">
            <MySelectList
              instanceId={element.id}
              color="teal.500"
              width="100%"
              height="40px"
              options={tlmNamesOptions}
              isMulti={isMulti}
              selectValue={selectValue}
            />
            <IconButton
              aria-label="delete telemetry list"
              variant="outline"
              colorScheme="teal"
              fontSize="15px"
              size="xs"
              icon={<SmallCloseIcon />}
              mx={2}
              onClick={() => deleteTlmList(index)}
            />
          </Flex>
        ))}
      </VStack>
      <Flex w="100%" justifyContent="right">
        <IconButton
          aria-label="add telemetry list"
          colorScheme="teal"
          size="xs"
          icon={<AddIcon />}
          mt={2}
          mr={2}
          onClick={() => addTlmList()}
        />
      </Flex>
    </VStack>
  )
}

export default TelemetrySelect
