import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import "./custom.scss";

import { Provider } from "react-redux";
import store, { Persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { WebSocketContext, stompClient } from "./context/appContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={Persistor}>
      <WebSocketContext.Provider value={stompClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </WebSocketContext.Provider>
    </PersistGate>
  </Provider>
);
