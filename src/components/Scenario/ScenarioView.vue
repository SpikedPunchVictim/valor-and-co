<style>

.map {
   margin-top: 5px;
}

.map-floor {
   /* text-align: center;
   border-style: solid;
   border-radius: 3px;
   border-width: 1px;*/
   margin-top: 4px;
   width: 40px;
   text-align: center;
}

.map-room {
   /* border-radius: 3px;
   border-width: 1px;
   border-color: blue; */
}

</style>

<template>
   <div class="map">
      <el-card>
         <el-carousel v-if="hasScenarios" :interval="0">
            <el-carousel-item v-for="scenario, index in scenarios" :key="index">
               <scenario-map :scenario="scenario"></scenario-map>
            </el-carousel-item>
         </el-carousel>
      </el-card>
   </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ScenarioMap from '@/components/Scenario/ScenarioMap'

export default {
   name: 'scenario-view',
   // props: {
   //    scenarios: {
   //       type: Array,
   //       default: []
   //    }
   // },
   data() {
      return {

      }
   },
   mounted: function() {

   },
   methods: {
      hasScenarios: function() {
         return this.scenarios != null && this.scenarios.length > 0
      }
      // ...mapActions(['startScenario', 'stopScenario']),
      // onStartScenario: function(scenario) {
      //    this.startScenario(scenario)
      // },
      // onStopScenario: function(scenario) {
      //    this.stopScenario(scenario)
      // }
   },
   computed: {
      ...mapGetters(['scenarios']),
      // getRunningState: function() {
      //    return this.activeDungeonRun.state
      // },
      // getRunningRoomIndex: function() {
      //    if(this.activeDungeonRun
      // }
   },
   components: {
      'scenario-map': ScenarioMap
   }
}

</script>