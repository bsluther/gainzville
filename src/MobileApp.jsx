import { NavBar } from "./mobile/components/NavBar"
import { TimelinePage } from "./mobile/pages/TimelinePage"

export const MobileApp = () => {
  return (
    <section
      className="w-full h-full flex flex-col items-center font-customMono"
    >
      <NavBar />
      <TimelinePage />
    </section>
  )
}