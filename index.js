import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./i18"; // Import the i18n configuration
import { persistor, store } from "./Redux/store";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PersistGate } from "redux-persist/integration/react";
// import "cmdk/dist/cmdk.css"; // Import cmdk CSS if required

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    {/* <PersistGate loading={null} persistor={persistor}> */}
    <GoogleOAuthProvider clientId="116197081390-bm9pam7494g1ahhv2e6qc6e43a5p2a4j.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
    {/* </PersistGate> */}
  </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
