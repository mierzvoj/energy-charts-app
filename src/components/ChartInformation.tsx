type ChartInformationProps = {
    message: string;
}

export default function ChartInformation({ message }: ChartInformationProps) {
    return (
        <div style={{
            padding: '8px 12px',
            backgroundColor: '#e3f2fd',
            borderRadius: '4px',
            fontSize: '13px',
            color: '#1565c0'
        }}>
            {message}
        </div>
    )
}
