import { Scenarios } from '@/data/scenario/scenarios'
import events from '@/data/events'
import { RewardHub } from '@/data/rewards'
import { Scenario, ScenarioRunner } from '@/data/scenario/index'
import { Summoners } from '@/data/summoner'
import Player from '@/data/player'

let ThePlayer = null
let RewardManager = null

events.on('scenario.completed', runner => {
   console.dir(runner)
   console.log(`[states] scenario.completed: ${runner.scenario.name}`)
   if(runner.scenario == Scenarios.SewerRats) {
      if(Player.summoners.indexOf(Summoners.Vernin) < 0) {
         Player.summoners.push(Summoners.Vernin)
      }
   }
})

export function startSystem(player) {
   if(player == null) {
      player = createNewPlayer()
   }

   if(player == null) {
      player = createNewPlayer()
   } else {
      player = Player.fromJSON(JSON.parse(player))
   }

   RewardManager = new RewardHub(player)

   // Start Scenarios
   player.scenarios.forEach(scenario => {
      if(scenario.run != null) {
         let runner = ScenarioRunner.create(scenario, scenario.run.champions)
         runner.begin()
      }
   })

   ThePlayer = player

   return player
}

export function createNewPlayer() {
   let player = new Player()
   player.wallet.gold = 0
   
   // All players have the sewer scenario
   player.scenarios.push(Scenarios.SewerRats)
   return player
}


class State {
   constructor(name) {
      this.name = name
      this.scenarios = []
   }

   addScenario(scenario) {
      this.scenarios.push(scenario)
   }

   addSummoner(summoner) {

   }

   apply(player) {

   }
}

const States = {
   Start: {
      scenarios: {

      }
   }
}

let start = new State('start')
start.addScenario(Scenarios.SewerRats)