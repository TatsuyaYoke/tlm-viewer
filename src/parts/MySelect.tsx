// import type { VFC } from 'react'
import type { SingleValue, MultiValue, PropsValue } from 'chakra-react-select'
import { Select } from 'chakra-react-select'
import type { selectOptionType } from '@types'

type Props<IsMulti extends boolean = false> = {
  instanceId: string
  color: string
  width: number | string
  height: number | string
  options: selectOptionType[]
  isMulti?: IsMulti | undefined
  selectValue: (value: IsMulti extends true ? MultiValue<selectOptionType> : SingleValue<selectOptionType>) => void
  defaultValue?: undefined | (IsMulti extends true ? MultiValue<selectOptionType> : SingleValue<selectOptionType>)
}

export const MySelect = <IsMulti extends boolean = false>(props: Props<IsMulti>) => {
  const { instanceId, color, width, height, options, isMulti, selectValue, defaultValue } = props

  return (
    <Select
      instanceId={instanceId}
      size="sm"
      isMulti={isMulti ?? (false as IsMulti)}
      options={options}
      placeholder=""
      focusBorderColor={color}
      defaultValue={defaultValue as PropsValue<selectOptionType>}
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
