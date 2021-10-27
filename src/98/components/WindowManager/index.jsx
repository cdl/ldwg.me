import React from "react";
import { DesktopContext, useDesktop } from "../../context/desktop";

export default function WindowManager({ children, state = {} }) {
  const desktop = useDesktop();

  return (
    <>
      <DesktopContext.Provider value={state}>
        {children}
      </DesktopContext.Provider>
    </>
  );
}
