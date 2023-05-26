import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import SuperfundJSON from "../Superfunds/SuperfundJSON";
import "./Visualizations.css";

const StateSitesChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSuperfundsData = async () => {
    axios
      .get<SuperfundJSON>(`https://api.chemicalsnear.me/superfunds?page=-1`)
      .then((res: any) => {
        var stateInfo: Map<string, number> = new Map();

        for (let superfund of res.data.superfunds) {
          if (stateInfo.has(superfund.state)) {
            stateInfo.set(superfund.state, stateInfo.get(superfund.state) + 1);
          } else {
            stateInfo.set(superfund.state, 1);
          }
        }

        var chartDataList = [];

        for (let [state, superfunds_count] of stateInfo) {
          chartDataList.push({
            name: state,
            superfunds_count: superfunds_count,
          });
        }

        chartDataList.sort((a, b) => {
          return b.superfunds_count - a.superfunds_count;
        });

        setChartData(chartDataList);
        setLoading(false);
      });
  };

  useEffect(() => {
    getSuperfundsData();
  }, []);

  return (
    // Adapted from Recharts documentation https://recharts.org/en-US/examples/SimpleBarChart
    <div>
      {loading ? (
        <Container className="visualizationBox">
          <Spinner animation="border" />
        </Container>
      ) : (
        <Container className="visualizationBox">
          <h3 className="visualizationTitle"># of Superfund Sites per State</h3>
          <ResponsiveContainer width="99%">
            <BarChart
              width={500}
              height={300}
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                name="State"
                dataKey="name"
                angle={70}
                height={120}
                textAnchor="start"
                tick={{ fontSize: 12 }}
                tickCount={chartData.length}
                interval={0}
              />
              <YAxis
                name="# of Superfund sites"
                dataKey="superfunds_count"
                type="number"
              />
              <Tooltip />
              <Bar
                name="# of Superfund sites"
                dataKey="superfunds_count"
                fill="rgba(136, 22, 22, 1)"
              />
              <Legend align="center" />
            </BarChart>
          </ResponsiveContainer>
        </Container>
      )}
    </div>
  );
};

export default StateSitesChart;
