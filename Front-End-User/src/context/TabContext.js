import React, { createContext, useContext, useState } from "react";

const TabContext = createContext();

export const useTabContext = () => useContext(TabContext);

export const TabProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("description");
  const [scrollToReviews, setScrollToReviews] = useState(false);

  return (
    <TabContext.Provider
      value={{ activeTab, setActiveTab, scrollToReviews, setScrollToReviews }}
    >
      {children}
    </TabContext.Provider>
  );
};
