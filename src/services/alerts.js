export const ALERT_THRESHOLDS = {
  cpu: { warning: 80, critical: 90 },
  memory: { warning: 80, critical: 90 },
  disk: { warning: 85, critical: 95 },
};

const getSeverity = (value, threshold) => {
  if (value >= threshold.critical) return 'critical';
  if (value >= threshold.warning) return 'warning';
  return null;
};

const buildAlert = ({ server, metric, label, value, threshold, severity }) => ({
  id: crypto.randomUUID(),
  serverId: server.id,
  serverName: server.name,
  metric,
  label,
  value,
  threshold,
  severity,
  message: `${label} is ${value.toFixed(1)}% on ${server.name}`,
  createdAt: new Date().toISOString(),
});

export const evaluateAlerts = (server, stats) => {
  if (!stats) return [];

  const alerts = [];
  const cpuValue = stats.cpu?.usage;
  const memoryValue = stats.memory?.total
    ? (stats.memory.used / stats.memory.total) * 100
    : null;

  if (cpuValue != null) {
    const severity = getSeverity(cpuValue, ALERT_THRESHOLDS.cpu);
    if (severity) {
      alerts.push(buildAlert({
        server,
        metric: 'cpu',
        label: 'CPU usage',
        value: cpuValue,
        threshold: ALERT_THRESHOLDS.cpu[severity],
        severity,
      }));
    }
  }

  if (memoryValue != null) {
    const severity = getSeverity(memoryValue, ALERT_THRESHOLDS.memory);
    if (severity) {
      alerts.push(buildAlert({
        server,
        metric: 'memory',
        label: 'Memory usage',
        value: memoryValue,
        threshold: ALERT_THRESHOLDS.memory[severity],
        severity,
      }));
    }
  }

  stats.disk?.forEach((mount) => {
    const diskValue = mount.percentage;
    if (diskValue == null) return;

    const severity = getSeverity(diskValue, ALERT_THRESHOLDS.disk);
    if (severity) {
      alerts.push(buildAlert({
        server,
        metric: `disk:${mount.mount}`,
        label: `Disk usage (${mount.mount})`,
        value: diskValue,
        threshold: ALERT_THRESHOLDS.disk[severity],
        severity,
      }));
    }
  });

  return alerts;
};

export const sendAlert = async (server, alert) => {
  const res = await fetch(`${server.url}/alert`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${server.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(alert),
  });

  if (!res.ok) {
    throw new Error(`Alert endpoint returned HTTP ${res.status}`);
  }
};
