import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import Button from "@/models/Button";
import InputLine from "@/models/InputLine";


Vue.config.productionTip = false;
Vue.use(Vuex);


const store = new Vuex.Store({
  state: {
    algoButtons: [
      new Button("First-Fit"),
      new Button("Last-Fit"),
      new Button("Best-Fit"),
      new Button("Worst-Fit"),
      new Button("Random-Fit"),
    ],
    inputLines: [
      new InputLine("Esimene", "1,8;35,4;3,6;4,2;1,4;3,3;1,2;5,1;50,1"),
      new InputLine("Teine", "1,8;7,4;10,6;25,2;1,4;13,3;6,2;8,1;50,1"),
      new InputLine("Kolmas", "5,10;6,6;3,9;8,4;3,6;5,12;1,4;15,3;3,4;9,7"),
      new InputLine("Enda oma", "")
    ],
    selectedAlgorithm: null,
    pickedInput: null
  },
  mutations: {
    unSelectAllExceptThis: (state, button) => {
      state.selectedAlgorithm = button;
      for (let i = 0; i < state.algoButtons.length; i++) {
        if (button !== state.algoButtons[i])
          state.algoButtons[i].selected = false;
      }
    },
    unSelectAll: (state) => {
      for (let i = 0; i < state.algoButtons.length; i++) {
        state.algoButtons[i].selected = false;
      }
    },
    pickedInput: function (state, foo) {
      state.pickedInput = foo;
    }
  },
  getters: {
    getButtons: (state) => {
      return state.algoButtons
    },
    getInputLines: (state) => state.inputLines,
    getSelectedAlgorithm: (state) => state.selectedAlgorithm
  }
})

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
