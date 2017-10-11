<style>
.stat-key {
   text-align: right;
}

.stat-value {
   width: 150px;
   text-align: center;
   margin-left: 5px;
}
</style>


<template>
   <div>
      <el-card v-if="champion != null">
         <el-row class="stat-row">
            <el-col :span="4" class="stat-key">Name:</el-col>
            <el-col :span="4"><el-tag type="primary" class="stat-value">{{ champion.name }}</el-tag></el-col>
         </el-row>

         <el-row class="stat-row">
            <el-col :span="4" class="stat-key">Type:</el-col>
            <el-col :span="4"><el-tag type="primary" class="stat-value">{{ champion.type }}</el-tag></el-col>
         </el-row>

         <el-row class="stat-row">
            <el-col :span="4" class="stat-key">str:</el-col>
            <el-col :span="4"><el-tag type="primary" class="stat-value">{{ champion.stats.str }}</el-tag></el-col>
         </el-row>

         <el-row class="stat-row">
            <el-col :span="4" class="stat-key">dex:</el-col>
            <el-col :span="4"><el-tag type="primary" class="stat-value">{{ champion.stats.dex }}</el-tag></el-col>
         </el-row>

         <el-row class="stat-row">
            <el-col :span="4" class="stat-key">con:</el-col>
            <el-col :span="4"><el-tag type="primary" class="stat-value">{{ champion.stats.con }}</el-tag></el-col>
         </el-row>

         <el-row class="stat-row">
            <el-col :span="4" class="stat-key">int:</el-col>
            <el-col :span="4"><el-tag type="primary" class="stat-value">{{ champion.stats.int }}</el-tag></el-col>
         </el-row>

         <el-row class="stat-row">
            <el-col :span="4" class="stat-key">wis:</el-col>
            <el-col :span="4"><el-tag type="primary" class="stat-value">{{ champion.stats.wis }}</el-tag></el-col>
         </el-row>
      </el-card>
   </div>
</template>

<script>

export default {
   name: 'champion-stats',
   props: {
      champion: Object
   }
}

</script>