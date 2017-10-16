import events from '@/data/events'

export class RewardHub {
   constructor(player) {
      this.player = player

      events.on('scenario.completed', scenario => {
         player.wallet.gold += 3
      })
   }
}