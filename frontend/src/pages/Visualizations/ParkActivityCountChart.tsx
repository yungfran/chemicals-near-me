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
import "./Visualizations.css";

const ParkActivityCountChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getParksData = async () => {
    axios
      .get(`https://api.trailmixapp.me/park?sort=-activities_cnt`, {
        headers: {
          "Content-Type": "application/vnd.api+json",
          Accept: "application/vnd.api+json",
        },
      })
      .then((res: any) => {
        var ParkData = res.data.data;
        var chartDataList: any = [];

        for (let i = 0; i < ParkData.length; i++) {
          var CurrPark = ParkData[i];
          var NumActivities = CurrPark.attributes.activities.length;
          var name = CurrPark.attributes.name.split("National")[0].trim();
          chartDataList.push({
            name: name,
            activities_count: parseInt(NumActivities),
          });
        }
        setChartData(chartDataList);
        setLoading(false);
      });
  };

  useEffect(() => {
    getParksData();
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
          <h3 className="visualizationTitle">
            National Parks with the Most Activities
          </h3>
          <ResponsiveContainer width="99%">
            <BarChart
              width={500}
              height={400}
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip label="activities_count" />
              <XAxis
                name="National Park"
                dataKey="name"
                angle={70}
                height={140}
                textAnchor="start"
                tick={{ fontSize: 16 }}
                tickCount={chartData.length}
                interval={0}
              />
              <YAxis
                name="Activity Count"
                dataKey="activities_count"
                type="number"
              />
              <Tooltip />
              <Bar
                name="Activity Count"
                dataKey="activities_count"
                fill="rgba(30, 130, 76, 1)"
              />
              <Legend align="center" verticalAlign="top" />
            </BarChart>
          </ResponsiveContainer>
        </Container>
      )}
    </div>
  );
};

export default ParkActivityCountChart;
