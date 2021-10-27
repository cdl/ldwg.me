import React from "react";
import { DesktopContext } from "../../context/desktop";

export default function WindowManager({ children, state = {} }) {
  return (
    <>
      <DesktopContext.Provider value={state}>
        {children}
      </DesktopContext.Provider>
    </>
  );
}
