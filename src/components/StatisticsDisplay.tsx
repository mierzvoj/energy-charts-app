import {StatisticsDisplayProps} from "../types/StatisticsDisplayProps";

export default function StatisticsDisplay({ statistics }: StatisticsDisplayProps) {
    return (
        <div
            data-testid="statistics"
            style={{
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
    )
}
