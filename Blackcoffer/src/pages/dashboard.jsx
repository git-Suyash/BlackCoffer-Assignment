import Chart from '../components/dataChart';
import ScatterPlot from '../components/scatterPlot';

function DashBoard() {
    return(
        <>
            <h1> Bar Chart </h1>
            <Chart />
            <h1> Scatterplot</h1>
            <ScatterPlot />
        </>
    )
}

export default DashBoard;