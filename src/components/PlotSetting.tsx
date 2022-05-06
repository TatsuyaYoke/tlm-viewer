import { useEffect } from 'react'

import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { VStack, StackDivider, IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { useRecoilState } from 'recoil'

import { isOrbitState, isStoredState } from '@atoms/PlotSettingAtom'
import { ProjectSelect, TelemetrySelect, TestCaseSelect } from '@components'
import { DayPicker, MySwitch } from '@parts'

type Props = {
  minW: number | string
}

export const PlotSetting = (props: Props) => {
  const { minW } = props
  const { colorMode, toggleColorMode } = useColorMode()
  const sidebarBg = useColorModeValue('gray.50', 'gray.700')
  const [isOrbit, setIsOrbit] = useRecoilState(isOrbitState)
  const [isStored, setIsStored] = useRecoilState(isStoredState)

  const toggleIsOrbit = (value: boolean) => {
    setIsOrbit(() => !value)
  }
  const toggleIsStored = (value: boolean) => {
    setIsStored(() => !value)
  }

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
      <MySwitch label="isOrbit" value={isOrbit} toggleValue={toggleIsOrbit} />
      <MySwitch label="isStored" value={isStored} toggleValue={toggleIsStored} />
      <DayPicker />
      <TestCaseSelect />
      <TelemetrySelect />
    </VStack>
  )
}
