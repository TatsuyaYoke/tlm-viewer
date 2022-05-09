import type { selectOptionType } from '@types'

export const stringToSelectOption = (element: string): selectOptionType => ({
  label: element,
  value: element,
})
