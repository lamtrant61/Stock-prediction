<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
    
  },
  created () {
      document.title = "Dự báo chứng khoán";
  }
}
</script>

<style>
html,body { 
  padding: 0 !important; 
  margin: 0 !important;
  overflow: hidden !important;
  width: 100%;
  height: 100%;
  
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 0px;
  width: 100%;
  height: 100%;
}
</style>
