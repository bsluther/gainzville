import { v4 as uuid } from "uuid"
import { ActivityInstanceBrowser } from "./components/activity/ActivityInstanceBrowser"
import { MainMenu } from "./components/MainMenu"

console.log(uuid())

function App() {

  return (
    <section className="font-customMono m-12">
      <MainMenu />
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

    </section>
  )
}

export default App
