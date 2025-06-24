import '@testing-library/jest-dom';
import {render, screen} from "@testing-library/react";
import TelemetryProvider from "../context/TelemetryProvider";
import StatisticsDisplay from "./StatisticsDisplay";
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
            <StatisticsDisplay statistics={statisticsTestData} />
        </TelemetryProvider>
    );
}

test('StatisticsDisplay', () => {
    render(<TestComponent />);

    expect(screen.getByTestId('statistics')).toBeInTheDocument();
});
