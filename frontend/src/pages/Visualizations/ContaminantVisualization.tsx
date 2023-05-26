import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';
import ContaminantJSON from "../contaminants/ContaminantJSON";

import "./Visualizations.css";

const ContaminantVisualization = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getContaminantData = async () => {
    axios
      .get<ContaminantJSON>(`https://api.chemicalsnear.me/contaminants?page=-1`)
      .then((res:any) => {
        var hazardInfo:any = new Map();
        var numContams = 0
        
        // Get a superfund, see iterate through all of its contaminants and update map
        for (let contaminant of res.data.contaminants) {
            var hazards = contaminant.hazards
            numContams++
            for (let i = 0; i < hazards.length; i++){
              var hazard = hazards[i].hazard_type
              if (hazardInfo.has(hazard)) {
                hazardInfo.set(hazard, hazardInfo.get(hazard) + 1);
              } else {
                hazardInfo.set(hazard, 1);
              }

            }
        }

        var chartDataList = [];

        for (let [hazard, num] of hazardInfo) {
          chartDataList.push({
            name: hazard,
            uv:  num,
            pv: numContams,
            fill: getColor(hazard)
          });
        }

        setChartData(chartDataList);
        setLoading(false);
      });
  };

  useEffect(() => {
    getContaminantData();
  });

  function getColor(hazard:string){
      if(hazard === "Explosive")
        return "#cf672b"
      else if(hazard === "Environmental Hazard")
        return "#006400"
      else if(hazard === "Flammable")
        return "#FF0000"
      else if(hazard === "Compressed Gas")
        return "#4287f5"
      else if(hazard === "Irritant")
        return "#7d707d"
      else if(hazard === "Corrosive")
        return "#633311"
      else if(hazard === "Acute Toxic")
        return "#6f803e"
      else // Health Hazard
        return "#cde067"
  }

  const style = {
    top: '50%',
    right: 0,
    transform: 'translate(0, -50%)',
    lineHeight: '24px',
  };
  

  return (
    <div>
      {loading ? (
        <Container className="visualizationBox">
          <Spinner animation="border" />
        </Container>
      ) : (
        <Container className="visualizationBox">
          <h3 className="visualizationTitle"> Most Common Hazards Among Contaminants</h3>

          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" barSize={40} data={chartData} barGap = "10">
              <RadialBar
                startAngle={0}
                label={{ position: 'insideStart', fill: '#000000' }}
                dataKey="uv"
                style ={{padding:"5px"}}
              />
              <Legend iconSize={15} layout="vertical" verticalAlign="middle" wrapperStyle={style} />
            </RadialBarChart>
        </ResponsiveContainer>
          
        </Container>
      )}
    </div>
  );
};

export default ContaminantVisualization;