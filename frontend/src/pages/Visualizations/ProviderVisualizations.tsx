import ParkActivityCountChart from "./ParkActivityCountChart";
import LongestTrailsChart from "./LongestTrailsChart";
import LodgingTypeChart from "./LodgingTypeChart";
import "./Visualizations.css";

const ProviderVisualizations = () => {
  return (
    <div>
      <h1 className="pageTitle">Provider Visualizations</h1>
      <ParkActivityCountChart />
      <LongestTrailsChart />
      <LodgingTypeChart />
    </div>
  );
};

export default ProviderVisualizations;
