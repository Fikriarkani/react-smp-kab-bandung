//import react
import React from "react";

//import toats
import { Toaster } from "react-hot-toast";

//import routes
import Routes from "./routes/routes";

import "leaflet/dist/leaflet.css";

function App() {
  return (
    <React.Fragment>
      <Toaster />
      <Routes />
    </React.Fragment>
  );
}

export default App;
