import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, ReferenceArea
} from 'recharts';

export const ambientLightData = [
    {
        state: 'On',
        'White TCRT5000L': 4.7,
        'White BPW17N': 4.6,
        'White TEKT5400S': 4.5,
        'Black BPW17N': 2.0,
        'Black TCRT5000L': 1.0,
        'Black TEKT5400S': 0.8,
    },
    {
        state: 'Off',
        'White TCRT5000L': 4.6,
        'White BPW17N': 4.6,
        'White TEKT5400S': 4.4,
        'Black BPW17N': 1.9,
        'Black TCRT5000L': 0.7,
        'Black TEKT5400S': 0.5,
    }
];

export const tcrt5000lSpreadData = [
    { distance: -3.0, '5 mm': 0.7, '10 mm': 0.6, '15 mm': 0.5 },
    { distance: -2.5, '5 mm': 0.7, '10 mm': 0.6, '15 mm': 0.5 },
    { distance: -2.0, '5 mm': 0.7, '10 mm': 0.6, '15 mm': 0.5 },
    { distance: -1.5, '5 mm': 0.8, '10 mm': 0.7, '15 mm': 0.6 },
    { distance: -1.0, '5 mm': 1.5, '10 mm': 1.2, '15 mm': 1.0 },
    { distance: -0.5, '5 mm': 4.2, '10 mm': 3.1, '15 mm': 2.1 },
    { distance: 0.0, '5 mm': 4.6, '10 mm': 3.2, '15 mm': 2.0 },
    { distance: 0.5, '5 mm': 4.1, '10 mm': 3.0, '15 mm': 1.9 },
    { distance: 1.0, '5 mm': 1.3, '10 mm': 1.1, '15 mm': 1.0 },
    { distance: 1.5, '5 mm': 0.8, '10 mm': 0.7, '15 mm': 0.6 },
    { distance: 2.0, '5 mm': 0.7, '10 mm': 0.6, '15 mm': 0.5 },
    { distance: 2.5, '5 mm': 0.7, '10 mm': 0.6, '15 mm': 0.5 },
    { distance: 3.0, '5 mm': 0.7, '10 mm': 0.6, '15 mm': 0.5 },
];

export const allSensorsSpreadData = [
    { distance: -3.0, 'TCRT5000L': 0.7, 'TEK5400S': 0.5, 'BPW17N': 2.0 },
    { distance: -2.5, 'TCRT5000L': 0.7, 'TEK5400S': 0.5, 'BPW17N': 2.0 },
    { distance: -2.0, 'TCRT5000L': 0.7, 'TEK5400S': 0.5, 'BPW17N': 2.0 },
    { distance: -1.5, 'TCRT5000L': 0.8, 'TEK5400S': 0.6, 'BPW17N': 2.0 },
    { distance: -1.0, 'TCRT5000L': 1.5, 'TEK5400S': 0.8, 'BPW17N': 2.1 },
    { distance: -0.5, 'TCRT5000L': 4.2, 'TEK5400S': 4.0, 'BPW17N': 4.5 },
    { distance: 0.0, 'TCRT5000L': 4.6, 'TEK5400S': 4.2, 'BPW17N': 4.6 },
    { distance: 0.5, 'TCRT5000L': 4.1, 'TEK5400S': 3.8, 'BPW17N': 4.0 },
    { distance: 1.0, 'TCRT5000L': 1.3, 'TEK5400S': 0.9, 'BPW17N': 2.0 },
    { distance: 1.5, 'TCRT5000L': 0.8, 'TEK5400S': 0.6, 'BPW17N': 2.0 },
    { distance: 2.0, 'TCRT5000L': 0.7, 'TEK5400S': 0.5, 'BPW17N': 2.0 },
    { distance: 2.5, 'TCRT5000L': 0.7, 'TEK5400S': 0.5, 'BPW17N': 2.0 },
    { distance: 3.0, 'TCRT5000L': 0.7, 'TEK5400S': 0.5, 'BPW17N': 2.0 },
];

