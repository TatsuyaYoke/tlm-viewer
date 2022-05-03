import { useRecoilState } from 'recoil'
import { MySwitch } from '@parts'
import { isStoredState } from '@atoms/PlotSettingAtom'

export const IsStoredSwitch = () => {
  const [isStored, setIsStored] = useRecoilState(isStoredState)

  const toggleValue = (value: boolean) => {
    setIsStored(() => !value)
  }

  return <MySwitch label="isStored?" htmlFor="is-stored" value={isStored} toggleValue={toggleValue} />
}
