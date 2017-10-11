import { randomInt } from '@/data/random'

export class MinMax {
   constructor(min, max) {
      this.min = min
      this.max = max
   }

   random() {
      return randomInt(this.min, this.max)
   }  
}