const colors = {
    blue: '#3b82f6',
    indigo: '#6366f1',
    emerald: '#10b981',
    rose: '#f43f5e',
    amber: '#f59e0b',
    slate: '#64748b'
};

const gridStroke = "rgba(161, 161, 170, 0.2)";
const axisColor = "#71717a";

const CustomTooltip = ({ active, payload, label, yLabel }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 p-3 rounded-lg shadow-xl text-xs">
                <p className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
                    {label} {yLabel ? yLabel : ''}
                </p>
                <div className="space-y-1">
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-zinc-600 dark:text-zinc-400 font-medium">{entry.name}:</span>
                            </div>
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">{entry.value.toFixed(1)}V</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export const AmbientLightChart = () => {
    return (
        <div className="h-64 sm:h-80 w-full font-sans transition-all duration-300">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ambientLightData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                    <XAxis dataKey="state" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: axisColor, fontWeight: 500 }} dy={10} />
                    <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: axisColor, fontWeight: 500 }} dx={-10} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px', fontWeight: 500 }} className="text-zinc-600 dark:text-zinc-400" />

                    {/* White lines - solid */}
                    <Line type="monotone" dataKey="White TCRT5000L" stroke={colors.emerald} strokeWidth={2.5} dot={{ r: 4, fill: colors.emerald, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="White BPW17N" stroke={colors.blue} strokeWidth={2.5} dot={{ r: 4, fill: colors.blue, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="White TEKT5400S" stroke={colors.indigo} strokeWidth={2.5} dot={{ r: 4, fill: colors.indigo, strokeWidth: 0 }} activeDot={{ r: 6 }} />

                    {/* Black lines - dashed */}
                    <Line type="monotone" dataKey="Black BPW17N" stroke={colors.rose} strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 4, fill: colors.rose, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="Black TCRT5000L" stroke={colors.amber} strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 4, fill: colors.amber, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="Black TEKT5400S" stroke={colors.slate} strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 4, fill: colors.slate, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

const SpreadChartBase = ({ data, lines }) => (
    <div className="h-64 sm:h-72 w-full font-sans transition-all duration-300">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                {/* Black line region overlays */}
                <ReferenceArea x1={-3} x2={-1} fill="#000000" fillOpacity={0.03} className="dark:fill-white dark:fill-opacity-10" />
                <ReferenceArea x1={1} x2={3} fill="#000000" fillOpacity={0.03} className="dark:fill-white dark:fill-opacity-10" />

                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis
                    dataKey="distance"
                    type="number"
                    domain={[-3, 3]}
                    ticks={[-3, -2, -1, 0, 1, 2, 3]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: axisColor, fontWeight: 500 }}
                    dy={10}
                />
                <YAxis
                    domain={[0, 5]}
                    ticks={[0, 1, 2, 3, 4, 5]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: axisColor, fontWeight: 500 }}
                    dx={-10}
                />
                <Tooltip content={<CustomTooltip yLabel="cm" />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px', fontWeight: 500 }} className="text-zinc-600 dark:text-zinc-400" />
                {lines.map((line) => (
                    <Line
                        key={line.key}
                        type="monotone"
                        dataKey={line.key}
                        stroke={line.color}
                        strokeWidth={2.5}
                        dot={{ r: 3.5, fill: line.color, strokeWidth: 0 }}
                        activeDot={{ r: 6 }}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    </div>
);

export const TCRT5000LSpreadChart = () => (
    <SpreadChartBase
        data={tcrt5000lSpreadData}
        lines={[
            { key: '5 mm', color: colors.blue },
            { key: '10 mm', color: colors.rose },
            { key: '15 mm', color: colors.emerald },
        ]}
    />
);

export const AllSensorsSpreadChart = () => (
    <SpreadChartBase
        data={allSensorsSpreadData}
        lines={[
            { key: 'TCRT5000L', color: colors.blue },
            { key: 'TEK5400S', color: colors.emerald },
            { key: 'BPW17N', color: colors.rose },
        ]}
    />
);
