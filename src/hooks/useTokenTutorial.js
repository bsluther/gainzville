const useToken = () => {
  const getToken = () => {
    const tokenString = sessionStorage.getItem("token")
    const token = JSON.parse(tokenString)
    return token?.token
  }

  const [tokenState, setTokenState] = useState(getToken)
  
  const setToken = userToken => {
    setTokenState(userToken)
    sessionStorage.setItem("token", JSON.stringify(userToken))
  }

  const removeToken = () => {
    setTokenState(null)
    sessionStorage.removeItem("token")
  }

  return ({
    token: tokenState,
    setToken,
    removeToken
  })
}