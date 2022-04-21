import type { VFC } from 'react'
import { Select, MultiValue } from 'chakra-react-select'
import type { selectOptionType } from '../types/index'

type Props = {
  instanceId: string
  color: string
  width: number | string
  height: number | string
  options: selectOptionType[]
  selectValue: (value: MultiValue<selectOptionType>) => void
}

const OriginalSelect: VFC<Props> = (props) => {
  const { instanceId, color, width, height, options, selectValue } = props

  return (
    <Select
      instanceId={instanceId}
      size="sm"
      isMulti={true}
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

export default OriginalSelect
