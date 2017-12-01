import { createNewPlayer } from '@/data/states'
import Champion from '@/data/champion'
import Player from '@/data/player'
import { Scenario, ScenarioRunner, ScenarioProgress } from '@/data/scenario/index'
import { Wallet } from '@/data/wallet'
import { RewardHub } from '@/data/rewards'

let RewardManager = null

export function load(data) {
   let player = data

   if(player == null) {
      player = createNewPlayer()
   } else {
      player = loadPlayer(JSON.parse(player))
   }

   RewardManager = new RewardHub(player)

   // Start Scenarios
   player.scenarios.forEach(scenario => {
      if(scenario.run != null) {
         let runner = ScenarioRunner.create(scenario, scenario.run.champions)
         runner.begin()
      }
   })

   return player
}

export function save(player) {
   let obj = {}
   savePlayer(player, obj)
   return obj
}


/*------------------------------------------------------------------------
 * Save Player
 *----------------------------------------------------------------------*/
function savePlayer(player, obj) {
   /*
      this.champions = []

      this.wallet = new Wallet()

      this.scenarios = []
      this.states = []
      this.summoners = []
      this.scenarioRuns = []


   */

   saveWallet(player, obj)
   player.champions.forEach(ch => saveChampion(ch, obj))
   player.scenarios.forEach(sc => saveScenario(sc, obj))
   player.scenarioRuns.forEach(run => saveScenarioRun(run, obj))
   obj.states = player.states
   obj.summoners = player.summoners
   return
}

/*------------------------------------------------------------------------
 * Load Player
 *----------------------------------------------------------------------*/
function loadPlayer(obj) {
   let player = new Player()

   // Temp storage for loading
   // Key: uuid
   // Value: Object
   let db = {
      champions: new Map(),
      scenarios: new Map()
   }

   loadWallet(player, obj)

   if(obj.champions) {
      player.champions = obj.champions.map(ch => loadChampion(ch, db))
   }

   player.states = obj.states || []

   // Required: Scenario needs champions to be loaded
   if(obj.scenarios) {
      player.scenarios = obj.scenarios.map(sc => loadScenario(sc, db))
   }

   if(obj.scenarioRuns) {
      player.scenarioRuns = obj.scenarioRuns.map(run => loadScenarioRun(run, db))
   }  
   
   player.timers = {
      scenarios: []
   }

   player.wallet = obj.wallet || new Wallet()
   player.states = obj.states || []
   return player
}

/*------------------------------------------------------------------------
 * Save Wallet
 *----------------------------------------------------------------------*/
function saveWallet(player, obj) {
   obj.wallet = {
      gold: player.wallet.gold,
      xp: player.wallet.xp
   }
}

/*------------------------------------------------------------------------
 * Load Wallet
 *----------------------------------------------------------------------*/
function loadWallet(player, obj) {
   player.wallet = new Wallet()
   player.wallet.gold = obj.wallet.gold
   player.wallet.xp = obj.wallet.xp
}

/*------------------------------------------------------------------------
 * Save Champion
 * 
 * @param {Champion} champion 
 * @param {*} obj 
 *----------------------------------------------------------------------*/
function saveChampion(champion, obj) {
   if(obj.champions == null) {
      obj.champions = []
   }

   obj.champions.push({
      uuid: champion.uuid,
      name: champion.name,
      type: champion.type,
      level: champion.level,
      stats: champion.stats,
      weapon: champion.weapon,
      armor: champion.armor,
      accessories: champion.accessories
   })

   return
}

/*------------------------------------------------------------------------
 * Load Champion
 * 
 * @param {Champion} champion 
 * @param {*} obj 
 *----------------------------------------------------------------------*/
function loadChampion(obj, db) {
   let champion = new Champion(obj.name, obj.type)
   champion.uuid = obj.uuid
   champion.level = obj.level
   champion.stats = obj.stats
   champion.weapon = obj.weapon
   champion.armor = obj.armor
   champion.accessories = obj.accessories

   db.champions.set(champion.uuid, champion)

   return champion
}

/*
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
         run: this.run == null ? null : this.run.toJSON()
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
      scenario.run = ScenarioProgress.fromJSON(obj.run, player)
      return scenario
   }



*/

/*------------------------------------------------------------------------
 * Save Scenario
 *----------------------------------------------------------------------*/
function saveScenario(scenario, obj) {
   if(obj.scenarios == null) {
      obj.scenarios = []
   }

   obj.scenarios.push({
      type: scenario.type,
      lifetime: scenario.lifetime,
      name: scenario.name,
      uuid: scenario.uuid,
      sceneCount: scenario.sceneCount,
      creatureStats: scenario.creatureStats,
      scenes: scenario.scenes,
      creatures: scenario.creatures,
      items: scenario.items
   })
}

/*------------------------------------------------------------------------
 * Load Scenario
 *----------------------------------------------------------------------*/
function loadScenario(obj, db) {
   let scenario = new Scenario(obj.type)
   scenario.lifetime = obj.lifetime
   scenario.name = obj.name
   scenario.uuid = obj.uuid
   scenario.sceneCount = obj.sceneCount
   scenario.creatureStats = obj.creatureStats
   scenario.scenes = obj.scenes
   scenario.creatures = obj.creatures
   scenario.items = obj.items

   db.scenarios.set(scenario.uuid, scenario)

   return scenario
}

function saveScenarioProgress(run, obj) {

}

// Requires: scenarios be loaded
function loadScenarioProgress(obj, db) {
   let run = new ScenarioProgress(db.scenarios.get(obj.scenarioUuid), obj.champions.map(cid => db.champions.get(cid)))
   run.sceneIndex = obj.sceneIndex
   run.step = obj.step
   run.stepsPerProgress = obj.stepsPerProgress
   run.state = obj.state
   return run 
}

function saveScenarioRun(run, obj) {
   if(obj.scenarioRuns == null) {
      obj.scenarioRuns = []
   }

   if(obj.timers == null) {
      obj.timers = []
   }

   if(obj.timers.runs == null) {
      obj.timers.runs = []
   }

   let progress = run.progress

   obj.scenarioRuns.push({
      scenarioUuid: progress.scenario.uuid,
      champions: progress.champions,
      sceneIndex: progress.sceneIndex,
      step: progress.step,
      stepsPerProgress: progress.stepsPerProgress,
      state: progress.state
   })
}

function loadScenarioRun(obj, db) {
   if(obj.scenarioRuns == null) {
      obj.scenarioRuns = []
   }

   if(obj.timers == null) {
      obj.timers = {
         runs: []
      }
   }

   if(obj.timers.runs == null) {
      obj.timers.runs = []
   }

   let scenario = db.scenarios.get(obj.scenarioUuid)
   let champions = []

   if(obj.champions) {
      champions = obj.champions.map(cid => db.champions.get(cid))
   }
   
   let progress = new ScenarioProgress(scenario, obj.champions)
   progress.sceneIndex = obj.sceneIndex
   progress.step = obj.step
   progress.stepsPerProgress = obj.stepsPerProgress
   progress.state = obj.state

   return progress
}
