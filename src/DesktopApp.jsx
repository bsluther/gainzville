import { Routes, Route } from "react-router-dom"
import { v4 as uuid } from "uuid"
import { NavBar } from "./components/nav/NavBar"
import { Welcome } from "./components/Welcome"
import { Record } from "./pages/record/Record"

console.log(uuid())

function DesktopApp() {

  return (
    <section className="h-screen w-screen flex flex-col font-customMono">
      <NavBar />

      <div
        className="h-full w-screen flex justify-center"
      >
        <Routes>
        
          <Route
            path="/"
            element={<Welcome />}
          />

          <Route
            path="record/*"
            element={<Record />}
          />
        
          <Route
            path="*"
            element={<Welcome />}
          />

        </Routes>
      </div>

    </section>
  )
}

export default DesktopApp
