<template>
  <div id="app">
    <Input v-on:buttonClicked="isSibling1Clicked = true"/>
    <OutPut v-bind:isMySiblingClicked ="isSibling1Clicked"/>
  </div>
</template>

<script>

import OutPut from "@/components/Output";
import Input from "@/components/Input";

export default {
  name: 'App',
  data() {
    return {
      isSibling1Clicked: false
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
