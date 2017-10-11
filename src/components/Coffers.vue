<style>

.container {
   background: black;
   border-radius: 3px;
   height: 45px;
   color: white;
}

.currency {
   margin: 15px 0px 0px 12px;
   font-size: small;
}

</style>

<template>
   <el-row class="container">
      <el-col :span="2" class="currency">Gold: {{ player.wallet.gold }}</el-col>
   </el-row>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
   name: 'cofffers',
   data() {
      return {

      }
   },
   computed: {
      ...mapGetters(['player'])
   }
}

</script>