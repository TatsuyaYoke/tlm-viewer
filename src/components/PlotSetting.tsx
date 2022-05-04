import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { VStack, StackDivider, IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { useEffect } from 'react'

import { ProjectSelect, DayPicker, IsStoredSwitch, TelemetrySelect, TestCaseSelect } from '@parts'

import type { VFC } from 'react'

type Props = {
  minW: number | string
}

export const PlotSetting: VFC<Props> = (props) => {
  const { minW } = props
  const { colorMode, toggleColorMode } = useColorMode()
  const sidebarBg = useColorModeValue('gray.50', 'gray.700')

  useEffect(() => {
    const settings = window.Main.getSettngs()
    console.log(settings)
  }, [])

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
      <ProjectSelect />
      <IsStoredSwitch />
      <DayPicker />
      <TestCaseSelect />
      <TelemetrySelect />
    </VStack>
  )
}
