import type { VFC } from 'react'
import type { MultiValue } from 'chakra-react-select'
import type { selectOptionType } from '@types'
import { MySelect } from '@parts'

type Props = {
  instanceId: string
  color: string
  width: number | string
  height: number | string
  options: selectOptionType[]
  selectValue: (value: MultiValue<selectOptionType>) => void
  defaultValue?: MultiValue<selectOptionType>
}

export const MySelectMultiple: VFC<Props> = (props) => {
  const { instanceId, color, width, height, options, selectValue, defaultValue } = props

  return (
    <MySelect
      instanceId={instanceId}
      color={color}
      width={width}
      height={height}
      options={options}
      isMulti={true}
      selectValue={selectValue}
      defaultValue={defaultValue}
    />
  )
}
