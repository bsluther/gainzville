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

        <span className="text-neutral-300 grow text-center">Gainzville</span>
        <GainzvilleIcon 
          style={{ animation: 'spin 1000ms cubic-bezier(.5, .2, .8, -5) infinite'}}
          // style={{ animation: 'spin 1000ms cubic-bezier(.5, .3, .9, -5) infinite'}}
          // style={{ animation: 'spin 1000ms cubic-bezier(.5, .3, .9, -1) infinite'}}
          className="w-6 h-6 fill-yellow-300 animate-spinNOT" 
        />
        {/* <span className="text-neutral-300 grow text-center text-lg">ville</span> */}

      </div>
      <AuthButton className="absolute right-2 top-2" />
    </div>
  )
}