import { EventEmitter } from 'events'

let Emitter = new EventEmitter()

export default {
   on: Emitter.on,
   emit: Emitter.emit,
   remove: Emitter.removeListener
}