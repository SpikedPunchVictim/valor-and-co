import * as types from '../mutation-types'
import Vue from 'vue'
import { Player } from '@/data/player'
import { CreatureTypes } from '@/data/creature'
import { inspect } from '@/data/debug'
import { Scenario, ScenarioTypes, ScenarioLifetime } from '@/data/scenario'
import { Wallet } from '@/data/wallet'

const state = {
   player: null
}

const mutations = {
   [types.PLAYER_INIT](state) {
      let player = Vue.storage.get('player', null)

      if(player == null) {
         state.player = createNewPlayer()
         saveState()
      } else {
         //console.dir(player)
         state.player = Player.fromJSON(JSON.parse(player))
      }   
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
   let scenario = new Scenario(ScenarioTypes.Sewer)
   scenario.name = "The Angry Sewer Rats"
   scenario.lifetime = ScenarioLifetime.RunForever
   Scenario.addCreature(scenario, CreatureTypes.Rat)
   Scenario.generate(scenario)
   player.scenarios.push(scenario)
   return player
}

export default {
   state,
   mutations
}

