import { Wallet } from '@/data/wallet'
import Champion from '@/data/champion'
import { Scenario } from '@/data/scenario/index'

export let GameState = {
   UnlockMancers: 'UnlockMancers',
   UnlockVernin: 'UnlockVernin',
   UnlockKayNyne: 'UnlockKayNyne'
}

export default class Player {
   constructor() {
      this.champions = []

      this.wallet = new Wallet()

      this.scenarios = []
      this.states = []
      this.summoners = []
      this.scenarioRuns = []
      this.timers = {
         runs: []
      }
   }

   toJSON() {
      return {
         champions: this.champions,
         scenarios: this.scenarios,
         states: this.states,
         summoners: this.summoners,
         wallet: this.wallet
      }
   }

   static fromJSON(obj) {
      let player = new Player()
      player.champions = obj.champions.map(ch => Champion.fromJSON(ch, player))
      player.states = obj.states || []

      // Required: Scenario needs champions to be loaded
      player.scenarios = obj.scenarios.map(sc => Scenario.fromJSON(sc, player))
      player.wallet = obj.wallet || new Wallet()
      player.states = obj.states || []
      return player
   }
}