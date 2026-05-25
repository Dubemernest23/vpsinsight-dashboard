import { useEffect, useState } from 'react';
import { useServers } from './store/serverContext';
import AddServerModal from './components/AddServerModal';
import AlertFeed from './components/AlertFeed';
import DocsPage from './components/DocsPage';
import ServerCard from './components/ServerCard';

const App = () => {
  const { servers, stats, history, status, alerts, removeServer } = useServers();
  const [showModal, setShowModal] = useState(false);
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (nextPath) => {
    window.history.pushState({}, '', nextPath);
    setPath(nextPath);
  };

  const isDocs = path === '/docs';

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">VPSInsight</h1>
          <p className="text-gray-500 text-xs mt-0.5">
            {isDocs
              ? 'Setup and alerting guide'
              : servers.length === 0
                ? 'No servers added yet'
                : `Monitoring ${servers.length} server${servers.length > 1 ? 's' : ''}`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigate('/')}
            className={`text-sm px-3 py-2 rounded-lg transition-colors ${
              !isDocs ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-900'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/docs')}
            className={`text-sm px-3 py-2 rounded-lg transition-colors ${
              isDocs ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-900'
            }`}
          >
            Docs
          </button>
          {!isDocs && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + Add Server
            </button>
          )}
        </div>
      </header>

      {isDocs ? (
        <DocsPage />
      ) : (
        <main className="px-6 py-8">
          {servers.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-24 text-center">
              <div className="text-gray-500 text-xs uppercase tracking-wider mb-4">No monitored hosts</div>
              <h2 className="text-gray-300 text-xl font-semibold mb-2">No servers yet</h2>
              <p className="text-gray-500 text-sm mb-6">
                Add your first VPS to start monitoring.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  + Add Server
                </button>
                <button
                  onClick={() => navigate('/docs')}
                  className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  Read Docs
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                {servers.map(server => (
                  <ServerCard
                    key={server.id}
                    server={server}
                    stats={stats[server.id]}
                    history={history[server.id] || []}
                    status={status[server.id]}
                    onRemove={removeServer}
                  />
                ))}
              </div>
              <AlertFeed alerts={alerts} />
            </div>
          )}
        </main>
      )}

      {showModal && <AddServerModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default App;
