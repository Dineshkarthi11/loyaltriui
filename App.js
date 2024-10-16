import "./App.css";
import "../src/assets/css/background.css";
import "../src/assets/css/style.css";
import "../src/assets/css/loader.css";
import "../src/assets/css/pluggins.css";
import "../node_modules/react-grid-layout/css/styles.css";
import "../node_modules/react-resizable/css/styles.css";

import Router from "./Router";
import { ConfigProvider, theme } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { themeColor } from "./Redux/slice";
import { ThemeProvider } from "./Context/Theme/ThemeContext";
import API, { action } from "./components/Api";
import { NotificationProvider } from "./Context/Notifications/Notification";
import CommandMenu from "./components/common/CommandMenu";
import SearchCommand from "./components/common/SearchCommand";
import FloatButtonGroup from "./components/common/FloatButtonGroup";

function App() {
  const dispatch = useDispatch();
  const colorPrimary = useSelector((state) => state.layout.themeColor);
  const mode = useSelector((state) => state.layout.mode);

  // document
  //   .querySelector("meta[name=viewport]")
  //   .setAttribute(
  //     "content",
  //     "width=device-width, initial-scale=" + 1 / window.devicePixelRatio
  //   );
  useEffect(() => {
    dispatch(themeColor(colorPrimary));
  }, [colorPrimary, dispatch]);

  // Only use For temp

  // const getOrganisation = async () => {
  //   const result = await action(API.GET_ALL_ORGANISATION);
  //   localStorage.setItem(
  //     "organisationId",
  //     JSON.stringify(parseInt(result?.result[0]?.organisationId))
  //   );
  //   // Tem Employee Id
  // };

  // useEffect(() => {
  //   getOrganisation();
  // }, []);

  useEffect(() => {
    const TAB_KEY = "myAppTabKey";
    const TAB_ID = "myUniqueTabId";

    const generateUniqueTabId = () => {
      return Math.random().toString(36).substr(2, 9);
    };

    const checkIfAnotherTabIsOpen = () => {
      const existingTabId = localStorage.getItem(TAB_KEY);
      if (existingTabId && existingTabId !== TAB_ID) {
        window.location.href = "about:blank";
      } else {
        localStorage.setItem(TAB_KEY, TAB_ID);
      }
    };

    const uniqueTabId = generateUniqueTabId();
    localStorage.setItem(TAB_ID, uniqueTabId);
    checkIfAnotherTabIsOpen();

    const onStorageChange = (event) => {
      if (event.key === TAB_KEY && event.newValue !== uniqueTabId) {
        window.location.href = "about:blank";
      }
    };

    window.addEventListener("storage", onStorageChange);

    const onUnload = () => {
      if (localStorage.getItem(TAB_KEY) === uniqueTabId) {
        localStorage.removeItem(TAB_KEY);
      }
    };

    window.addEventListener("beforeunload", onUnload);

    return () => {
      window.removeEventListener("storage", onStorageChange);
      window.removeEventListener("beforeunload", onUnload);
      onUnload(); // Cleanup on component unmount
    };
  }, []);

  let logoutTimer;

  const logout = () => {
    // alert("You have been logged out due to inactivity.");
    localStorage.clear();
    window.location.reload();
  };

  const resetLogoutTimer = () => {
    if (logoutTimer) clearTimeout(logoutTimer);

    logoutTimer = setTimeout(logout, 60 * 60 * 1000);
  };

  useEffect(() => {
    resetLogoutTimer();

    const events = [
      "mousemove",
      "mousedown",
      "keypress",
      "scroll",
      "touchstart",
      "mousehover",
    ];

    events.forEach((event) => window.addEventListener(event, resetLogoutTimer));

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetLogoutTimer)
      );
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, []);

  return (
    <ThemeProvider>
      <ConfigProvider
        theme={{
          token: { colorPrimary },
          algorithm:
            mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        <NotificationProvider>
          <Router />
          <SearchCommand />
        </NotificationProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
}

export default App;
