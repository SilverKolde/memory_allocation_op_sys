<template>
  <div id="app">
    <Input/>
    <OutPut/>
  </div>
</template>

<script>

import OutPut from "@/components/Output";
import Input from "@/components/Input";

export default {
  name: 'App',
  data() {
    return {
      componentKey: 0
    }
  },
  components: {
    Input,
    OutPut
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
