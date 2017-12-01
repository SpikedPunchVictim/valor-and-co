import { MinMax } from '@/data/value'

export class Creature {
   constructor(type, hp, attack) {
      this.type = type
      this.hp = hp
      this.attack = attack
   }
}

//------------------------------------------------------------------------
//-- Definitions
//------------------------------------------------------------------------
export const Creatures = {
   // Rats
   Rat: new Creature('Rat', new MinMax(1, 3), new MinMax(1, 1)),
   LargeRat: new Creature('Large Rat', new MinMax(5, 10), new MinMax(1, 3)),
   FerrellRat: new Creature('Ferrell Rat (trust me, it\'s spelled right)', new MinMax(15, 28), new MinMax(3, 5)),
   HumungousRat: new Creature('Humungous Rat', new MinMax(45, 75), new MinMax(8, 11)),
   RatasourusRex: new Creature('Ratasaurus Rex', new MinMax(80, 125), new MinMax(15, 28)),
   // Dogs
   SweetPuppy: new Creature('Sweet Puppy', new MinMax(15, 22), new MinMax(2, 4)),
   Wolf: new Creature('Wolf', new MinMax(28, 34), new MinMax(6, 8)),
   FerrellFido: new Creature('Ferrell Fido', new MinMax(28, 34), new MinMax(6, 8)),
   RabidMastiff: new Creature('Rabid Mastiff', new MinMax(28, 34), new MinMax(6, 8)),
   HellHound: new Creature('Hell Hound', new MinMax(28, 34), new MinMax(6, 8)),
}

