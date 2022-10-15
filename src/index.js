import React from "react";
import ReactDOM from "react-dom/client";
// antd样式
import "antd/dist/antd.css";
import { Provider } from "react-redux";
import store from "./store";
import "./style/index.scss";
import App from "./router";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);


reportWebVitals();
