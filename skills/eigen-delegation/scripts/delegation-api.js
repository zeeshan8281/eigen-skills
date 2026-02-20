/**
 * EigenLayer Delegation API Client
 *
 * Data source: EigenExplorer REST API
 * Covers: delegation events, operator-sets, staker ↔ operator delegation tracking
 */

const axios = require('axios');

const MAINNET = 'https://api.eigenexplorer.com';
const HOLESKY = 'https://api-holesky.eigenexplorer.com';

class DelegationAPI {
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

    // ─── Delegation Events ────────────────────────────────

    /**
     * Get recent delegation/undelegation events across the protocol.
     * @param {object} opts
     * @param {string} [opts.type] - 'DELEGATION' | 'UNDELEGATION'
     * @param {number} [opts.skip=0]
     * @param {number} [opts.take=12]
     */
    async getDelegationEvents(opts = {}) {
        const params = {
            skip: opts.skip || 0,
            take: opts.take || 12,
        };
        if (opts.type) params.type = opts.type;

        const { data } = await this.client.get('/events', { params });
        return data;
    }

    // ─── Operator Delegation Details ──────────────────────

    /**
     * Get an operator's full delegation profile (stakers, shares, strategies, TVL).
     * @param {string} operatorAddress
     */
    async getOperatorDelegation(operatorAddress) {
        const { data } = await this.client.get(`/operators/${operatorAddress}`, {
            params: { withTvl: 'true' },
        });
        return {
            address: data.address,
            name: data.metadataName,
            totalStakers: data.totalStakers,
            totalAvs: data.totalAvs,
            shares: data.shares,
            tvl: data.tvl,
            avsRegistrations: data.avsRegistrations,
        };
    }

    /**
     * Get all stakers delegating to a specific operator.
     * @param {string} operatorAddress
     * @param {object} opts
     */
    async getOperatorStakers(operatorAddress, opts = {}) {
        const { data } = await this.client.get(`/operators/${operatorAddress}/stakers`, {
            params: { skip: opts.skip || 0, take: opts.take || 12 },
        });
        return data;
    }

    // ─── Staker Delegation ────────────────────────────────

    /**
     * Get which operator a staker has delegated to and their position details.
     * @param {string} stakerAddress
     */
    async getStakerDelegation(stakerAddress) {
        const { data } = await this.client.get(`/stakers/${stakerAddress}`);
        return data;
    }

    /**
     * Get a staker's withdrawal history (partial/full undelegations).
     * @param {string} stakerAddress
     * @param {object} opts
     */
    async getStakerWithdrawals(stakerAddress, opts = {}) {
        const { data } = await this.client.get(`/stakers/${stakerAddress}/withdrawals`, {
            params: { skip: opts.skip || 0, take: opts.take || 12 },
        });
        return data;
    }

    // ─── Operator-Sets ────────────────────────────────────

    /**
     * Get all operator-sets (the new slashing-era grouping model).
     * @param {object} opts
     */
    async getOperatorSets(opts = {}) {
        const { data } = await this.client.get('/operator-sets', {
            params: { skip: opts.skip || 0, take: opts.take || 12 },
        });
        return data;
    }

    /**
     * Get a specific operator-set by AVS address + operatorSetId.
     * @param {string} avsAddress
     * @param {string} operatorSetId
     */
    async getOperatorSet(avsAddress, operatorSetId) {
        const { data } = await this.client.get(`/operator-sets/${avsAddress}/${operatorSetId}`);
        return data;
    }

    // ─── Top Delegated Operators ──────────────────────────

    /**
     * Get operators sorted by total stakers (most delegated first).
     * @param {number} [limit=10]
     */
    async getTopDelegatedOperators(limit = 10) {
        const { data } = await this.client.get('/operators', {
            params: {
                withTvl: 'true',
                sortByTotalStakers: 'desc',
                take: limit,
                skip: 0,
            },
        });
        return data;
    }

    /**
     * Get operators sorted by TVL (most capital delegated first).
     * @param {number} [limit=10]
     */
    async getTopOperatorsByTVL(limit = 10) {
        const { data } = await this.client.get('/operators', {
            params: {
                withTvl: 'true',
                sortByTvl: 'desc',
                take: limit,
                skip: 0,
            },
        });
        return data;
    }
}

module.exports = DelegationAPI;
