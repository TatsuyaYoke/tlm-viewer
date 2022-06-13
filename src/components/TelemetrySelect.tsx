import { SmallCloseIcon, AddIcon } from '@chakra-ui/icons'
import { VStack, Text, Flex, IconButton } from '@chakra-ui/react'

import { useTlmListSetting } from '@hooks'
import { MySelect } from '@parts'

import type { SelectOptionType } from '@types'

type Props = {
  options?: SelectOptionType[]
}

const TLM_SELECT_INSTANCE_ID_PREFIX = 'tlmListId'

export const TelemetrySelect = (props: Props) => {
  const { options } = props

  const { tlmList, filteredOptions, addTlmList, deleteTlmList, selectValue, filterOption } = useTlmListSetting(
    options,
    TLM_SELECT_INSTANCE_ID_PREFIX
  )

  return (
    <VStack>
      <Flex w="100%">
        <Text fontWeight={600}>Choose telemetries</Text>
      </Flex>
      <VStack w="100%">
        {tlmList.map((element, index) => (
          <Flex key={`tlm${element.id}`} w="100%" alignItems="center">
            <MySelect
              instanceId={`${TLM_SELECT_INSTANCE_ID_PREFIX}${element.id}`}
              color="teal.500"
              width="100%"
              height="40px"
              options={filteredOptions}
              isMulti={true}
              selectValue={selectValue}
              filterOption={filterOption}
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
