import {getArchetype, getReplays} from '@/api';
export default {
    state: {
        replays: [],
        filters: {}
    },
    actions: {
        GET_ARCHETYPE({commit, state}, {ids}) {
        },
        GET_REPLAYS({commit, state}, {ids}) {
        }
    },
    getters: {}
};
