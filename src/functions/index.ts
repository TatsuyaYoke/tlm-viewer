import type { SelectOptionType } from '@types'

export const stringToSelectOption = (element: string): SelectOptionType => ({
  label: element,
  value: element,
})
