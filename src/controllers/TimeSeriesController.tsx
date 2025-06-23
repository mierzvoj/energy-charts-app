import {useEffect, useState} from "react";
import {DateGranularity} from "../types/DateGranularity";
import LineTelemetryChart from "../components/LineTelemetryChart";
import {TelemetryDataset} from "../interfaces/TelemetryDataset";



export default function TimeSeriesController() {
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [datasets, setDataset] = useState<TelemetryDataset[]>([]);

    const apiUrl = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        const fetchTelemetry = async () => {
            setIsLoading(true);
            try {

                const response = await fetch(`${apiUrl}/timeSeries`);
                const datasets = await response.json() as TelemetryDataset[];
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
        return <div>Something went wrong. Please try again later</div>
    }

    return (
        <div>
            <h1>Energy Dashboard</h1>
            <LineTelemetryChart datasets={datasets}/>
        </div>
    );
}
