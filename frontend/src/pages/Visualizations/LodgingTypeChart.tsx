// Help with indivual pie slice styling found at https://www.freakyjolly.com/react-charts-examples/#Pie_Chart_using_Recharts
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import './Visualizations.css';

const LodgingTypeChart = () => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    const getLodgingData = async () => {
        let chartDataDict: { [ key: string ]: number } = {};
        for (let p = 1; p <= 2; ++p) {
            axios
            .get(`https://api.trailmixapp.me/lodging?page[size]=500&page[number]=${p}`, {
                headers: {
                "Content-Type": "application/vnd.api+json",
                Accept: "application/vnd.api+json",
                },
            })
            .then((res: any) => {
                const lodgingData = res.data.data;

                for (let i = 0; i < lodgingData.length; ++i) {
                    const lodging = lodgingData[i];
                    const lodgingType = lodging.attributes.lodging_type;
                    if (lodgingType in chartDataDict)
                        ++chartDataDict[lodgingType];
                    else
                        chartDataDict[lodgingType] = 1;
                }

                const chartDataList: any = [];
                let sum = 0;
                for (const key in chartDataDict) {
                    chartDataList.push({
                        "name": key,
                        "value": chartDataDict[key]
                    });
                    sum += chartDataDict[key];
                }

                setChartData(chartDataList);
                setLoading(sum !== 925); // total number of lodgings
            });
        }
        
    };

    useEffect(() => {
        getLodgingData();
    }, []);

    return (
        <div>
            {loading ? (
                <Container className="visualizationBox">
                    <Spinner animation="border" />
                </Container>
            ) : (
                <Container className="visualizationBox">
                    <h3 className="visualizationTitle">Lodging Types</h3>
                    <ResponsiveContainer width="99%" height="99%">
                        <PieChart
                            width={500}
                            height={400}>
                                <Pie data={chartData} dataKey="value" nameKey="name" fill="#8884d8">
                                    {chartData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Container>
            )}
        </div>
    );
};

export default LodgingTypeChart;
