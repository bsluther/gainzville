import { MenuSvg } from "../svg/MenuSvg"
import { AuthButton } from "./auth/AuthButton"

export const NavBar = () => {

  return (
    <div
      className="relative w-full h-max flex justify-center bg-neutral-800 py-2"
    >
      <MenuSvg className="w-6 h-6 text-neutral-400 absolute left-2 top-2" />
      <span className="text-neutral-300 grow text-center">Gainzville</span>
      <AuthButton className="absolute right-2 top-2" />
    </div>
  )
}