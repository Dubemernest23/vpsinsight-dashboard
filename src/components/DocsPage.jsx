const DASHBOARD_REPO = 'https://github.com/Dubemernest23/vpsinsight-dashboard';
const AGENT_REPO = 'https://github.com/Dubemernest23/vpsinsight-agent';

const Section = ({ title, children }) => (
  <section className="border-t border-gray-800 pt-6">
    <h2 className="text-white text-lg font-semibold mb-3">{title}</h2>
    <div className="text-gray-400 text-sm leading-6 space-y-3">{children}</div>
  </section>
);

const CodeBlock = ({ children }) => (
  <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 overflow-x-auto text-sm text-gray-200">
    <code>{children}</code>
  </pre>
);

const DocsPage = () => {
  return (
    <main className="px-6 py-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">VPSInsight Docs</h1>
        <p className="text-gray-400 mt-3 max-w-2xl">
          VPSInsight is a lightweight, self-hosted VPS monitoring dashboard. The agent runs on each VPS,
          exposes protected system metrics, and the dashboard displays CPU, memory, disk, network,
          process, and alert activity in one place.
        </p>
      </div>

      <div className="space-y-8">
        <Section title="Before You Start">
          <p>You need a VPS with Node.js installed, PM2 for keeping the agent alive, and a Resend account if you want email alerts.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Node.js 18 or newer</li>
            <li>PM2 installed globally on the VPS</li>
            <li>A Resend API key plus verified sender details</li>
            <li>A private bearer token shared by the agent and dashboard</li>
          </ul>
        </Section>

        <Section title="Step 1: Clone And Run The Agent">
          <p>Install the agent on the VPS you want to monitor.</p>
          <CodeBlock>{`git clone ${AGENT_REPO}.git
cd vpsinsight-agent
npm install
cp .env.example .env`}</CodeBlock>
          <p>Set the agent environment values:</p>
          <CodeBlock>{`PORT=4000
TOKEN=replace-with-a-long-random-token
RESEND_API_KEY=re_your_resend_key
ALERT_FROM=alerts@yourdomain.com
ALERT_TO=you@example.com`}</CodeBlock>
          <p>Start it with PM2:</p>
          <CodeBlock>{`pm2 start src/index.js --name vpsinsight-agent
pm2 save
pm2 startup`}</CodeBlock>
        </Section>

        <Section title="Step 2: Clone And Run The Dashboard">
          <p>Run the dashboard locally or deploy it as a static Vite app.</p>
          <CodeBlock>{`git clone ${DASHBOARD_REPO}.git
cd vpsinsight-dashboard
npm install
npm run dev`}</CodeBlock>
          <p>For production:</p>
          <CodeBlock>{`npm run build
npm run preview`}</CodeBlock>
        </Section>

        <Section title="Step 3: Add Your First Server">
          <p>Click Add Server in the dashboard and enter a friendly name, the agent URL, and the bearer token from the agent `.env` file.</p>
          <CodeBlock>{`Name: Production VPS
Agent URL: http://YOUR_VPS_IP:4000
Bearer Token: replace-with-a-long-random-token`}</CodeBlock>
          <p>The dashboard tests `/stats` before saving, so invalid tokens and unreachable agents are caught immediately.</p>
        </Section>

        <Section title="Step 4: Configure Alerts">
          <p>The dashboard evaluates CPU, memory, and disk thresholds after each poll. When a threshold is crossed, it calls the agent `/alert` endpoint and records the result in the alert feed.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>CPU warning at 80%, critical at 90%</li>
            <li>Memory warning at 80%, critical at 90%</li>
            <li>Disk warning at 85%, critical at 95%</li>
          </ul>
          <p>Keep Resend secrets on the agent. Do not expose the Resend API key in a Vite dashboard environment variable, because Vite client variables are bundled into browser code.</p>
        </Section>

        <Section title="GitHub Repos">
          <div className="flex flex-col sm:flex-row gap-3">
            <a className="text-blue-300 hover:text-blue-200 underline" href={AGENT_REPO} target="_blank" rel="noreferrer">VPSInsight Agent</a>
            <a className="text-blue-300 hover:text-blue-200 underline" href={DASHBOARD_REPO} target="_blank" rel="noreferrer">VPSInsight Dashboard</a>
          </div>
        </Section>
      </div>
    </main>
  );
};

export default DocsPage;
