import { GainzvilleIcon, GainzvilleIcon_ } from "../../svg/GainzvilleIcon"
import { GvSpinner } from "../../svg/GvSpinner"
import { MenuSvg } from "../../svg/MenuSvg"
import { AuthButton } from "../auth/AuthButton"

export const NavBar = () => {

  return (
    <div
      className="relative w-full h-max flex justify-center bg-neutral-800 py-2"
    >
      <MenuSvg className="w-6 h-6 text-neutral-400 absolute left-2 top-2" />
      <div className="flex">

        <span className="text-neutral-300 grow text-center relative">
          Gainzville
        {/* <GainzvilleIcon 
          className="absolute top-[1px] left-full w-6 h-6 fill-yellow-300" 
        /> */}
        </span>
        <GainzvilleIcon 
          className="w-6 h-6 fill-yellow-300" 
        />

      </div>
      <AuthButton className="absolute right-2 top-2" />
    </div>
  )
}