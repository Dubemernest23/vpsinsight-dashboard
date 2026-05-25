const POLL_INTERVAL = 5000;

export const startPolling = (server, onSuccess, onError) => {
  const poll = async () => {
    try {
      const res = await fetch(`${server.url}/stats`, {
        headers: { Authorization: `Bearer ${server.token}` },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      onSuccess(data);
    } catch {
        // network failure or bad response — mark server unreachable
      onError();
    }
  };

  poll(); // immediate first fetch
  const intervalId = setInterval(poll, POLL_INTERVAL);
  return intervalId;
};

export const stopPolling = (intervalId) => {
  if (intervalId) clearInterval(intervalId);
};