import CPUChart from './CPUChart';
import MemoryBar from './MemoryBar';
import DiskUsage from './DiskUsage';
import NetworkIO from './NetworkIO';
import ProcessList from './ProcessList';

const formatUptime = (seconds) => {
  if (!seconds) return '--';
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

const ServerCard = ({ server, stats, history, status, onRemove }) => {
  const isOk = status === 'ok';
  const isWarning = status === 'warning';
  const isUnreachable = status === 'unreachable';

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                isOk ? 'bg-green-400' : isUnreachable ? 'bg-red-500' : isWarning ? 'bg-amber-400' : 'bg-gray-600'
              }`}
            />
            <h3 className="text-white font-semibold text-sm">{server.name}</h3>
            {isWarning && (
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                Warning
              </span>
            )}
            {isUnreachable && (
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                Unreachable
              </span>
            )}
          </div>
          {stats?.server && (
            <p className="text-gray-500 text-xs mt-1 ml-4">
              {stats.server.hostname} · {stats.server.distro} · up {formatUptime(stats.server.uptime)}
            </p>
          )}
        </div>
        <button
          onClick={() => onRemove(server.id)}
          className="text-gray-600 hover:text-red-400 text-xs transition-colors ml-2"
          title="Remove server"
        >
          ✕
        </button>
      </div>

      {/* Metrics */}
      {stats ? (
        <>
          <CPUChart history={history} />
          <MemoryBar memory={stats.memory} />
          <DiskUsage disk={stats.disk} />
          <NetworkIO network={stats.network} />
          <ProcessList processes={stats.processes} />
        </>
      ) : (
        <p className="text-gray-600 text-sm">
          {isUnreachable ? 'Last known stats unavailable.' : 'Waiting for first poll...'}
        </p>
      )}
    </div>
  );
};

export default ServerCard;
