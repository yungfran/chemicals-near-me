import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import {
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  import "./Visualizations.css";

const LongestTrailsChart = () => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    const getTrailsData = async () => {
        axios
        .get(`https://api.trailmixapp.me/trail?sort=-distance`, {
            headers: {
            "Content-Type": "application/vnd.api+json",
            Accept: "application/vnd.api+json",
            },
        })
        .then((res: any) => {
            var trailData = res.data.data;
            var chartDataList: any = [];

            for (let i = 0; i < trailData.length; i++) {
                var currPark = trailData[i];
                var trailLength = currPark.attributes.distance;
                var name = currPark.attributes.name;
                chartDataList.push({
                    name: name,
                    trail_length: parseInt(trailLength),
                });
            }
        setChartData(chartDataList);
        setLoading(false);
        });
    };

    useEffect(() => {
        getTrailsData();
    }, []);

    return (
        <div>
        {loading ? (
            <Container className="visualizationBox">
            <Spinner animation="border" />
            </Container>
        ) : (
            <Container className="visualizationBox">
            <h3 className="visualizationTitle">
                Longest Trails
            </h3>
            <ResponsiveContainer width="99%" height="99%">
                <AreaChart
                    width={500}
                    height={400}
                    data={chartData}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <Tooltip label="trail_length"/>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis name="Name" dataKey="name" />
                    <YAxis name="Trail Length" dataKey="trail_length"/>
                    <Tooltip />
                    <Area name="Trail Length" type="monotone" dataKey="trail_length" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
            </ResponsiveContainer>
            </Container>
        )}
        </div>
    );

};

export default LongestTrailsChart;

