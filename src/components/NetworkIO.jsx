const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
};

const NetworkIO = ({ network }) => {
  if (!network) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-xs uppercase tracking-wider">Network</span>
        <span className="text-gray-500 text-xs">{network.interface}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-800 rounded-lg px-3 py-2">
          <p className="text-gray-500 text-xs mb-0.5">↓ IN</p>
          <p className="text-white text-sm font-medium">
            {network.rx_sec != null ? `${formatBytes(network.rx_sec)}/s` : '--'}
          </p>
          <p className="text-gray-600 text-xs">{formatBytes(network.rx_total)} total</p>
        </div>
        <div className="bg-gray-800 rounded-lg px-3 py-2">
          <p className="text-gray-500 text-xs mb-0.5">↑ OUT</p>
          <p className="text-white text-sm font-medium">
            {network.tx_sec != null ? `${formatBytes(network.tx_sec)}/s` : '--'}
          </p>
          <p className="text-gray-600 text-xs">{formatBytes(network.tx_total)} total</p>
        </div>
      </div>
    </div>
  );
};

export default NetworkIO;