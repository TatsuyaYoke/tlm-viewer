import { FormControl, FormLabel, Switch } from '@chakra-ui/react'

import type { VFC } from 'react'

type Props = {
  label: string
  htmlFor: string
  value: boolean
  toggleValue: (value: boolean) => void
}

export const MySwitch: VFC<Props> = (props) => {
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
