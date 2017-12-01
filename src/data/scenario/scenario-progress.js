import { Scenario } from '@/data/scenario/index'

export class ScenarioProgress {
   constructor(scenario, champions) {
      this.scenario = scenario
      
      // Champions can be Champion objects or an Array of names
      // TODO: Just store Champion ids
      this.champions = champions.map(ch => {
         if(typeof ch === 'object') {
            return ch.uuid
         } else if(typeof ch === 'string') {
            return ch
         }
      })

      this.sceneIndex = 0

      this.step = 0
      this.stepsPerProgress = 3
      this.state = RunState.Stopped
   }  

   get sceneCount() {
      return this.scenario.sceneCount
   }

   toJSON() {
      return {
         scenarioUuid: this.scenario.uuid,
         champions: this.champions,
         sceneIndex: this.sceneIndex,
         step: this.step,
         stepsPerProgress: this.stepsPerProgress,
         state: this.state
      }      
   }

   static fromJSON(obj, player) {
      let scenario = new Scenario(obj.type)
      scenario.lifetime = obj.lifetime
      scenario.name = obj.name
      scenario.uuid = obj.uuid
      scenario.sceneCount = obj.sceneCount
      scenario.creatureStats = obj.creatureStats
      scenario.scenes = obj.scenes
      scenario.creatures = obj.creatures
      scenario.items = obj.items
      scenario.run = obj.run
      return scenario
   }
}
