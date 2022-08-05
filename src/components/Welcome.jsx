import { useAuth0 } from "@auth0/auth0-react"


export const Welcome = () => {
  const { user, isAuthenticated, loginWithRedirect, isLoading } = useAuth0()
  console.log("isAuth", isLoading)
  return (
    <section>
      <div>
        {isLoading
          ? <></>
          : isAuthenticated
            ? <div className="flex flex-col items-center space-y-3">
                <span>
                  {`Welcome to Gainzville, ${user.nickname}!`  }
                </span>
              </div>

            : <div className="flex flex-col items-center space-y-3">
                <span >
                  {`Welcome to Gainzville! You'll need an account to get started.`}
                </span>

                <div className="flex space-x-4">
                  <span
                    className="text-neutral-300 font-bold cursor-pointer"
                    onClick={() => loginWithRedirect()}>
                    Sign in
                  </span>
                  <span>or</span>
                  <span
                    className="text-neutral-300 font-bold cursor-pointer"
                    onClick={() => loginWithRedirect({ screen_hint: "signup"})}>
                    Create a new account
                  </span>
                </div>

              </div>}

      </div>
    </section>
  )
}