<style>

</style>

<template>
   <div>
      <el-card v-if="hasSummoners" v-for="summoner in player.summoners" :key="summoner.name">
         <div slot="header"><h3>{{ summoner.name }}</h3></div>
         <el-button
            type="primary"
            v-for="spawn in summoner.spawns"
            :key="spawn.type">
            {{ spawn.type }}
            </el-button>
      </el-card>
   </div>
</template>
  
<script>
import { mapGetters } from 'vuex'

export default {
   name: 'summoners',
   computed: {
      ...mapGetters(['player']),
      hasSummoners: function() {
         return this.player.summoners.length > 0            
      }
   }
}

</script>
