import { useRecoilState } from 'recoil'

import { isStoredState } from '@atoms/PlotSettingAtom'
import { MySwitch } from '@parts'

export const IsStoredSwitch = () => {
  const [isStored, setIsStored] = useRecoilState(isStoredState)

  const toggleValue = (value: boolean) => {
    setIsStored(() => !value)
  }

  return <MySwitch label="isStored?" htmlFor="is-stored" value={isStored} toggleValue={toggleValue} />
}
