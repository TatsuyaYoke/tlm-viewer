import { useRecoilState } from 'recoil'

import { isOrbitState } from '@atoms/PlotSettingAtom'
import { MySwitch } from '@parts'

export const IsOrbitSwitch = () => {
  const [isOrbit, setIsOrbit] = useRecoilState(isOrbitState)

  const toggleValue = (value: boolean) => {
    setIsOrbit(() => !value)
  }

  return <MySwitch label="isOrbit?" htmlFor="is-orbit" value={isOrbit} toggleValue={toggleValue} />
}
