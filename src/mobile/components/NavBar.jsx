import { GainzvilleIcon, GainzvilleIcon_ } from "../../svg/GainzvilleIcon"
import { MenuSvg } from "../../svg/MenuSvg"
import { AuthButton } from "../auth/AuthButton"

export const NavBar = () => {

  return (
    <div
      className="relative w-full h-max flex justify-center bg-neutral-800 py-2"
    >
      <MenuSvg className="w-6 h-6 text-neutral-400 absolute left-2 top-2" />
      <div className="flex">
        <span className="text-neutral-300 grow text-center text-lg">Gain</span>
        <GainzvilleIcon className="w-7 h-7 fill-yellow-300 -ml-[6px] -mr-[8px] mt-[2px] -rotate-[5deg]" />
        {/* <GainzvilleIcon_ className="w-6 h-6 fill-yellow-300 -mx-[6px] mt-[2px]" />
        <GainzvilleIcon className="w-6 h-6 fill-yellow-300 -mx-[6px] mt-[2px]" /> */}
        <span className="text-neutral-300 grow text-center text-lg">ville</span>
      </div>
      <AuthButton className="absolute right-2 top-2" />
    </div>
  )
}