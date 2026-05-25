const formatBytes = (bytes) => {
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`;
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(0)} MB`;
  return `${bytes} B`;
};

const MemoryBar = ({ memory }) => {
  if (!memory) return null;

  const { total, used } = memory;
  const pct = ((used / total) * 100).toFixed(1);
  const color = pct >= 90 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-400' : 'bg-blue-500';

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-gray-400 text-xs uppercase tracking-wider">Memory</span>
        <span className="text-white text-sm font-medium">{pct}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-1.5">
        <div
          className={`${color} h-1.5 rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-gray-500 text-xs mt-1">
        {formatBytes(used)} / {formatBytes(total)}
      </p>
    </div>
  );
};

export default MemoryBar;