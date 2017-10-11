<style>

.header {
   margin-bottom: 5px;
}

.champion-area {
   width: 350px;
   height: 350px;
}

</style>

<template>
   <div>
      <coffers class="header"></coffers>
      <el-row :gutter="5">
         <!-- Left Side -->
         <el-col :span="10">
            <component
               :is="championArea"
               class="champion-area"
               @selected="onChampionSelected">
            </component>
         </el-col>

         <!-- Right Side -->
         <el-col :span="12">
            <scenario-view v-if="showScenarios"></scenario-view>
         </el-col>
      </el-row>
   </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SelectChampion from '@/components/SelectChampion'
import Coffers from '@/components/Coffers'
import ChampionView from '@/components/ChampionView'
import ScenarioView from '@/components/Scenario/ScenarioView'

const GameState = {
   None: 'None',
   NewPlayer: 'NewPlayer',
   ContinueProgress: 'ContinueProgress'
}

export default {
   name: 'main',
   data() {
      return {
         championArea: null,
         gameState: GameState.None
      }
   },
   mounted: function() {
      this.gameState = this.player.champions.length == 0 ?
         GameState.NewPlayer : GameState.ContinueProgress

      this.updateChampionComponent()
   },
   methods: {
      ...mapActions(['addChampion']),
      onChampionSelected: function(champ) {
         this.addChampion({ champ: champ })
         this.gameState = GameState.ContinueProgress
         this.updateChampionComponent()
      },
      updateChampionComponent: function() {
         switch(this.gameState) {
            case GameState.NewPlayer: { return this.championArea = 'select-champion' }
            case GameState.ContinueProgress: { return this.championArea = 'champion-view' }
            default: return this.championArea = 'champion-view'
         }
      }
   },
   computed: {
      ...mapGetters(['player', 'scenarios']),
      showScenarios: function() {
         return this.gameState != GameState.NewPlayer && this.scenarios.length > 0
      }
   },
   components: {
      ChampionView,
      'coffers': Coffers,
      'scenario-view': ScenarioView,
      'select-champion': SelectChampion
   }
}

</script>