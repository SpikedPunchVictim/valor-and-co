export const championTypes = state => state.champions.types
export const generateChampion = state => type => state.champions.generateChampion(type)
export const wallet = state => state.player.player == null ? null : state.player.player.wallet
export const champions = state => state.player.player == null ? [] : state.player.player.champions

//------------------------------------------------------------------------
export const availableChampions = state => {
   let player = state.player.player
   let scenarios = player.scenarios
   let champions = player.champions

   let unavailable = scenarios
      .filter(sc => sc.isRunning || sc.isStopped)
      .reduce((set, sc) => {
         sc.champions.forEach(ch => set.add(ch))
         return set
      }, new Set())

   unavailable = Array.from(unavailable)

   return champions
      .map(ch => ch.name)
      .filter(ch => unavailable.indexOf(ch) < 0)
      .map(name => champions.find(ch => ch.name == name))
}

//------------------------------------------------------------------------
export const player = state => state.player.player

//------------------------------------------------------------------------
export const scenarios = state => {
   if(state.player.player && state.player.player.scenarios) {
      return state.player.player.scenarios
   }
   return []
}

//------------------------------------------------------------------------
export const getScenarioChampions = state => scenario => {
   if(scenario.run == null) {
      return []
   }

   return scenario.run.champions.reduce((all, name) => {
      let found = state.player.player.champions.find(ch => ch.name === name)

      if(found) {
         all.push(found)
      }

      return all
   }, [])
}

// export const mainCounter = state => state.counters.main
// export const selected = state => state.selected.selected
// export const lastSavePath = state => state.application.lastSavePath
// export const project = state => state.affinity.project
// export const affinity = state => state.affinity.project
// export const typeNames = state => state.affinity.typeNames 