import { useAuth0 } from "@auth0/auth0-react"
import { UserSvg } from "../../svg/UserSvg"

export const LogoutButton = () => {
  const { user, logout } = useAuth0()

  return (
    <button
      className="border-2 border-neutral-800 bg-neutral-550 text-neutral-300 space-x-2 rounded-md px-3 py-1 flex items-center"
      onClick={() => logout({ returnTo: window.location.origin })}
    >
      <UserSvg className="h-5 w-5 text-neutral-300" />
      <span>{user.nickname}</span>
    </button>
  )
}