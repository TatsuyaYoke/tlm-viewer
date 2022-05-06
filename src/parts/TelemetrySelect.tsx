import { useState } from 'react'

import { SmallCloseIcon, AddIcon } from '@chakra-ui/icons'
import { VStack, Text, Flex, IconButton } from '@chakra-ui/react'
import { useRecoilState } from 'recoil'

import { tlmListState } from '@atoms/PlotSettingAtom'
import { MySelectList } from '@parts'

import type { selectOptionType } from '@types'
import type { SingleValue, MultiValue } from 'chakra-react-select'

export const TelemetrySelect = () => {
  const [tlmList, setTlmList] = useRecoilState(tlmListState)
  const [countList, setCountList] = useState(1)

  const tlmNames = ['DATE', 'VOLTAGE', 'CURRENT']

  const tlmNamesOptions: selectOptionType[] = tlmNames.map((element) => ({
    label: element,
    value: element,
  }))

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
    const newTlmList = tlmList.map((list) => ({ ...list }))
    const foundIndex = newTlmList.findIndex((element) => element.id === instanceId)
    const item = newTlmList[foundIndex]
    if (item) {
      if (Array.isArray(value)) {
        item.tlm = value
      }
    }

    setTlmList(() => newTlmList)
  }
  return (
    <VStack>
      <Flex w="100%">
        <Text fontWeight={600}>Choose telemeries</Text>
      </Flex>
      <VStack w="100%">
        {tlmList.map((element, index) => (
          <Flex key={`tlm${element.id}`} w="100%" alignItems="center">
            <MySelectList
              instanceId={element.id}
              color="teal.500"
              width="100%"
              height="40px"
              options={tlmNamesOptions}
              isMulti={true}
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
