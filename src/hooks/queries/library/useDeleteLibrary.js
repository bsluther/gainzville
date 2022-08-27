import { useMutation } from "react-query"
import { fetchWithError } from "../../../utility/fns"

 const useDeleteLibrary = options => {
  const { getAccessTokenSilently } = useAuth0()

  return useMutation(
    libId =>
      getAccessTokenSilently()
      .then(tkn =>
        fetchWithError(`/v2end/libraries`))
  )
}