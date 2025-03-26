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
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  // If no data is provided, use sample data
  const chartData = data.length ? data : [
    { date: '29 Jul', networkEarnings: 0, referrals: 5.3, total: 5.3 },
    { date: '30 Jul', networkEarnings: 0, referrals: 5.3, total: 5.3 },
    { date: '31 Jul', networkEarnings: 0, referrals: 5.3, total: 5.3 },
    { date: '1 Aug', networkEarnings: 5.8, referrals: 5.3, total: 11.1 },
    { date: '2 Aug', networkEarnings: 0, referrals: 5.3, total: 5.3 },
    { date: '3 Aug', networkEarnings: 0, referrals: 5.3, total: 5.3 },
    { date: '4 Aug', networkEarnings: 5.8, referrals: 5.3, total: 11.1 },
    { date: '5 Aug', networkEarnings: 0, referrals: 1.1, total: 1.1 },
    { date: '6 Aug', networkEarnings: 0, referrals: 0, total: 0 },
    { date: '7 Aug', networkEarnings: 0, referrals: 7.7, total: 7.7 },
    { date: '8 Aug', networkEarnings: 0, referrals: 5.3, total: 5.3 },
    { date: '9 Aug', networkEarnings: 5.8, referrals: 5.3, total: 11.1 },
    { date: '10 Aug', networkEarnings: 4.8, referrals: 5.3, total: 10.1 },
    { date: '11 Aug', networkEarnings: 0, referrals: 5.3, total: 5.3 },
    { date: '12 Aug', networkEarnings: 1.4, referrals: 5.3, total: 6.7 },
    { date: '13 Aug', networkEarnings: 6.9, referrals: 5.3, total: 12.2 },
    { date: '14 Aug', networkEarnings: 2.2, referrals: 5.3, total: 7.5 },
    { date: '15 Aug', networkEarnings: 0, referrals: 4.8, total: 4.8 },
    { date: '16 Aug', networkEarnings: 1.4, referrals: 5.3, total: 6.7 },
    { date: '17 Aug', networkEarnings: 6, referrals: 5.3, total: 11.3 },
    { date: '18 Aug', networkEarnings: 6.8, referrals: 5.3, total: 12.1 },
    { date: '19 Aug', networkEarnings: 4.5, referrals: 5.3, total: 9.8 },
    { date: '20 Aug', networkEarnings: 6.9, referrals: 5.3, total: 12.2 },
    { date: '21 Aug', networkEarnings: 4.8, referrals: 5.3, total: 10.1 },
    { date: '22 Aug', networkEarnings: 5.8, referrals: 5.3, total: 11.1 }
  ];

  // Custom tooltip
const CustomTooltip = ({ active, payload }) => {
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
                    <Tooltip content={<CustomTooltip />} cursor={false} />
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
                                fill={highlightedIndex === index ? cxmputeLightGreen : "#c2f0a1"}
                                stroke={highlightedIndex === index ? cxmputeGreen : "#a6e775"}
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
