import * as types from '../mutation-types'
import Vue from 'vue'
import Player from '@/data/player'
import { Creatures } from '@/data/creature'
import { inspect } from '@/data/debug'
import { Scenario, Scenarios, ScenarioTypes, ScenarioLifetime } from '@/data/scenario/index'
import { Wallet } from '@/data/wallet'
import events from '@/data/events'
import { load as serializeLoad } from '@/data/serialize'

const state = {
   player: null
}

const mutations = {
   [types.PLAYER_INIT](state) {
      let player = Vue.storage.get('player', null)
      
      state.player = serializeLoad(player)
      events.on('scenario.sceneprogressed', saveState)
      events.on('scenario.completed', saveState)

      saveState()
   },

   [types.PLAYER_SAVE](state) {
      saveState()
   },

   [types.PLAYER_ADD_CHAMPION](state, { champion }) {
      state.player.champions.push(champion)
      saveState()
   },

   [types.PLAYER_START_SCENARIO](state, { scenario, champions }) {
      //state.player.startScenario(scenario, champions)
      saveState()
   },

   [types.PLAYER_STOP_SCENARIO](state, { scenario }) {
      saveState()
   },
}

function saveState() {
   console.dir(state.player)
   Vue.storage.set('player', JSON.stringify(state.player))
   //inspect('Saving Player State', state.player)
}

function loadState() {
   let player = Vue.storage.get('player', 'false')

   if(player === 'false') {
      player = createNewPlayer()
   } else {
      player = Player.fromJSON(JSON.parse(player))
   }

   state.player = player
}

function createNewPlayer() {
   let player = new Player()
   player.wallet.gold = 0

   // All players have the sewer scenario
   player.scenarios.push(Scenarios.SewerRats)
   return player
}

export default {
   state,
   mutations
}

