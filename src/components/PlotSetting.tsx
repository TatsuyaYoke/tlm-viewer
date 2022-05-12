import { useEffect, useState } from 'react'

import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { VStack, StackDivider, IconButton, useColorMode, useColorModeValue, Text, Button } from '@chakra-ui/react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { isOrbitState, isStoredState, projectState, settingState } from '@atoms/PlotSettingAtom'
import { ProjectSelect, TelemetrySelect, TestCaseSelect } from '@components'
import { stringToSelectOption } from '@functions'
import { DayPicker, MySwitch } from '@parts'

import type { selectOptionType } from '@types'

type Props = {
  width: number | string
}

export const PlotSetting = (props: Props) => {
  const { width } = props
  const { colorMode, toggleColorMode } = useColorMode()
  const sidebarBg = useColorModeValue('gray.50', 'gray.700')
  const [isOrbit, setIsOrbit] = useRecoilState(isOrbitState)
  const [isStored, setIsStored] = useRecoilState(isStoredState)
  const [isLoading, setIsLoading] = useState(true)
  const [projectOptionList, setProjectOptionList] = useState<selectOptionType[]>([])
  const project = useRecoilValue(projectState)
  const [setting, setSetting] = useRecoilState(settingState)

  const toggleIsOrbit = (value: boolean) => {
    setIsOrbit(() => !value)
  }
  const toggleIsStored = (value: boolean) => {
    setIsStored(() => !value)
  }

  const initializeSetting = () => {
    const response = window.Main.getSettings()
    if (!response.success) {
      console.log(response.error)
      return
    }
    const settings = response.data
    if (settings) {
      if (!project) {
        const initialSetting = settings[0]
        if (initialSetting) setSetting(initialSetting)
      } else {
        const foundIndex = settings.findIndex((element) => element.pjName === project.value)
        const foundSetting = settings[foundIndex]
        if (foundSetting) setSetting(foundSetting)
      }

      setProjectOptionList(() => settings.map((element) => stringToSelectOption(element.pjName)))
    }
    setIsLoading(false)
  }

  useEffect(() => {
    initializeSetting()
  }, [project])

  return (
    <VStack
      divider={<StackDivider borderColor="gray.200" />}
      spacing={3}
      p={8}
      align="stretch"
      minW={width}
      maxW={width}
      bg={sidebarBg}
    >
      <VStack>
        <IconButton
          aria-label="change color theme"
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          width="100%"
        />
        <Button width="100%" colorScheme="teal" onClick={initializeSetting}>
          Reconnect
        </Button>
        <Text width="100%">No Error</Text>
      </VStack>
      {!isLoading && (
        <ProjectSelect
          options={projectOptionList}
          defaultValue={setting?.pjName ? stringToSelectOption(setting.pjName) : undefined}
        />
      )}
      <MySwitch label="isOrbit" value={isOrbit} toggleValue={toggleIsOrbit} />
      <MySwitch label="isStored" value={isStored} toggleValue={toggleIsStored} />
      <DayPicker />
      <TestCaseSelect
        options={setting?.testCase ? setting?.testCase?.map((element) => stringToSelectOption(element)) : undefined}
      />
      <TelemetrySelect
        options={
          setting?.tlmId ? Object.keys(setting.tlmId).map((element) => stringToSelectOption(element)) : undefined
        }
      />
    </VStack>
  )
}
