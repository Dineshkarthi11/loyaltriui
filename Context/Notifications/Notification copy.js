import React, { createContext, useContext, useCallback } from "react";
import { notification } from "antd";

// Create a context to provide the notification function
const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  // Define a function to open a notification
  const openNotification = useCallback(
    (type, message, description) => {
      api[type]({
        message,
        description,
        placement: "topCenter",
        style: {
          background:
            type === "success"
              ? "linear-gradient(180deg, rgba(204, 255, 233, 0.8) 0%, rgba(235, 252, 248, 0.8) 51.08%, rgba(246, 251, 253, 0.8) 100%)"
              : "linear-gradient(180deg, rgba(255, 236, 236, 0.80) 0%, rgba(253, 246, 248, 0.80) 51.13%, rgba(251, 251, 254, 0.80) 100%)",
          boxShadow:
            type === "success"
              ? "0px 4.868px 11.358px rgba(62, 255, 93, 0.2)"
              : "0px 22px 60px rgba(134, 92, 144, 0.20)",
        },
      });
    },
    [api]
  );

  return (
    <NotificationContext.Provider value={openNotification}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
