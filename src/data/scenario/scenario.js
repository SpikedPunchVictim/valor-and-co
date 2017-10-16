import uuid from 'uuid/v4'
import { pullRandom } from '@/data/random'
import range from 'lodash.range'
import awful from 'awful'
import { Creature } from '@/data/creature'
import { ScenarioRunner } from '@/data/scenario/index'

/*------------------------------------------------------------------------*/
export const RunState = { }
RunState.NotStarted = 'NotStarted'
RunState.Stopped = 'Stopped'
RunState.Running = 'Running'
RunState.Completed = 'Completed'

export const ScenarioLifetime = {
   RunOnce: 'RunOnce',
   RunForever: 'RunForever'
}

class IScenarioLifetime {
   //...
}

/*------------------------------------------------------------------------
 * 
 *----------------------------------------------------------------------*/
export class Scene {
   constructor() {
      this.creatures = []
      this.items = []
   }
}

let ScenarioId = 0

/*------------------------------------------------------------------------
 * 
 *----------------------------------------------------------------------*/
export class Scenario {
   constructor(type) {
      this.type = type
      this.lifetime = ScenarioLifetime.RunOnce
      this.name = `${awful.random()} ${type.name}`
      this.uuid = uuid()
      //this.name = `Scenario ${++ScenarioId}`
      this.sceneCount = 10

      this.creatureStats = {
         scene: { min: 0, max: 1 } 
      }

      this.scenes = []
      this.creatures = []
      this.items = []

      this.run = null
   }

   toJSON() {
      return {
         type: this.type,
         lifetime: this.lifetime,
         name: this.name,
         uuid: this.uuid || uuid(),
         sceneCount: this.sceneCount,
         creatureStats: this.creatureStats,
         scenes: this.scenes,
         creatures: this.creatures,
         items: this.items,
         run: this.run
      }      
   }

   static fromJSON(obj) {
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

   static isRunning(scenario) {
      return ScenarioRunner.isRunning(scenario)
   }

   static isStopped(scenario) {
      return ScenarioRunner.isStopped(scenario)
   }

   static isCompleted(scenario) {
      return ScenarioRunner.isCompleted(scenario)
   }

   static champions(scenario) {
      return scenario.run == null ? [] : scenario.run.champions
   }

   static addCreature(scenario, type) {
      if(scenario.creatures.indexOf(type) >= 0) {
         return
      }

      scenario.creatures.push(type)
   }

   static addItem(scenario, type) {
      if(scenario.items.indexOf(type) >= 0) {
         return
      }

      scenario.items.push(type)
   }

   static generate(scenario) {
      // Setup the rooms
      scenario.scenes = []

      range(scenario.sceneCount)
         .forEach(i => scenario.scenes.push(new Scene()))

      // Fill the dungeon with 33% of each creature
      let creatureCount = scenario.creatures.length == 0 ? 0 : Math.floor(scenario.sceneCount * 0.3)

      console.log('---------------------------------------------------')
      console.log(`Generating Scenario:`)
      console.log(`      Scenes: ${scenario.sceneCount}`)
      console.log(`   Creatures: ${creatureCount}`)
      console.log('---------------------------------------------------')    

      let fullScenes = []
      let areScenesFull = false

      for(let i = 0; i < creatureCount; ++i) {
         let creature = pullRandom(scenario.creatures)
         let scene = pullRandom(scenario.scenes, scn => scn.creatures.length < scenario.creatureStats.scene.max)

         if(scene == null) {
            break
         }

         scene.creatures.push(new Creature(creature))
      }   
   }

   static start(scenario, champions) {
      console.dir(scenario)
      if(Scenario.isRunning(scenario)) {
         return
      }

      if(Scenario.isStopped(scenario)) {
         let runner = ScenarioRunner.create(scenario, champions)
         return runner.continue()
      }

      // Note: Supporting unlimited runs
      if(Scenario.isCompleted(scenario)) {
         let runner = ScenarioRunner.create(scenario, champions)
         return runner.start()
      }

      let runner = ScenarioRunner.create(scenario, champions)
      return runner.start()
   }

   static stop(scenario) {
      if(scenario.run == null) {
         return
      }

      let runner = ScenarioRunner.get(scenario)

      if(runner == null) {
         return
      }

      return runner.stop()
   }

   static continue(scenario) {
      if(Scenario.isRunning(scenario)) {
         return
      }

      if(Scenario.isCompleted(scenario)) {
         return
      }

      let runner = ScenarioRunner.get(scenario)

      if(runner == null) {
         return
      }

      return runner.start()
   }
}