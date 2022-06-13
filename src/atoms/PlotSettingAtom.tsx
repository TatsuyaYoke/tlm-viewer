import { atom } from 'recoil'

import type { DateSettingType, pjSettingWithTlmIdType, SelectOptionType, tlmListType } from '@types'
import type { SingleValue, MultiValue } from 'chakra-react-select'

export const isMaximizeState = atom<boolean>({
  key: 'isMaximizeState',
  default: true,
})

export const isStoredState = atom<boolean>({
  key: 'isStoredState',
  default: false,
})

export const isOrbitState = atom<boolean>({
  key: 'isOrbitState',
  default: false,
})

export const isChosenState = atom<boolean>({
  key: 'isChosenState',
  default: false,
})

export const dateSettingState = atom<DateSettingType>({
  key: 'dateSettingState',
  default: {
    startDate: new Date(),
    endDate: new Date(),
  },
})

export const testCaseListState = atom<MultiValue<SelectOptionType>>({
  key: 'testCaseListState',
  default: [],
})

export const projectState = atom<SingleValue<SelectOptionType>>({
  key: 'projectState',
  default: null,
})

export const tlmListState = atom<tlmListType[]>({
  key: 'tlmListState',
  default: [{ id: 1, tlm: [] }],
})

export const settingState = atom<pjSettingWithTlmIdType | null>({
  key: 'settingState',
  default: null,
})
