import { MinMax } from '@/data/value'
import { Creatures } from '@/data/creature'

export let Summoners = {}

export class Summoner {
   constructor(name, level = 1) {
      this.name = name
      this.level = level
      this.spawns = []
      return this
   }
}

//------------------------------------------------------------------------
//-- Definitions
//------------------------------------------------------------------------
let vernin = new Summoner("Vernin the Vermon Mancer")
vernin.spawns.push(Creatures.Rat)
vernin.spawns.push(Creatures.LargeRat)
vernin.spawns.push(Creatures.FerrellRat)
vernin.spawns.push(Creatures.HumungousRat)
vernin.spawns.push(Creatures.RatasourusRex)
Summoners.Vernin = vernin

let kaynine = new Summoner('Kay Nyne Puppeteer')
kaynine.spawns.push(Creatures.SweetPuppy)
kaynine.spawns.push(Creatures.Wolf)
kaynine.spawns.push(Creatures.FerrellFido)
kaynine.spawns.push(Creatures.RabidMastiff)
kaynine.spawns.push(Creatures.HellHound)
Summoners.KayNine = kaynine
