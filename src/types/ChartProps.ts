import {DateGranularity} from "./DateGranularity";
import {ChartData} from "../interfaces/ChartData";

export type ChartProps = {
    granularity: DateGranularity;
    chartData: ChartData[];
}
