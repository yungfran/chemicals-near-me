import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import {
  ScatterChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  Scatter,
} from "recharts";
import axios from "axios";
import CityJSON from "../Cities/CityJSON";
import { numberWithCommas } from "../Utility";

const CitiesChart = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCities = async () => {
    axios
      .get<CityJSON>("https://api.chemicalsnear.me/cities?page=-1")
      .then((res: any) => {
        var cityChartData = [];
        for (let city of res.data.cities) {
          cityChartData.push({
            name: city.name,
            disability: city.disability,
            median_household_income: city.median_household_income,
          });
        }

        cityChartData.sort((a, b) => {
          return b.median_household_income - a.median_household_income;
        });
        setCities(cityChartData);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // Code inspired by https://stackoverflow.com/questions/42646352/recharts-setting-x-axis-label-margin
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="customTooltip">
          <p>
            <b>{payload[0].payload.name}</b>
          </p>
          <p>
            <b>Household Income:</b> $
            {numberWithCommas(payload[0].payload.median_household_income)}
          </p>
          <p>
            <b>Disability:</b> {payload[0].payload.disability}%
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      {loading ? (
        <Container className="visualizationBox"></Container>
      ) : (
        <Container className="visualizationBox">
          <h3 className="visualizationTitle">City Income vs Disability % </h3>
          <ResponsiveContainer width="99%">
            <ScatterChart
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="median_household_income"
                height={50}
                textAnchor="middle"
              >
                <Label
                  value="Median Household Income ($)"
                  position="insideBottom"
                />
              </XAxis>
              <YAxis dataKey="disability">
                <Label
                  angle={-90}
                  value="% of people with disasbility"
                  position="insideLeft"
                />
              </YAxis>
              <Tooltip content={<CustomTooltip />} />
              <Scatter data={cities} fill="#9c136e" />
            </ScatterChart>
          </ResponsiveContainer>
        </Container>
      )}
    </div>
  );
};

export default CitiesChart;
