import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {TelemetryChartProps} from "../interfaces/TelemetryChartProps";
import {ChartData} from "../interfaces/ChartData";
import {TelemetryDataset} from "../interfaces/TelemetryDataset";
import {DateGranularity} from "../types/DateGranularity";



export default function LineTelemetryChart({ datasets }: TelemetryChartProps) {
    const [granularity, setGranularity] = useState<DateGranularity>('day');

    const aggregateDataByGranularity = (data: TelemetryDataset[]): ChartData[] => {
        if (granularity === 'day') {

            return data.map(item => ({
                date: new Date(item.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                }),
                consumption: item.consumption,
                price: item.price,
                totalCost: item.price * item.consumption,
                dataPoints: 1
            }));
        }


        const grouped = new Map<string, TelemetryDataset[]>();

        data.forEach(item => {
            const date = new Date(item.timestamp);
            // Group by month
            const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;

            if (!grouped.has(key)) {
                grouped.set(key, []);
            }
            grouped.get(key)!.push(item);
        });


        return Array.from(grouped.entries()).map(([key, items]) => {
            const avgConsumption = items.reduce((sum, item) => sum + item.consumption, 0) / items.length;
            const avgPrice = items.reduce((sum, item) => sum + item.price, 0) / items.length;
            const totalCost = items.reduce((sum, item) => sum + (item.consumption * item.price), 0);

            // Format date for display - monthly only
            const [year, month] = key.split('-');
            const monthDate = new Date(parseInt(year), parseInt(month), 1);
            const displayDate = monthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

            return {
                date: displayDate,
                consumption: avgConsumption,
                price: avgPrice,
                totalCost: totalCost,
                dataPoints: items.length
            };
        }).sort((a, b) => a.date.localeCompare(b.date));
    };

    const chartData = aggregateDataByGranularity(datasets);


    const getAxisInterval = (): number => {
        const dataLength = chartData.length;

        if (granularity === 'day') {
            return Math.max(0, Math.floor(dataLength / 15)); // Show every 15th day
        } else {
            return 0;
        }
    };

    return (
        <div style={{ width: '100%', height: '600px' }}>
            {/* Granularity Controls */}
            <div style={{
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e9ecef'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <div>
                        <label style={{ marginRight: '10px', fontWeight: 'bold', color: '#495057' }}>
                            Data Granularity:
                        </label>
                        <select
                            value={granularity}
                            onChange={(e) => setGranularity(e.target.value as DateGranularity)}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '4px',
                                border: '1px solid #ced4da',
                                backgroundColor: 'white',
                                fontSize: '14px'
                            }}
                        >
                            <option value="day">Daily View</option>
                            <option value="month">Monthly Averages</option>
                        </select>
                    </div>

                    <div style={{ color: '#6c757d', fontSize: '14px' }}>
                        Showing {chartData.length} data points
                        {granularity !== 'day' && (
                            <span> (aggregated from {datasets.length} daily records)</span>
                        )}
                    </div>
                </div>

                {granularity !== 'day' && (
                    <div style={{
                        marginTop: '10px',
                        padding: '8px 12px',
                        backgroundColor: '#e3f2fd',
                        borderRadius: '4px',
                        fontSize: '13px',
                        color: '#1565c0'
                    }}>
                        📊 Monthly aggregation: Consumption & Price show averages, Total Cost shows actual sums
                    </div>
                )}
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: granularity === 'day' ? 80 : 60,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        interval={getAxisInterval()}
                        tick={{ fontSize: granularity === 'day' ? 8 : 10 }}
                        angle={granularity === 'day' ? -45 : 0}
                        textAnchor={granularity === 'day' ? "end" : "middle"}
                        height={granularity === 'day' ? 80 : 60}
                    />
                    <YAxis />
                    <Tooltip
                        formatter={(value: any, name: string) => {
                            if (name === 'Consumption (kWh)') {
                                const suffix = granularity === 'day' ? '' : ' avg';
                                return [value.toFixed(2) + suffix, name];
                            } else if (name === 'Price (PLN/kWh)') {
                                const suffix = granularity === 'day' ? '' : ' avg';
                                return [value.toFixed(3) + suffix, name];
                            } else if (name === 'Total Cost (PLN)') {
                                const suffix = granularity === 'day' ? '' : ' (month total)';
                                return [value.toFixed(2) + suffix, name];
                            }
                            return [value, name];
                        }}
                        labelFormatter={(label) => {
                            return `${label}`;
                        }}
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />
                    <Legend />

                    <Line
                        type="monotone"
                        dataKey="consumption"
                        stroke="#2563eb"
                        dot={granularity !== 'day'}
                        // dotSize={4}
                        strokeWidth={granularity === 'day' ? 1.5 : 2.5}
                        name="Consumption (kWh)"
                    />
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#059669"
                        dot={granularity !== 'day'}
                        // dotSize={4}
                        strokeWidth={granularity === 'day' ? 1.5 : 2.5}
                        name="Price (PLN/kWh)"
                    />
                    <Line
                        type="monotone"
                        dataKey="totalCost"
                        stroke="#dc2626"
                        dot={granularity !== 'day'}
                        // dotSize={4}
                        strokeWidth={granularity === 'day' ? 1.5 : 2.5}
                        name="Total Cost (PLN)"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
