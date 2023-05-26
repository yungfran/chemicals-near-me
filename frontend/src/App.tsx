import React from "react";
import "./App.css";
import NavBar from "./NavBar";
import Search from './pages/Search/Search';
import Superfunds from "./pages/Superfunds/Superfunds";
import Superfund from "./pages/Superfunds/Superfund";
import AllContaminants from "./pages/ChemicalPages/ContaminantPages";
import Contaminant_instance from "./pages/ChemicalPages/contaminant_instance_page";
import Cities from "./pages/Cities/Cities";
import City_instance from "./pages/Cities/city_instance_page";
import OurVisualizations from "./pages/Visualizations/OurVisualizations";
import ProviderVisualizations from "./pages/Visualizations/ProviderVisualizations";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import { Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Route exact path="/" component={Home} />
      <Route exact path="/search" component={Search} />
      <Route exact path="/cities" component={Cities} />
      <Route exact path="/cities/:id" component={City_instance} />
      <Route exact path="/contaminants" component={AllContaminants} />
      <Route path="/contaminants/:id" component={Contaminant_instance} />
      <Route exact path="/superfunds" component={Superfunds} />
      <Route exact path="/superfunds/:id" component={Superfund} />
      <Route exact path="/our-visualizations" component={OurVisualizations} />
      <Route
        exact
        path="/provider-visualizations"
        component={ProviderVisualizations}
      />
      <Route exact path="/about" component={About} />
    </div>
  );
}

export default App;
