import { atom } from 'recoil'
import { MultiValue } from 'chakra-react-select'
import type { selectOptionType } from '../types/index'
import tlmListType from '../types/tlmList'

export const isStoredState = atom<boolean>({
  key: 'isStoredState',
  default: false,
})
export const isChoosedState = atom<boolean>({
  key: 'isChoosedState',
  default: false,
})

export const isMultiState = atom<boolean>({
  key: 'isMultiState',
  default: false,
})

export const testCaseListState = atom<MultiValue<selectOptionType>>({
  key: 'testCaseListState',
  default: [],
})

export const tlmListState = atom<tlmListType[]>({
  key: 'tlmListState',
  default: [{ id: 1, tlm: [] }],
})
