import { NavLink } from "react-router-dom"
import { AuthenticationButton } from "../auth/AuthenticationButton"

const NavItem = props =>
  <NavLink
    className={({ isActive }) =>
      `border-2 border-neutral-800 px-2 py-1
      ${isActive ? "bg-neutral-450" : "bg-neutral-550"}`}
    {...props}
  >
    {props.children}
  </NavLink>

export const NavBar = () => {

  return (
    <div
      className="w-screen flex justify-center"
    >
      <nav
        className="
          flex py-1
          justify-evenly
          border-2 border-neutral-800 rounded-md w-4/5
          bg-neutral-700
        "
      >
        <NavItem
          to="activity-instance"
        >Activity Instances</NavItem>
        <NavItem
          to="activity-template"
        >Activity Templates</NavItem>
        <NavItem
          to="facet-template"
        >Facet Templates</NavItem>
        <NavItem
          to="user-profile"
        >User Profile</NavItem>      
        <AuthenticationButton />
      </nav>
    </div>
  )
}