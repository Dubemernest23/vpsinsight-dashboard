const formatBytes = (bytes) => {
  if (bytes >= 1099511627776) return `${(bytes / 1099511627776).toFixed(1)} TB`;
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`;
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(0)} MB`;
  return `${bytes} B`;
};

const DiskUsage = ({ disk }) => {
  if (!disk?.length) return null;

  return (
    <div>
      <span className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Disk</span>
      <div className="flex flex-col gap-2">
        {disk.map((mount, i) => {
          const pct = parseFloat(mount.percentage?.toFixed(1) ?? 0);
          const color = pct >= 95 ? 'bg-red-500' : pct >= 85 ? 'bg-amber-400' : 'bg-blue-500';

          return (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-400 text-xs truncate max-w-[60%]">{mount.mount}</span>
                <span className="text-white text-xs font-medium">{pct}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div
                  className={`${color} h-1.5 rounded-full transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-gray-500 text-xs mt-1">
                {formatBytes(mount.used)} / {formatBytes(mount.total)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DiskUsage;