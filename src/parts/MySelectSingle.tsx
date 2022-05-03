import type { VFC } from 'react'
import type { SingleValue } from 'chakra-react-select'
import { Select } from 'chakra-react-select'
import type { selectOptionType } from '@types'

type Props = {
  instanceId: string
  color: string
  width: number | string
  height: number | string
  options: selectOptionType[]
  selectValue: (value: SingleValue<selectOptionType>) => void
}

export const MySelectSingle: VFC<Props> = (props) => {
  const { instanceId, color, width, height, options, selectValue } = props

  return (
    <Select
      instanceId={instanceId}
      size="sm"
      isMulti={false}
      options={options}
      placeholder=""
      focusBorderColor={color}
      onChange={(value) => selectValue(value)}
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
