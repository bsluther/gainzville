import { useContext } from "react"
import { DotsCircleHorizontalFilledSvg } from "../../svg/DotsCircleHorizontalFilledSvg"
import { HandSvg } from "../../svg/HandSvg"
import { MinusCircleSVG } from "../../svg/MinusCircleSVG"

export const ExpandedInstance = ({ FacetInstance, ...props }) => {
  const [, dispatch] = useContext(props.Context)

  const handleRemoveFacet = () =>
    dispatch({
      type: "removeFacet",
      payload: props.address.facet
    })


  return (
    <div className="flex items-center">
      <div className="flex items-center space-x-1 text-xsNO">
        <MinusCircleSVG className="w-6 h-6" onClick={handleRemoveFacet} />
        {/* <div className="flex -space-x-1">
          <HandSvg className="w-5 h-5 -scale-x-100" />
          <HandSvg className="w-5 h-5 " />
        </div> */}
        <DotsCircleHorizontalFilledSvg className="w-6 h-6" />
        <FacetInstance {...props} />
      </div>
    </div>
  )
}