import { Select } from 'chakra-react-select'

import type { selectOptionType } from '@types'
import type { SingleValue, MultiValue } from 'chakra-react-select'

type Props = {
  instanceId: number
  color: string
  width: number | string
  height: number | string
  options: selectOptionType[]
  isMulti: boolean
  selectValue: (value: SingleValue<selectOptionType> | MultiValue<selectOptionType>, instanceId: number) => void
}

export const MySelectList = (props: Props) => {
  const { instanceId, color, width, height, options, isMulti, selectValue } = props

  return (
    <Select
      instanceId={instanceId}
      size="sm"
      isMulti={isMulti}
      options={options}
      placeholder=""
      focusBorderColor={color}
      onChange={(value) => selectValue(value, instanceId)}
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
