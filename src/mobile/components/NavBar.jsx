import { GainzvilleIcon } from "../../svg/GainzvilleIcon"
import { MenuSvg } from "../../svg/MenuSvg"
import { AuthButton } from "../auth/AuthButton"

export const NavBar = () => {

  return (
    <div
      className="relative w-full h-max flex justify-center bg-neutral-800 py-2"
    >
      <MenuSvg className="w-6 h-6 text-neutral-400 absolute left-2 top-2" />
      <div className="flex">
        <span className="text-neutral-300 grow text-center">Gain</span>
        <GainzvilleIcon className="w-6 h-6 fill-yellow-300 -mx-[6px] mt-[2px]" />
        <span className="text-neutral-300 grow text-center">ville</span>
      </div>
      <AuthButton className="absolute right-2 top-2" />
    </div>
  )
}