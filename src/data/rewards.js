import events from '@/data/events'

export class RewardHub {
   constructor(player) {
      this.player = player

      events.on('scenario.completed', this.onScenarioRewarded)
   }

   onScenarioRewarded(scenario) {
      this.player.wallet.gold += 3
   }
}