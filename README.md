# VPSInsight Dashboard

Lightweight, self-hosted VPS monitoring dashboard. Connects to one or more VPSInsight agents, displays live CPU, memory, disk, network, and process metrics, and fires email alerts when thresholds are exceeded.

**Agent repo:** [vpsinsight-agent](https://github.com/Dubemernest23/vpsinsight-agent)  
**Live demo:** [vpsinsight-dashboard.vercel.app](https://vpsinsight-dashboard.vercel.app)

---

## Features

- Real-time CPU, memory, disk, and network monitoring (polls every 5s)
- Multi-server support — monitor all your VPS servers from one dashboard
- CPU sparkline charts with 30-point history
- Node.js process monitoring per server (via PM2)
- Automatic alert engine — evaluates thresholds on every poll
- Email alerts via Resend (sent through the agent)
- In-dashboard alert feed with severity badges
- Visual server health indicators — green / warning / red
- Persistent server config via `localStorage` — no backend needed
- Responsive, mobile-friendly dark UI
- Built-in docs page at `/docs`

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React + Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| State | React Context + useState |
| Storage | localStorage |
| HTTP | fetch API |

---

## Prerequisites

- Modern browser (Chrome, Firefox, Safari — latest 2 versions)
- For local development: Node.js 18+
- A running [vpsinsight-agent](https://github.com/Dubemernest23/vpsinsight-agent) on each VPS you want to monitor

> **HTTPS note:** If you deploy the dashboard to Vercel, your agent must also be accessible over HTTPS. See the [agent README](https://github.com/Dubemernest23/vpsinsight-agent#3-https-setup) for the Nginx + nip.io + Let's Encrypt setup guide.

---

## Deployment

### Option A — Vercel (Recommended, Free)

1. Fork this repo and push to your GitHub
2. Go to [vercel.com](https://vercel.com), import the repo, and deploy
3. Vercel auto-detects Vite — no config needed
4. Your dashboard is live at a `.vercel.app` URL

### Option B — Self-host on a VPS

```bash
git clone https://github.com/Dubemernest23/vpsinsight-dashboard.git
cd vpsinsight-dashboard
npm install
npm run build
pm2 serve dist 3001 --name vpsinsight-dashboard --spa
```

Accessible at `http://YOUR_VPS_IP:3001`. No HTTPS issue when agent and dashboard are on the same server.

---

## Adding a Server

1. Open the dashboard
2. Click **+ Add Server**
3. Enter:
   - **Name** — e.g. `Hostinger VPS`
   - **URL** — `https://YOUR_VPS_IP.nip.io` (HTTPS) or `http://YOUR_VPS_IP:4000` (self-hosted)
   - **Token** — the `TOKEN` from the agent's `.env`
4. Click **Add Server** — connection is tested before saving
5. Live stats appear within seconds

---

## Alert Thresholds

The alert engine runs automatically. No setup needed.

| Metric | Warning | Critical |
|---|---|---|
| CPU usage | 80% | 90% |
| Memory usage | 80% | 90% |
| Disk usage | 85% | 95% |

When a threshold is breached the Alert Feed updates immediately. If `RESEND_API_KEY` and `ALERT_TO` are configured on the agent, an email is sent automatically.

---

## Local Development

```bash
git clone https://github.com/Dubemernest23/vpsinsight-dashboard.git
cd vpsinsight-dashboard
npm install
npm run dev
```

App runs at `http://localhost:5173`.

---

## Project Structure

```
src/
├── components/
│   ├── ServerCard.jsx       # Per-server stat summary card
│   ├── CPUChart.jsx         # Real-time CPU sparkline
│   ├── MemoryBar.jsx        # RAM usage bar
│   ├── DiskUsage.jsx        # Disk usage per mount
│   ├── NetworkIO.jsx        # Network in/out display
│   ├── ProcessList.jsx      # PM2 process status table
│   ├── AlertFeed.jsx        # In-dashboard alert log
│   └── AddServerModal.jsx   # Server configuration form
├── pages/
│   └── DocsPage.jsx         # Built-in documentation
├── services/
│   ├── poller.js            # Per-server polling logic
│   └── alerts.js            # Threshold evaluation + alert dispatch
├── store/
│   └── ServerContext.jsx    # Server config and stats state
├── utils/
│   └── formatBytes.js       # Shared byte formatting utility
├── App.jsx
└── main.jsx
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Server shows "Unreachable" | Check agent is running (`pm2 status`), port 4000 is open, URL has no trailing slash |
| "Could not reach the agent" on Add Server | Mixed content — agent must be on HTTPS when dashboard is on Vercel. See agent HTTPS setup. |
| CORS error in console | Set `ALLOWED_ORIGINS` in agent `.env` to your exact Vercel URL. Restart agent with `--update-env`. |
| Alert Feed shows "failed" | Check `RESEND_API_KEY` and `ALERT_TO` in agent `.env`. Run `pm2 logs vpsinsight-agent`. |
| Processes not showing | `MONITORED_APPS` in agent `.env` must match exact PM2 process names from `pm2 list`. |

---

## Contributing

PRs and issues welcome. Keep changes focused and follow existing code style.

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit and push
4. Open a pull request

---

## License

MIT — see [LICENSE](LICENSE) for details.

Built by [SideSkripts Technologies](https://github.com/Dubemernest23).