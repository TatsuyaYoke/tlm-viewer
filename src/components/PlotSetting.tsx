import { useEffect, useState } from 'react'

import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { VStack, StackDivider, IconButton, useColorMode, useColorModeValue, Button, Flex } from '@chakra-ui/react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { isOrbitState, isStoredState, projectState, settingState } from '@atoms/PlotSettingAtom'
import { ProjectSelect, TelemetrySelect, TestCaseSelect, Error } from '@components'
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
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
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
      setErrorMessage(response.error)
      setIsError(true)
      return
    }
    const settings = response.data
    let settingIndex = 0

    if (settings) {
      if (project) settingIndex = settings.findIndex((element) => element.pjName === project.value)
      const foundSetting = settings[settingIndex]
      if (foundSetting?.tlmId) {
        setSetting(foundSetting)
        setProjectOptionList(() => settings.map((element) => stringToSelectOption(element.pjName)))
        setIsError(false)
      } else {
        setErrorMessage(`tlm_id.json for ${project?.value} not found`)
        setIsError(true)
      }
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
        <Error isError={isError} errorMessage={errorMessage} />
      </VStack>
      {!isLoading && (
        <ProjectSelect
          options={projectOptionList}
          defaultValue={setting?.pjName ? stringToSelectOption(setting.pjName) : undefined}
        />
      )}
      {!isError && (
        <Flex>
          <MySwitch label="isOrbit" value={isOrbit} toggleValue={toggleIsOrbit} />
          <MySwitch label="isStored" value={isStored} toggleValue={toggleIsStored} />
        </Flex>
      )}
      {!isError && <DayPicker />}
      {!isError && !isOrbit && (
        <TestCaseSelect
          options={setting?.testCase ? setting?.testCase?.map((e) => stringToSelectOption(e)) : undefined}
        />
      )}
      {!isError && (
        <TelemetrySelect
          options={setting?.tlmId ? Object.keys(setting.tlmId).map((e) => stringToSelectOption(e)) : undefined}
        />
      )}
    </VStack>
  )
}
