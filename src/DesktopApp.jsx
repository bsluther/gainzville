import { Routes, Route } from "react-router-dom"
import { v4 as uuid } from "uuid"
import { NavBar } from "./components/nav/NavBar"
import { Welcome } from "./components/Welcome"
import { useActivityInstances } from "./hooks/queries/activity/instance/useActivityInstances"
import { useActivityTemplates } from "./hooks/queries/activity/template/useActivityTemplates"
import { useFacetTemplates } from "./hooks/queries/facet/useFacetTemplates"
import { useTypeTemplates } from "./hooks/queries/type/useTypeTemplates"
import { About } from "./pages/about/About"
import { Record } from "./pages/record/Record"


console.log(uuid())

function DesktopApp() {
  const aiQ = useActivityInstances()
  const ftQ = useFacetTemplates()
  const ttQ = useTypeTemplates()

  return (
    <section className="h-screen w-screen flex flex-col font-customMono   grow-0">
      <NavBar />

      <div
        className="h-fullNO grow basis-1   w-screen flex justify-center"
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
            path="about/*"
            element={<About />}
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
