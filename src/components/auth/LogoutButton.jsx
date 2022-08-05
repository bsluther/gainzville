import { useAuth0 } from "@auth0/auth0-react"

export const LogoutButton = () => {
  const { logout } = useAuth0()

  return (
    <button
      className="border-2 border-neutral-800 bg-neutral-550 px-2 py-1"
      onClick={() => logout({ returnTo: window.location.origin })}
    >
      Log Out
    </button>
  )
}