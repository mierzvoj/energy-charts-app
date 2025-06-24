import {useCallback, useMemo, useState} from "react";
import {DateGranularity} from "../types/DateGranularity";
import {TelemetryDataset} from "../interfaces/TelemetryDataset";
import {ChartData} from "../interfaces/ChartData";
import {useTelemetryData, useTelemetryErrorHandler} from "../appContext/TelemetryProvider";
import {ErrorDisplay} from "./ErrorDisplay";
import Chart from "./Chart";
import ChartSelector from "./ChartSelector";
import StatisticsDisplay from "./StatisticsDisplay";
import NoDataError from "./NoDataError";
import ChartInformation from "./ChartInformation";

export default function LineTelemetryChart() {
    const [granularity, setGranularity] = useState<DateGranularity>('day');
    const {datasets, isLoading} = useTelemetryData();
    const {error, clearError} = useTelemetryErrorHandler();

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

    const chartData = useMemo(() => {
        return aggregateDataByGranularity(datasets);
    }, [datasets, aggregateDataByGranularity]);

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
                <div style={{textAlign: 'center'}}>
                    <div style={{fontSize: '24px', marginBottom: '10px'}}>⏳</div>
                    Loading telemetry data...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{padding: '20px'}}>
                <ErrorDisplay
                    error={error}
                    onDismiss={clearError}
                    showTechnicalDetails={process.env.NODE_ENV === 'development'}
                />
            </div>
        );
    }

    if ((!chartData || chartData.length === 0) && !isLoading && !error) {
        return (
            <NoDataError />
        );
    }

    return (
        <div style={{width: '100%', height: '600px'}}>

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
                    <ChartSelector granularity={granularity} setGranularity={setGranularity} isLoading={isLoading}/>

                    <div style={{color: '#6c757d', fontSize: '14px'}}>
                        Showing {statistics.dataPointsCount} data points
                        {granularity !== 'day' && (
                            <span> (aggregated from {statistics.originalDataCount} daily records)</span>
                        )}
                    </div>
                </div>

                {(
                    statistics.dateRange
                    && statistics.totalConsumption !== undefined
                    && statistics.averagePrice !== undefined
                    && statistics.dateRange.start !== statistics.dateRange.end
                ) && (
                    <StatisticsDisplay statistics={statistics}/>
                )}

                {granularity === 'month'
                    ? <ChartInformation message={"📊 Monthly aggregation: Consumption & Price show averages, Total Cost shows actual sums"} />
                    : <ChartInformation message={"📊 Daily aggregation: Consumption & Price show averages, Total Cost shows actual sums"} />
                }
            </div>

            <Chart granularity={granularity} chartData={chartData}/>
        </div>
    );
}
