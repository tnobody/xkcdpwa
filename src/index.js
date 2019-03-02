import React from "react";
import ReactDOM from "react-dom";

import Viewer from './components/viewer/viewer'
import "./index.css";
import registerServiceWorker from './register-serviceworker';

ReactDOM.render(<Viewer/>, document.getElementById("root"));
registerServiceWorker();
