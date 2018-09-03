import Vue from 'vue'
import Router from 'vue-router'
import Replays from '@/components/Replays'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Replays',
      component: Replays
    }
  ]
})
