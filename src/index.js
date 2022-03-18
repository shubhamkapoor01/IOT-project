import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.css";
import reportWebVitals from "./reportWebVitals";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import MyRooms from "./Screens/MyRooms";
import RevokePermission from "./Screens/RevokePermission";
import TakeOwnership from "./Screens/TakeOwnership";
import Ownedrooms from "./Screens/Ownedrooms";

import GrantPermission from "./Screens/GrantPermission";
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}></Route>
        <Route path="myrooms" element={<MyRooms />} />
        <Route path="ownedrooms" element={<Ownedrooms />} />
        <Route path="revokepermission" element={<RevokePermission />} />
        <Route path="transferownership" element={<TakeOwnership />} />
        <Route path="grantpermission" element={<GrantPermission />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
