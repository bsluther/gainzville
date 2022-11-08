import { useAuth0 } from "@auth0/auth0-react"
import { useRef, useState } from "react"
import { UserSvg } from "../../svg/UserSvg"

export const LogoutButton = () => {
  const { user, logout } = useAuth0()
  const [menuOpen, setMenuOpen] = useState(false)
  const ref = useRef()

  return (
    <div className="w-max h-max relative" ref={ref}>
      <button
        className="border-2 border-neutral-800 bg-neutral-550 text-neutral-300 space-x-2 rounded-md px-3 py-1 flex items-center"
        onClick={() => setMenuOpen(prev => !prev)}
      >
        <UserSvg className="h-5 w-5 text-neutral-300" />
        <span>{user.nickname}</span>
      </button>
      {menuOpen &&
        <div className="absolute top-full translate-y-1 right-0 w-max h-max bg-neutral-300 px-1 py-2 flex flex-col items-end space-y-1 rounded-sm z-50">
          <button className="font-bold uppercase" onClick={() => logout({ returnTo: window.location.origin })}>Logout</button>
        </div>
      }
    </div>
  )
}