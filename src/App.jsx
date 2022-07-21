import { v4 as uuid } from "uuid"
import { ActivityInstanceBrowser } from "./components/activity/ActivityInstanceBrowser"
import { ActivityTemplateBrowser } from "./components/activity/ActivityTemplateBrowser"
import { FacetTemplateBrowser } from "./components/facet/FacetTemplateBrowser"
import { MainMenu } from "./components/MainMenu"

console.log(uuid())

function App() {

  return (
    <section className="h-screen w-screen flex flex-col font-customMono m-12 space-y-12">
      <MainMenu />
      <div className="flex space-x-20">
        <div
          className="
            flex flex-col items-center
            border-2 border-neutral-800 rounded-md
            w-max
            px-1
          "
        >
          <span className="w-max">Activity Instances</span>
          <ActivityInstanceBrowser user="dev2" />
        </div>
        
        <ActivityTemplateBrowser />

        <FacetTemplateBrowser />
      </div>

    </section>
  )
}

export default App
