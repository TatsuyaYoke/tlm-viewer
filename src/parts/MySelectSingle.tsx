import { MySelect } from '@parts'

import type { selectOptionType } from '@types'
import type { SingleValue } from 'chakra-react-select'

type Props = {
  instanceId: string
  color: string
  width: number | string
  height: number | string
  options: selectOptionType[]
  selectValue: (value: SingleValue<selectOptionType>) => void
  defauleValue?: SingleValue<selectOptionType>
}

export const MySelectSingle = (props: Props) => {
  const { instanceId, color, width, height, options, selectValue, defauleValue } = props

  return (
    <MySelect
      instanceId={instanceId}
      color={color}
      width={width}
      height={height}
      options={options}
      isMulti={false}
      selectValue={selectValue}
      defaultValue={defauleValue}
    />
  )
}
