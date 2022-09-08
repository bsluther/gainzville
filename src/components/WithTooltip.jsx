import { useRef, useState } from "react";

export const WithTooltip = ({ children, tip }) => {
  const [hovered, setHovered] = useState(false)
  const wrapperRef = useRef()

  // if (wrapperRef.current) {
  //   const { x, y, width } = wrapperRef.current.getBoundingClientRect()
  //   const center = x + (width / 2)
  // }

  return (
    <div
      className="w-max h-max relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={wrapperRef}
    >
      {children}

      {hovered &&
        <div
          className="
            absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-1/2
            bg-neutral-800 text-neutral-200 text-sm text-center rounded-sm
            w-max px-1 z-50
          "
        >{tip}</div>}
    </div>
  );
};
