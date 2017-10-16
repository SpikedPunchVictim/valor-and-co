import { Wallet } from '@/data/wallet'
import { Champion } from '@/data/champion'
import { Scenario, ScenarioRunner } from '@/data/scenario/index'
import { RewardHub } from '@/data/rewards'

export class Player {
   constructor() {
      this.champions = []

      this.wallet = new Wallet()

      this.scenarios = []
   }

   // get availableChampions() {
   //    // let busyChamps = this.scenarios.reduce((result, scenario) => {
   //    //    scenario.champions.forEach(ch => result.add(ch))
   //    //    return result
   //    // }, new Set())

   //    return this.champions.filter(ch => this.isChampionAvailable(ch))
   // }

   // get busyChampions() {
   //    let set = this.scenarios.reduce((result, scenario) => {
   //       scenario.champions.forEach(ch => result.add(ch))
   //       return result
   //    }, new Set())

   //    return Array.from(set)
   // }

   // isChampionAvailable(champion) {
   //    return this.scenarios.some(sc => {
   //       if(sc.isRunning) {
   //          sc.champions.indexOf(champion) >= 0
   //       }         
   //    })
   // }

   toJSON() {
      return {
         champions: this.champions,
         scenarios: this.scenarios,
         wallet: this.wallet
      }
   }

   static fromJSON(obj) {
      let player = new Player()
      player.champions = obj.champions.map(ch => Champion.fromJSON(ch)),
      player.scenarios = obj.scenarios.map(sc => Scenario.fromJSON(sc)),
      player.wallet = obj.wallet
      return player
   }
}

// TODO: Move this
let RewardManager = null
export function startSystem(player) {
   RewardManager = new RewardHub(player)

   // Start Scenarios
   player.scenarios.forEach(scenario => {
      if(scenario.run != null) {
         let runner = ScenarioRunner.create(scenario, scenario.run.champions)
         runner.begin()
      }
   })
}