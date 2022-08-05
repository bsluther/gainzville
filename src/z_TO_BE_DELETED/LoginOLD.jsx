import { useState } from "react"

const loginUser = credentials =>
  fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  })
  .then(data => data.json())

export const Login = ({ setToken }) => {
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  const handleLogin = credentials => {
    loginUser(credentials)
    .then(tkn => {
      console.log(tkn)
      return tkn
    })
    .then(tkn => setToken(tkn))
  }
  
  return(
    <div
      className="font-customMono fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col space-y-2"
    >
      <div className="grow flex justify-center">
        <h2>Please log in:</h2>
      </div>
      <form
        className="flex flex-col space-y-2"
        onSubmit={e => {
          e.preventDefault()
          console.log('submited!')
          handleLogin({ username, password })
        }}
      >
        <label
          className="flex space-x-2"
        >
          <p>Username</p>
          <input
            className="bg-neutral-500 border-2 border-neutral-800 rounded-md"
            type="text"
            onChange={e => setUsername(e.target.value)}  
          />
        </label>
        <label
          className="flex space-x-2"
        >
          <p>Password</p>
          <input
            className="bg-neutral-500 border-2 border-neutral-800 rounded-md"
            type="password"
            onChange={e => setPassword(e.target.value)}
          />
        </label>
        <div
          className="grow flex justify-center"
        >
          <button
            className="
              rounded-md px-2
              bg-neutral-800 text-neutral-400
            "
            type="submit"
          >Submit</button>
        </div>
      </form>
    </div>
  )
}