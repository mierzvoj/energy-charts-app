import {useEffect, useState} from "react";

// const API_BASE_URL = 'https://energy-charts.free.beeceptor.com'

interface telemetryDataset {
    timestamp: string;
    consumption: number;
    price: number;
}

export default function TimeSeriesController() {
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [datasets, setDataset] = useState<telemetryDataset[]>([]);
    const[page, setPage] = useState(0);

    const apiUrl = process.env.REACT_APP_API_BASE_URL;


    useEffect(() => {
        const fetchTelemetry = async () => {
            setIsLoading(true);
            try {

                const response = await fetch(`${apiUrl}/timeSeries`);
                const datasets = await response.json() as telemetryDataset[];
                setDataset(datasets);
            } catch (error: any) {
                setError(error)
            } finally {

                setIsLoading(false);
            }
        };
        fetchTelemetry();
    }, [page])

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Something went wrong. Please try again later</div>
    }

    const indexedDatasets = datasets.map((dataset, index) =>({
        ...dataset, index: index + 1
    }));
    return (
        <div className='container'>
            <h1 className='title'>Time Series</h1>
            <ul style={{listStyleType: 'none'}}>
                {indexedDatasets.map((dataset, index) => {
                    return <li
                        key={dataset.timestamp}> #{dataset.index} - {dataset.consumption} kWh, {dataset.price} PLN/kWh</li>
                })
                }
            </ul>
        </div>
    )
}
