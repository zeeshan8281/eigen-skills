<p align="center">
  <h1 align="center">eigen-skills</h1>
  <p align="center">
    <strong>EigenLayer Agent Skills — Plug-and-play AI agent capabilities for the entire EigenLayer stack</strong>
  </p>
  <p align="center">
    <a href="#installation">Installation</a> •
    <a href="#skills-overview">Skills</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#usage">Usage</a> •
    <a href="#api-reference">API Reference</a>
  </p>
</p>

---

## What is this?

**eigen-skills** is a modular skills package that gives any AI agent instant access to the full EigenLayer ecosystem. Inspired by the [Agent Skills specification](https://github.com/anthropics/skills), it follows the `SKILL.md` standard so agents like Claude Code, OpenClaw, or any compatible framework can discover and use these capabilities automatically.

```bash
npx skills add zeeshan8281/eigen-skills
```

> Think of it like `npm install` but for AI agents — instead of code libraries, you're installing **knowledge and capabilities**.

---

## Skills Overview

| Skill | Emoji | Domain | Data Source |
|-------|-------|--------|-------------|
| [`eigen-restaking`](#eigen-restaking) | 🔄 | Operators, TVL, stakers, deposits, withdrawals | EigenExplorer API |
| [`eigen-avs`](#eigen-avs) | 🛡️ | Actively Validated Services, registrations, operator-sets | EigenExplorer API |
| [`eigen-rewards`](#eigen-rewards) | 💰 | Rewards, APY rankings, yield strategies | EigenExplorer API |
| [`eigen-delegation`](#eigen-delegation) | 🤝 | Delegation events, staker positions, top operators | EigenExplorer API |
| [`eigen-compute`](#eigen-compute) | 🔒 | TEE deployment, attestation, lifecycle management | EigenCompute (ecloud CLI) |
| [`eigen-da`](#eigen-da) | 📦 | Blob storage & retrieval, data availability | EigenDA Proxy |

---

## Architecture

### How Agent Skills Work

```
┌─────────────────────────────────────────────────────────────┐
│                        AI Agent                             │
│  (Claude Code / OpenClaw / Any Agent Skills-compatible)     │
│                                                             │
│  1. User asks: "What are the top EigenLayer operators?"     │
│  2. Agent scans installed skills/                           │
│  3. Matches intent → eigen-restaking/SKILL.md              │
│  4. Reads SKILL.md for instructions                        │
│  5. Executes the appropriate curl/CLI command               │
│  6. Formats and returns results                             │
└──────────────┬──────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────┐
│                     eigen-skills/                            │
│                                                              │
│  skills/                                                     │
│  ├── eigen-restaking/                                        │
│  │   ├── SKILL.md          ← Agent reads this               │
│  │   └── scripts/                                            │
│  │       └── eigen-api.js  ← JS client (optional)           │
│  ├── eigen-avs/                                              │
│  ├── eigen-rewards/                                          │
│  ├── eigen-delegation/                                       │
│  ├── eigen-compute/                                          │
│  └── eigen-da/                                               │
└──────────────┬──────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────┐
│                   EigenLayer Ecosystem                        │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ EigenExplorer │  │ EigenCompute │  │   EigenDA    │       │
│  │   REST API   │  │  (ecloud CLI)│  │   (Proxy)    │       │
│  │              │  │              │  │              │       │
│  │  Operators   │  │  TEE Deploy  │  │  Blob Store  │       │
│  │  AVS         │  │  Attestation │  │  Blob Get    │       │
│  │  Stakers     │  │  KMS Signing │  │  KZG Verify  │       │
│  │  Rewards     │  │  Lifecycle   │  │  Commitment  │       │
│  │  Events      │  │  Monitoring  │  │  Explorer    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│         │                  │                  │               │
│         ▼                  ▼                  ▼               │
│  ┌─────────────────────────────────────────────────┐         │
│  │           EigenLayer Protocol (L1)              │         │
│  │  DelegationManager · StrategyManager · AVSDir   │         │
│  │  AllocationManager · RewardsCoordinator         │         │
│  └─────────────────────────────────────────────────┘         │
└──────────────────────────────────────────────────────────────┘
```

### Data Flow

```
                    ┌─────────────────┐
                    │    User Query   │
                    │ "top operators" │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   AI Agent      │
                    │   reads SKILL.md│
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼─────┐ ┌─────▼──────┐ ┌─────▼──────┐
     │  REST API    │ │ ecloud CLI │ │ DA Proxy   │
     │  (curl)      │ │ (shell)    │ │ (curl)     │
     └────────┬─────┘ └─────┬──────┘ └─────┬──────┘
              │              │              │
     ┌────────▼─────┐ ┌─────▼──────┐ ┌─────▼──────┐
     │ EigenExplorer│ │ EigenCloud │ │  EigenDA   │
     │   Mainnet    │ │   TEE      │ │  Network   │
     └──────────────┘ └────────────┘ └────────────┘
```

---

## Installation

### For AI Agents (Primary Method)

```bash
npx skills add zeeshan8281/eigen-skills
```

This clones the skills into your agent's skill directory. The agent will auto-discover the `SKILL.md` files.

### For Programmatic Use (npm)

```bash
npm install eigen-skills
```

```javascript
const { EigenAPI, AVSAPI, RewardsAPI, DelegationAPI, EigenCompute, EigenDA } = require('eigen-skills');
```

---

## Prerequisites

### Data Skills (restaking, AVS, rewards, delegation)

| Requirement | How to Get |
|-------------|-----------|
| EigenExplorer API Key | Free at [developer.eigenexplorer.com](https://developer.eigenexplorer.com) |
| Set env var | `export EIGEN_API_KEY=your_key` |

### EigenCompute Skill

| Requirement | How to Get |
|-------------|-----------|
| ecloud CLI | `npm install -g @layr-labs/ecloud-cli` |
| Auth | `ecloud auth login` or `ecloud auth generate --store` |

### EigenDA Skill

| Requirement | How to Get |
|-------------|-----------|
| EigenDA Proxy | See [EigenDA Proxy Setup](#eigenda-proxy-setup) below |
| Ethereum RPC | Any Sepolia RPC endpoint |

---

## Usage

### Agent Usage (SKILL.md driven)

When an agent has eigen-skills installed, it reads the `SKILL.md` files to know what to do:

**User:** "What are the top EigenLayer operators by TVL?"
**Agent reads:** `skills/eigen-restaking/SKILL.md`
**Agent runs:**
```bash
curl -s "https://api.eigenexplorer.com/operators?withTvl=true&sortByTvl=desc&take=10" \
  -H "x-api-token: $EIGEN_API_KEY"
```
**Agent formats:** Bold names, TVL in human-readable form, staker counts.

---

**User:** "Deploy my Dockerfile to EigenCompute"
**Agent reads:** `skills/eigen-compute/SKILL.md`
**Agent runs:**
```bash
ecloud compute app deploy
# Selects "Build and deploy from Dockerfile"
# Selects Linux/AMD64
```

---

**User:** "Store this verification proof on EigenDA"
**Agent reads:** `skills/eigen-da/SKILL.md`
**Agent runs:**
```bash
curl -s -X POST "http://127.0.0.1:3100/put?commitment_mode=standard" \
  -H "Content-Type: application/json" \
  -d '{"verified": true, "model": "gpt-oss-120b", "timestamp": "2025-01-01"}'
```

### Programmatic Usage (JavaScript)

```javascript
const { EigenAPI, AVSAPI, RewardsAPI, DelegationAPI, EigenCompute, EigenDA } = require('eigen-skills');

// ─── Restaking Data ─────────────────────────────────
const eigen = new EigenAPI(process.env.EIGEN_API_KEY);

// Ecosystem overview
const metrics = await eigen.getMetrics();
console.log(`Total TVL: ${metrics.tvl}`);
console.log(`Operators: ${metrics.totalOperators}`);
console.log(`Stakers: ${metrics.totalStakers}`);

// Top operators
const ops = await eigen.getOperators({ sortByTvl: 'desc', take: 5 });
ops.data.forEach(op => {
  console.log(`${op.metadataName} — TVL: ${op.tvl?.tvl} — Stakers: ${op.totalStakers}`);
});

// ─── AVS Data ───────────────────────────────────────
const avs = new AVSAPI(process.env.EIGEN_API_KEY);

// All services
const services = await avs.getAllAVS({ sortByTvl: 'desc', take: 10 });

// Operators securing a specific AVS
const avsOps = await avs.getAVSOperators('0xAVS_ADDRESS');

// ─── Rewards & Yield ────────────────────────────────
const rewards = new RewardsAPI(process.env.EIGEN_API_KEY);

// Best yield operators
const topYield = await rewards.getTopOperatorsByAPY(10);

// Rewards for a specific operator
const opRewards = await rewards.getOperatorRewards('0xOPERATOR');

// ─── Delegation ─────────────────────────────────────
const delegation = new DelegationAPI(process.env.EIGEN_API_KEY);

// Most delegated operators
const topDelegated = await delegation.getTopDelegatedOperators(10);

// Staker's delegation position
const stakerInfo = await delegation.getStakerDelegation('0xSTAKER');

// ─── TEE Compute ────────────────────────────────────
const compute = new EigenCompute();

// Check if running inside TEE
const health = compute.healthCheck();
console.log(`Inside TEE: ${health.insideTEE}`);

// Collect attestation (inside TEE container)
const attestation = compute.collectAttestation();
console.log(`App ID: ${attestation.appId}`);
console.log(`KMS Key: ${attestation.kmsKeyFingerprint}`);

// ─── Data Availability ──────────────────────────────
const da = new EigenDA();

// Store data
const commitment = await da.store({
  proof: { verified: true, model: 'gpt-oss-120b' },
  timestamp: new Date().toISOString(),
});
console.log(`Stored! Commitment: ${commitment}`);
console.log(`Explorer: ${da.getExplorerUrl(commitment)}`);

// Retrieve data
const data = await da.retrieve(commitment);
console.log(`Retrieved:`, data);
```

---

## Detailed Skill Reference

### eigen-restaking

🔄 **Query EigenLayer restaking data**

```
Operators ←→ Stakers ←→ Strategies ←→ TVL
     │
     └── Deposits / Withdrawals / Events
```

**Key endpoints:**

| Method | What |
|--------|------|
| `getMetrics()` | Ecosystem-wide TVL, operator count, staker count |
| `getOperators(opts)` | List operators with sorting/filtering |
| `getOperator(address)` | Single operator detail |
| `getStaker(address)` | Staker info and positions |
| `getDeposits()` | Recent deposit events |
| `getWithdrawals()` | Recent withdrawal events |
| `getHistoricalMetrics()` | TVL over time |

**Example queries:**
```bash
# Top 10 operators by TVL
curl -s "https://api.eigenexplorer.com/operators?withTvl=true&sortByTvl=desc&take=10" \
  -H "x-api-token: $EIGEN_API_KEY"

# Search operator by name
curl -s "https://api.eigenexplorer.com/operators?searchByText=p2p&withTvl=true" \
  -H "x-api-token: $EIGEN_API_KEY"

# Staker position
curl -s "https://api.eigenexplorer.com/stakers/0xADDRESS" \
  -H "x-api-token: $EIGEN_API_KEY"
```

---

### eigen-avs

🛡️ **Query Actively Validated Services**

```
AVS (Service)
 ├── Operators (securing it)
 ├── Stakers (delegated via operators)
 ├── Registration Events
 └── Operator-Sets (slashing-era grouping)
```

**Key endpoints:**

| Method | What |
|--------|------|
| `getAllAVS(opts)` | List all AVS with sorting/filtering |
| `getAVS(address)` | Single AVS detail |
| `getAVSOperators(address)` | Operators registered to an AVS |
| `getAVSStakers(address)` | Stakers delegated to an AVS |
| `getAVSRegistrationEvents(address)` | Registration/deregistration events |
| `getAVSOperatorSets(address)` | Operator-sets for an AVS |

---

### eigen-rewards

💰 **Query rewards and yield data**

```
AVS distributes rewards
        │
        ▼
   ┌─────────┐
   │ Operator │ ← takes fee (0-100%)
   └────┬────┘
        │
        ▼
   ┌─────────┐
   │ Staker  │ ← receives remaining rewards
   └─────────┘
```

**Key endpoints:**

| Method | What |
|--------|------|
| `getTopOperatorsByAPY(limit)` | Best yield operators |
| `getTopAVSByAPY(limit)` | Best yield AVS |
| `getOperatorRewards(address)` | Reward strategies for an operator |
| `getStakerRewards(address)` | Rewards earned by a staker |
| `getAVSRewards(address)` | Rewards distributed by an AVS |

---

### eigen-delegation

🤝 **Query delegation relationships**

```
Staker ──delegates──▶ Operator ──registers──▶ AVS
  │                       │
  └── withdrawals         └── operator-sets
```

**Key endpoints:**

| Method | What |
|--------|------|
| `getTopDelegatedOperators(limit)` | Most delegated by staker count |
| `getTopOperatorsByTVL(limit)` | Most capital delegated |
| `getOperatorDelegation(address)` | Operator's full delegation profile |
| `getOperatorStakers(address)` | Stakers delegating to an operator |
| `getStakerDelegation(address)` | Which operator a staker is delegated to |
| `getDelegationEvents()` | Recent delegation/undelegation events |
| `getOperatorSets()` | Operator-sets (slashing-era model) |

---

### eigen-compute

🔒 **Deploy and manage TEE applications**

```
┌─────────────────────────────────────────┐
│            EigenCompute TEE             │
│         (Intel TDX Enclave)             │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │     Your Docker Container       │    │
│  │                                 │    │
│  │  • Encrypted memory             │    │
│  │  • Sealed secrets               │    │
│  │  • KMS signing key              │    │
│  │  • Unique wallet identity       │    │
│  │  • Cryptographic attestation    │    │
│  └─────────────────────────────────┘    │
│                                         │
│  /usr/local/bin/                         │
│  ├── compute-source-env.sh  (secrets)   │
│  ├── kms-signing-public-key.pem         │
│  └── kms-client                         │
└─────────────────────────────────────────┘
```

**Lifecycle:**

```
ecloud auth login
       │
       ▼
ecloud compute app deploy    ← builds Dockerfile in TEE
       │
       ▼
ecloud compute app list      ← check status + IP
       │
       ▼
ecloud compute app logs <id> ← view logs
       │
       ▼
ecloud compute app stop <id> ← pause
       │
       ▼
ecloud compute app terminate <id> ← permanent destroy
```

**Key methods:**

| Method | What |
|--------|------|
| `whoami()` | Check authenticated address |
| `listApps()` | List all deployed apps |
| `getAppInfo(id)` | App status and details |
| `getAppLogs(id)` | View app logs |
| `startApp(id)` / `stopApp(id)` | Lifecycle control |
| `collectAttestation()` | Gather TEE attestation data |
| `computeConfigHash(files)` | Hash config files for integrity proof |

**Known issues:** See [Troubleshooting](#troubleshooting).

---

### eigen-da

📦 **Store and retrieve data blobs**

```
Your App ──POST /put──▶ EigenDA Proxy ──disperse──▶ EigenDA Network
                              │                         │
                         commitment                KZG commitment
                              │                    stored on-chain
                              ▼
                        ┌──────────┐
                        │ Explorer │
                        │ blobs-   │
                        │ sepolia. │
                        │eigenda.  │
                        │ xyz      │
                        └──────────┘

Your App ──GET /get/X──▶ EigenDA Proxy ──retrieve──▶ EigenDA Network
                              │
                         original data
```

**Proxy endpoints:**

| Endpoint | Method | What |
|----------|--------|------|
| `/put?commitment_mode=standard` | POST | Store a blob, returns commitment |
| `/get/<commitment>?commitment_mode=standard` | GET | Retrieve a blob by commitment |
| `/health` | GET | Proxy health check |

**Key methods:**

| Method | What |
|--------|------|
| `store(data)` | Store JSON on EigenDA, returns commitment |
| `retrieve(commitment)` | Retrieve JSON by commitment |
| `getExplorerUrl(commitment)` | Get blob explorer URL |
| `healthCheck()` | Check proxy availability |

**Networks:**

| Network | Disperser RPC | Service Manager |
|---------|---------------|-----------------|
| Sepolia | `disperser-sepolia.eigenda.xyz:443` | `0xD4A7E1Bd8015057293f0D0A557088c286942e84b` |
| Mainnet | `disperser.eigenda.xyz:443` | See EigenLayer docs |

### EigenDA Proxy Setup

```bash
docker run -d \
  --name eigenda-proxy \
  -p 3100:3100 \
  ghcr.io/layr-labs/eigenda-proxy:latest \
  --eigenda.disperser-rpc=disperser-sepolia.eigenda.xyz:443 \
  --eigenda.service-manager-addr=0xD4A7E1Bd8015057293f0D0A557088c286942e84b \
  --eigenda.eth-rpc=YOUR_SEPOLIA_RPC_URL \
  --eigenda.status-query-timeout=45s \
  --eigenda.signer-private-key-hex=YOUR_PRIVATE_KEY \
  --memstore.enabled=false \
  --eigenda.disable-tls=false
```

---

## API Reference

### Constructor Options

#### EigenAPI / AVSAPI / RewardsAPI / DelegationAPI

```javascript
new EigenAPI(apiKey, { network: 'mainnet' | 'holesky' })
```

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `apiKey` | string | **required** | EigenExplorer API key |
| `network` | string | `'mainnet'` | `'mainnet'` or `'holesky'` |

#### EigenDA

```javascript
new EigenDA({ proxyUrl, commitmentMode, timeout })
```

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `proxyUrl` | string | `'http://127.0.0.1:3100'` | EigenDA proxy URL |
| `commitmentMode` | string | `'standard'` | `'standard'` or `'optimistic'` |
| `timeout` | number | `60000` | Request timeout in ms |

#### EigenCompute

```javascript
new EigenCompute()  // No args — wraps ecloud CLI
```

### Pagination

All list endpoints support pagination:

```javascript
const results = await eigen.getOperators({
  skip: 0,     // offset
  take: 12,    // page size (default: 12)
  sortByTvl: 'desc',
});

console.log(results.meta.total);  // total records
console.log(results.meta.skip);   // current offset
console.log(results.meta.take);   // page size
```

### Sorting Options

| Parameter | Valid Values | Available On |
|-----------|-------------|-------------|
| `sortByTvl` | `'asc'` / `'desc'` | Operators, AVS |
| `sortByApy` | `'asc'` / `'desc'` | Operators, AVS |
| `sortByTotalStakers` | `'asc'` / `'desc'` | Operators, AVS |
| `sortByTotalAvs` | `'asc'` / `'desc'` | Operators |
| `searchByText` | any string | Operators, AVS |
| `withTvl` | `true` / `false` | Operators, AVS |

---

## Environment Variables

| Variable | Required For | Description |
|----------|-------------|-------------|
| `EIGEN_API_KEY` | Data skills | EigenExplorer API key |
| `EIGENDA_PROXY_URL` | eigen-da | Proxy URL (default: `http://127.0.0.1:3100`) |
| `EIGENDA_COMMITMENT_MODE` | eigen-da | `standard` or `optimistic` |
| `EIGENDA_TIMEOUT` | eigen-da | Timeout in ms (default: `60000`) |
| `ECLOUD_APP_ID` | eigen-compute | Auto-set inside TEE |

---

## Demo

Run the interactive demo to verify all data skills work:

```bash
EIGEN_API_KEY=your_key npm run demo
```

Sample output:
```
🔄 Eigen Agent Skills — Demo

📡 Health check...
   Status: ✅ Healthy
   EigenLayer TVL: 4,754,266

👥 Top 5 Operators by TVL:
  1. EigenYields — Stakers: 25,700 — AVS: 32
  2. AltLayer — Stakers: 21,826 — AVS: 14
  3. InfStones — Stakers: 21,617 — AVS: 11

🛡️ Top 5 AVS:
  1. Brevis coChain AVS
  2. DIN
  3. Renzo wBTC DVN

💰 Top 5 by APY:
  1. EigenYields — APY: 484.3%
  2. Nodes.Guru — APY: 484.3%

✅ All skills working!
```

---

## Troubleshooting

### Data Skills (EigenExplorer)

| Issue | Fix |
|-------|-----|
| `401 Unauthorized` | Check your `EIGEN_API_KEY` is set correctly |
| Timeout on `withTvl=true` | TVL calculations are expensive — set `withTvl=false` for faster queries, or increase timeout |
| Rate limited | EigenExplorer has rate limits on the free tier — add delays between requests |

### EigenCompute

| Issue | Fix |
|-------|-----|
| `ecloud: command not found` | Run `npm install -g @layr-labs/ecloud-cli` |
| App stuck in `Status: Unknown` | Use "Build from Dockerfile" method instead of "Deploy from registry" |
| `app logs` returns 403 | Known issue — add HTTP logging endpoint in your app as workaround |
| 429 rate limiting after deploy | Wait 30-60 seconds before running `app list` or `app info` |
| IP changes on every deploy | No static IP available — use DNS/webhook updates in your entrypoint |

### EigenDA

| Issue | Fix |
|-------|-----|
| `ECONNREFUSED 127.0.0.1:3100` | Start the EigenDA proxy Docker container |
| Store timeout | Increase `EIGENDA_TIMEOUT` — dispersal can take 30-60s |
| Invalid commitment | Ensure `commitment_mode` matches between store and retrieve |

---

## Project Structure

```
eigen-skills/
├── package.json                  # npm package with "agents" field
├── index.js                      # programmatic entry point (all 6 modules)
├── README.md                     # this file
├── .gitignore
├── .npmignore
├── scripts/
│   └── demo.js                   # interactive demo
└── skills/
    ├── eigen-restaking/          # 🔄 Operators, TVL, stakers
    │   ├── SKILL.md              #    agent instructions
    │   └── scripts/
    │       └── eigen-api.js      #    JS API client
    │
    ├── eigen-avs/                # 🛡️ Actively Validated Services
    │   ├── SKILL.md
    │   └── scripts/
    │       └── avs-api.js
    │
    ├── eigen-rewards/            # 💰 Rewards & APY
    │   ├── SKILL.md
    │   └── scripts/
    │       └── rewards-api.js
    │
    ├── eigen-delegation/         # 🤝 Delegation & operator-sets
    │   ├── SKILL.md
    │   └── scripts/
    │       └── delegation-api.js
    │
    ├── eigen-compute/            # 🔒 TEE deployment & attestation
    │   ├── SKILL.md
    │   └── scripts/
    │       └── compute-api.js
    │
    └── eigen-da/                 # 📦 Blob storage & data availability
        ├── SKILL.md
        └── scripts/
            └── da-api.js
```

---

## How It Compares

| Feature | eigen-skills | Manual curl | Custom SDK |
|---------|-------------|-------------|------------|
| Agent-compatible | ✅ SKILL.md standard | ❌ | ❌ |
| Zero config | ✅ just add API key | ✅ | ❌ needs setup |
| Covers restaking data | ✅ | ✅ manual | ✅ |
| Covers TEE compute | ✅ | ❌ need CLI | ❌ |
| Covers data availability | ✅ | ✅ manual | ❌ |
| Programmatic JS API | ✅ | ❌ | ✅ |
| Works with Claude/OpenClaw | ✅ auto-discovered | ❌ | ❌ |

---

## Contributing

1. Fork the repo
2. Create a new skill directory under `skills/`
3. Add a `SKILL.md` following the [Agent Skills spec](https://github.com/anthropics/skills)
4. Add scripts in `scripts/` for programmatic use
5. Update `index.js` to export the new module
6. PR it

---

## License

MIT

---

<p align="center">
  Built with data from <a href="https://eigenexplorer.com">EigenExplorer</a>, <a href="https://eigencloud.xyz">EigenCloud</a>, and <a href="https://docs.eigenlayer.xyz">EigenDA</a>
</p>
