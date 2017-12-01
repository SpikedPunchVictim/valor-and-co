import uuid from 'uuid/v4'
import { randomInt } from '@/data/random'

export const ChampionTypes = {
   Fighter: {
      str: { min: 7, max: 10 },
      dex: { min: 0, max: 3 },
      con: { min: 5, max: 9 },
      int: { min: 0, max: 2 },
      wis: { min: 0, max: 5 }
   },
   Monk: {
      str: { min: 4, max: 7 },
      dex: { min: 6, max: 9 },
      con: { min: 4, max: 8 },
      int: { min: 3, max: 7 },
      wis: { min: 6, max: 10 }
   },
   Ranger: {
      str: { min: 5, max: 8 },
      dex: { min: 5, max: 10 },
      con: { min: 3, max: 7 },
      int: { min: 3, max: 5 },
      wis: { min: 4, max: 7 }
   },
   Wizard: {
      str: { min: 0, max: 2 },
      dex: { min: 2, max: 4 },
      con: { min: 1, max: 4 },
      int: { min: 7, max: 10 },
      wis: { min: 3, max: 6 }
   },
   Cleric: {
      str: { min: 3, max: 6 },
      dex: { min: 2, max: 6 },
      con: { min: 4, max: 6 },
      int: { min: 2, max: 6 },
      wis: { min: 7, max: 10 }
   },
   Bard: {
      str: { min: 3, max: 6 },
      dex: { min: 3, max: 6 },
      con: { min: 3, max: 6 },
      int: { min: 3, max: 6 },
      wis: { min: 3, max: 6 }
   }
}

export default class Champion {
   constructor(name, type) {
      this.name = name
      this.type = type
      this.level = 1
      this.uuid = uuid()

      let champ = ChampionTypes[type]
      this.stats = {}
      this.stats.str = randomInt(champ.str.min, champ.str.max)
      this.stats.dex = randomInt(champ.dex.min, champ.dex.max)
      this.stats.con = randomInt(champ.con.min, champ.con.max)
      this.stats.int = randomInt(champ.int.min, champ.int.max)
      this.stats.wis = randomInt(champ.wis.min, champ.wis.max)
      
      this.weapon = {}
      this.weapon.right = null
      this.weapon.left = null

      this.armor = {}
      this.armor.head = null
      this.armor.chest = null
      this.armor.hands = null
      this.armor.legs = null
      this.armor.feet = null

      this.accessories = {}
      this.accessories.head = null
      this.accessories.neck = null
      this.accessories.ears = null
      this.accessories.waist = null
   }

   static fromJSON(obj, player) {
      let champion = new Champion(obj.name, obj.type)
      champion.level = obj.level
      champion.stats = obj.stats
      champion.weapon = obj.weapon
      champion.armor = obj.armor
      champion.accessories = obj.accessories
      return champion
   }
}