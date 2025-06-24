// components/LineTelemetryChart.tsx
import { useState, useCallback, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DateGranularity } from "../types/DateGranularity";
import { TelemetryDataset } from "../interfaces/TelemetryDataset";
import { ChartData } from "../interfaces/ChartData";
import { useTelemetryData, useTelemetryErrorHandler } from "../appContext/TelemetryProvider";
import { ErrorDisplay } from "./ErrorDisplay";

export default function LineTelemetryChart() {
    const [granularity, setGranularity] = useState<DateGranularity>('day');
    const { datasets, isLoading } = useTelemetryData();
    const { error, clearError } = useTelemetryErrorHandler();

    // Data processing logic kept in component with null protection
    const aggregateDataByGranularity = useCallback((data: TelemetryDataset[]): ChartData[] => {
        if (!data || data.length === 0) {
            return [];
        }

        // Filter out invalid data entries
        const validData = data.filter(item => {
            return item &&
                item.timestamp &&
                !isNaN(item.consumption) &&
                !isNaN(item.price) &&
                item.consumption >= 0 &&
                item.price >= 0;
        });

        if (validData.length === 0) {
            return [];
        }

        if (granularity === 'day') {
            return validData.map(item => {
                try {
                    const date = new Date(item.timestamp);
                    // Check if date is valid
                    if (isNaN(date.getTime())) {
                        return null;
                    }

                    return {
                        date: date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                        }),
                        consumption: Number(item.consumption) || 0,
                        price: Number(item.price) || 0,
                        totalCost: (Number(item.price) || 0) * (Number(item.consumption) || 0),
                        dataPoints: 1
                    };
                } catch {
                    return null;
                }
            }).filter((item): item is ChartData => item !== null);
        }

        // Monthly aggregation with null protection
        const grouped = new Map<string, TelemetryDataset[]>();

        validData.forEach(item => {
            try {
                const date = new Date(item.timestamp);
                if (isNaN(date.getTime())) {
                    return;
                }

                const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;

                if (!grouped.has(key)) {
                    grouped.set(key, []);
                }
                grouped.get(key)!.push(item);
            } catch {
                // Silently skip invalid items
            }
        });

        return Array.from(grouped.entries())
            .map(([key, items]) => {
                try {
                    if (!items || items.length === 0) {
                        return null;
                    }

                    // Calculate averages with null protection
                    const validConsumption = items
                        .map(item => Number(item.consumption))
                        .filter(val => !isNaN(val) && val >= 0);

                    const validPrices = items
                        .map(item => Number(item.price))
                        .filter(val => !isNaN(val) && val >= 0);

                    if (validConsumption.length === 0 || validPrices.length === 0) {
                        return null;
                    }

                    const avgConsumption = validConsumption.reduce((sum, val) => sum + val, 0) / validConsumption.length;
                    const avgPrice = validPrices.reduce((sum, val) => sum + val, 0) / validPrices.length;

                    // Calculate total cost from individual items
                    const totalCost = items.reduce((sum, item) => {
                        const consumption = Number(item.consumption) || 0;
                        const price = Number(item.price) || 0;
                        return sum + (consumption * price);
                    }, 0);

                    const [year, month] = key.split('-');
                    const monthDate = new Date(parseInt(year) || 0, parseInt(month) || 0, 1);

                    if (isNaN(monthDate.getTime())) {
                        return null;
                    }

                    const displayDate = monthDate.toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                    });

                    return {
                        date: displayDate,
                        consumption: avgConsumption || 0,
                        price: avgPrice || 0,
                        totalCost: totalCost || 0,
                        dataPoints: items.length
                    };
                } catch {
                    return null;
                }
            })
            .filter((item): item is ChartData => item !== null)
            .sort((a, b) => {
                try {
                    return a.date.localeCompare(b.date);
                } catch {
                    return 0;
                }
            });
    }, [granularity]);

    // Memoized chart data
    const chartData = useMemo(() => {
        return aggregateDataByGranularity(datasets);
    }, [datasets, aggregateDataByGranularity]);

    // X-axis interval calculation
    const xAxisInterval = useMemo(() => {
        const dataLength = chartData.length;
        return granularity === 'day'
            ? Math.max(0, Math.floor(dataLength / 15))
            : 0;
    }, [chartData.length, granularity]);

    // Statistics with null protection
    const statistics = useMemo(() => {
        const dataPointsCount = chartData?.length || 0;
        const originalDataCount = datasets?.length || 0;

        let dateRange = null;
        try {
            if (datasets && datasets.length > 0) {
                const validDates = datasets
                    .map(d => {
                        try {
                            return d?.timestamp ? new Date(d.timestamp) : null;
                        } catch {
                            return null;
                        }
                    })
                    .filter((date): date is Date => date !== null && !isNaN(date.getTime()))
                    .sort((a, b) => a.getTime() - b.getTime());

                if (validDates.length > 0) {
                    dateRange = {
                        start: validDates[0].toLocaleDateString(),
                        end: validDates[validDates.length - 1].toLocaleDateString()
                    };
                }
            }
        } catch {
            // Silently handle error
        }

        let totalConsumption = 0;
        let averagePrice = 0;

        try {
            if (chartData && chartData.length > 0) {
                const validConsumption = chartData
                    .map(item => Number(item?.consumption) || 0)
                    .filter(val => !isNaN(val));

                const validPrices = chartData
                    .map(item => Number(item?.price) || 0)
                    .filter(val => !isNaN(val));

                totalConsumption = validConsumption.reduce((sum, val) => sum + val, 0);
                averagePrice = validPrices.length > 0
                    ? validPrices.reduce((sum, val) => sum + val, 0) / validPrices.length
                    : 0;
            }
        } catch {
            // Silently handle error
        }

        return {
            dataPointsCount,
            originalDataCount,
            dateRange,
            totalConsumption: totalConsumption || 0,
            averagePrice: averagePrice || 0
        };
    }, [chartData, datasets]);

    // Tooltip formatter with null protection
    const tooltipFormatter = useCallback((value: any, name: string) => {
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

    // Loading state with null protection
    if (isLoading && (!datasets || datasets.length === 0)) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '400px',
                fontSize: '18px',
                color: '#6c757d'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
                    Loading telemetry data...
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div style={{ padding: '20px' }}>
                <ErrorDisplay
                    error={error}
                    onDismiss={clearError}
                    showTechnicalDetails={process.env.NODE_ENV === 'development'}
                />
            </div>
        );
    }

    // No data state with null protection
    if ((!chartData || chartData.length === 0) && !isLoading && !error) {
        return (
            <div style={{
                padding: '40px',
                textAlign: 'center',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e9ecef'
            }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                <h4 style={{ margin: '0 0 8px 0', color: '#495057' }}>No data available</h4>
                <p style={{ margin: '0', color: '#6c757d' }}>
                    No telemetry data found for the selected period.
                </p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: '600px' }}>
            {/* Chart Controls */}
            <div style={{
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e9ecef'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    flexWrap: 'wrap',
                    marginBottom: '10px'
                }}>
                    <div>
                        <label style={{
                            marginRight: '10px',
                            fontWeight: 'bold',
                            color: '#495057'
                        }}>
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
                                fontSize: '14px',
                                cursor: 'pointer'
                            }}
                            disabled={isLoading}
                        >
                            <option value="day">Daily View</option>
                            <option value="month">Monthly Averages</option>
                        </select>
                    </div>

                    <div style={{ color: '#6c757d', fontSize: '14px' }}>
                        Showing {statistics.dataPointsCount} data points
                        {granularity !== 'day' && (
                            <span> (aggregated from {statistics.originalDataCount} daily records)</span>
                        )}
                    </div>
                </div>

                {/* Statistics */}
                {(statistics.dateRange || statistics.totalConsumption !== undefined || statistics.averagePrice !== undefined) && (
                    <div style={{
                        display: 'flex',
                        gap: '20px',
                        flexWrap: 'wrap',
                        fontSize: '13px',
                        color: '#6c757d',
                        marginBottom: '10px'
                    }}>
                        {statistics.dateRange && (
                            <div>📅 <strong>Period:</strong> {statistics.dateRange.start} - {statistics.dateRange.end}</div>
                        )}
                        {statistics.totalConsumption !== undefined && statistics.totalConsumption !== null && (
                            <div>⚡ <strong>Total:</strong> {statistics.totalConsumption.toFixed(2)} kWh</div>
                        )}
                        {statistics.averagePrice !== undefined && statistics.averagePrice !== null && (
                            <div>💰 <strong>Avg Price:</strong> {statistics.averagePrice.toFixed(3)} PLN/kWh</div>
                        )}
                    </div>
                )}

                {granularity !== 'day' && (
                    <div style={{
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

            {/* Chart */}
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
                        interval={xAxisInterval}
                        tick={{ fontSize: granularity === 'day' ? 8 : 10 }}
                        angle={granularity === 'day' ? -45 : 0}
                        textAnchor={granularity === 'day' ? "end" : "middle"}
                        height={granularity === 'day' ? 80 : 60}
                    />
                    <YAxis />
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
                    <Legend />

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
        </div>
    );
}
