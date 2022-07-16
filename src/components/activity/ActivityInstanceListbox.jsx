import { useQueries } from "react-query"
import { useActivityInstances } from "../../hooks/activity/useActivityInstances"
import { snakeToSpace } from "../../utility/fns"


export function ActivityInstanceListbox({ instanceIds, selected, setSelected, ItemButtons }) {
  const instancesQ = useActivityInstances(instanceIds)

  const templatesQ = useQueries(
    instancesQ.map(instanceQ => ({
      queryKey: ["activity", "template", instanceQ.data?.template],
      queryFn: ({ queryKey }) => fetch(`/api/activity/template/${queryKey[2]}`).then(res => res.json()),
      enabled: instanceQ.isSuccess
    }))
  )


  return (
    <nav>
        <ol
          className="
            w-60
            border-2 border-neutral-800 bg-neutral-500 rounded-md
            cursor-pointer
          "
        >
          {instancesQ.map(instanceQ => 
            instanceQ.isSuccess 
              ? <li 
                  key={instanceQ.data.id} 
                  className={`
                    h-6
                    flex
                    capitalize
                    hover:bg-neutral-400 pl-2 pr-1
                    first:rounded-t-md last:rounded-b-md
                    ${selected === instanceQ.data.id && 
                      "bg-yellow-300 hover:bg-yellow-300"}
                  `}
                >
                  <span
                    className="grow"
                    onClick={() => setSelected(instanceQ.data.id)}
                  >
                    {snakeToSpace(templatesQ.find(templateQ => templateQ.data?.id === instanceQ.data.template)?.data.name)}
                  </span>

                  {selected === instanceQ.data.id &&
                    <ItemButtons
                      instanceId={instanceQ.data.id}
                    />}
                </li> 
              : null)}
        </ol>
    </nav>
  )
}