import React from 'react';
import './App.css';
import LineTelemetryChart from "./components/LineTelemetryChart";
import TelemetryProvider from "./appContext/TelemetryProvider";

function App() {
    return (
        <>
            <TelemetryProvider>
                <LineTelemetryChart/>
            </TelemetryProvider>

        </>
    );
}

export default App;
