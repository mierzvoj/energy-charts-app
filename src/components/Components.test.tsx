import '@testing-library/jest-dom';
import {render, screen} from "@testing-library/react";
import TelemetryProvider from "../context/TelemetryProvider";
import StatisticsBarView from "./StatisticsBarView";
import {Statistics} from "../types/Statistics";
import {ChartData} from "../interfaces/ChartData";
import Chart from "./Chart";

const TestComponent1 = () => {
    const statisticsTestData: Statistics = {
        dateRange: {
            start: '2022-01-01',
            end: '2025-01-20'
        },
        totalConsumption: 100,
        averagePrice: 1
    };
    return (
        <TelemetryProvider>
            <StatisticsBarView statistics={statisticsTestData}/>
        </TelemetryProvider>
    );
}

test('StatisticsBarView', () => {
    render(<TestComponent1/>);

    expect(screen.getByTestId('statistics')).toBeInTheDocument();
});

const TestComponent2 = () => {
    const chartTestData: ChartData[] = [
        {date: "2024-04-20", consumption: 10, price: 20, totalCost: 200, dataPoints: 100}
    ];
    return (
        <TelemetryProvider>
            <Chart granularity={'day'} chartData={chartTestData}/>
        </TelemetryProvider>
    );
}

test('ChartView', () => {
    render(<TestComponent2/>);
    expect(screen.getByTestId('chart-view')).toBeInTheDocument();
});
