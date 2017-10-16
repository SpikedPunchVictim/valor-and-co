export class ScenarioRun {
   constructor(sceneCount, champions) {
      this.sceneCount = sceneCount
      
      // Champions can be Champion objects or an Array of names
      // TODO: Just store Champion ids
      this.champions = champions.map(ch => {
         if(typeof ch === 'object') {
            return ch.name
         } else if(typeof ch === 'string') {
            return ch
         }
      })

      this.sceneIndex = 0

      this.step = 0
      this.stepsPerProgress = 3
      this.state = RunState.Stopped
   }

   static empty() {
      return new ScenarioRun(0, [])
   }
}
