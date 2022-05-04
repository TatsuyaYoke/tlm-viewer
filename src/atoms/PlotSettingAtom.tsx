import { atom } from 'recoil'
import type { SingleValue, MultiValue } from 'chakra-react-select'
import type { selectOptionType, tlmListType } from 'types'

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

export const projectState = atom<SingleValue<selectOptionType>>({
  key: 'projectState',
  default: null,
})

export const tlmListState = atom<tlmListType[]>({
  key: 'tlmListState',
  default: [{ id: 1, tlm: [] }],
})
