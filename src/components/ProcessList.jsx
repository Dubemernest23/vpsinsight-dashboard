const formatBytes = (bytes) => {
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`;
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(0)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
};

const statusColor = (status) => {
  switch (status) {
    case 'running': return 'bg-green-500/20 text-green-400';
    case 'stopping':
    case 'stopped': return 'bg-gray-500/20 text-gray-400';
    case 'errored': return 'bg-red-500/20 text-red-400';
    default: return 'bg-amber-500/20 text-amber-400';
  }
};

const ProcessList = ({ processes }) => {
  if (!processes?.length) return null;

  return (
    <div>
      <span className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Processes</span>
      <div className="flex flex-col gap-1.5">
        {processes.map((proc, i) => (
          <div key={i} className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2">
            <div>
              <p className="text-white text-xs font-medium">{proc.name}</p>
              <p className="text-gray-500 text-xs">
                CPU: {proc.cpu != null ? proc.cpu.toFixed(1) : '--'}% | MEM: {proc.memory != null ? formatBytes(proc.memory) : '--'}
              </p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(proc.status)}`}>
              {proc.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessList;
