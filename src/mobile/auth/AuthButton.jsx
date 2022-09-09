import { useAuth0 } from "@auth0/auth0-react"
import { useRef, useState } from "react"
import { useOutsideClick } from "../../hooks/useOutsideClick"
import { UserSvg } from "../../svg/UserSvg"

const LoggedInButton = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const ref = useRef()

  useOutsideClick([ref], () => setMenuOpen(false))
  return (
    <div className="w-max h-max relative" ref={ref}>
      <UserSvg className="w-6 h-6 text-neutral-300" onClick={() => setMenuOpen(prev => !prev)} />
      {menuOpen &&
        <div className="absolute top-full right-0 w-10 h-10 bg-neutral-300">hi</div>
      }
    </div>
  )
}

const LoggedOutButton = () => {
  return (
    <button>Login</button>
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