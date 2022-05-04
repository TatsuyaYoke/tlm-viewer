import type { VFC } from 'react'
import type { SingleValue } from 'chakra-react-select'
// import { Select } from 'chakra-react-select'
import type { selectOptionType } from '@types'
import { MySelect } from '@parts'

type Props = {
  instanceId: string
  color: string
  width: number | string
  height: number | string
  options: selectOptionType[]
  selectValue: (value: SingleValue<selectOptionType>) => void
  defauleValue?: SingleValue<selectOptionType>
}

export const MySelectSingle: VFC<Props> = (props) => {
  const { instanceId, color, width, height, options, selectValue, defauleValue } = props

  return (
    <MySelect
      instanceId={instanceId}
      color={color}
      width={width}
      height={height}
      options={options}
      isMulti={false}
      selectValue={(value) => selectValue(value as SingleValue<selectOptionType>)}
      defaultValue={defauleValue}
    />
    // <Select
    //   instanceId={instanceId}
    //   size="sm"
    //   isMulti={true}
    //   options={options}
    //   placeholder=""
    //   focusBorderColor={color}
    //   onChange={(value) => selectValue(value)}
    //   chakraStyles={{
    //     valueContainer: (provided) => ({
    //       ...provided,
    //       minHeight: height,
    //     }),
    //     control: (provided) => ({
    //       ...provided,
    //       borderRadius: '0.375rem',
    //       width: width,
    //     }),
    //     container: (provided) => ({
    //       ...provided,
    //       width: width,
    //     }),
    //   }}
    // />
  )
}
