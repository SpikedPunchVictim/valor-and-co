import { EventEmitter } from 'events'

const Emitter = new EventEmitter()
let TickId = null

class GameTimer {
   constructor() {
      this.emitter = new EventEmitter()
      this._tickId = null
   }

   start() {
      if(this._tickId) {
         return
      }
   
      this._tickId = setInterval(_ => this.onTick(), 500)
   }

   stop() {
      clearInterval(this._tickId)
   }

   add(handler) {
      this.emitter.on('tick', handler)
   }

   remove(handler) {
      this.emitter.removeListener('tick', handler)
   }

   onTick() {
      this.emitter.emit('tick')
   }
}

const Timer = new GameTimer()
export { Timer }

export function start() {
   if(TickId) {
      return
   }

   TickId = setInterval(_ => onTick(), 500)
}

export function stop() {
   clearInterval(TickId)
}

export function subscribe(handler) {
   Emitter.on('tick', handler)
}

export function unsubscribe(handler) {
   Emitter.removeListener('tick', handler)
}

function onTick() {
   Emitter.emit('tick')
}