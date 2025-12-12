import { LineChart } from '@mui/x-charts/LineChart';
export default function LineCharts() {
    return (
        <LineChart
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[
                {
                    data: [2, 3, 4, 5, 1.5, 5],
                },
            ]}
            height={150}
        />
    )
}