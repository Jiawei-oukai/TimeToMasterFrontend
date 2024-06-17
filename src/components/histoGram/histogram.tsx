import styles from './histogram.module.scss';
import React from 'react';
import { ComposedChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList, ReferenceLine, Line } from 'recharts';
import { useState } from 'react';
import DailyRecord from '@/models/record-daily';

interface HistogramProps {
    dailyRecords: DailyRecord[];
    weeklyRecords: DailyRecord[];
    monthlyRecords: DailyRecord[];
}

export default function Histogram(props: HistogramProps) {
    const [selectedPeriod, setSelectedPeriod] = useState('day');

    const handlePeriodChange = (newPeriod: string) => {
        setSelectedPeriod(newPeriod);
    };

    const getDataForPeriod = () => {
        let records: DailyRecord[];
        switch (selectedPeriod) {
            case 'day':
                records = props.dailyRecords;
                break;
            case 'week':
                records = props.weeklyRecords;
                break;
            case 'month':
                records = props.monthlyRecords;
                break;
            default:
                records = [];
                break;
        }

        return records.sort((a, b) => {
            const dateA = new Date(a.recordsDate).getTime();
            const dateB = new Date(b.recordsDate).getTime();
            return dateB - dateA;
        });
    };

    return (
        <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
                <div className={styles.chartTitle}>
                    <h2>Recent Time Invested &nbsp;</h2> <p>(h)</p>
                </div>

                <div className={styles.buttonContainer}>
                    <div className={styles.buttonHighlight}
                        style={{
                            left: `${selectedPeriod === 'day' ? 5 : selectedPeriod === 'week' ? 38.33 : 71.66}%`
                        }}></div>
                    <button className={`${styles.button} ${selectedPeriod === 'day' ? styles.selected : ''}`} onClick={() => handlePeriodChange('day')}>Day</button>
                    <button className={`${styles.button} ${selectedPeriod === 'week' ? styles.selected : ''}`} onClick={() => handlePeriodChange('week')}>Week</button>
                    <button className={`${styles.button} ${selectedPeriod === 'month' ? styles.selected : ''}`} onClick={() => handlePeriodChange('month')}>Month</button>

                    <div className={styles.verticalLine} style={{ left: '33.33%' }}></div>
                    <div className={styles.verticalLine} style={{ left: '66.66%' }}></div>
                </div>
            </div>
            <div className={styles.chartContent}>
                <div className={styles.histogram}>
                    <ComposedChart
                        className={styles.customChart}
                        width={800}
                        height={400}
                        data={getDataForPeriod()}
                        margin={{ top: 25, right: 10, left: 10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="recordsDate" stroke="#494949" axisLine={false} tickLine={false}
                            tick={{ fontSize: 16 }}
                            tickFormatter={(value) => {
                                // Return the date string directly, ensuring it is not affected by time zones.
                                return value;
                            }}
                        >
                            <ReferenceLine y={0} stroke="#494949" />
                        </XAxis>
                        <YAxis stroke="#494949" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#333', color: '#f3f3f2' }}
                            formatter={(value: number) => {
                                return parseFloat(value.toFixed(2));
                            }}
                        />
                        <Bar dataKey="totalHours" fill="#d1cd8e" barSize={30}>
                            <LabelList dataKey="totalHours" position="top"
                                formatter={(value: number) => parseFloat(value.toFixed(2))}
                                fontSize={16}
                            />
                        </Bar>
                        <Line type="linear" dataKey="totalHours" stroke="#a7b798"
                            strokeWidth={2} dot={true} />
                    </ComposedChart>
                </div>
            </div>
        </div>
    );
}
