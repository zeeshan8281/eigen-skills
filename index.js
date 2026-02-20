/**
 * eigen-agent-skills — EigenLayer data skills for AI agents
 *
 * Install:  npx skills add eigen-agent-skills
 * Usage:    Agents discover SKILL.md files in skills/ automatically.
 *           For programmatic use, require this module.
 */

const EigenAPI = require('./skills/eigen-restaking/scripts/eigen-api');
const AVSAPI = require('./skills/eigen-avs/scripts/avs-api');
const RewardsAPI = require('./skills/eigen-rewards/scripts/rewards-api');
const DelegationAPI = require('./skills/eigen-delegation/scripts/delegation-api');

module.exports = {
    EigenAPI,
    AVSAPI,
    RewardsAPI,
    DelegationAPI,
};
