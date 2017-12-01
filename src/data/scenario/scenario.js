import uuid from 'uuid/v4'
import { pullRandom } from '@/data/random'
import range from 'lodash.range'
import awful from 'awful'
import { Creature } from '@/data/creature'
import { ScenarioProgress, ScenarioRunner } from '@/data/scenario/index'

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

      this.onComplete = null
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
         items: this.items
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
      return scenario
   }

   /*---------------------------------------------------------------------
    * Determines if a scenario is Running
    *
    * @param {Scenario} scenario 
    *-------------------------------------------------------------------*/
   static isRunning(scenario) {
      return ScenarioRunner.isRunning(scenario)
   }

   /*---------------------------------------------------------------------
    * Determines if a scenario has been Stopped
    *
    * @param {Scenario} scenario 
    *-------------------------------------------------------------------*/
   static isStopped(scenario) {
      return ScenarioRunner.isStopped(scenario)
   }

   /*---------------------------------------------------------------------
    * Determines if a scenario has been Completed
    *
    * @param {Scenario} scenario 
    *-------------------------------------------------------------------*/
   static isCompleted(scenario) {
      return ScenarioRunner.isCompleted(scenario)
   }

   /*---------------------------------------------------------------------
    * Add a creature to a scenario
    *
    * @param {Scenario} scenario 
    *-------------------------------------------------------------------*/
   static addCreature(scenario, type) {
      if(scenario.creatures.indexOf(type) >= 0) {
         return
      }

      scenario.creatures.push(type)
   }

   /*---------------------------------------------------------------------
    * Add an item to a scenario
    *
    * @param {Scenario} scenario 
    *-------------------------------------------------------------------*/
   static addItem(scenario, type) {
      if(scenario.items.indexOf(type) >= 0) {
         return
      }

      scenario.items.push(type)
   }

   /*---------------------------------------------------------------------
    * Generate the scenario based on the properties that have been set
    *
    * @param {Scenario} scenario 
    *-------------------------------------------------------------------*/
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

   /*---------------------------------------------------------------------
    * Start a scenario 
    *
    * @param {Scenario} scenario 
    *-------------------------------------------------------------------*/
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

   /*---------------------------------------------------------------------
    * Stop a scenario
    *
    * @param {Scenario} scenario 
    *-------------------------------------------------------------------*/
   static stop(scenario) {
      let runner = ScenarioRunner.get(scenario)

      if(runner == null) {
         return
      }

      return runner.stop()
   }

   /*---------------------------------------------------------------------
    * Continue a scenario that was once started
    *
    * @param {Scenario} scenario 
    *-------------------------------------------------------------------*/
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