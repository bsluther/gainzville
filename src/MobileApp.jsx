import { NavBar } from "./mobile/components/NavBar"
import { Timeline } from "./mobile/pages/Timeline"

export const MobileApp = () => {
  return (
    <section
      className="w-full h-full flex flex-col items-center font-customMono"
    >
      <NavBar />
      <Timeline />
    </section>
  )
}