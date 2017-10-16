import events from '@/data/events'
import { subscribe, unsubscribe, Timer } from '@/data/timer'
import { RunState } from '@/data/scenario/scenario'
//import { inspect } from '@/data/debug'

let RunnerMap = new Map()

/**
 * Represents the running state, as it progresses
 */
export class ScenarioRunner {
   constructor(run) {
      if(run == null) {
         throw new Error('run must be valid')
      }

      this.run = run
      this._nextHandler = this._next.bind(this)
   }

   //------------------------------------------------------------------------
   static get(scenario) {
      return RunnerMap.get(scenario.uuid)
   }

   //------------------------------------------------------------------------
   static create(scenario, champions) {
      let found = RunnerMap.get(scenario.uuid)
      
      if(found === undefined) {
         // Preserve any initial state
         if(scenario.run == null) {
            scenario.run = new ScenarioRun(scenario.sceneCount, champions)
         }

         found = new ScenarioRunner(scenario.run)
         RunnerMap.set(scenario.uuid, found)
      }
   
      return found
   }

   //------------------------------------------------------------------------
   static isRunning(scenario) {
      if(scenario.run == null) {
         return false
      }

      if(scenario.run.state != RunState.Running) {
         return false
      }

      if(scenario.run.state == RunState.Running && !RunnerMap.has(scenario.uuid)) {
         return false
      }

      return true
   }

   //------------------------------------------------------------------------
   static isStopped(scenario) {
      return scenario.run == null || scenario.run.state == RunState.Stopped
   }

   //------------------------------------------------------------------------
   static isCompleted(scenario) {
      return scenario.run == null ? false : scenario.run.state == RunState.Completed
   }

   /*---------------------------------------------------------------------
    * Start after being reloaded from a saved state
    *-------------------------------------------------------------------*/
   begin() {
      if(this.run.state == RunState.Running) {
         return Timer.add(this._nextHandler)
      }
   }

   //------------------------------------------------------------------------
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

   //------------------------------------------------------------------------
   reset() {
      this.run.step = 0
      this.run.sceneIndex = 0
   }

   //------------------------------------------------------------------------
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

   //------------------------------------------------------------------------
   stop() {
      Timer.remove(this._nextHandler)
      this.run.state = RunState.Stopped
   }

   //------------------------------------------------------------------------
   continue() {
      if(this.run.state == RunState.Completed) {
         return
      }

      Timer.add(this._nextHandler)
   }

   //------------------------------------------------------------------------
   _next() {
      console.log(`Scene Index (${this.run.step} / ${this.run.stepsPerProgress}): ${this.run.sceneIndex}`)

      if(this.run.step < this.run.stepsPerProgress) {
         this.run.step++
         return
      }

      this.run.step = 0
      this.run.sceneIndex++
      events.emit('scenario.sceneprogressed', this)

      if(this.run.sceneIndex > this.run.sceneCount) {
         this.stop()
         this.run.state = RunState.Completed
         events.emit('scenario.completed', this)      
         return
      }
   }
}