import '@testing-library/jest-dom';
import {render, screen} from "@testing-library/react";
import TelemetryProvider from "../context/TelemetryProvider";
import StatisticsBarView from "./StatisticsBarView";
import {Statistics} from "../types/Statistics";

const TestComponent = () => {
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
            <StatisticsBarView statistics={statisticsTestData} />
        </TelemetryProvider>
    );
}

test('StatisticsBarView', () => {
    render(<TestComponent />);

    expect(screen.getByTestId('statistics')).toBeInTheDocument();
});
