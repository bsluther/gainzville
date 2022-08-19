export const RecordSvg = props =>
  <svg 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round"
      strokeWidth={2} 
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
    />

    <circle
      cx="12"
      cy="12"
      r="4"
      fill="currentColor"
    />

  </svg>