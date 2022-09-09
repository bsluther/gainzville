import { useAuth0 } from "@auth0/auth0-react"
import { useRef, useState } from "react"
import { useOutsideClick } from "../../hooks/useOutsideClick"
import { UserSvg } from "../../svg/UserSvg"

const LoggedInButton = () => {
  const { user, logout } = useAuth0()
  const [menuOpen, setMenuOpen] = useState(false)
  const ref = useRef()

  useOutsideClick([ref], () => setMenuOpen(false))
  return (
    <div className="w-max h-max relative" ref={ref}>
      <UserSvg className="w-6 h-6 text-neutral-400" onClick={() => setMenuOpen(prev => !prev)} />
      {menuOpen &&
        <div className="absolute top-full translate-y-1 right-0 w-max h-max bg-neutral-300 px-1 py-2 flex flex-col items-end space-y-1 rounded-sm">
          <span>{user.nickname}</span>
          <button className="font-bold uppercase" onClick={() => logout({ returnTo: window.location.origin })}>Logout</button>
        </div>
      }
    </div>
  )
}

const LoggedOutButton = () => {
  const { loginWithRedirect } = useAuth0()

  return (
    <div className="flex space-x-1">
      <button 
        className="text-neutral-400 text-sm border border-neutral-400 rounded-md px-1 py-0"
        onClick={() => loginWithRedirect()}
      >Login</button>
      {/* <button 
        className="text-neutral-800 bg-neutral-400 text-sm border border-neutral-400 rounded-md px-1 py-0 font-semiboldNO"
        onClick={() => loginWithRedirect()}
      >Login</button> */}
    </div>
  )
}

export const AuthButton = props => {
  const { isAuthenticated } = useAuth0()

  return (
    <div {...props}>
      {isAuthenticated ? <LoggedInButton {...props} /> : <LoggedOutButton {...props} />}
    </div>
  )
}