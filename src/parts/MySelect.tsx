import type { VFC } from 'react'
import type { SingleValue, MultiValue } from 'chakra-react-select'
import { Select } from 'chakra-react-select'
import type { selectOptionType } from '@types'

type Props = {
  instanceId: string
  color: string
  width: number | string
  height: number | string
  options: selectOptionType[]
  isMulti: boolean
  selectValue: (value: SingleValue<selectOptionType> | MultiValue<selectOptionType>) => void
}

export const MySelect: VFC<Props> = (props) => {
  const { instanceId, color, width, height, options, isMulti, selectValue } = props

  return (
    <Select
      instanceId={instanceId}
      size="sm"
      isMulti={isMulti}
      options={options}
      placeholder=""
      focusBorderColor={color}
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
