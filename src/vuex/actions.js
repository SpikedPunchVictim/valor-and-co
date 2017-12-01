import * as types from './mutation-types'
import { Scenario, ScenarioProgress, RunState } from '@/data/scenario/index'
import Runner from '@/data/runner'
import { Timer } from '@/data/timer'

export const init = ({ commit, state }) => {
   commit(types.PLAYER_INIT)
   commit(types.GAME_TIME_START)
}

export const addChampion = ({ commit }, { champ }) => {
   commit(types.PLAYER_ADD_CHAMPION, { champion: champ })
}

export const generateChampion = ({ commit }, type) => {
   commit(types.CHAMPIONS_GENERATE, { type })
}

//------------------------------------------------------------------------
export const startScenario = ({ commit, state }, { scenario, champions }) => {
   console.log('starting')
   Runner.startScenario(state.player.player, scenario, champions)
   commit(types.PLAYER_START_SCENARIO, { scenario, champions })   
}

export const stopScenario = ({ commit }, scenario) => {
   Runner.stopScenario(state.player.player, scenario, champions)
   commit(types.PLAYER_STOP_SCENARIO, { scenario })
}

export const continueScenario = ({ commit }, scenario) => {
   Scenario.continue(scenario)
   commit(types.PLAYER_CONTINUE_SCENARIO, { scenario })
}
