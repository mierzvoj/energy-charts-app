import {DateGranularity} from "../types/DateGranularity";

type ChartSelectorProps = {
    granularity: DateGranularity;
    setGranularity: (granularity: DateGranularity) => void;
    isLoading: boolean;
}

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
