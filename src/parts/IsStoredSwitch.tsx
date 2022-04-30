import { useRecoilState } from 'recoil'
import MySwitch from '@parts/MySwitch'
import { isStoredState } from '@atoms/PlotSettingAtom'

const IsStoredSwitch = () => {
  const [isStored, setIsStored] = useRecoilState(isStoredState)

  const toggleValue = (value: boolean) => {
    setIsStored(() => !value)
  }

  return <MySwitch label="isStored?" htmlFor="is-stored" value={isStored} toggleValue={toggleValue} />
}

export default IsStoredSwitch
