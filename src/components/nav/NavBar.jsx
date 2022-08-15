import { NavLink } from "react-router-dom"
import { AuthenticationButton } from "../auth/AuthenticationButton"

const NavItem0 = props =>
  <NavLink
    className={({ isActive }) =>
      `border border-neutral-800 rounded-md px-2 py-1 text-neutral-300 bg-neutral-750
      ${isActive ? "border-yellow-200" : ""}`}
    {...props}
  >
    {props.children}
  </NavLink>

const NavItem = props =>
  <NavLink
    className={({ isActive }) =>
      `px-8 text-neutral-400 text-lg font-semibold uppercase
      ${isActive ? "text-yellow-300" : ""}`}
    {...props}
  >
    {props.children}
  </NavLink>

export const NavBar = () => {

  return (
    <div
      className="w-screen h-max flex justify-end pl-12 pr-2 pb-6 bg-neutral-800"
    >
      <nav
        className="
          w-full
          flex
          justify-end items-end
        "
      >
        <div className="grow h-full flex flex-col justify-end items-start">
          <span className="h-4"/>
          <span className="font-paytoneOneNOT font-semibold text-4xl text-neutral-500">Gainzville</span>
        </div>
        <div className="flex items-center">
          <NavItem
            to="record"
          >Record
          </NavItem>
          <NavItem
            to="activity-instance"
          >Activity Instances</NavItem>
          <NavItem
            to="library"
          >Libraries</NavItem>
          {/* <NavItem
            to="activity-template"
          >Activity Templates</NavItem> */}
          {/* <NavItem
            to="facet-template"
          >Facet Templates</NavItem> */}
          <NavItem
            to="user-profile"
          >User Profile</NavItem>      
          <div className="pl-8">
            <AuthenticationButton />
          </div>
        </div>
      </nav>
    </div>
  )
}