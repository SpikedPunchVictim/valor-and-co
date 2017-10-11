import { EventEmitter } from 'events'
import { randomInt, pullRandom } from '@/data/random'
import range from 'lodash.range'
import awful from 'awful'
import { Creature } from '@/data/creature'
import { subscribe, unsubscribe, Timer } from '@/data/timer'
import { inspect } from '@/data/debug'

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

/*------------------------------------------------------------------------
 * 
 *----------------------------------------------------------------------*/
export const ScenarioTypes = {
   ForestPath: {
      name: 'Forest Path'
   },
   Sewer: {
      name: 'Sewer'
   },
   OpenField: {
      name: 'Open Field'
   },
   Manor: {
      name: 'Manor'
   },
   Ruins: {
      name: 'Ruins'
   },
   AncientCity: {
      name: 'Ancient City'
   },
   Hellscape: {
      name: 'Hellscape'
   },
   AngelicWorld: {
      name: 'Angelic World'
   }
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
      scenario.sceneCount = obj.sceneCount
      scenario.creatureStats = obj.creatureStats
      scenario.scenes = obj.scenes
      scenario.creatures = obj.creatures
      scenario.items = obj.items
      scenario.run = obj.run
      return scenario
   }

   static isRunning(scenario) {
      return scenario.run == null ? false : scenario.run.state == RunState.Running
   }

   static isStopped(scenario) {
      return scenario.run == null ? false : scenario.run.state == RunState.Stopped
   }

   static isCompleted(scenario) {
      return scenario.run == null ? false : scenario.run.state == RunState.Completed
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
      if(Scenario.isRunning(scenario)) {
         return
      }

      if(Scenario.isStopped(scenario) && scenario.run != null) {
         let runner = getRunner(scenario.run)
         return runner.continue()
      }

      scenario.run = new ScenarioRun(scenario.sceneCount, champions)
      let runner = getRunner(scenario.run)
      return runner.start()
   }

   static stop(scenario) {
      if(scenario.run == null) {
         return
      }

      let runner = getRunner(scenario.run)
      return runner.stop()
   }

   static continue(scenario) {
      if(Scenario.isCompleted(scenario)) {
         return
      }

      let runner = getRunner(scenario.run)
      return runner.start()
   }
}

//------------------------------------------------------------------------
class ScenarioRun {
   constructor(sceneCount, champions) {
      this.sceneCount = sceneCount
      this.champions = champions.map(ch => ch.name)
      this.sceneIndex = 0

      this.step = 0
      this.stepsPerProgress = 3
      this.state = RunState.Stopped
   }

   static empty() {
      return new ScenarioRun(0, [])
   }
}

let RunnerMap = new Map()

function getRunner(run) {
   let found = RunnerMap.get(run)
   
   if(found === undefined) {
      found= new ScenarioRunner(run)
      RunnerMap.set(run, found)
   }

   return found
}


class ScenarioRunner {
   constructor(run) {
      if(run == null) {
         throw new Error('run must be valid')
      }

      this.run = run
      this._nextHandler = this._next.bind(this)
   }

   start() {
      if(this.run.state == RunState.Running) {
         return
      }

      if(this.run.state == RunState.Completed) {
         this.reset()
      }

      this.run.state = RunState.Running
      Timer.add(this._nextHandler)
   }

   reset() {
      this.run.step = 0
      this.run.sceneIndex = 0
   }

   start() {
      if(this.run.state == RunState.Running) {
         return
      }

      if(this.run.state == RunState.Completed) {
         this.reset()
      }

      this.run.state = RunState.Running
      Timer.add(this._nextHandler)
   }

   stop() {
      Timer.remove(this._nextHandler)
      this.run.state = RunState.Stopped
   }

   continue() {
      if(this.run.state == RunState.Completed) {
         return
      }

      Timer.add(this._nextHandler)
   }

   _next() {
      console.log(`Scene Index (${this.run.step} / ${this.run.stepsPerProgress}): ${this.run.sceneIndex}`)

      if(this.run.step < this.run.stepsPerProgress) {
         this.run.step++
         return
      }

      this.run.step = 0
      this.run.sceneIndex++

      if(this.run.sceneIndex > this.run.sceneCount) {
         this.stop()
         this.run.state = RunState.Completed        
         return
      }
   }
}


/*------------------------------------------------------------------------
 * 
 *----------------------------------------------------------------------
export class ScenarioRun extends EventEmitter {
   constructor(sceneCount, champions) {
      super()

      this.sceneCount = sceneCount
      this.champions = champions.map(ch => ch.name)
      this.sceneIndex = 0

      this.step = 0
      this.stepsPerProgress = 3
      this.state = RunState.Stopped
      this.nextHandler = _ => this._next()// this._next.bind(this)
   }

   static _next(run) {
      console.log(`Scene Index (${run.step} / ${run.stepsPerProgress}): ${run.sceneIndex}`)

      if(run.step < run.stepsPerProgress) {
         run.step++
         return
      }

      run.step = 0
      run.sceneIndex++

      if(run.sceneIndex > run.sceneCount) {
         ScenarioRun.stop(run)
         run.state = RunState.Completed        
         return run.emit(RunState.Completed)
      }
   }

   static reset(run) {
      run.step = 0
      run.sceneIndex = 0
   }

   static start(run) {
      if(run.state == RunState.Running) {
         return
      }

      if(run.state == RunState.Completed) {
         ScenarioRun.reset(run)
      }

      run.state = RunState.Running
      Timer.add(_ => ScenarioRun._next(run))
      run.emit(RunState.Running)
   }

   static stop(run) {
      Timer.remove(this.nextHandler)
      run.state = RunState.Stopped
      run.emit(RunState.Stopped)
   }

   static continue(run) {
      if(run.state == RunState.Completed) {
         return
      }

      Timer.add(_ => ScenarioRun._next(run))
      run.emit(RunState.Running)
   }
   
}
*/