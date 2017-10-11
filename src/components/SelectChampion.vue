<style>

.stat-container {
   margin-top: 5px;
   width: 620px;
   /* width: 350px; */
   /* border-width: 3px;
   border-radius: 3px;
   box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75); */
}

.stat-row {
   margin: 5px 0px 0px 0px;
}

.stat-key {
   text-align: right;
}

.stat-value {
   width: 150px;
   text-align: center;
   margin-left: 5px;
}

.keep-button {
   margin: 5px 0px 0px 0px;
}

</style>

<template>
   <div>
      <el-row :gutter="5">
         <el-col :span="12">
            <el-select v-model="type" placeholder="Select Champion" @change="onSelectionChange">
               <el-option
                  v-for="champ in championTypes"
                  :key="champ"
                  :label="champ"
                  :value="champ">
               </el-option>
            </el-select>
         </el-col>
         <el-col :span="3">
            <el-button v-if="type != null" @click="onSelectionChange(type)">Generate Again</el-button>
         </el-col>
      </el-row>
      <champion-stats :champion="champion" class="stat-row"></champion-stats>
      <el-button
         v-if="champion != null"
         class="keep-button"
         @click="onKeep">Keep This One</el-button>
   </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Stats from '@/components/Champion/Stats'

export default {
   name: 'select-champion',
   data() {
      return {
         type: null,
         champion: null
      }
   },
   methods: {
      onSelectionChange: function(value) {
         console.log(value)
         //this.selected = this.generateChampion(value)
         this.champion = this.generateChampion(value)

         // this.$emit('selected', value)
      },
      onKeep: function() {
         this.$emit('selected', this.champion)
      }
   },
   computed: {
      ...mapGetters(['championTypes', 'generateChampion'])
   },
   components: {
      'champion-stats': Stats
   }
}

</script>