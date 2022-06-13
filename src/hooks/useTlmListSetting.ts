import { useState } from 'react'

import { useRecoilState } from 'recoil'

import { tlmListState } from '@atoms/PlotSettingAtom'

import type { SelectOptionType } from '@types'
import type { MultiValue } from 'chakra-react-select'

const MAX_OPTION_LENGTH = 2000

export const useTlmListSetting = (options: SelectOptionType[] | undefined, prefixId: string) => {
  const [tlmList, setTlmList] = useRecoilState(tlmListState)
  const [countList, setCountList] = useState(1)
  const [filteredOptions, setFilteredOptions] = useState<SelectOptionType[] | undefined>([])

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

  const selectValue = (value: MultiValue<SelectOptionType>, instanceId?: string) => {
    const newTlmList = tlmList.map((list) => ({ ...list }))
    const foundIndex = newTlmList.findIndex((element) => `${prefixId}${element.id}` === instanceId)
    const item = newTlmList[foundIndex]
    if (item) {
      if (Array.isArray(value)) {
        item.tlm = value
      }
    }

    setTlmList(() => newTlmList)
  }

  const filterOption = (value: string) => {
    const result = options?.filter((option) => option.value.indexOf(value.toLocaleUpperCase()) !== -1)
    const resultLength = result?.length
    if (resultLength && resultLength > MAX_OPTION_LENGTH) return
    setFilteredOptions(() => result)
  }

  return { tlmList, filteredOptions, addTlmList, deleteTlmList, selectValue, filterOption }
}
