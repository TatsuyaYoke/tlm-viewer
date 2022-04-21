import { VStack, Box, Text, useColorModeValue } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { SingleDatepicker } from 'chakra-dayzed-datepicker'
import { type PropsConfigs } from 'chakra-dayzed-datepicker/dist/utils/commonTypes'

const DayPicker = () => {
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const hoverBg = useColorModeValue('teal.300', 'teal.400')
  const selectedBg = useColorModeValue('teal.100', 'teal.700')

  const dayPickerCoinfg: PropsConfigs = {
    dateNavBtnProps: {
      variant: 'outline',
    },
    dayOfMonthBtnProps: {
      borderColor: 'blue.300',
      selectedBg: selectedBg,
      _hover: {
        bg: hoverBg,
      },
    },
  }

  useEffect(() => {
    if (startDate > endDate) {
      setEndDate(() => startDate)
    }
  }, [startDate, endDate])

  return (
    <VStack spacing={3}>
      <Box w="100%">
        <Text fontWeight={600}>Start Date</Text>
        <SingleDatepicker date={startDate} onDateChange={setStartDate} propsConfigs={dayPickerCoinfg} />
      </Box>
      <Box w="100%">
        <Text fontWeight={600}>End Date</Text>
        <SingleDatepicker date={endDate} onDateChange={setEndDate} propsConfigs={dayPickerCoinfg} />
      </Box>
    </VStack>
  )
}

export default DayPicker
