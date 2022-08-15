import { useAuth0 } from "@auth0/auth0-react"

export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0()

  return (
    <button
      className="border-2 border-neutral-800 bg-neutral-550 rounded-md text-neutral-300 px-2 py-1"
      onClick={() => loginWithRedirect()}
    >
      Log In
    </button>
  )
}