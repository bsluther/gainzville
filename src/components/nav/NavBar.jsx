import { NavLink } from "react-router-dom"
import { AuthenticationButton } from "../auth/AuthenticationButton"
import { AuthButton } from "../../mobile/auth/AuthButton"
const NavItem = props =>
  <NavLink
    className={({ isActive }) =>
      `px-8 text-lg font-semibold uppercase
      ${isActive ? "text-yellow-300" : "text-neutral-400"}`
    }
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
          <span className="h-4" />
          <span className="font-paytoneOneNOT font-semibold text-4xl text-neutral-500">Gainzville</span>
        </div>
        <div className="flex items-center">
          <NavItem
            to="record"
          >Record
          </NavItem>

          <NavItem
            to="about"
          >About</NavItem>

          <div className="pl-8">
            <AuthenticationButton />
            {/* <AuthButton /> */}
          </div>
        </div>
      </nav>
    </div>
  )
}