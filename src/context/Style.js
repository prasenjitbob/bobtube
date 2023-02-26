import { createContext, useContext, useEffect, useState } from "react";

const StyleContext = createContext();

export const useStyle = () => {
  return useContext(StyleContext);
};

const Style = ({ children }) => {

  const [navIsOpen, setNavIsOpen] = useState(false);

  return (
    <StyleContext.Provider
      value={{ navIsOpen, setNavIsOpen }}
    >
      {children}
    </StyleContext.Provider>
  );
};

export default Style;