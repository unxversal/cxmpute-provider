import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import styles from './chart.module.css';

const cxmputeGreen = "#20a191";
const cxmputePink = "#fe91e8";
const cxmputeYellow = "#f8cb46";
const cxmputePurple = "#91a8eb";
// const cxmputeRed = "#d64989";
// const cxmputeSand = "#d4d4cb";
const cxmputeSlate = "#d4d4cb";
const cxmputeLightGreen = '#97e1bd'

const EarningsStatisticsChart = ({ data = [] }) => {
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  // If no data is provided, use sample data
const chartData = data.length ? data : [
    { date: '29 Jul', networkEarnings: 1.2, referrals: 6.3, total: 7.5 },
    { date: '30 Jul', networkEarnings: 2.1, referrals: 4.8, total: 6.9 },
    { date: '31 Jul', networkEarnings: 3.5, referrals: 5.1, total: 8.6 },
    { date: '1 Aug', networkEarnings: 6.2, referrals: 4.3, total: 10.5 },
    { date: '2 Aug', networkEarnings: 1.8, referrals: 3.9, total: 5.7 },
    { date: '3 Aug', networkEarnings: 2.4, referrals: 4.7, total: 7.1 },
    { date: '4 Aug', networkEarnings: 5.6, referrals: 6.2, total: 11.8 },
    { date: '5 Aug', networkEarnings: 3.1, referrals: 2.5, total: 5.6 },
    { date: '6 Aug', networkEarnings: 1.9, referrals: 2.1, total: 4.0 },
    { date: '7 Aug', networkEarnings: 2.7, referrals: 7.3, total: 10.0 },
    { date: '8 Aug', networkEarnings: 3.3, referrals: 5.4, total: 8.7 },
    { date: '9 Aug', networkEarnings: 6.1, referrals: 4.9, total: 11.0 },
    { date: '10 Aug', networkEarnings: 4.2, referrals: 6.3, total: 10.5 },
    { date: '11 Aug', networkEarnings: 2.8, referrals: 5.7, total: 8.5 },
    { date: '12 Aug', networkEarnings: 3.6, referrals: 4.5, total: 8.1 },
    { date: '13 Aug', networkEarnings: 7.2, referrals: 6.1, total: 13.3 },
    { date: '14 Aug', networkEarnings: 4.4, referrals: 5.2, total: 9.6 },
    { date: '15 Aug', networkEarnings: 2.3, referrals: 4.8, total: 7.1 },
    { date: '16 Aug', networkEarnings: 3.7, referrals: 5.9, total: 9.6 },
    { date: '17 Aug', networkEarnings: 6.5, referrals: 4.7, total: 11.2 },
    { date: '18 Aug', networkEarnings: 7.1, referrals: 5.4, total: 12.5 },
    { date: '19 Aug', networkEarnings: 5.3, referrals: 6.2, total: 11.5 },
    { date: '20 Aug', networkEarnings: 6.8, referrals: 5.7, total: 12.5 },
    { date: '21 Aug', networkEarnings: 4.9, referrals: 6.3, total: 11.2 },
    { date: '22 Aug', networkEarnings: 5.7, referrals: 5.8, total: 11.5 }
];

interface TooltipPayload {
    payload: {
        date: string;
        networkEarnings: number;
        referrals: number;
        total: number;
    };
}

  // Custom tooltip
const CustomTooltip = ({ active, payload }: { active: boolean; payload: TooltipPayload[] }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className={styles.tooltip}>
                <p className={styles.tooltipDate}>{data.date}</p>
                <p className={styles.tooltipNetworkEarnings}>
                    Network Earnings: {data.networkEarnings.toFixed(1)}
                </p>
                <p className={styles.tooltipReferrals}>Referrals: {data.referrals.toFixed(1)}</p>
                <p className={styles.tooltipTotal}>Total: {data.total.toFixed(1)}</p>
            </div>
        );
    }
    return null;
};

// Find max value for YAxis
const maxValue = Math.max(...chartData.map(item => item.total)) * 1.1;

return (
    <div className={styles.chartContainer}>

        <div className={styles.chart}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                    data={chartData}
                    margin={{ top: 20, right: 0, left: -30, bottom: 0 }}
                    barGap={0}
                    barSize={18}
                    onMouseMove={(data) => {
                        if (data.activeTooltipIndex !== undefined) {
                            setHighlightedIndex(data.activeTooltipIndex);
                        }
                    }}
                    onMouseLeave={() => setHighlightedIndex(null)}
                >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }} 
                        tickLine={false} 
                        axisLine={false}
                    />
                    <YAxis hide={true} domain={[0, maxValue]} />
                    
                    <Tooltip content={<CustomTooltip { ...{ active: false, payload: [] }}/>} cursor={false} />
                    <Bar 
                        dataKey="referrals" 
                        stackId="a" 
                        fill="#f0f0f0" 
                        stroke="#e0e0e0"
                        radius={[0, 0, 0, 0]}
                    >
                        {chartData.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={highlightedIndex === index ? "#f5f5f5" : "#f0f0f0"}
                                stroke={highlightedIndex === index ? "#e5e5e5" : "#e0e0e0"}
                            />
                        ))}
                    </Bar>
                    <Bar 
                        dataKey="networkEarnings" 
                        stackId="a" 
                        fill={cxmputeLightGreen}
                        stroke={cxmputeGreen}
                        radius={[4, 4, 0, 0]}
                    >
                        {chartData.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={cxmputeLightGreen}
                                stroke={cxmputeGreen}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>

        <div className={styles.chartFooter}>
            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <div className={`${styles.legendColor} ${styles.network}`}></div>
                    <span>Network Earnings</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={`${styles.legendColor} ${styles.referrals}`}></div>
                    <span>Referrals</span>
                </div>
            </div>
        </div>
    </div>
);

};

export default EarningsStatisticsChart;
