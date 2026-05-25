import { useCallback, useState, useEffect, useRef } from 'react';
import { startPolling, stopPolling } from '../services/poller';
import { evaluateAlerts, sendAlert } from '../services/alerts';
import { ServerContext } from './serverContext';

const STORAGE_KEY = 'vpsinsight_servers';
const ALERT_LOG_LIMIT = 50;

export const ServerProvider = ({ children }) => {
  const [servers, setServers] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [stats, setStats] = useState({});      // { [serverId]: latestStatsObject }
  const [history, setHistory] = useState({});  // { [serverId]: [...last 30 polls] }
  const [status, setStatus] = useState({});    // { [serverId]: 'ok' | 'warning' | 'unreachable' }
  const [alerts, setAlerts] = useState([]);

  const pollersRef = useRef({});
  const alertStatesRef = useRef({});

  const recordAlert = useCallback((alert) => {
    setAlerts(prev => [alert, ...prev].slice(0, ALERT_LOG_LIMIT));
  }, []);

  const handleAlerts = useCallback((server, data) => {
    const currentAlerts = evaluateAlerts(server, data);
    const serverAlertStates = alertStatesRef.current[server.id] || {};
    const activeKeys = new Set(currentAlerts.map(alert => alert.metric));

    currentAlerts.forEach(alert => {
      const previousSeverity = serverAlertStates[alert.metric];
      serverAlertStates[alert.metric] = alert.severity;

      if (previousSeverity === alert.severity || (previousSeverity === 'critical' && alert.severity === 'warning')) {
        return;
      }

      recordAlert({ ...alert, deliveryStatus: 'sending' });
      sendAlert(server, alert)
        .then(() => {
          setAlerts(prev => prev.map(item => (
            item.id === alert.id ? { ...item, deliveryStatus: 'sent' } : item
          )));
        })
        .catch((error) => {
          setAlerts(prev => prev.map(item => (
            item.id === alert.id
              ? { ...item, deliveryStatus: 'failed', error: error.message }
              : item
          )));
        });
    });

    Object.keys(serverAlertStates).forEach(metric => {
      if (!activeKeys.has(metric)) {
        delete serverAlertStates[metric];
      }
    });

    alertStatesRef.current[server.id] = serverAlertStates;
    return currentAlerts.some(alert => alert.severity === 'warning' || alert.severity === 'critical');
  }, [recordAlert]);

  const updateStats = useCallback((server, data) => {
    const hasActiveAlerts = handleAlerts(server, data);

    setStats(prev => ({ ...prev, [server.id]: data }));
    setHistory(prev => {
      const existing = prev[server.id] || [];
      const updated = [...existing, data].slice(-30);
      return { ...prev, [server.id]: updated };
    });
    setStatus(prev => ({ ...prev, [server.id]: hasActiveAlerts ? 'warning' : 'ok' }));
  }, [handleAlerts]);

  const markUnreachable = useCallback((serverId) => {
    setStatus(prev => ({ ...prev, [serverId]: 'unreachable' }));
  }, []);

  const addServer = (server) => {
    const newServer = { ...server, id: crypto.randomUUID() };
    setServers(prev => {
      const updated = [...prev, newServer];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeServer = (serverId) => {
    stopPolling(pollersRef.current[serverId]);
    delete pollersRef.current[serverId];
    delete alertStatesRef.current[serverId];

    setServers(prev => {
      const updated = prev.filter(s => s.id !== serverId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    setStats(prev => { const s = { ...prev }; delete s[serverId]; return s; });
    setHistory(prev => { const h = { ...prev }; delete h[serverId]; return h; });
    setStatus(prev => { const st = { ...prev }; delete st[serverId]; return st; });
  };

  // Keep pollers in sync with the current server list without restarting existing ones.
  useEffect(() => {
    servers.forEach(server => {
      if (!pollersRef.current[server.id]) {
        pollersRef.current[server.id] = startPolling(
          server,
          (data) => updateStats(server, data),
          () => markUnreachable(server.id)
        );
      }
    });

    const activeServerIds = new Set(servers.map(server => server.id));
    Object.keys(pollersRef.current).forEach(serverId => {
      if (!activeServerIds.has(serverId)) {
        stopPolling(pollersRef.current[serverId]);
        delete pollersRef.current[serverId];
      }
    });
  }, [servers, updateStats, markUnreachable]);

  // Stop everything when the provider unmounts.
  useEffect(() => {
    return () => {
      Object.values(pollersRef.current).forEach(stopPolling);
      pollersRef.current = {};
    };
  }, []);

  return (
    <ServerContext.Provider value={{ servers, stats, history, status, alerts, addServer, removeServer }}>
      {children}
    </ServerContext.Provider>
  );
};
