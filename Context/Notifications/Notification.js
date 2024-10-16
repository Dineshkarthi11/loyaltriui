// NotificationProvider.js
import React, { createContext, useState, useContext, useEffect } from "react";
import Notification from "../../components/common/Notification";

const NotificationContext = createContext();

export const NotificationProvider = React.memo(({ children }) => {
  const [notificationData, setNotificationData] = useState(null);

  const showNotification = (data) => {
    setNotificationData(data);
    // Clear the notification after a timeout
    setTimeout(() => {
      setNotificationData(null);
    }, data?.duration || 1500);
  };

  useEffect(() => {
   
    if (!notificationData) {
     
    }
  }, [notificationData]);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notificationData && <Notification {...notificationData} />}
    </NotificationContext.Provider>
  );
});

export const useNotification = () => useContext(NotificationContext);
