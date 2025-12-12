import { PieChart } from '@mui/x-charts/PieChart';
import { desktopOS, valueFormatter } from './webUsageStets';

export default function PieActiveArc(){
    return (
        <PieChart
            series={[
                {
                    data: desktopOS,
                    highlightScope: {fade: 'global', highlight: 'item'},
                    faded: {innerRadius: 30, additionalRadius: -30, color: 'gray'},
                    valueFormatter
                }
            ]}
        height={150}
        width={150}
        />
    )
}