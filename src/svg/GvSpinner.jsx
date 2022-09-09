import { GainzvilleIcon } from "./GainzvilleIcon";

const cb0 = ".5, .2, .8, -1"
const cb1 = ".5, -1.2, .8, -1"
const cb2 = ".5, 1.2, -.8, 1"
const cb3 = "5.5, .2, .8, -1"

export const GvSpinner = props => 
  <GainzvilleIcon
    style={{ animation: `spin 1500ms cubic-bezier(${cb1}) infinite`}}
    {...props}
  />