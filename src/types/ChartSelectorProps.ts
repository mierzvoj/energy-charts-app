import {DateGranularity} from "./DateGranularity";

export type ChartSelectorProps = {
    granularity: DateGranularity;
    setGranularity: (granularity: DateGranularity) => void;
    isLoading: boolean;
}
