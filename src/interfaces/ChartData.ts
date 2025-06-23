import {TelemetryDataset} from "./TelemetryDataset";

export interface ChartData  {
    date: string;
    consumption: number;
    price: number;
    totalCost: number;
    dataPoints: number;
}
