import { Select } from 'chakra-react-select'

import type { selectOptionType } from '@types'
import type { SingleValue, MultiValue } from 'chakra-react-select'

type Props<IsMulti extends boolean = false> = {
  instanceId: string
  color: string
  width: number | string
  height: number | string
  options: selectOptionType[]
  isMulti?: IsMulti
  selectValue: (value: IsMulti extends true ? MultiValue<selectOptionType> : SingleValue<selectOptionType>) => void
  defaultValue?: IsMulti extends true ? MultiValue<selectOptionType> : SingleValue<selectOptionType>
}

export const MySelect = <IsMulti extends boolean = false>(props: Props<IsMulti>) => {
  const { instanceId, color, width, height, options, isMulti, selectValue, defaultValue } = props

  return (
    <Select
      instanceId={instanceId}
      size="sm"
      isMulti={isMulti}
      options={options}
      placeholder=""
      focusBorderColor={color}
      defaultValue={defaultValue}
      onChange={selectValue}
      chakraStyles={{
        valueContainer: (provided) => ({
          ...provided,
          minHeight: height,
        }),
        control: (provided) => ({
          ...provided,
          borderRadius: '0.375rem',
          width: width,
        }),
        container: (provided) => ({
          ...provided,
          width: width,
        }),
      }}
    />
  )
}
