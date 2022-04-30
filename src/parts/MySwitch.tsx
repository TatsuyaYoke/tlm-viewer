import type { VFC } from 'react'
import { FormControl, FormLabel, Switch } from '@chakra-ui/react'

type Props = {
  label: string
  htmlFor: string
  value: boolean
  toggleValue: (value: boolean) => void
}

const MySwitch: VFC<Props> = (props) => {
  const { label, htmlFor, value, toggleValue } = props
  return (
    <FormControl display="flex" alignItems="center">
      <FormLabel htmlFor={htmlFor} mb="0">
        {label}
      </FormLabel>
      <Switch id={htmlFor} colorScheme="teal" defaultChecked={value} onChange={() => toggleValue(value)} />
    </FormControl>
  )
}

export default MySwitch
