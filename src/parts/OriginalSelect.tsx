import type { ComponentProps } from 'react'

import { Select } from 'chakra-react-select'

import type { SelectComponent } from 'chakra-react-select'

type Merge<T, U> = Omit<T, keyof U> & U
type PropsType<T> = T extends (props: infer R) => unknown ? R : unknown

type InputProps = Merge<
  ComponentProps<'input'>,
  {
    id: string
  }
>

const Input = (props: InputProps) => {
  const { id, ...rest } = props
  console.log(id)
  return <input {...rest} />
}

export const SuperInput = () => <Input id="input" type="text" />


type Props = Merge<
  PropsType<SelectComponent>,
  {
    id: string
  }
>

const OriginalSelect = (props: Props) => {
  const { id, ...rest } = props
  console.log(id)
  return <Select {...rest} />
}

export const SuperSelect = () => <OriginalSelect id="Super" onChange={() => console.log('super')} />