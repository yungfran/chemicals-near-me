import StateSitesChart from "./StateSitesChart";
import ContaminantVisualization from "./ContaminantVisualization";
import "./Visualizations.css";
import CitiesChart from "./CitiesChart"

const OurVisualizations = () => {
  return (
    <div>
      <h1 className="pageTitle">Our Visualizations</h1>
      <StateSitesChart />
      <br></br>
      <ContaminantVisualization />
			<br></br>
			<CitiesChart />
    </div>
  );
};

export default OurVisualizations;
