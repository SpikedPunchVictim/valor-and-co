import { MinMax } from '@/data/value'

export const CreatureTypes = {
   Rat: {
      name: 'Rat',
      hp: new MinMax(1, 3),
      attack: new MinMax(1, 1),
   },
   LargeRat: {
      name: 'Large Rat',
      hp: new MinMax(5, 10),
      attack: new MinMax(1, 3)
   },
   FerrelRat: {
      name: 'Ferrel Rat (trust me, it\'s spelled right)',
      hp: new MinMax(15, 28),
      attack: new MinMax(3, 5)
   },
   HumungousRat: {
      name: 'Humungous Rat',
      hp: new MinMax(45, 75),
      attack: new MinMax(8, 11)
   },
   Wolf: {
      name: 'Wolf',
      hp: new MinMax(15, 22),
      attack: new MinMax(2, 4)
   }
}

export class Creature {
   constructor(type) {
      console.log(`Creating creature ${type} ${type.name}`)
      this.type = type
      this.hp = type.hp.random()
   }

   get attack() {
      return this.type.attack.random()
   }
}

