import { Routes, Route } from "react-router-dom"
import { v4 as uuid } from "uuid"
import { ActivityInstanceBrowser } from "./components/activity/ActivityInstanceBrowser"
import { ActivityTemplateBrowser } from "./components/activity/ActivityTemplateBrowser"
import { FacetTemplateBrowser } from "./components/facet/FacetTemplateBrowser"
import { NavBar } from "./components/nav/NavBar"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { UserProfile } from "./components/user/UserProfile"
import { Welcome } from "./components/Welcome"
import { LibraryBrowser } from "./components/library/LibraryBrowser"
import { Record } from "./pages/record/Record"

console.log(uuid())

function App() {

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

export default App
