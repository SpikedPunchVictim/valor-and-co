<style>

.stats {
   margin-top: 5px;
   /* width: 90vw;
   text-align: center; */
}

.level-tag {
   float: right;
   margin: 10px;
}

</style>

<template>
   <div>
      <el-collapse>
         <el-collapse-item
            v-for="champ in champions"
            :name="champ.name"
            :key="champ.name">
            <template slot="title">
               {{ champ.name }} <el-tag type="primary" class="level-tag">Level: {{ champ.level }}</el-tag>
            </template>            
            <champion-stats :champion="champ" class="stats"></champion-stats>
         </el-collapse-item>
      </el-collapse>
   </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Stats from '@/components/Champion/Stats'

export default {
   name: 'champion-view',
   computed: {
      ...mapGetters(['champions'])
   },
   components: {
      'champion-stats': Stats
   }
}

</script>