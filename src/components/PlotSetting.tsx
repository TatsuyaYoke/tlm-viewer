import type { VFC } from 'react'
import { VStack, StackDivider, IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import IsStoredSwitch from './SettingPart/IsStoredSwitch'
import DayPicker from './SettingPart/DayPicker'
import TestCaseSelect from './SettingPart/TescCaseSelect'
import TelemetrySelect from './SettingPart/TelemetrySelect'

type Props = {
  minW: number | string
}

const PlotSetting: VFC<Props> = (props) => {
  const { minW } = props
  const { colorMode, toggleColorMode } = useColorMode()
  const sidebarBg = useColorModeValue('gray.50', 'gray.700')

  return (
    <VStack
      divider={<StackDivider borderColor="gray.200" />}
      spacing={3}
      p={8}
      align="stretch"
      minW={minW}
      bg={sidebarBg}
    >
      <IconButton
        aria-label="change color theme"
        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
      />
      <IsStoredSwitch />
      <DayPicker />
      <TestCaseSelect />
      <TelemetrySelect />
    </VStack>
  )
}

export default PlotSetting
