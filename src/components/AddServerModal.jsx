import { useState } from 'react';
import { useServers } from '../store/serverContext';

const AddServerModal = ({ onClose }) => {
  const { addServer } = useServers();
  const [form, setForm] = useState({ name: '', url: '', token: '' });
  const [error, setError] = useState('');
  const [testing, setTesting] = useState(false);
  const [showToken, setShowToken] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async () => {
    const { name, url, token } = form;

    if (!name.trim() || !url.trim() || !token.trim()) {
      setError('All fields are required.');
      return;
    }

    // Test connection before saving
    setTesting(true);
    try {
      const res = await fetch(`${url.replace(/\/$/, '')}/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        setError('Invalid token — check your agent TOKEN.');
        return;
      }

      if (!res.ok) {
        setError(`Agent returned HTTP ${res.status}.`);
        return;
      }

      addServer({ name, url: url.replace(/\/$/, ''), token });
      onClose();
    } catch {
      setError('Could not reach the agent. Check the URL and that port 4000 is open.');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-white text-lg font-semibold mb-5">Add Server</h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Server Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Production VPS"
              className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Agent URL</label>
            <input
              name="url"
              value={form.url}
              onChange={handleChange}
              placeholder="e.g. http://YOUR_VPS_IP:4000"
              className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Bearer Token</label>
            <div className="relative">
              <input
                name="token"
                value={form.token}
                onChange={handleChange}
                type={showToken ? 'text' : 'password'}
                placeholder="Your agent TOKEN from .env"
                className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 pr-16 text-sm focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowToken(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white transition-colors"
              >
                {showToken ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <div className="flex gap-3 mt-2">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-2 text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={testing}
              className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg py-2 text-sm font-medium transition-colors"
            >
              {testing ? 'Testing connection...' : 'Add Server'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddServerModal;
