const severityStyles = {
  critical: 'bg-red-500/20 text-red-300 border-red-500/30',
  warning: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
};

const deliveryStyles = {
  sending: 'text-blue-300',
  sent: 'text-green-300',
  failed: 'text-red-300',
};

const formatTime = (value) => {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(value));
  } catch {
    return '--';
  }
};

const AlertFeed = ({ alerts }) => {
  return (
    <aside className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-white text-sm font-semibold">Alert Feed</h2>
          <p className="text-gray-500 text-xs mt-0.5">Latest threshold events</p>
        </div>
        <span className="text-gray-400 text-xs bg-gray-800 px-2 py-1 rounded-full">
          {alerts.length}
        </span>
      </div>

      {alerts.length === 0 ? (
        <p className="text-gray-500 text-sm">No alerts yet.</p>
      ) : (
        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
          {alerts.map(alert => (
            <div key={alert.id} className="border border-gray-800 rounded-lg p-3 bg-gray-950/50">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-white text-sm font-medium">{alert.serverName}</p>
                  <p className="text-gray-400 text-xs mt-1">{alert.message}</p>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${severityStyles[alert.severity]}`}>
                  {alert.severity}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className="text-gray-600">{formatTime(alert.createdAt)}</span>
                <span className={deliveryStyles[alert.deliveryStatus] || 'text-gray-500'}>
                  {alert.deliveryStatus}
                </span>
              </div>
              {alert.error && (
                <p className="text-red-300 text-xs mt-2">{alert.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};

export default AlertFeed;
