import {useCallback, useMemo, useState} from "react";
import {DateGranularity} from "../types/DateGranularity";
import {TelemetryDataset} from "../interfaces/TelemetryDataset";
import {ChartData} from "../interfaces/ChartData";
import {useTelemetryData, useTelemetryErrorHandler} from "../context/TelemetryProvider";
import {ErrorView} from "./ErrorView";
import Chart from "./Chart";
import ChartSelector from "./ChartSelector";
import StatisticsBarView from "./StatisticsBarView";
import NoDataError from "./NoDataError";
import ChartInformation from "./ChartInformation";

/**
 * Component with data logic and processing for chart render
 * @constructor
 */
export default function LineTelemetryChart() {
    const [granularity, setGranularity] = useState<DateGranularity>('day');
    const {datasets, isLoading} = useTelemetryData();
    const {error, clearError} = useTelemetryErrorHandler();

    /**
     * Data aggregation by selected chart granularity logic (day or month), uses callback hook to avoid unnecessary recalculation
     * Recalculates upon granularity dependency change
     * @param {TelemetryDataset[]}  array of data TelemetryDataset
     * @return's {ChartData[]} array of ChartData type
     */
    const aggregateDataByGranularity = useCallback((data: TelemetryDataset[]): ChartData[] => {

        /**
         * Early return when no data is found
         */
        if (!data || data.length === 0) {
            return [];
        }
        /**
         * Data initial filtering, timestamp presence check
         * Proper data figures check, data positiveness validation and exits function
         * All inproper data is being discarded
         */
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
        /**
         *Process this if if granularity of final view is to be in days
         * @return type is of ChartData[] type
         * null protection, all null items are being filtered out from ChartData[]
         */
        if (granularity === 'day') {
            return validData.map(item => {
                try {
                    const date = new Date(item.timestamp);
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
        /**
         * Granularity month scenario is being processed by creation of an empty Map with key strings and values of TelemetryDataset[]
         * Line 89 is unique string key creation by combining year and month ("2024-00", "2024-01", "2024-02"....) it is sortable
         * Map is being filled with data key, value pairs: key is "2024-00" => [January records], "2024-01" => [Feb records only]...
         */
        const grouped = new Map<string, TelemetryDataset[]>();
        validData.forEach(item => {

            const date = new Date(item.timestamp);
            if (isNaN(date.getTime())) {
                return;
            }

            const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;

            if (!grouped.has(key)) {
                grouped.set(key, []);
            }
            grouped.get(key)!.push(item);

        });
        /**
         * Map is being transformed into an array by entries(), that returns an iterator from a Map so now our data
         * @param is grouped Map with entries() applied
         * @return type ChartData[]
         * looks ["2024-00" [January data ],... ]
         * items[] is being processed to calulate aggregates like average, sum, with reduce() function
         * former map key is being transformed into proper date format "year-month"
         * sorted by date ChartData[] is being returned
         */
        return Array.from(grouped.entries())
            .map(([key, items]) => {
                try {
                    if (!items || items.length === 0) {
                        return null;
                    }

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

    /**
    *Memoization protects component from unnecessary data reprocessing, only in case that dataset changes
     */
    const chartData = useMemo(() => {
        return aggregateDataByGranularity(datasets);
    }, [datasets]);

    /**
     * Data prepared for the statistics view over main chart,
     * @return main aggregates like period, total and average price
     */
    const statistics = useMemo(() => {
        const dataPointsCount = chartData?.length || 0;
        const originalDataCount = datasets?.length || 0;

        let dateRange = null;

        if (datasets && datasets.length > 0) {
            const validDates = datasets
                .map(d => {
                    return d?.timestamp ? new Date(d.timestamp) : null;
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

        let totalConsumption = 0;
        let averagePrice = 0;

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

        return {
            dataPointsCount,
            originalDataCount,
            dateRange,
            totalConsumption: totalConsumption || 0,
            averagePrice: averagePrice || 0
        };
    }, [chartData, datasets]);
    /**
     * Loading data state "spinner"
     */
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
                    <div style={{fontSize: '24px', marginBottom: '10px'}}>Wait now...</div>
                    Loading telemetry data...
                </div>
            </div>
        );
    }
    /**
     * In case of error, show this error messasge with tehcnical details i.e. http error code, on close clear error from context
     */
    if (error) {
        return (
            <div style={{padding: '20px'}}>
                <ErrorView
                    error={error}
                    onDismiss={clearError}
                    showTechnicalDetails={process.env.NODE_ENV === 'development'}
                />
            </div>
        );
    }
        /**
        *Empty dataset error message
         */
    if ((!chartData || chartData.length === 0) && !isLoading && !error) {
        return (
            <NoDataError/>
        );
    }
    /**
     * Main chart render code, default styling from re charts
     */
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
                    <StatisticsBarView statistics={statistics}/>
                )}

                {granularity === 'month'
                    ? <ChartInformation
                        message={"Monthly aggregation: Consumption & Price show averages, Total Cost shows actual sums"}/>
                    : <ChartInformation
                        message={"Daily aggregation: Consumption & Price show averages, Total Cost shows actual sums"}/>
                }
            </div>
            <Chart granularity={granularity} chartData={chartData}/>
        </div>
    );
}
