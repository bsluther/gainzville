import { useState } from "react"
import { ActivityInstanceBrowser } from "../components/activity/ActivityInstanceBrowser"
import { ActivityInstanceController, NewActivityInstanceController } from "../components/activity/ActivityInstanceController"
import { LibraryBrowser } from "../components/library/LibraryBrowser"
import { useInsertActivityInstance } from "../hooks/queries/activity/instance/useInsertActivityInstance"


const NumberPlaceholder = () =>
  <input
    className="w-8 bg-neutral-200 outline-none  h-full border-2 border-neutral-600 rounded-md text-center px-[1px]"
  />

const StringPlaceholder = () =>
  <input
    className="w-32 bg-neutral-200 outline-none h-full border-2 border-neutral-600 rounded-md text-center px-[1px]"
  />

const SetPlaceholder = ({ options = ["one", "two", "three"]}) =>
  <select className="bg-neutral-200 h-full border-2 border-neutral-600 rounded-md text-center px-[1px]">
    {options.map(opt => <option key={opt}>{opt}</option>)}
  </select>

const FacetPlaceholder = ({ label, Fields }) => {
  return (
    <div className="bg-neutral-400 border-2 border-black w-max rounded-md flex items-center space-x-2 px-2 py-1 h-10">
      <span className="pr-2">{label}</span>
      {Fields}
    </div>
  )
}

const PhormPlaceholder = () => {
  return (
    <section className="w-96 h-48 bg-neutral-500 min-h border-2 border-black rounded-md flex flex-col items-start space-y-2 p-2">
      <span className="text-lg uppercase">Phorm</span>
      <FacetPlaceholder
        label="Route Name"
        Fields={<StringPlaceholder />}
      />
      <FacetPlaceholder
        label="Grade"
        Fields={<SetPlaceholder options={["V0", "V1"]} />}
      />
      <FacetPlaceholder
        label="Load"
        Fields={<>
          <NumberPlaceholder />
          <SetPlaceholder options={["lb", "kg"]} />
        </>}
      />
    </section>
  )
}

const LogBrowserPlaceholder = () => {
  return (
    <section className="
      w-full h-full
      bg-neutral-500
      border border-dashed rounded-sm
      flex flex-col
    ">

    </section>
  )
}

const Button = props =>
  <button
    {...props}
    className="w-max h-max px-2 py-1 bg-neutral-300 text-neutral-800 rounded-md"
  >
    {props.children}
  </button>

export const Record = () => {
  const [selectedTemplate, setSelectedTemplate] = useState()
  const [selectedInstance, setSelectedInstance] = useState()
  const insertInstanceM = useInsertActivityInstance()
  const [mode, setMode] = useState()
  const [target, setTarget] = useState([])
  console.log("target", target)
  return (
    <main
      className="w-full h-full flex borderNOT border-red-400NOT"
    >
      <div className="h-full w-1/4">
        <LibraryBrowser
          Buttons={<Button onClick={() => selectedTemplate ? setMode("record") : null }>Record</Button>}
          reportSelectedTemplate={setSelectedTemplate}
        />
      </div>
      <div className="h-full w-1/2 borderNOT border-yellow-300 flex justify-center items-start p-4">
        {mode &&
          mode === "record"
            ? <NewActivityInstanceController
                templateId={selectedTemplate}
                handleSaveNewInstance={insertInstanceM.mutate}
              />
            : mode === "edit"
              ? <ActivityInstanceController instanceId={selectedInstance} />
              : null}
        {/* <PhormPlaceholder /> */}
      </div>
      <div className="h-full w-1/4">
        <ActivityInstanceBrowser
          handleEdit={id => {
            setMode("edit")
            setSelectedInstance(id)
          }}
        />
      </div>
    </main>
  )
}