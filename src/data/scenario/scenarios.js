import { Scenario, ScenarioLifetime } from '@/data/scenario/scenario'
import { ScenarioTypes } from '@/data/scenario/scenario-types'
import { Creatures } from '@/data/creature'
import events from '@/data/events'

export const Scenarios = {
   SewerRats: createSewerRats()
}

function createSewerRats() {
   let scenario = new Scenario(ScenarioTypes.Sewer)
   scenario.name = "The Angry Sewer Rats"
   scenario.lifetime = ScenarioLifetime.RunForever
   Scenario.addCreature(scenario, Creatures.Rat)
   Scenario.generate(scenario)
   return scenario
}