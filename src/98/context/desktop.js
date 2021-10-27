import React, { useContext } from "react";

const DesktopContext = React.createContext({});

function useDesktop() {
  return useContext(DesktopContext);
}

export { DesktopContext, useDesktop };
