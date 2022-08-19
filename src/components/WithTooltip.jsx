import { useState } from "react";

export const WithTooltip = ({ children, tip }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="w-max h-max relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      {hovered &&
        <div
          className="
            absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-1
            bg-neutral-800 text-neutral-200 text-sm text-center rounded-sm
            w-max px-1
          "
        >{tip}</div>}
    </div>
  );
};
