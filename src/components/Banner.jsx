import { useNavigate } from "react-router-dom"


export const Banner = () => {
  const navigate = useNavigate()
  return (
    <section
      className="w-screen flex justify-start text-4xl font-paytoneOne"
    >
      <span 
        className="cursor-pointer h-max pl-12 pt-2"
        onClick={() => navigate("/")}
      >GAINZVILLE</span>

    </section>
  )
}