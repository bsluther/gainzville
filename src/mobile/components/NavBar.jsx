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

        <div className="flex">
          <span className="text-neutral-300 grow text-center font-semibold">
            Gain
          </span>
          <GainzvilleIcon 
            className="w-6 h-6 fill-neutral-300 -rotate-[38deg] -ml-[4px] -mr-[8px] translate-y-[3px] -skew-x-12 skew-y-12" 
          />
          <span className="text-neutral-300 grow text-center font-semibold">
            ville
          </span>
        </div>

        {/* <span className="text-neutral-300 grow text-center relative">
          Gainzville
        </span>
        <GainzvilleIcon 
          className="w-6 h-6 fill-yellow-300" 
        /> */}

      </div>
      <AuthButton className="absolute right-2 top-2" />
    </div>
  )
}