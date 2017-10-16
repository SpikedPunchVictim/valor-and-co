<style>

.option-button {
   margin-left: 2px;
}

.cell-not-visited {
   background: lightskyblue;
   border-radius: 3px;
   margin: 5px 3px 3px 3px;
   min-width: 4px;
   min-height: 25px;
}

.cell-visited {
   background: slateblue;
   border-radius: 3px;
   margin: 5px 3px 3px 3px;
   min-width: 4px;
   min-height: 25px;
}

.cell-current {
   background: lightgreen;
   border-radius: 3px;
   margin: 5px 3px 3px 3px;
   min-width: 4px;
   min-height: 25px;
}

.progress-bar {
   margin: 4px;
}

</style>

<template>
   <div>
      <h3>{{ scenario.name }}</h3>
      <el-row :gutter="3">
         <el-col :span="12">
         <el-select v-model="champions" multiple placeholder="Champions" class="option-button">
            <el-option
               v-for="champion in availableChampions"
               :key="champion.name"
               :label="champion.name"
               :value="champion.name">
            </el-option>
         </el-select>
         </el-col>
         <el-col :span="2">
            <el-button
               :disabled="!canRunMap"
               @click="onStartScenario"
               class="option-button"
               type="info">Start
            </el-button>
         </el-col>
      </el-row>
      <!-- Note: v-for indexes are 1-based -->
      <el-row v-for="rowIndex in getRowCount()" :gutter="5" :key="rowIndex">
         <el-col
            :span="2"
            v-for="colIndex in getColCount(rowIndex)"
            :class="getCellStyle(rowIndex - 1, colIndex - 1)"
            :key="colIndex">
            <!-- {{ colIndex }} -->
            <el-progress
               v-if="isActiveScene(colIndex - 1)"
               type="circle"
               class="progress-bar"
               :stroke-width="2"
               :show-text="false"
               :width="18"
               :percentage="getSceneProgress(colIndex - 1)">
            </el-progress>
         </el-col>
      </el-row>
   </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Scenario } from '@/data/scenario/index'

let ColumnsPerRow = 10

export default {
   name: 'scenario-map',
   props: {
      scenario: Object
   },
   data() {
      return {
         champions: []
      }
   },
   mounted: function() {
      if(this.scenario != null && Scenario.isRunning(this.scenario)) {
         this.champions = this.getScenarioChampions(this.scenario)
         this.startScenario({ scenario: this.scenario, champions: this.champions })
      }
   },
   methods: {
      ...mapActions(['startScenario', 'stopScenario', 'continueScenario']),
      onStartScenario: function() {
         this.startScenario({ scenario: this.scenario, champions: this.champions })
      },
      onStopScenario: function(scenario) {
         this.stopScenario(scenario)
      },
      getRowCount: function() {
         console.log(`Row Count: ${Math.ceil(this.scenario.sceneCount / 10)}`)
         return Math.ceil(this.scenario.sceneCount / 10)
      },
      getColCount: function(rowIndex) {
         let count = rowIndex * ColumnsPerRow
         if(count - this.scenario.sceneCount < 0) {
            return ColumnsPerRow
         } else {
            return ColumnsPerRow - (count - this.scenario.sceneCount)
         }
      },
      isActiveScene: function(sceneIndex) {
         let run = this.scenario.run
         return run == null ? false : run.sceneIndex == sceneIndex
      },
      getSceneProgress: function(sceneIndex) {
         let run = this.scenario.run

         if(!this.isActiveScene(sceneIndex)) {
            return 0
         }

         if(Scenario.isStopped(this.scenario)) {
            return 0
         }

         if(Scenario.isCompleted(this.scenario)) {
            return 100
         }

         return run == null ?
            0 :
            Math.floor(((run.step / run.stepsPerProgress) * 100))
      },
      getCellStyle: function(rowIndex, colIndex) {
         if(this.scenario.run == null) {
            return 'cell-not-visited'
         }

         let step = (rowIndex * ColumnsPerRow) + colIndex

         //console.log(`[${this.scenario.run.sceneIndex}] rowIndex: ${rowIndex}  colIndex: ${colIndex}  step: ${step} `)
         
         if(step < this.scenario.run.sceneIndex) {
            return 'cell-visited'
         } else if(step > this.scenario.run.sceneIndex) {
            return 'cell-not-visited'
         } else {
            return 'cell-current'
         }
      }
   },
   watch: {
      scenario: function(newScenario) {
         console.log('scenario changed')
         if(Scenario.isRunning(newScenario)) {
            console.log('Attempting to resume scenario')
            let champs = this.getScenarioChampions(scenario)
            this.champions = champs
            this.startScenario(scenario, champs)
         }
      }
   },
   computed: {
      ...mapGetters(['player', 'scenarios', 'availableChampions', 'getScenarioChampions']),
      canRunMap: function() {
         return this.champions.length > 0
      },
      // availableChampions: function() {
      //    let busyChamps = this.scenarios.reduce((result, scenario) => {
      //       if(scenario.isRunning) {
      //          console.dir(scenario)
      //          scenario.champions.forEach(ch => result.add(ch))
      //       }            
      //       return result
      //    }, new Set())

      //    return this.player.champions.filter(ch => !busyChamps.has(ch))
      // }
   }
}

</script>