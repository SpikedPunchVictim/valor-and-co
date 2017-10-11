import * as types from '../mutation-types'
import { start, stop, subscribe, unsubscribe, Timer } from '@/data/timer'

const mutations = {
   [types.GAME_TIME_START](state) {
      Timer. start()
   },

   [types.GAME_TIME_STOP](state) {
      Timer.stop()
   },

   [types.GAME_TIME_SUBSCRIBE](state, { handler }) {
      //subscribe(handler)
      Timer.add(handler)
   },

   [types.GAME_TIME_UNSUBSCRIBE](state, { handler }) {
      //unsubscribe(handler)
      Timer.remove(handler)    
   }
}

export default {
   mutations
}