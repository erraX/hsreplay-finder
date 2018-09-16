import Vue from 'vue';
import Vuex from 'vuex';
import replays from './modules/replays';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        loading: 0
    },
    modules: {
        replays
    }
});
