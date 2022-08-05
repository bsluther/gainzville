import { Routes, Route } from "react-router-dom"
import { v4 as uuid } from "uuid"
import { ActivityInstanceBrowser } from "./components/activity/ActivityInstanceBrowser"
import { ActivityTemplateBrowser } from "./components/activity/ActivityTemplateBrowser"
import { FacetTemplateBrowser } from "./components/facet/FacetTemplateBrowser"
import { NavBar } from "./components/nav/NavBar"
import { useAuth0 } from "@auth0/auth0-react"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { UserProfile } from "./components/user/UserProfile"
import { useActorActivityInstances } from "./hooks/queries/activity/instance/useActorActivityInstances"
import { Welcome } from "./components/Welcome"
import { Banner } from "./components/Banner"

console.log(uuid())



function App() {
  const { user } = useAuth0()
  console.log("USER: ", user)

  const instancesQ = useActorActivityInstances()
  console.log("useActor isError: ", instancesQ.isError)
  console.log("useActor data:", instancesQ.data)
  return (
    <section className="h-screen w-screen flex flex-col font-customMono">
      <Banner />
      <NavBar />

      <main
        className="w-screen flex justify-center pt-8"
      >
        <Routes>
        
          <Route
            path="/"
            element={<Welcome />}
          />
        
          <Route
            path="activity-instance"
            element={<ActivityInstanceBrowser user="dev2" />}
          />
        
        
          <Route
            path="activity-template"
            element={<ActivityTemplateBrowser />}
          />
        
          <Route
            path="facet-template"
            element={<FacetTemplateBrowser />}
          />
        
          <Route
            path="user-profile"
            element={<ProtectedRoute component={UserProfile} />}
          />
        
          <Route
            path="*"
            element={<Welcome />}
          />

        </Routes>
      </main>

    </section>
  )
}

export default App
