import type { MultiValue } from 'chakra-react-select'

export type selectOptionType = {
  label: string
  value: string
}

export type tlmListType = {
  id: number
  tlm: MultiValue<selectOptionType>
}

export type DataType = number | Date | null

export type ObjectArrayType = {
  [key: string]: DataType[]
}
