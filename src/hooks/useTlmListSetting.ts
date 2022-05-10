import { useState } from 'react'

import { useRecoilState } from 'recoil'

import { tlmListState } from '@atoms/PlotSettingAtom'

import type { selectOptionType } from '@types'
import type { MultiValue } from 'chakra-react-select'

export const useTlmListSetting = <InstanceId extends string = string>() => {
  const [tlmList, setTlmList] = useRecoilState(tlmListState)
  const [countList, setCountList] = useState(1)

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

  const selectValue = (value: MultiValue<selectOptionType>, instanceId?: InstanceId) => {
    const newTlmList = tlmList.map((list) => ({ ...list }))
    const foundIndex = newTlmList.findIndex((element) => `tlmListId${element.id}` === instanceId)
    const item = newTlmList[foundIndex]
    if (item) {
      if (Array.isArray(value)) {
        item.tlm = value
      }
    }

    setTlmList(() => newTlmList)
  }
  return { tlmList, addTlmList, deleteTlmList, selectValue }
}
