import { v4 as uuid } from "uuid"
import { ActivityInstanceBrowser } from "./components/activity/ActivityInstanceBrowser"
import { makeSet } from "./data/typeConstructor/setConstructor"

console.log(uuid())

function App() {

  return (
    <section className="font-customMono m-12">

      <ActivityInstanceBrowser user="dev2" />

    </section>
  )
}

export default App
