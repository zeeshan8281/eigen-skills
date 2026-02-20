# eigen-skills

**EigenLayer skills for AI agents.** Query restaking data, manage AVS, track rewards, handle delegation, deploy to TEE, and store blobs on DA — powered by [EigenExplorer API](https://docs.eigenexplorer.com), EigenCompute, and EigenDA.

```bash
npx skills add zeeshan8281/eigen-skills
```

## What This Does

Gives any AI agent (Claude, OpenClaw, etc.) the ability to interact with the full EigenLayer stack:

| Skill | What It Does |
|-------|-------------|
| `eigen-restaking` | Operators, stakers, TVL, deposits, withdrawals, ecosystem metrics |
| `eigen-avs` | AVS listings, operators per AVS, stakers per AVS, registration events |
| `eigen-rewards` | Operator rewards, staker rewards, AVS reward distributions, top APY |
| `eigen-delegation` | Delegation events, operator delegation profiles, operator-sets |
| `eigen-compute` | Deploy & manage apps on EigenCompute TEE, attestation, lifecycle |
| `eigen-da` | Store & retrieve data blobs on EigenDA, commitments, proxy management |

## Setup

### For data skills (restaking, AVS, rewards, delegation)

1. **Get a free API key** at [developer.eigenexplorer.com](https://developer.eigenexplorer.com)
2. Set the env var:
   ```bash
   export EIGEN_API_KEY=your_api_key_here
   ```

### For EigenCompute (TEE deployment)

```bash
npm install -g @layr-labs/ecloud-cli
ecloud auth login
```

### For EigenDA (blob storage)

Run the EigenDA proxy:
```bash
docker run -d -p 3100:3100 ghcr.io/layr-labs/eigenda-proxy:latest \
  --eigenda.disperser-rpc=disperser-sepolia.eigenda.xyz:443 \
  --eigenda.service-manager-addr=0xD4A7E1Bd8015057293f0D0A557088c286942e84b \
  --eigenda.eth-rpc=YOUR_SEPOLIA_RPC \
  --eigenda.signer-private-key-hex=YOUR_KEY
```

## How Agents Use It

Once installed, agents discover the `SKILL.md` files automatically. Each skill contains:
- **When to use** — triggers that match user intent
- **How to query** — exact curl/CLI commands
- **Response format** — how to present data
- **Programmatic usage** — JS client for deeper integrations

### Example: "What are the top EigenLayer operators?"

Agent reads `skills/eigen-restaking/SKILL.md` → runs:
```bash
curl -s "https://api.eigenexplorer.com/operators?withTvl=true&sortByTvl=desc&take=10" \
  -H "x-api-token: $EIGEN_API_KEY"
```

### Example: "Deploy my app to EigenCompute"

Agent reads `skills/eigen-compute/SKILL.md` → runs:
```bash
ecloud compute app deploy
```

### Example: "Store this proof on EigenDA"

Agent reads `skills/eigen-da/SKILL.md` → runs:
```bash
curl -s -X POST "http://127.0.0.1:3100/put?commitment_mode=standard" \
  -H "Content-Type: application/json" -d '{"proof": "data"}'
```

## Programmatic Usage

```javascript
const { EigenAPI, AVSAPI, RewardsAPI, DelegationAPI, EigenCompute, EigenDA } = require('eigen-skills');

// Restaking data
const eigen = new EigenAPI('YOUR_API_KEY');
const metrics = await eigen.getMetrics();
const topOps = await eigen.getOperators({ sortByTvl: 'desc', take: 10 });

// AVS data
const avs = new AVSAPI('YOUR_API_KEY');
const services = await avs.getAllAVS({ sortByTvl: 'desc' });

// Rewards
const rewards = new RewardsAPI('YOUR_API_KEY');
const topYield = await rewards.getTopOperatorsByAPY(10);

// Delegation
const delegation = new DelegationAPI('YOUR_API_KEY');
const topDelegated = await delegation.getTopDelegatedOperators(10);

// TEE Compute
const compute = new EigenCompute();
const attestation = compute.collectAttestation();

// Data Availability
const da = new EigenDA();
const commitment = await da.store({ key: 'value' });
const data = await da.retrieve(commitment);
```

## Demo

```bash
EIGEN_API_KEY=your_key npm run demo
```

## Project Structure

```
eigen-skills/
├── package.json
├── index.js
├── scripts/demo.js
└── skills/
    ├── eigen-restaking/      🔄 Operators, TVL, stakers
    │   ├── SKILL.md
    │   └── scripts/eigen-api.js
    ├── eigen-avs/            🛡️ Actively Validated Services
    │   ├── SKILL.md
    │   └── scripts/avs-api.js
    ├── eigen-rewards/        💰 Rewards & APY
    │   ├── SKILL.md
    │   └── scripts/rewards-api.js
    ├── eigen-delegation/     🤝 Delegation & operator-sets
    │   ├── SKILL.md
    │   └── scripts/delegation-api.js
    ├── eigen-compute/        🔒 TEE deployment & attestation
    │   ├── SKILL.md
    │   └── scripts/compute-api.js
    └── eigen-da/             📦 Blob storage & data availability
        ├── SKILL.md
        └── scripts/da-api.js
```

## License

MIT
