---
name: eigen-compute
description: "Deploy and manage applications on EigenCompute TEE (Trusted Execution Environment) — deploy, monitor, attest, and manage lifecycle via ecloud CLI"
version: 1.0.0
metadata:
  emoji: "🔒"
  tags: ["eigenlayer", "eigencompute", "tee", "tdx", "deploy", "attestation"]
user-invocable: true
---

# EigenCompute Skill

Deploy, manage, and attest applications running inside EigenCompute TEE (Trusted Execution Environment) powered by Intel TDX.

## What is EigenCompute?

EigenCompute runs your Docker containers inside **hardware-isolated Intel TDX TEEs**. Each deployed app gets:
- **Encrypted memory** — the host cannot read your app's data
- **Unique wallet** — cryptographic identity per deployment
- **KMS signing key** — at `/usr/local/bin/kms-signing-public-key.pem`
- **Sealed secrets** — env vars are unsealed inside the TEE at runtime
- **Cryptographic attestation** — verifiable proof of what code is running

## Prerequisites

Install the ecloud CLI:
```bash
npm install -g @layr-labs/ecloud-cli
```

## When to use this skill

Use when the user asks about:
- Deploying to EigenCompute / TEE / EigenCloud
- Checking app status, logs, or info
- TEE attestation or verification
- Managing EigenCompute apps (start, stop, terminate)
- Dockerfile setup for TEE deployment
- KMS signing or sealed secrets
- EigenCompute troubleshooting

## How to use

### Authentication

```bash
# Login with existing key
ecloud auth login

# Or generate a new key
ecloud auth generate --store

# Check who you're authenticated as
ecloud auth whoami
```

### Create a new app from template

```bash
ecloud compute app create --name my-app --language typescript
# Languages: typescript, python, golang, rust
```

### Deploy from Dockerfile (recommended)

```bash
ecloud compute app deploy
```
- Select **"Build and deploy from Dockerfile"** (most reliable method)
- Choose **Linux/AMD64** (standard TEE architecture)
- Estimated cost: ~0.008 ETH per deploy (Sepolia testnet)

**IMPORTANT:** "Deploy from registry" method is unreliable — apps often end up in `Status: Unknown` with no error. Always use "Build from Dockerfile".

### Check app status

```bash
# List all your apps
ecloud compute app list

# Get info for a specific app
ecloud compute app info <APP_ID>

# View logs (may require admin permissions)
ecloud compute app logs <APP_ID>
```

### Set environment variables (sealed secrets)

```bash
ecloud compute app env set \
  MY_SECRET="value" \
  API_KEY="key"
```

**Note:** You cannot inspect sealed secrets after they're set. Verify through your app's logging.

### App lifecycle

```bash
# Start a stopped app
ecloud compute app start <APP_ID>

# Stop a running app
ecloud compute app stop <APP_ID>

# Terminate (permanent — creates new App ID on redeploy)
ecloud compute app terminate <APP_ID>
```

### Upgrade (update running app)
```bash
ecloud compute app upgrade <APP_ID>
```

## TEE Container Internals

Inside the TEE container, these are available:

| Path | What |
|------|------|
| `/usr/local/bin/compute-source-env.sh` | Sources sealed env vars at runtime |
| `/usr/local/bin/kms-signing-public-key.pem` | KMS signing public key |
| `/usr/local/bin/kms-client` | KMS signing client binary |

### Entrypoint pattern for TEE

```bash
#!/bin/bash
# Source sealed secrets
if [ -f "/usr/local/bin/compute-source-env.sh" ]; then
    source /usr/local/bin/compute-source-env.sh
fi

# Start your app
node server.js
```

### Dockerfile pattern for TEE

```dockerfile
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
ENTRYPOINT ["bash", "entrypoint.sh"]
```

## TEE Attestation

Collect attestation data to prove your app runs in a real TEE:

```javascript
const crypto = require('crypto');
const fs = require('fs');

function getAttestation() {
    return {
        appId: process.env.ECLOUD_APP_ID || null,
        platform: 'Intel TDX (EigenCompute)',
        kmsKeyFingerprint: getKMSFingerprint(),
        nodeVersion: process.version,
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
    };
}

function getKMSFingerprint() {
    try {
        const pem = fs.readFileSync('/usr/local/bin/kms-signing-public-key.pem', 'utf-8');
        return 'sha256:' + crypto.createHash('sha256').update(pem.trim()).digest('hex');
    } catch { return null; }
}
```

Verify at: `https://verify-sepolia.eigencloud.xyz`

## Known Issues & Workarounds

- **429 rate limiting** — The API rate-limits aggressively after deploys. Wait 30-60s before running `app list` or `app info`.
- **Logs 403** — Even with "admin viewable" selected, `app logs` may return 403. Add logging within your app and expose it via HTTP as a workaround.
- **IP changes on every deploy** — No static IP. Don't hardcode IPs in DNS or webhooks.
- **App ID changes on terminate + redeploy** — No persistent identity across deploys.
- **Secret rotation requires full redeploy** — No way to update env vars without terminate + deploy.

## Programmatic Usage

```javascript
const EigenCompute = require('eigen-skills/skills/eigen-compute/scripts/compute-api');
const compute = new EigenCompute();

// These are wrappers around the ecloud CLI
const apps = await compute.listApps();
const info = await compute.getAppInfo('APP_ID');
const attestation = compute.collectAttestation();
```
