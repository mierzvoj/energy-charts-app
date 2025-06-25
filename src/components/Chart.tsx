import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {useCallback, useMemo} from "react";
import {ChartProps} from "../types/ChartProps";


export default function Chart({granularity, chartData}: ChartProps) {
    const xAxisInterval = useMemo(() => {
        const dataLength = chartData.length;
        return granularity === 'day'
            ? Math.max(0, Math.floor(dataLength / 100))
            : 0;
    }, [chartData.length, granularity]);

    const tooltipFormatter = useCallback((value: never, name: string) => {
        try {
            const numValue = Number(value);
            if (isNaN(numValue)) {
                return ['N/A', name];
            }

            if (name === 'Consumption (kWh)') {
                const suffix = granularity === 'day' ? '' : ' avg';
                return [numValue.toFixed(2) + suffix, name];
            } else if (name === 'Price (PLN/kWh)') {
                const suffix = granularity === 'day' ? '' : ' avg';
                return [numValue.toFixed(3) + suffix, name];
            } else if (name === 'Total Cost (PLN)') {
                const suffix = granularity === 'day' ? '' : ' (month total)';
                return [numValue.toFixed(2) + suffix, name];
            }
            return [numValue.toString(), name];
        } catch {
            return ['Error', name];
        }
    }, [granularity]);

    return (
        <>
            <div data-testid="chart-view"/>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data-testid="chart-view"
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: granularity === 'day' ? 80 : 60,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                        dataKey="date"
                        interval={xAxisInterval}
                        tick={{fontSize: granularity === 'day' ? 8 : 10}}
                        angle={granularity === 'day' ? -45 : 0}
                        textAnchor={granularity === 'day' ? "end" : "middle"}
                        height={granularity === 'day' ? 80 : 60}
                    />
                    <YAxis/>
                    <Tooltip
                        formatter={tooltipFormatter}
                        labelFormatter={(label) => `${label}`}
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                    />
                    <Legend/>

                    <Line
                        type="monotone"
                        dataKey="consumption"
                        stroke="#2563eb"
                        dot={granularity !== 'day'}
                        strokeWidth={granularity === 'day' ? 1.5 : 2.5}
                        name="Consumption (kWh)"
                    />
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#059669"
                        dot={granularity !== 'day'}
                        strokeWidth={granularity === 'day' ? 1.5 : 2.5}
                        name="Price (PLN/kWh)"
                    />
                    <Line
                        type="monotone"
                        dataKey="totalCost"
                        stroke="#dc2626"
                        dot={granularity !== 'day'}
                        strokeWidth={granularity === 'day' ? 1.5 : 2.5}
                        name="Total Cost (PLN)"
                    />
                </LineChart>
            </ResponsiveContainer>
        </>
    )
}
