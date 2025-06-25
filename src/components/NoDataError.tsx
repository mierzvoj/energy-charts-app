export default function NoDataError() {
    return  (
        <div style={{
            padding: '40px',
            textAlign: 'center',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
        }}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}>Data graph</div>
            <h4 style={{margin: '0 0 8px 0', color: '#495057'}}>No data available</h4>
            <p style={{margin: '0', color: '#6c757d'}}>
                No telemetry data found for the selected period.
            </p>
        </div>
    )
}
