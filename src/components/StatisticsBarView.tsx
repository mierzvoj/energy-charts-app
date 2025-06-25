import {StatisticsDisplayProps} from "../types/StatisticsDisplayProps";

/**
 * Bar view with statistics like period data start and finish, total energy consumed and average price
 * @param statistics
 * @constructor
 */
export default function StatisticsBarView({ statistics }: StatisticsDisplayProps) {
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
                <div>Calendar data: <strong>Period:</strong> {statistics.dateRange.start} - {statistics.dateRange.end}</div>
            )}
            {statistics.totalConsumption !== undefined && statistics.totalConsumption !== null && (
                <div>Total consumption statistics: <strong>Total:</strong> {statistics.totalConsumption.toFixed(2)} kWh</div>
            )}
            {statistics.averagePrice !== undefined && statistics.averagePrice !== null && (
                <div>Average price statistics: <strong>Avg Price:</strong> {statistics.averagePrice.toFixed(3)} PLN/kWh</div>
            )}
        </div>
    )
}
