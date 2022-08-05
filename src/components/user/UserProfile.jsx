import { useAuth0 } from "@auth0/auth0-react"

const Field = ({ label, value }) => {
  return (
    <div
      className="flex space-x-2"
    >
      <span>{label}:</span>
      <span>{value}</span>
    </div>
  )
}

export const UserProfile = () => {
  const { user } = useAuth0()
  return (
    <div>
      {Object.entries(user).map(([label, value]) => 
        <Field key={label} label={label} value={value} />)}
    </div>
  )
}