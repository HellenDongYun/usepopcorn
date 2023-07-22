import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import StarRating from "./StarRating";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating
      maxRating={5}
      message={["terrible", "bad", "ok", "good", "excellent"]}
    ></StarRating>
    <StarRating maxRating={5} color="red"></StarRating> */}
  </React.StrictMode>
);
