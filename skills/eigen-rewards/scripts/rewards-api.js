/**
 * EigenLayer Rewards API Client
 *
 * Data source: EigenExplorer REST API
 * Covers: rewards per operator, rewards per staker, reward strategies
 */

const axios = require('axios');

const MAINNET = 'https://api.eigenexplorer.com';
const HOLESKY = 'https://api-holesky.eigenexplorer.com';

class RewardsAPI {
    constructor(apiKey, { network = 'mainnet' } = {}) {
        if (!apiKey) throw new Error('EigenExplorer API key required. Get one free at https://developer.eigenexplorer.com');
        this.client = axios.create({
            baseURL: network === 'holesky' ? HOLESKY : MAINNET,
            headers: {
                'x-api-token': apiKey,
                'Content-Type': 'application/json',
            },
            timeout: 30000,
        });
    }

    // ─── Global Rewards ───────────────────────────────────

    /**
     * Get all rewards data.
     * @param {object} opts
     */
    async getRewards(opts = {}) {
        const { data } = await this.client.get('/rewards', {
            params: { skip: opts.skip || 0, take: opts.take || 12 },
        });
        return data;
    }

    // ─── Operator Rewards ─────────────────────────────────

    /**
     * Get rewards info for a specific operator.
     * Returns the reward strategies and tokens the operator receives.
     * @param {string} operatorAddress
     */
    async getOperatorRewards(operatorAddress) {
        const { data } = await this.client.get(`/operators/${operatorAddress}/rewards`);
        return data;
    }

    // ─── Staker Rewards ───────────────────────────────────

    /**
     * Get staker rewards by address.
     * @param {string} stakerAddress
     */
    async getStakerRewards(stakerAddress) {
        const { data } = await this.client.get(`/stakers/${stakerAddress}/rewards`);
        return data;
    }

    // ─── AVS Rewards ──────────────────────────────────────

    /**
     * Get rewards distributed by a specific AVS.
     * @param {string} avsAddress
     */
    async getAVSRewards(avsAddress) {
        const { data } = await this.client.get(`/avs/${avsAddress}/rewards`);
        return data;
    }

    // ─── Convenience Queries ──────────────────────────────

    /**
     * Get the top operators sorted by APY (best yield first).
     * @param {number} [limit=10]
     */
    async getTopOperatorsByAPY(limit = 10) {
        const { data } = await this.client.get('/operators', {
            params: {
                withTvl: 'true',
                sortByApy: 'desc',
                take: limit,
                skip: 0,
            },
        });
        return data;
    }

    /**
     * Get top AVS sorted by APY.
     * @param {number} [limit=10]
     */
    async getTopAVSByAPY(limit = 10) {
        const { data } = await this.client.get('/avs', {
            params: {
                withTvl: 'true',
                sortByApy: 'desc',
                take: limit,
                skip: 0,
            },
        });
        return data;
    }
}

module.exports = RewardsAPI;
