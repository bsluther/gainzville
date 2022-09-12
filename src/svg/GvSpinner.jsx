import { GainzvilleIcon } from "./GainzvilleIcon";

const cb0 = ".5, .2, .8, -1"
const cb1 = ".5, -1.2, .8, -1"
const cb2 = ".5, 1.2, -.8, 1"
const cb3 = "5.5, .2, .8, -1"

const cb4 = ".43, .84, .61, .14"

export const GvSpinner = props => 
  <GainzvilleIcon
    style={{ animation: `spin 500ms linear infinite` }}
    {...props}
  />