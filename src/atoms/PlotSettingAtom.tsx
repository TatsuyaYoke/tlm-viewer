import { atom } from 'recoil'

import type { pjSettingWithTlmIdType, selectOptionType, tlmListType } from '@types'
import type { SingleValue, MultiValue } from 'chakra-react-select'

export const isStoredState = atom<boolean>({
  key: 'isStoredState',
  default: false,
})

export const isOrbitState = atom<boolean>({
  key: 'isOrbitState',
  default: false,
})

export const isChoosedState = atom<boolean>({
  key: 'isChoosedState',
  default: false,
})

export const testCaseListState = atom<MultiValue<selectOptionType>>({
  key: 'testCaseListState',
  default: [],
})

export const projectState = atom<SingleValue<selectOptionType>>({
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
