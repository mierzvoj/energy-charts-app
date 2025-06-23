import {useEffect, useState} from "react";

const API_BASE_URL = 'https://energy-charts.free.beeceptor.com'

interface telemetryDataset {
    timestamp: string;
    consumption: number;
    price: number;
}

export default function TimeSeriesController() {
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [datasets, setDataset] = useState<telemetryDataset[]>([]);

    useEffect(() => {
        const fetchTelemetry = async () => {
            setIsLoading(true);
            try {

                const response = await fetch(`${API_BASE_URL}/timeSeries`);
                const datasets = await response.json() as telemetryDataset[];
                setDataset(datasets);
            } catch (error: any) {
                setError(error)
            } finally {

                setIsLoading(false);
            }
        };
        fetchTelemetry();
    }, [])

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Something went wrong, Please try again later</div>
    }
    return (
        <div className='container'>
            <h1 className='title'>Time Series</h1>
            <ul>
                {datasets.map((dataset) => {
                    return <li key={dataset.timestamp}>{dataset.consumption}, {dataset.price}</li>
                })
                })
            </ul>
        </div>
    )
}
