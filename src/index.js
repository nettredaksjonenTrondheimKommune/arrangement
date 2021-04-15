import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./polyfills.js";
import App from "./App";

// fjern stil fra Joomla-template som lager blå bakgrunn på cardarea
// jQuery(".bd-tagstyles").removeClass("bd-tagstyles")
// if (window.jQuery) {
//     jQuery(".bd-tagstyles").removeClass("bd-tagstyles")
// }

ReactDOM.render(<App />, document.getElementById("tk-arrangement"));
