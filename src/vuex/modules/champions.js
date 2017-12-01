import * as types from '../mutation-types'
import superb from 'superb'
import catNames from 'cat-names'
import capitalize from 'lodash.capitalize'
import { randomInt } from '@/data/random'
import { ChampionTypes } from '@/data/champion'
import Champion from '@/data/champion'

function createChampion(type) {
   return new Champion(`${capitalize(superb())} ${catNames.random()}`, type)
}

const state = {
   types: Object.keys(ChampionTypes),
   champions: [],
   generateChampion: createChampion
}

const mutations = {
   [types.CHAMPIONS_GET_TYPES]() {
      return Object.keys(ChampionTypes)
   },

   [types.CHAMPIONS_GENERATE](state, { type }) {
      console.log(`Creating Champion of type ${type}`)
      let champ = createChampion(type)
      console.dir(champ)
      return champ
   }
}

export default {
   state,
   mutations
}