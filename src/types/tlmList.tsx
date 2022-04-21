import type { MultiValue } from 'chakra-react-select'
import type { selectOptionType } from '.'

type tlmListType = {
  id: number
  tlm: MultiValue<selectOptionType>
}

export default tlmListType
