import events from '@/data/events'
import { subscribe, unsubscribe, Timer } from '@/data/timer'
import { ScenarioProgress } from '@/data/scenario/scenario-progress'
import { RunState } from '@/data/scenario/scenario'
//import { inspect } from '@/data/debug'

let RunnerMap = new Map()

/**
 * Represents the running state, as it progresses
 */
export class ScenarioRunner {
   constructor(progress) {
      if(progress == null) {
         throw new Error('progress must be valid')
      }

      this.progress = progress
      this._nextHandler = this._next.bind(this)
   }

   get scenario() {
      return this.progress == null ? null : this.progress.scenario
   }

   get champions() {
      return this.progress == null ? [] : this.progress.champions
   }

   //------------------------------------------------------------------------
   static get(scenario) {
      return RunnerMap.get(scenario.uuid)
   }

   //------------------------------------------------------------------------
   static create(scenario, champions) {
      let found = RunnerMap.get(scenario.uuid)
      
      if(found === undefined) {
         let progress = new ScenarioProgress(scenario, champions)
         found = new ScenarioRunner(progress)
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
      if(this.progress.state == RunState.Running) {
         return Timer.add(this._nextHandler)
      }
   }

   //------------------------------------------------------------------------
   start() {
      if(this.progress.state == RunState.Running) {
         return
      }

      if(this.progress.state == RunState.Completed) {
         this.reset()
      }

      this.progress.state = RunState.Running
      Timer.add(this._nextHandler)
   }

   //------------------------------------------------------------------------
   reset() {
      this.progress.step = 0
      this.progress.sceneIndex = 0
   }

   //------------------------------------------------------------------------
   start() {
      if(this.progress.state == RunState.Running) {
         return
      }

      if(this.progress.state == RunState.Completed) {
         this.reset()
      }

      this.progress.state = RunState.Running
      Timer.add(this._nextHandler)
      return this
   }

   //------------------------------------------------------------------------
   stop() {
      Timer.remove(this._nextHandler)
      this.progress.state = RunState.Stopped
      return this
   }

   //------------------------------------------------------------------------
   continue() {
      if(this.progress.state == RunState.Completed) {
         return
      }

      Timer.add(this._nextHandler)
   }

   //------------------------------------------------------------------------
   _next() {
      console.log(`Scene Index (${this.progress.step} / ${this.progress.stepsPerProgress}): ${this.progress.sceneIndex}`)

      if(this.progress.step < this.progress.stepsPerProgress) {
         this.progress.step++
         return
      }

      this.progress.step = 0
      this.progress.sceneIndex++
      events.emit('scenario.sceneprogressed', this)

      if(this.progress.sceneIndex > this.progress.sceneCount) {
         this.stop()
         this.progress.state = RunState.Completed
         events.emit('scenario.completed', this)      
         return
      }
   }
}