import { AreaChart, Area, Tooltip, ResponsiveContainer, YAxis } from 'recharts';

const CPUChart = ({ history }) => {
  const data = history.map((snap, i) => ({
    index: i,
    cpu: parseFloat(snap.cpu?.usage?.toFixed(1) ?? 0),
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-gray-400 text-xs uppercase tracking-wider">CPU</span>
        <span className="text-white text-sm font-medium">
          {data.length ? `${data[data.length - 1].cpu}%` : '--'}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={50}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis domain={[0, 100]} hide />
          <Tooltip
            contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '6px', fontSize: '11px' }}
            labelFormatter={() => 'CPU'}
            formatter={(val) => [`${val}%`, '']}
          />
          <Area
            type="monotone"
            dataKey="cpu"
            stroke="#3b82f6"
            strokeWidth={1.5}
            fill="url(#cpuGradient)"
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CPUChart;