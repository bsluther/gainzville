import { useNavigate } from "react-router-dom"


export const Banner = () => {
  const navigate = useNavigate()
  return (
    <section
      className="w-screen flex justify-center text-4xl font-paytoneOne pt-2 pb-4"
    >
      <span 
        className="cursor-pointer"
        onClick={() => navigate("/")}
      >GAINZVILLE</span>

    </section>
  )
}