// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
export function randomInt(min, max) {
   min = Math.ceil(min);
   max = Math.floor(max);
   return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Pull a random item from an array with an optional 'where' clause
 * 
 * @param {Array} array 
 * @param {function} filter Only pull a random item that passes this test
 */
export function pullRandom(array, filter) {
   if(array.length == 0) {
      return null
   }

   filter = filter || (_ => true)

   let usable = []
   for(let item of array) {
      if(filter(item)) {
         usable.push(item)
      }
   }   

   return usable.length == 0 ? null : usable[randomInt(0, usable.length - 1)]
}