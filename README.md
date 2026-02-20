# eigen-agent-skills

**EigenLayer data skills for AI agents.** Query restaking, AVS, rewards, and delegation data — powered by [EigenExplorer API](https://docs.eigenexplorer.com).

```bash
npx skills add eigen-agent-skills
```

## What This Does

Gives any AI agent (Claude, OpenClaw, etc.) the ability to query live EigenLayer on-chain data:

| Skill | What It Queries |
|-------|----------------|
| `eigen-restaking` | Operators, stakers, TVL, deposits, withdrawals, ecosystem metrics |
| `eigen-avs` | AVS listings, operators per AVS, stakers per AVS, registration events |
| `eigen-rewards` | Operator rewards, staker rewards, AVS reward distributions, top APY |
| `eigen-delegation` | Delegation events, operator delegation profiles, operator-sets |

## Setup

1. **Get a free API key** at [developer.eigenexplorer.com](https://developer.eigenexplorer.com)

2. **Set the env var:**
   ```bash
   export EIGEN_API_KEY=your_api_key_here
   ```

3. **Install the skills:**
   ```bash
   npx skills add eigen-agent-skills
   ```

   Or for programmatic use:
   ```bash
   npm install eigen-agent-skills
   ```

## How Agents Use It

Once installed, agents discover the `SKILL.md` files automatically. Each skill contains:
- **When to use** — triggers that match user intent
- **How to query** — exact curl commands with the right endpoints
- **Response format** — how to present data to users
- **Programmatic usage** — JS client for deeper integrations

### Example: User asks "What are the top EigenLayer operators?"

The agent reads `skills/eigen-restaking/SKILL.md`, finds the relevant curl command, and runs:

```bash
curl -s "https://api.eigenexplorer.com/operators?withTvl=true&sortByTvl=desc&take=10" \
  -H "x-api-token: $EIGEN_API_KEY"
```

Then formats the response with bold names, TVL, staker counts.

## Programmatic Usage

```javascript
const { EigenAPI, AVSAPI, RewardsAPI, DelegationAPI } = require('eigen-agent-skills');

const eigen = new EigenAPI('YOUR_API_KEY');
const avs = new AVSAPI('YOUR_API_KEY');
const rewards = new RewardsAPI('YOUR_API_KEY');
const delegation = new DelegationAPI('YOUR_API_KEY');

// Top operators
const ops = await eigen.getOperators({ sortByTvl: 'desc', take: 10 });

// All AVS
const services = await avs.getAllAVS({ sortByTvl: 'desc' });

// Best yields
const topYield = await rewards.getTopOperatorsByAPY(10);

// Most delegated
const topDelegated = await delegation.getTopDelegatedOperators(10);
```

## Demo

```bash
EIGEN_API_KEY=your_key npm run demo
```

## Project Structure

```
eigen-agent-skills/
├── package.json            # npm package with "agents" field
├── index.js                # programmatic entry point
├── scripts/
│   └── demo.js             # demo runner
└── skills/
    ├── eigen-restaking/
    │   ├── SKILL.md         # agent instructions
    │   └── scripts/
    │       └── eigen-api.js # JS API client
    ├── eigen-avs/
    │   ├── SKILL.md
    │   └── scripts/
    │       └── avs-api.js
    ├── eigen-rewards/
    │   ├── SKILL.md
    │   └── scripts/
    │       └── rewards-api.js
    └── eigen-delegation/
        ├── SKILL.md
        └── scripts/
            └── delegation-api.js
```

## Data Source

All data comes from [EigenExplorer API](https://docs.eigenexplorer.com):
- **Mainnet**: `https://api.eigenexplorer.com`
- **Holesky Testnet**: `https://api-holesky.eigenexplorer.com`
- **Auth**: `x-api-token` header with free API key
- **Rate limits**: See [docs](https://docs.eigenexplorer.com/api-reference/rate-limit)

## License

MIT
