import { Scenario } from '@/data/scenario/index'

export default {
   startScenario,
   stopScenario
}

export function startScenario(player, scenario, champions) {
   let runner = Scenario.start(scenario, champions)
   player.scenarioRuns.push(runner.run)
}

export function stopScenario(player, scenario, champions) {
   Scenario.stop(scenario)
}