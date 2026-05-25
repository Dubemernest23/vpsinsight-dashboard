const AGENT_REPO     = 'https://github.com/Dubemernest23/vpsinsight-agent';
const DASHBOARD_REPO = 'https://github.com/Dubemernest23/vpsinsight-dashboard';

const Section = ({ title, children }) => (
  <section className="border-t border-gray-800 pt-6">
    <h2 className="text-white text-lg font-semibold mb-3">{title}</h2>
    <div className="text-gray-400 text-sm leading-7 space-y-3">{children}</div>
  </section>
);

const CodeBlock = ({ children }) => (
  <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 overflow-x-auto text-sm text-gray-200 my-2">
    <code>{children}</code>
  </pre>
);

const Inline = ({ children }) => (
  <code className="bg-gray-800 text-gray-200 text-xs px-1.5 py-0.5 rounded font-mono">
    {children}
  </code>
);

const DocsPage = () => {
  return (
    <main className="px-6 py-8 max-w-3xl mx-auto">

      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          VPSInsight Documentation
        </h1>
        <p className="text-gray-400 mt-3 leading-7">
          VPSInsight is a lightweight, self-hosted VPS monitoring and alerting tool.
          It consists of an <strong className="text-gray-300">agent</strong> that runs
          on each server and a <strong className="text-gray-300">dashboard</strong> that
          connects to all your agents and displays live metrics. Email alerts fire
          automatically when CPU, memory, or disk thresholds are exceeded.
        </p>
      </div>

      <div className="space-y-8">

        {/* Prerequisites */}
        <Section title="Prerequisites">
          <p>Before starting, make sure you have the following on each VPS you want to monitor:</p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>Node.js 18+ — <a href="https://nodejs.org" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300">nodejs.org</a></li>
            <li>PM2 installed globally: <Inline>npm install -g pm2</Inline></li>
            <li>Git installed</li>
            <li>A <a href="https://resend.com" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300">Resend</a> account and API key (free, no domain required — for email alerts)</li>
          </ul>
        </Section>

        {/* Step 1 */}
        <Section title="Step 1 — Install the Agent on a VPS">
          <p>SSH into your VPS and run the following:</p>
          <CodeBlock>{`ssh user@YOUR_VPS_IP

git clone https://github.com/Dubemernest23/vpsinsight-agent.git
cd vpsinsight-agent
npm install
cp .env.example .env
nano .env`}</CodeBlock>

          <p>Set the following values in <Inline>.env</Inline>:</p>
          <CodeBlock>{`PORT=4000
TOKEN=your-generated-secret-token
MONITORED_APPS=your-app-name
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
ALERT_TO=your-email@gmail.com
ALERT_FROM=VPSInsight <onboarding@resend.dev>
ALLOWED_ORIGINS=https://your-dashboard-url.com`}</CodeBlock>

          <p>
            <Inline>MONITORED_APPS</Inline> is a comma-separated list of PM2 process names
            to track. Check your process names with <Inline>pm2 list</Inline>.
          </p>

          <p>Generate a secure token:</p>
          <CodeBlock>{`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`}</CodeBlock>

          <p>Start the agent with PM2:</p>
          <CodeBlock>{`pm2 start index.js --name vpsinsight-agent
pm2 save
pm2 startup`}</CodeBlock>

          <p>
            Run the command that <Inline>pm2 startup</Inline> outputs — it enables
            auto-start on server reboot.
          </p>

          <p>Open port 4000 if needed:</p>
          <CodeBlock>{`sudo ufw allow 4000`}</CodeBlock>

          <p>Verify the agent is running:</p>
          <CodeBlock>{`curl http://localhost:4000/health
curl -H "Authorization: Bearer your-token" http://localhost:4000/stats`}</CodeBlock>
        </Section>

        {/* Step 2 */}
        <Section title="Step 2 — Deploy the Dashboard">
          <p>The dashboard only needs to be deployed once. You can use Vercel (recommended) or self-host it.</p>

          <h3 className="text-white font-medium mt-4 mb-2">Option A — Vercel (Recommended, Free)</h3>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>Fork or clone the <a href={DASHBOARD_REPO} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300">dashboard repo</a> and push it to your GitHub</li>
            <li>Go to <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300">vercel.com</a>, import the repo, and deploy</li>
            <li>No environment variables needed for the dashboard itself</li>
          </ol>

          <h3 className="text-white font-medium mt-6 mb-2">Option B — Self-host on a VPS</h3>
          <CodeBlock>{`git clone https://github.com/Dubemernest23/vpsinsight-dashboard.git
cd vpsinsight-dashboard
npm install
npm run build
pm2 serve dist 3001 --name vpsinsight-dashboard --spa`}</CodeBlock>
          <p>The dashboard will be accessible at <Inline>http://YOUR_VPS_IP:3001</Inline>.</p>
        </Section>

        {/* Step 3 */}
        <Section title="Step 3 — Add Your First Server">
          <ol className="list-decimal pl-5 space-y-2">
            <li>Open the dashboard in your browser</li>
            <li>Click <strong className="text-gray-300">+ Add Server</strong></li>
            <li>Fill in:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong className="text-gray-300">Name</strong> — e.g. <Inline>Hostinger VPS</Inline></li>
                <li><strong className="text-gray-300">URL</strong> — <Inline>http://YOUR_VPS_IP:4000</Inline></li>
                <li><strong className="text-gray-300">Token</strong> — the <Inline>TOKEN</Inline> value from the agent's <Inline>.env</Inline></li>
              </ul>
            </li>
            <li>Click <strong className="text-gray-300">Add Server</strong> — the dashboard will test the connection before saving</li>
            <li>Live stats will appear on the server card within seconds</li>
          </ol>
          <p>Repeat for each VPS you want to monitor. Each server needs its own agent running and its own unique token.</p>
        </Section>

        {/* Step 4 — Alerts */}
        <Section title="Step 4 — Alerts & Notifications">
          <p>
            The alert engine runs automatically in the dashboard. No configuration needed —
            it evaluates every poll response against the following default thresholds:
          </p>

          <table className="w-full mt-3 text-sm border border-gray-800 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-gray-300">
                <th className="text-left px-4 py-2 font-medium">Metric</th>
                <th className="text-left px-4 py-2 font-medium">Warning</th>
                <th className="text-left px-4 py-2 font-medium">Critical</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['CPU usage',    '80%', '90%'],
                ['Memory usage', '80%', '90%'],
                ['Disk usage',   '85%', '95%'],
              ].map(([metric, warn, crit], i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-gray-950' : 'bg-gray-900'}>
                  <td className="px-4 py-2 text-gray-300">{metric}</td>
                  <td className="px-4 py-2 text-amber-400">{warn}</td>
                  <td className="px-4 py-2 text-red-400">{crit}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-4">
            When a threshold is breached, the Alert Feed on the right side of the dashboard
            updates immediately. If <Inline>RESEND_API_KEY</Inline> and <Inline>ALERT_TO</Inline> are
            set in the agent's <Inline>.env</Inline>, an email notification is also sent
            via the agent's <Inline>POST /alert</Inline> endpoint.
          </p>
        </Section>

        {/* Step 5 */}
        <Section title="Step 5 — Adding More Servers">
          <p>To monitor additional VPS servers, repeat Step 1 on each new server — then add them in the dashboard under <strong className="text-gray-300">+ Add Server</strong>.</p>
          <p>
            Generate a <strong className="text-gray-300">unique token</strong> for each VPS.
            Never reuse the same token across multiple servers.
          </p>
          <CodeBlock>{`# On each new VPS
git clone https://github.com/Dubemernest23/vpsinsight-agent.git
cd vpsinsight-agent
npm install
cp .env.example .env
# Edit .env with a fresh token
pm2 start index.js --name vpsinsight-agent
pm2 save`}</CodeBlock>
        </Section>

        {/* Troubleshooting */}
        <Section title="Troubleshooting">
          <div className="space-y-4">
            {[
              {
                problem: 'Dashboard shows "Unreachable" immediately after adding a server',
                fix: 'Check that the agent is running (pm2 status), port 4000 is open (ufw allow 4000), and the URL does not have a trailing slash.',
              },
              {
                problem: '"Invalid token" when connecting',
                fix: 'The TOKEN in Add Server must exactly match the TOKEN value in the agent\'s .env. Tokens are case-sensitive.',
              },
              {
                problem: 'CORS error in the browser console',
                fix: 'Set ALLOWED_ORIGINS in the agent .env to your dashboard\'s URL e.g. https://your-dashboard.vercel.app. Restart the agent after saving.',
              },
              {
                problem: 'Alert Feed shows "failed" for email alerts',
                fix: 'Check that RESEND_API_KEY and ALERT_TO are set in the agent .env. Run pm2 logs vpsinsight-agent to see the exact error.',
              },
              {
                problem: 'Processes section is empty',
                fix: 'Set MONITORED_APPS in the agent .env using the exact PM2 process names shown in pm2 list. Names are case-sensitive.',
              },
            ].map(({ problem, fix }, i) => (
              <div key={i} className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                <p className="text-gray-200 font-medium mb-1">{problem}</p>
                <p className="text-gray-500">{fix}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Repos */}
        <Section title="GitHub Repositories">
          <p>Both repos are open source under the MIT licence. Clone, fork, and customise freely.</p>
          <div className="flex flex-col sm:flex-row gap-4 mt-3">
            <a
              href={AGENT_REPO}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 transition-colors"
            >
              <span className="text-white font-medium text-sm">vpsinsight-agent</span>
              <span className="text-gray-500 text-xs">Express · systeminformation · PM2</span>
            </a>
            <a
              href={DASHBOARD_REPO}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 transition-colors"
            >
              <span className="text-white font-medium text-sm">vpsinsight-dashboard</span>
              <span className="text-gray-500 text-xs">React · Vite · Tailwind · Recharts</span>
            </a>
          </div>
        </Section>

      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-800 text-center">
        <p className="text-gray-600 text-xs">
          Built by{' '}
          <a href="https://github.com/Dubemernest23" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-gray-400">
            SideSkripts Technologies
          </a>
        </p>
      </div>

    </main>
  );
};

export default DocsPage;