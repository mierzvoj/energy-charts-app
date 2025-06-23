import {useEffect, useState} from "react";
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



interface telemetryDataset {
    timestamp: string;
    consumption: number;
    price: number;
}


export default function TimeSeriesController() {
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [datasets, setDataset] = useState<telemetryDataset[]>([]);


    const apiUrl = process.env.REACT_APP_API_BASE_URL;


    useEffect(() => {
        const fetchTelemetry = async () => {
            setIsLoading(true);
            try {

                const response = await fetch(`${apiUrl}/timeSeries`);
                const datasets = await response.json() as telemetryDataset[];
                setDataset(datasets);
            } catch (error: any) {
                setError(error)
            } finally {
                setIsLoading(false);
            }
        };
        fetchTelemetry();
    }, [])

    const chartData = datasets.map((item, index) => {
        return ({
            ...item,
            date: new Date(item.timestamp).toLocaleDateString('en-US', {
                month: 'numeric',
                day: 'numeric'
            }),
            totalCost: item.price * item.consumption,
        });
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Something went wrong. Please try again later</div>
    }

    return (
        <div style={{ width: '100%', height: '500px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 80,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        interval={0}
                        tick={{ fontSize: 8 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis />
                    <Tooltip
                        formatter={(value: any, name: string) => {
                            if (name === 'Consumption (kWh)') {
                                return [value.toFixed(2), name];
                            } else if (name === 'Price (PLN/kWh)') {
                                return [value.toFixed(3), name];
                            } else if (name === 'Total Cost (PLN)') {
                                return [value.toFixed(2), name];
                            }
                            return [value, name];
                        }}
                    />
                    <Legend />

                    <Line
                        type="monotone"
                        dataKey="consumption"
                        stroke="#8884d8"
                        dot={false}
                        strokeWidth={2}
                        name="Consumption (kWh)"
                    />
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#82ca9d"
                        dot={false}
                        strokeWidth={2}
                        name="Price (PLN/kWh)"
                    />
                    <Line
                        type="monotone"
                        dataKey="totalCost"
                        stroke="#ff7300"
                        dot={false}
                        strokeWidth={2}
                        name="Total Cost (PLN)"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
