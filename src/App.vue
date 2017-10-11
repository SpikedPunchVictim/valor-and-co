<style>
@import url(https://fonts.googleapis.com/css?family=Droid+Serif);

#app {
   font-family: 'Droid Serif';
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   margin-top: 20px;
}
</style>

<template>
   <div id="app">
      <router-view></router-view>
   </div>
</template>

<script>
import store from '@/vuex/store'
import { mapActions } from 'vuex'

export default {
   name: 'app',
   store,
   created: function() {
      this.init()
   },
   methods: {
      ...mapActions(['init'])
   }
}
</script>
