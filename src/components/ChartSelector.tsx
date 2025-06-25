import {DateGranularity} from "../types/DateGranularity";
import {ChartSelectorProps} from "../types/ChartSelectorProps";

/**
 * ChartSelector component, allows to switch views between day and month aggregated data
 * @param granularity
 * @param setGranularity
 * @param isLoading
 * @constructor
 */
export default function ChartSelector({granularity, setGranularity, isLoading}: ChartSelectorProps) {
    return (
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
    )
}
